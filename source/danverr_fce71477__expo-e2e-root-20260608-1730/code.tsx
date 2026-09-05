import { Text, View } from "react-native"
import ExpoE2EDep202606081730 from "./expo-e2e-dep-20260608-1730"
import ExpoE2ELeaf202606081730 from "./expo-e2e-leaf-20260608-1730"
import { formatExpoMetric } from "./expo-e2e-root-20260608-1730-utils/format"
import { StatusBadge } from "./expo-e2e-root-20260608-1730-utils/status-badge"
import { getPanelStyle } from "./expo-e2e-root-20260608-1730-utils/theme"
import { useStableLabel } from "./expo-e2e-root-20260608-1730-utils/use-stable-label"

export default function ExpoE2ERoot202606081730() {
  const label = useStableLabel("Expo registry E2E")

  return (
    <View style={getPanelStyle()}>
      <Text style={{ color: "#111827", fontSize: 18, fontWeight: "900" }}>{label}</Text>
      <Text style={{ color: "#475569" }}>{formatExpoMetric(42)}</Text>
      <StatusBadge label="root support files included" />
      <ExpoE2EDep202606081730 />
      <ExpoE2ELeaf202606081730 label="Nested dependency referenced by root" />
    </View>
  )
}
