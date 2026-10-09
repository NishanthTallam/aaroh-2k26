import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#111111",
    padding: 36,
    color: "#FFF9EF",
    fontFamily: "Helvetica",
  },
  borderOuter: {
    border: "2pt solid #D4A72C",
    padding: 24,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  borderInner: {
    border: "1pt solid #9E1B23",
    padding: 20,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  headerFest: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E5BE45",
    letterSpacing: 4,
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 10,
    color: "#FFF9EF",
    letterSpacing: 2,
    marginBottom: 16,
  },
  certTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  certifyText: {
    fontSize: 11,
    color: "#C2BAAF",
    marginBottom: 10,
  },
  recipientName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E5BE45",
    borderBottom: "1pt solid #D4A72C",
    paddingBottom: 4,
    marginBottom: 10,
    minWidth: 260,
  },
  recipientDetails: {
    fontSize: 10,
    color: "#FFF9EF",
    marginBottom: 16,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  eventCategory: {
    fontSize: 10,
    color: "#D4A72C",
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  footer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
    borderTop: "1pt solid rgba(212, 167, 44, 0.3)",
    paddingTop: 12,
  },
  signBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  signLine: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#E5BE45",
  },
  signRole: {
    fontSize: 8,
    color: "#9E9085",
  },
  certMeta: {
    fontSize: 7,
    color: "#6B6055",
    letterSpacing: 1,
  },
});

interface CertificateData {
  certificateId: string;
  certificateType: "PARTICIPATION" | "MERIT" | "WINNER";
  recipientName: string;
  college?: string | null;
  rollNumber?: string | null;
  eventName: string;
  category: string;
  eventDate: string;
  positionText?: string;
}

export function CertificateDocument({ data }: { data: CertificateData }) {
  return (
    <Document title={`Aaroh 2K26 Certificate - ${data.certificateId}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.borderOuter}>
          <View style={styles.borderInner}>
            <View>
              <Text style={styles.headerFest}>AAROH 2K26</Text>
              <Text style={styles.subHeader}>
                NATIONAL INTER-COLLEGE CULTURAL & SPORTS FESTIVAL
              </Text>
              <Text style={styles.certTitle}>
                {data.certificateType === "WINNER"
                  ? "CERTIFICATE OF EXCELLENCE"
                  : data.certificateType === "MERIT"
                  ? "CERTIFICATE OF MERIT"
                  : "CERTIFICATE OF PARTICIPATION"}
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={styles.certifyText}>This is proudly presented to</Text>
              <Text style={styles.recipientName}>{data.recipientName}</Text>
              <Text style={styles.recipientDetails}>
                {data.college ? `of ${data.college}` : "Participant"}
                {data.rollNumber ? ` • Roll No: ${data.rollNumber}` : ""}
              </Text>
              <Text style={styles.certifyText}>
                {data.certificateType === "WINNER"
                  ? `for securing ${data.positionText || "Podium Position"} in`
                  : "for active participation and spirited performance in"}
              </Text>
              <Text style={styles.eventName}>{data.eventName}</Text>
              <Text style={styles.eventCategory}>
                {data.category.replace("_", " ")} • AAROH 2K26
              </Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.signBlock}>
                <Text style={styles.signLine}>Convener, Aaroh 2K26</Text>
                <Text style={styles.signRole}>Faculty Organizing Committee</Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <Text style={styles.certMeta}>
                  CERTIFICATE ID: {data.certificateId}
                </Text>
                <Text style={styles.certMeta}>
                  ISSUED: {data.eventDate} • SECURE VERIFIED
                </Text>
              </View>

              <View style={styles.signBlock}>
                <Text style={styles.signLine}>Dean, Student Affairs</Text>
                <Text style={styles.signRole}>Aroha University</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function generateCertificatePdfBuffer(
  data: CertificateData
): Promise<Buffer> {
  const doc = <CertificateDocument data={data} />;
  return await renderToBuffer(doc);
}
