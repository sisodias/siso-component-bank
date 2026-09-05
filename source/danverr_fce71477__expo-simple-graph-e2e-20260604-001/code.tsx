import { StyleSheet, Text, View } from "react-native"
import { buildSubtitle } from "./expo-simple-graph-e2e-20260604-001-utils/subtitle"
import { formatStatus } from "./expo-simple-graph-e2e-20260604-001-utils/status"
import { getToneStyle } from "./expo-simple-graph-e2e-20260604-001-utils/tone"

export interface SimpleGraphCardProps {
  title: string
  createdAt: string
  value: number
  total: number
  tone?: "mint" | "indigo"
}

export default function SimpleGraphCard({
  title,
  createdAt,
  value,
  total,
  tone = "mint",
}: SimpleGraphCardProps) {
  const toneStyle = getToneStyle(tone)

  return (
    <View style={[styles.card, toneStyle.container]}>
      <Text style={styles.eyebrow}>EXPO SIMPLE E2E</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.status}>{formatStatus(createdAt, value)}</Text>
      <Text style={styles.subtitle}>{buildSubtitle(value, total)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 340,
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  status: {
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
})
