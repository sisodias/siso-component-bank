import { Text, View } from "react-native"
import ExpoE2ELeaf202606081730 from "./expo-e2e-leaf-20260608-1730"

export default function ExpoE2EDep202606081730() {
  return (
    <View style={{ gap: 8, borderRadius: 14, backgroundColor: "#f8fafc", padding: 12 }}>
      <Text style={{ color: "#0f172a", fontWeight: "800" }}>Parent registry dependency</Text>
      <ExpoE2ELeaf202606081730 label="Nested leaf installed from registry" />
    </View>
  )
}
