import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  priceSection: {
    backgroundColor: "#f8f8f8",
    padding: 24,
    borderRadius: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  priceLabel: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  priceRange: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  priceMid: {
    fontSize: 12,
    color: "#666",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    paddingBottom: 24,
    borderBottom: "1 solid #e5e5e5",
  },
  statItem: {
    textAlign: "center",
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: "1 solid #e5e5e5",
  },
  specGrid: {
    flexDirection: "row",
    marginBottom: 16,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  specValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  moduleList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moduleTag: {
    backgroundColor: "#f0f0f0",
    padding: "4 8",
    borderRadius: 4,
    fontSize: 10,
  },
  costDriverRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottom: "1 solid #f0f0f0",
  },
  costDriverName: {
    flex: 1,
  },
  costDriverAmount: {
    fontWeight: "bold",
  },
  assumptionItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  assumptionBullet: {
    width: 16,
    color: "#666",
  },
  assumptionText: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#999",
    fontSize: 9,
    borderTop: "1 solid #e5e5e5",
    paddingTop: 16,
  },
});

// Helper to format price
function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Labels
const PLATFORM_LABELS: Record<string, string> = {
  web: "Web Application",
  mobile: "Mobile Apps",
  both: "Web + Mobile",
  unknown: "Platform TBD",
};

const AUTH_LABELS: Record<string, string> = {
  none: "No Authentication",
  basic: "Basic Auth",
  roles: "Role-Based",
  "multi-tenant": "Multi-Tenant",
  unknown: "Auth TBD",
};

const QUALITY_LABELS: Record<string, string> = {
  prototype: "Prototype",
  mvp: "MVP",
  production: "Production",
  unknown: "Quality TBD",
};

export interface QuoteData {
  shareId: string;
  createdAt: number;
  snapshot: {
    platform: string;
    authLevel: string;
    quality: string;
    modules: string[];
    priceMin: number;
    priceMax: number;
    priceMid: number;
    confidence: number;
    hoursMin: number;
    hoursMax: number;
    daysMin: number;
    daysMax: number;
    costDrivers: { name: string; impact: string; amount: number }[];
    assumptions: string[];
  };
  moduleDetails?: { id: string; name: string; category: string }[];
}

interface QuotePDFProps {
  quote: QuoteData;
}

// Export function that returns the Document element directly (for renderToBuffer)
export function QuotePDFDocument(quote: QuoteData) {
  return <QuotePDF quote={quote} />;
}

export function QuotePDF({ quote }: QuotePDFProps) {
  const { snapshot, moduleDetails } = quote;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Manager Matt LLC</Text>
          <Text style={styles.subtitle}>Project Quote</Text>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Estimated Cost Range</Text>
          <Text style={styles.priceRange}>
            {formatPrice(snapshot.priceMin)} - {formatPrice(snapshot.priceMax)}
          </Text>
          <Text style={styles.priceMid}>
            Most likely: {formatPrice(snapshot.priceMid)}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Confidence</Text>
            <Text style={styles.statValue}>{snapshot.confidence}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Timeline</Text>
            <Text style={styles.statValue}>
              {Math.round(snapshot.daysMin)}-{Math.round(snapshot.daysMax)} days
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Hours</Text>
            <Text style={styles.statValue}>
              {snapshot.hoursMin}-{snapshot.hoursMax}
            </Text>
          </View>
        </View>

        {/* Project Specification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Specification</Text>
          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Platform</Text>
              <Text style={styles.specValue}>
                {PLATFORM_LABELS[snapshot.platform] || snapshot.platform}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Authentication</Text>
              <Text style={styles.specValue}>
                {AUTH_LABELS[snapshot.authLevel] || snapshot.authLevel}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Quality Level</Text>
              <Text style={styles.specValue}>
                {QUALITY_LABELS[snapshot.quality] || snapshot.quality}
              </Text>
            </View>
          </View>

          {/* Modules */}
          {moduleDetails && moduleDetails.length > 0 && (
            <View>
              <Text style={{ ...styles.specLabel, marginBottom: 8 }}>
                Modules Included ({moduleDetails.length})
              </Text>
              <View style={styles.moduleList}>
                {moduleDetails.map((module) => (
                  <Text key={module.id} style={styles.moduleTag}>
                    {module.name}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Cost Drivers */}
        {snapshot.costDrivers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cost Breakdown</Text>
            {snapshot.costDrivers.map((driver, index) => (
              <View key={index} style={styles.costDriverRow}>
                <Text style={styles.costDriverName}>{driver.name}</Text>
                <Text style={styles.costDriverAmount}>
                  {driver.amount >= 0 ? "+" : ""}
                  {formatPrice(driver.amount)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Assumptions */}
        {snapshot.assumptions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assumptions</Text>
            {snapshot.assumptions.map((assumption, index) => (
              <View key={index} style={styles.assumptionItem}>
                <Text style={styles.assumptionBullet}>•</Text>
                <Text style={styles.assumptionText}>{assumption}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Quote ID: {quote.shareId} | Generated:{" "}
            {new Date(quote.createdAt).toLocaleDateString()}
          </Text>
          <Text style={{ marginTop: 4 }}>
            Manager Matt LLC | AI-Accelerated Development | managermatt.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}
