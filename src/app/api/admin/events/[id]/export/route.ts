import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/db";
import { events, registrations, profiles, registrationMembers, certificates } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import ExcelJS from "exceljs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper to prevent CSV / Spreadsheet Formula Injection (CWE-1236)
function sanitizeText(val: string | null | undefined): string {
  if (!val) return "";
  const str = String(val).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 1. Authenticate and enforce ADMIN role
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required to export event data." },
        { status: 403 }
      );
    }

    const { id: eventId } = await params;
    if (!eventId) {
      return NextResponse.json({ error: "Missing event identifier." }, { status: 400 });
    }

    // 2. Fetch Event with Manager details
    const [event] = await db
      .select({
        id: events.id,
        name: events.name,
        slug: events.slug,
        category: events.category,
        description: events.description,
        rules: events.rules,
        venue: events.venue,
        registrationType: events.registrationType,
        soloFee: events.soloFee,
        teamFee: events.teamFee,
        minTeamSize: events.minTeamSize,
        maxTeamSize: events.maxTeamSize,
        registrationOpen: events.registrationOpen,
        registrationClose: events.registrationClose,
        eventDate: events.eventDate,
        status: events.status,
        createdAt: events.createdAt,
        managerId: events.eventManagerId,
        managerName: profiles.name,
        managerEmail: profiles.email,
        managerPhone: profiles.phone,
      })
      .from(events)
      .leftJoin(profiles, eq(events.eventManagerId, profiles.id))
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    // 3. Fetch all registrations for this specific event
    const eventRegistrations = await db
      .select({
        id: registrations.id,
        eventId: registrations.eventId,
        participantId: registrations.participantId,
        registrationType: registrations.registrationType,
        teamName: registrations.teamName,
        fee: registrations.fee,
        utrNumber: registrations.utrNumber,
        status: registrations.status,
        rejectionReason: registrations.rejectionReason,
        attended: registrations.attended,
        createdAt: registrations.createdAt,
        updatedAt: registrations.updatedAt,
        participantName: profiles.name,
        participantEmail: profiles.email,
        participantPhone: profiles.phone,
        participantRollNumber: profiles.rollNumber,
        participantCollege: profiles.college,
        participantDepartment: profiles.department,
        participantYear: profiles.year,
      })
      .from(registrations)
      .innerJoin(profiles, eq(registrations.participantId, profiles.id))
      .where(eq(registrations.eventId, eventId))
      .orderBy(registrations.createdAt);

    const registrationIds = eventRegistrations.map((r) => r.id);

    // 4. Fetch team members for these registrations
    let teamMembersList: (typeof registrationMembers.$inferSelect)[] = [];
    if (registrationIds.length > 0) {
      teamMembersList = await db
        .select()
        .from(registrationMembers)
        .where(inArray(registrationMembers.registrationId, registrationIds))
        .orderBy(registrationMembers.createdAt);
    }

    // Map team members by registrationId
    const teamMembersMap = new Map<string, typeof teamMembersList>();
    for (const member of teamMembersList) {
      const list = teamMembersMap.get(member.registrationId) || [];
      list.push(member);
      teamMembersMap.set(member.registrationId, list);
    }

    // 5. Fetch certificates for this event
    const eventCertificates = await db
      .select()
      .from(certificates)
      .where(eq(certificates.eventId, eventId));

    // Map certificates by registrationId and participantId
    const certificateMap = new Map<string, typeof eventCertificates[0]>();
    for (const cert of eventCertificates) {
      if (cert.registrationId) {
        certificateMap.set(cert.registrationId, cert);
      }
      if (cert.participantId) {
        certificateMap.set(`${cert.eventId}_${cert.participantId}`, cert);
      }
    }

    // 6. Calculate Real Database Statistics
    const totalRegs = eventRegistrations.length;
    const pendingRegs = eventRegistrations.filter((r) => r.status === "PENDING").length;
    const approvedRegs = eventRegistrations.filter((r) => r.status === "APPROVED").length;
    const rejectedRegs = eventRegistrations.filter((r) => r.status === "REJECTED").length;

    const soloRegs = eventRegistrations.filter((r) => r.registrationType === "SOLO").length;
    const teamRegs = eventRegistrations.filter((r) => r.registrationType === "TEAM").length;

    // Total participants = All registered captains + all teammates
    const totalCaptains = totalRegs;
    const totalTeammates = teamMembersList.length;
    const totalParticipants = totalCaptains + totalTeammates;

    // Approved participants
    const approvedRegIds = new Set(
      eventRegistrations.filter((r) => r.status === "APPROVED").map((r) => r.id)
    );
    const approvedTeammates = teamMembersList.filter((m) =>
      approvedRegIds.has(m.registrationId)
    ).length;
    const approvedParticipants = approvedRegs + approvedTeammates;

    // Attendance
    const attendedRegs = eventRegistrations.filter((r) => r.attended).length;

    // Financials
    const totalExpectedFees = eventRegistrations.reduce((acc, r) => acc + (r.fee || 0), 0);
    const approvedFees = eventRegistrations
      .filter((r) => r.status === "APPROVED")
      .reduce((acc, r) => acc + (r.fee || 0), 0);

    // 7. Initialize Excel Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Aaroh 2K26 Festival Management";
    workbook.lastModifiedBy = session.user.name;
    workbook.created = new Date();
    workbook.modified = new Date();

    // Reusable styling helpers
    const headerFill: ExcelJS.Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF171310" }, // Festival Dark #171310
    };
    const headerFont: Partial<ExcelJS.Font> = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: "FFE5BE45" }, // Festival Gold #E5BE45
    };
    const sectionHeaderFill: ExcelJS.Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF9E1B23" }, // Festival Crimson #9E1B23
    };
    const sectionHeaderFont: Partial<ExcelJS.Font> = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    // ==========================================
    // WORKSHEET 1: EVENT SUMMARY
    // ==========================================
    const wsSummary = workbook.addWorksheet("Event Summary", {
      properties: { tabColor: { argb: "FFE5BE45" } },
      views: [{ showGridLines: true }],
    });

    wsSummary.columns = [
      { header: "Field Name", key: "field", width: 34 },
      { header: "Value", key: "value", width: 55 },
      { header: "Notes / Details", key: "notes", width: 36 },
    ];

    // Banner Title
    wsSummary.mergeCells("A1:C1");
    const titleCell = wsSummary.getCell("A1");
    titleCell.value = `AAROH 2K26 - EVENT SUMMARY REPORT: ${event.name.toUpperCase()}`;
    titleCell.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FFE5BE45" } };
    titleCell.fill = headerFill;
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    wsSummary.getRow(1).height = 32;

    // Metadata Section
    const addSectionHeader = (title: string) => {
      const row = wsSummary.addRow([title, "", ""]);
      wsSummary.mergeCells(`A${row.number}:C${row.number}`);
      row.getCell(1).fill = sectionHeaderFill;
      row.getCell(1).font = sectionHeaderFont;
      row.height = 24;
    };

    const addKeyValueRow = (field: string, value: any, notes = "") => {
      const row = wsSummary.addRow([field, sanitizeText(String(value ?? "N/A")), notes]);
      row.getCell(1).font = { bold: true };
      row.getCell(2).alignment = { wrapText: true };
    };

    wsSummary.addRow([]); // Blank spacer
    addSectionHeader("1. EVENT SPECIFICATIONS");
    addKeyValueRow("Event Identifier (UUID)", event.id);
    addKeyValueRow("Event Name", event.name);
    addKeyValueRow("Event Slug", `/${event.slug}`);
    addKeyValueRow("Category", event.category.replace(/_/g, " "));
    addKeyValueRow("Venue", event.venue);
    addKeyValueRow(
      "Event Scheduled Date",
      event.eventDate ? new Date(event.eventDate).toLocaleString() : "TBD"
    );
    addKeyValueRow("Lifecycle Status", event.status);
    addKeyValueRow("Allowed Registration Type", event.registrationType);
    addKeyValueRow("Solo Entry Fee", `₹${event.soloFee}`);
    addKeyValueRow("Team Entry Fee", `₹${event.teamFee}`);
    addKeyValueRow(
      "Team Size Boundaries",
      `${event.minTeamSize} to ${event.maxTeamSize} members (Captain + Teammates)`
    );
    addKeyValueRow(
      "Registration Window",
      `${event.registrationOpen ? new Date(event.registrationOpen).toLocaleDateString() : "Open"} to ${
        event.registrationClose ? new Date(event.registrationClose).toLocaleDateString() : "Close"
      }`
    );
    addKeyValueRow(
      "Assigned Event Manager",
      event.managerName ? `${event.managerName} (${event.managerEmail || "No Email"})` : "Unassigned",
      event.managerPhone ? `Phone: ${event.managerPhone}` : ""
    );
    addKeyValueRow("Event Description", event.description || "N/A");

    wsSummary.addRow([]);
    addSectionHeader("2. REGISTRATION & AUDIT STATISTICS");
    addKeyValueRow("Total Registration Entries", totalRegs, "All submitted entries");
    addKeyValueRow("Approved Registrations", approvedRegs, "Passed payment/audit verification");
    addKeyValueRow("Pending Registrations", pendingRegs, "Awaiting admin/manager review");
    addKeyValueRow("Rejected Registrations", rejectedRegs, "Payment mismatch or invalid details");
    addKeyValueRow("Solo Registrations Count", soloRegs, "Individual entries");
    addKeyValueRow("Team Registrations Count", teamRegs, "Group entries");
    addKeyValueRow(
      "Total Individual Headcount",
      totalParticipants,
      `${totalCaptains} captains + ${totalTeammates} teammates`
    );
    addKeyValueRow(
      "Approved Individual Headcount",
      approvedParticipants,
      `${approvedRegs} approved captains + ${approvedTeammates} approved teammates`
    );
    addKeyValueRow("Verified Venue Attendance", attendedRegs, "Checked in at event desk");

    wsSummary.addRow([]);
    addSectionHeader("3. FINANCIAL BREAKDOWN (INR)");
    addKeyValueRow(
      "Total Stated Registration Revenue",
      `₹${totalExpectedFees.toLocaleString("en-IN")}`,
      "Sum of fees across all submitted registrations"
    );
    addKeyValueRow(
      "Total Approved / Collected Revenue",
      `₹${approvedFees.toLocaleString("en-IN")}`,
      "Sum of fees strictly for APPROVED entries"
    );
    addKeyValueRow(
      "Pending Revenue Under Audit",
      `₹${(totalExpectedFees - approvedFees).toLocaleString("en-IN")}`,
      "Sum of fees for pending / rejected entries"
    );
    addKeyValueRow(
      "Financial Audit Disclaimer",
      "Calculated from real database records. UTR numbers require bank settlement confirmation.",
      "Aaroh 2K26 Finance Policy"
    );

    // ==========================================
    // WORKSHEET 2: REGISTRATIONS
    // ==========================================
    const wsRegistrations = workbook.addWorksheet("Registrations", {
      properties: { tabColor: { argb: "FF9E1B23" } },
      views: [{ state: "frozen", ySplit: 1, showGridLines: true }],
    });

    wsRegistrations.columns = [
      { header: "Registration ID", key: "regId", width: 28 },
      { header: "Registered At", key: "createdAt", width: 20 },
      { header: "Event Name", key: "eventName", width: 24 },
      { header: "Type", key: "regType", width: 12 },
      { header: "Status", key: "status", width: 14 },
      { header: "Attended", key: "attended", width: 12 },
      { header: "Team Name", key: "teamName", width: 22 },
      { header: "Participant / Lead Name", key: "name", width: 24 },
      { header: "Email Address", key: "email", width: 28 },
      { header: "Phone Number", key: "phone", width: 18 },
      { header: "Roll / Student ID", key: "rollNumber", width: 18 },
      { header: "College / Institution", key: "college", width: 32 },
      { header: "Department", key: "department", width: 16 },
      { header: "Academic Year", key: "year", width: 14 },
      { header: "Teammates Count", key: "teammatesCount", width: 16 },
      { header: "Total Team Size", key: "teamSize", width: 16 },
      { header: "Fee Paid (₹)", key: "fee", width: 14 },
      { header: "UTR / Reference No.", key: "utr", width: 24 },
      { header: "Rejection Reason", key: "rejectionReason", width: 30 },
      { header: "Certificate Status", key: "certStatus", width: 18 },
      { header: "Certificate ID", key: "certId", width: 24 },
      { header: "Certificate Type", key: "certType", width: 18 },
    ];

    // Format Registrations Header Row
    const regHeaderRow = wsRegistrations.getRow(1);
    regHeaderRow.height = 26;
    regHeaderRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        bottom: { style: "medium", color: { argb: "FFE5BE45" } },
      };
    });

    // Populate Registrations Rows
    for (const reg of eventRegistrations) {
      const members = teamMembersMap.get(reg.id) || [];
      const cert =
        certificateMap.get(reg.id) || certificateMap.get(`${reg.eventId}_${reg.participantId}`);

      const row = wsRegistrations.addRow({
        regId: sanitizeText(reg.id),
        createdAt: reg.createdAt ? new Date(reg.createdAt).toISOString().replace("T", " ").substring(0, 19) : "",
        eventName: sanitizeText(event.name),
        regType: sanitizeText(reg.registrationType),
        status: sanitizeText(reg.status),
        attended: reg.attended ? "Yes" : "No",
        teamName: sanitizeText(reg.teamName || (reg.registrationType === "TEAM" ? "Team (Unnamed)" : "N/A")),
        name: sanitizeText(reg.participantName),
        email: sanitizeText(reg.participantEmail),
        phone: sanitizeText(reg.participantPhone || "N/A"),
        rollNumber: sanitizeText(reg.participantRollNumber || "N/A"),
        college: sanitizeText(reg.participantCollege || "N/A"),
        department: sanitizeText(reg.participantDepartment || "N/A"),
        year: sanitizeText(reg.participantYear || "N/A"),
        teammatesCount: reg.registrationType === "TEAM" ? members.length : 0,
        teamSize: reg.registrationType === "TEAM" ? members.length + 1 : 1,
        fee: reg.fee,
        utr: sanitizeText(reg.utrNumber),
        rejectionReason: sanitizeText(reg.rejectionReason || "N/A"),
        certStatus: cert ? "Issued" : "Not Generated",
        certId: cert ? sanitizeText(cert.certificateId) : "N/A",
        certType: cert ? sanitizeText(cert.certificateType) : "N/A",
      });

      // Alignments and number formatting
      row.getCell("fee").numFmt = '"₹"#,##0';
      row.getCell("phone").numFmt = "@";
      row.getCell("rollNumber").numFmt = "@";
      row.getCell("utr").numFmt = "@";

      // Status pill coloring
      const statusCell = row.getCell("status");
      if (reg.status === "APPROVED") {
        statusCell.font = { bold: true, color: { argb: "FF15803D" } }; // Green
      } else if (reg.status === "REJECTED") {
        statusCell.font = { bold: true, color: { argb: "FFB91C1C" } }; // Red
      } else {
        statusCell.font = { bold: true, color: { argb: "FFB45309" } }; // Amber
      }
    }

    wsRegistrations.autoFilter = {
      from: "A1",
      to: `V${Math.max(2, eventRegistrations.length + 1)}`,
    };

    // ==========================================
    // WORKSHEET 3: TEAM MEMBERS
    // ==========================================
    const wsTeamMembers = workbook.addWorksheet("Team Members", {
      properties: { tabColor: { argb: "FF2563EB" } },
      views: [{ state: "frozen", ySplit: 1, showGridLines: true }],
    });

    wsTeamMembers.columns = [
      { header: "Registration ID", key: "regId", width: 28 },
      { header: "Team Name", key: "teamName", width: 22 },
      { header: "Team Captain (Lead)", key: "captainName", width: 24 },
      { header: "Captain Roll Number", key: "captainRoll", width: 18 },
      { header: "Teammate Name", key: "memberName", width: 24 },
      { header: "Roll / Student ID", key: "rollNumber", width: 18 },
      { header: "Email Address", key: "email", width: 28 },
      { header: "Phone Number", key: "phone", width: 18 },
      { header: "Department", key: "department", width: 16 },
      { header: "Academic Year", key: "year", width: 14 },
      { header: "Registration Status", key: "status", width: 16 },
      { header: "Individual Certificate Status", key: "certStatus", width: 24 },
    ];

    const teamHeaderRow = wsTeamMembers.getRow(1);
    teamHeaderRow.height = 26;
    teamHeaderRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        bottom: { style: "medium", color: { argb: "FFE5BE45" } },
      };
    });

    // Populate Team Members Rows
    if (teamMembersList.length === 0) {
      // Empty row placeholder note if no team members
      const emptyRow = wsTeamMembers.addRow({
        regId: "No team members recorded for this event.",
        teamName: "N/A",
        captainName: "N/A",
        captainRoll: "N/A",
        memberName: "N/A",
        rollNumber: "N/A",
        email: "N/A",
        phone: "N/A",
        department: "N/A",
        year: "N/A",
        status: "N/A",
        certStatus: "N/A",
      });
      emptyRow.font = { italic: true, color: { argb: "FF6B7280" } };
    } else {
      // Map registrations for quick lookup
      const regMap = new Map(eventRegistrations.map((r) => [r.id, r]));

      for (const m of teamMembersList) {
        const parentReg = regMap.get(m.registrationId);
        const row = wsTeamMembers.addRow({
          regId: sanitizeText(m.registrationId),
          teamName: sanitizeText(parentReg?.teamName || "Team (Unnamed)"),
          captainName: sanitizeText(parentReg?.participantName || "N/A"),
          captainRoll: sanitizeText(parentReg?.participantRollNumber || "N/A"),
          memberName: sanitizeText(m.name),
          rollNumber: sanitizeText(m.rollNumber || "N/A"),
          email: sanitizeText(m.email || "N/A"),
          phone: sanitizeText(m.phone || "N/A"),
          department: sanitizeText(m.department || "N/A"),
          year: sanitizeText(m.year || "N/A"),
          status: sanitizeText(parentReg?.status || "PENDING"),
          certStatus: parentReg?.status === "APPROVED" ? "Eligible (Via Team)" : "Pending Review",
        });

        row.getCell("phone").numFmt = "@";
        row.getCell("rollNumber").numFmt = "@";
        row.getCell("captainRoll").numFmt = "@";
      }

      wsTeamMembers.autoFilter = {
        from: "A1",
        to: `L${teamMembersList.length + 1}`,
      };
    }

    // ==========================================
    // WORKSHEET 4: STATUS SUMMARY
    // ==========================================
    const wsStatusSummary = workbook.addWorksheet("Status Summary", {
      properties: { tabColor: { argb: "FF059669" } },
      views: [{ state: "frozen", ySplit: 1, showGridLines: true }],
    });

    wsStatusSummary.columns = [
      { header: "Registration Status", key: "status", width: 20 },
      { header: "Registration Type", key: "type", width: 18 },
      { header: "Entries Count", key: "entries", width: 16 },
      { header: "Captains / Leads", key: "captains", width: 18 },
      { header: "Teammates", key: "teammates", width: 16 },
      { header: "Total Headcount", key: "headcount", width: 18 },
      { header: "Total Fee Sum (₹)", key: "feeSum", width: 20 },
      { header: "Attended Count", key: "attended", width: 16 },
    ];

    const statusHeaderRow = wsStatusSummary.getRow(1);
    statusHeaderRow.height = 26;
    statusHeaderRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        bottom: { style: "medium", color: { argb: "FFE5BE45" } },
      };
    });

    const statusTypes: Array<{ status: "APPROVED" | "PENDING" | "REJECTED"; type: "SOLO" | "TEAM" }> = [
      { status: "APPROVED", type: "SOLO" },
      { status: "APPROVED", type: "TEAM" },
      { status: "PENDING", type: "SOLO" },
      { status: "PENDING", type: "TEAM" },
      { status: "REJECTED", type: "SOLO" },
      { status: "REJECTED", type: "TEAM" },
    ];

    for (const group of statusTypes) {
      const matchingRegs = eventRegistrations.filter(
        (r) => r.status === group.status && r.registrationType === group.type
      );
      const regIdSet = new Set(matchingRegs.map((r) => r.id));
      const mates = teamMembersList.filter((m) => regIdSet.has(m.registrationId)).length;
      const count = matchingRegs.length;
      const totalHead = count + mates;
      const feeSum = matchingRegs.reduce((acc, r) => acc + (r.fee || 0), 0);
      const attended = matchingRegs.filter((r) => r.attended).length;

      const row = wsStatusSummary.addRow({
        status: group.status,
        type: group.type,
        entries: count,
        captains: count,
        teammates: mates,
        headcount: totalHead,
        feeSum: feeSum,
        attended: attended,
      });

      row.getCell("feeSum").numFmt = '"₹"#,##0';
      if (group.status === "APPROVED") {
        row.getCell("status").font = { bold: true, color: { argb: "FF15803D" } };
      } else if (group.status === "REJECTED") {
        row.getCell("status").font = { bold: true, color: { argb: "FFB91C1C" } };
      } else {
        row.getCell("status").font = { bold: true, color: { argb: "FFB45309" } };
      }
    }

    // Totals Row
    const totalsRow = wsStatusSummary.addRow({
      status: "TOTAL OVERALL",
      type: "ALL TYPES",
      entries: totalRegs,
      captains: totalCaptains,
      teammates: totalTeammates,
      headcount: totalParticipants,
      feeSum: totalExpectedFees,
      attended: attendedRegs,
    });
    totalsRow.height = 24;
    totalsRow.font = { bold: true };
    totalsRow.getCell("feeSum").numFmt = '"₹"#,##0';
    totalsRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "double" },
      };
    });

    // 8. Generate Buffer & Safe Filename
    const buffer = await workbook.xlsx.writeBuffer();

    // Safe filename e.g. Aaroh_2K26_Dandiya_Night.xlsx
    const sanitizedEventName = event.name
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
    const filename = `Aaroh_2K26_${sanitizedEventName || "Event"}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to generate event Excel export:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while generating Excel workbook." },
      { status: 500 }
    );
  }
}
