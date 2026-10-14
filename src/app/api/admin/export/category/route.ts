import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/db";
import { events, registrations, profiles, registrationMembers } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import ExcelJS from "exceljs";

// Helper to prevent CSV / Spreadsheet Formula Injection (CWE-1236)
function sanitizeText(val: string | null | undefined): string {
  if (!val) return "";
  const str = String(val).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

const CATEGORY_META: Record<
  string,
  { key: string; label: string; fileSlug: string }
> = {
  CULTURAL: {
    key: "CULTURAL",
    label: "Culturals",
    fileSlug: "Culturals",
  },
  SPORTS: {
    key: "SPORTS",
    label: "Sports",
    fileSlug: "Sports",
  },
  CREATIVE_MEDIA: {
    key: "CREATIVE_MEDIA",
    label: "Creative Media",
    fileSlug: "Creative_Media",
  },
  FOOD_FEST: {
    key: "FOOD_FEST",
    label: "Food Fest",
    fileSlug: "Food_Fest",
  },
};

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate and enforce ADMIN role
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required to export registration data." },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const requestedCategory = (searchParams.get("category") || "ALL").toUpperCase().trim();

    // 2. Fetch all events (optionally filtered by category)
    let categoryFilter: any = undefined;
    if (requestedCategory !== "ALL" && CATEGORY_META[requestedCategory]) {
      categoryFilter = eq(events.category, requestedCategory as any);
    }

    const eventRows = await db
      .select({
        id: events.id,
        name: events.name,
        category: events.category,
      })
      .from(events)
      .where(categoryFilter)
      .orderBy(events.category, events.name);

    const eventIds = eventRows.map((e) => e.id);
    const eventMap = new Map(eventRows.map((e) => [e.id, e]));

    // 3. Fetch all registrations for these events
    let registrationRows: Array<{
      id: string;
      eventId: string;
      registrationType: string;
      status: string;
      teamName: string | null;
      participantName: string;
      email: string;
      phone: string | null;
      rollNumber: string | null;
      college: string | null;
      department: string | null;
      year: string | null;
      createdAt: Date;
    }> = [];

    if (eventIds.length > 0) {
      registrationRows = await db
        .select({
          id: registrations.id,
          eventId: registrations.eventId,
          registrationType: registrations.registrationType,
          status: registrations.status,
          teamName: registrations.teamName,
          participantName: profiles.name,
          email: profiles.email,
          phone: profiles.phone,
          rollNumber: profiles.rollNumber,
          college: profiles.college,
          department: profiles.department,
          year: profiles.year,
          createdAt: registrations.createdAt,
        })
        .from(registrations)
        .innerJoin(profiles, eq(registrations.participantId, profiles.id))
        .where(inArray(registrations.eventId, eventIds))
        .orderBy(registrations.createdAt);
    }

    const registrationIds = registrationRows.map((r) => r.id);

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

    // 5. Initialize ExcelJS Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Aaroh 2K26 Festival Management";
    workbook.lastModifiedBy = session.user.name;
    workbook.created = new Date();
    workbook.modified = new Date();

    const headerFill: ExcelJS.Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF171310" }, // Dark #171310
    };
    const headerFont: Partial<ExcelJS.Font> = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: "FFE5BE45" }, // Gold #E5BE45
    };

    // Helper to build a standard category worksheet with the exact 12 columns requested
    const buildCategoryWorksheet = (sheetTitle: string, regs: typeof registrationRows) => {
      const ws = workbook.addWorksheet(sheetTitle, {
        views: [{ state: "frozen", ySplit: 1, showGridLines: true }],
      });

      // EXACT 12 COLUMNS REQUESTED:
      // event name, type, status, team name, participant/lead name, team members,
      // email address, phone number, roll number, college, department, academic year.
      ws.columns = [
        { header: "Event Name", key: "eventName", width: 28 },
        { header: "Type", key: "type", width: 12 },
        { header: "Status", key: "status", width: 14 },
        { header: "Team Name", key: "teamName", width: 24 },
        { header: "Participant / Lead Name", key: "leadName", width: 26 },
        { header: "Team Members", key: "teamMembers", width: 44 },
        { header: "Email Address", key: "email", width: 28 },
        { header: "Phone Number", key: "phone", width: 18 },
        { header: "Roll Number", key: "rollNumber", width: 18 },
        { header: "College", key: "college", width: 34 },
        { header: "Department", key: "department", width: 16 },
        { header: "Academic Year", key: "year", width: 16 },
      ];

      // Format Header Row
      const headerRow = ws.getRow(1);
      headerRow.height = 26;
      headerRow.eachCell((cell) => {
        cell.fill = headerFill;
        cell.font = headerFont;
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          bottom: { style: "medium", color: { argb: "FFE5BE45" } },
        };
      });

      // Populate Data Rows
      if (regs.length === 0) {
        const emptyRow = ws.addRow({
          eventName: "No registrations recorded for this category.",
          type: "-",
          status: "-",
          teamName: "-",
          leadName: "-",
          teamMembers: "-",
          email: "-",
          phone: "-",
          rollNumber: "-",
          college: "-",
          department: "-",
          year: "-",
        });
        emptyRow.font = { italic: true, color: { argb: "FF6B7280" } };
      } else {
        for (const reg of regs) {
          const ev = eventMap.get(reg.eventId);
          const members = teamMembersMap.get(reg.id) || [];

          // Format Team Members cell
          let formattedTeamMembers = "-";
          if (reg.registrationType === "TEAM") {
            if (members.length > 0) {
              formattedTeamMembers = members
                .map((m, idx) => {
                  const roll = m.rollNumber ? ` (${m.rollNumber})` : "";
                  const phone = m.phone ? ` [Ph: ${m.phone}]` : "";
                  return `${idx + 1}. ${m.name}${roll}${phone}`;
                })
                .join("\n");
            } else {
              formattedTeamMembers = "No additional members";
            }
          }

          const row = ws.addRow({
            eventName: sanitizeText(ev?.name || "Unknown Event"),
            type: sanitizeText(reg.registrationType),
            status: sanitizeText(reg.status),
            teamName: sanitizeText(reg.teamName || (reg.registrationType === "TEAM" ? "Team (Unnamed)" : "-")),
            leadName: sanitizeText(reg.participantName),
            teamMembers: sanitizeText(formattedTeamMembers),
            email: sanitizeText(reg.email),
            phone: sanitizeText(reg.phone || "-"),
            rollNumber: sanitizeText(reg.rollNumber || "-"),
            college: sanitizeText(reg.college || "-"),
            department: sanitizeText(reg.department || "-"),
            year: sanitizeText(reg.year || "-"),
          });

          // Text format for phone and roll number
          row.getCell("phone").numFmt = "@";
          row.getCell("rollNumber").numFmt = "@";

          // Wrap text on team members
          row.getCell("teamMembers").alignment = { wrapText: true, vertical: "top" };
          row.getCell("eventName").alignment = { vertical: "top" };
          row.getCell("leadName").alignment = { vertical: "top" };

          // Status coloring
          const statusCell = row.getCell("status");
          if (reg.status === "APPROVED") {
            statusCell.font = { bold: true, color: { argb: "FF15803D" } };
          } else if (reg.status === "REJECTED") {
            statusCell.font = { bold: true, color: { argb: "FFB91C1C" } };
          } else {
            statusCell.font = { bold: true, color: { argb: "FFB45309" } };
          }
        }

        ws.autoFilter = {
          from: "A1",
          to: `L${regs.length + 1}`,
        };
      }
    };

    // 6. Generate Worksheets
    let filename = "Aaroh_2K26_Registrations.xlsx";

    if (requestedCategory !== "ALL" && CATEGORY_META[requestedCategory]) {
      // Single Category Mode: All registrations for this category in one sheet
      const meta = CATEGORY_META[requestedCategory];
      const categoryRegs = registrationRows.filter((r) => {
        const ev = eventMap.get(r.eventId);
        return ev?.category === requestedCategory;
      });

      buildCategoryWorksheet(`${meta.label} Registrations`, categoryRegs);
      filename = `Aaroh_2K26_${meta.fileSlug}_Registrations.xlsx`;
    } else {
      // "ALL" Mode: Each Category in its own sheet + Consolidated All Sheet
      // Sheet 1: Culturals
      // Sheet 2: Sports
      // Sheet 3: Creative Media
      // Sheet 4: Food Fest
      for (const catKey of Object.keys(CATEGORY_META)) {
        const meta = CATEGORY_META[catKey];
        const categoryRegs = registrationRows.filter((r) => {
          const ev = eventMap.get(r.eventId);
          return ev?.category === catKey;
        });

        buildCategoryWorksheet(meta.label, categoryRegs);
      }

      // Sheet 5: All Categories combined
      buildCategoryWorksheet("All Registrations", registrationRows);
      filename = "Aaroh_2K26_All_Categories_Registrations.xlsx";
    }

    // 7. Generate Excel Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to generate category Excel export:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while exporting category registrations." },
      { status: 500 }
    );
  }
}
