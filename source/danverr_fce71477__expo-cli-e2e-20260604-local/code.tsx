import moment from "moment"
import { StyleSheet, Text, View } from "react-native"
import { buildCardTitle } from "./expo-cli-e2e-20260604-local-utils/build-card-title"
import { getAccentColor } from "./expo-cli-e2e-20260604-local-utils/palette"
import { getMetricLabel } from "./expo-cli-e2e-20260604-local-utils/get-metric-label"

export default function ExpoCliE2ECard() {
  const title = buildCardTitle("expo cli", "publish")
  const updatedAt = moment("2026-06-04T12:00:00Z").format("MMM D")
  const metric = getMetricLabel(12840)

  return (
    <View style={[styles.card, { borderColor: getAccentColor("mint") }]}>
      <Text style={styles.eyebrow}>CLI Expo smoke</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>
        {metric} verified through nested local dependencies on {updatedAt}.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    backgroundColor: "#111827",
  },
  eyebrow: {
    color: "#6ee7b7",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    color: "#f9fafb",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
  },
  body: {
    color: "#d1d5db",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
})
