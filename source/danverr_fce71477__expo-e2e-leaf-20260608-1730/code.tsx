import { Text, View } from "react-native"

export default function ExpoE2ELeaf202606081730({
  label = "Leaf dependency",
}: {
  label?: string
}) {
  return (
    <View style={{ borderRadius: 12, backgroundColor: "#ecfeff", padding: 10 }}>
      <Text style={{ color: "#155e75", fontWeight: "700" }}>{label}</Text>
    </View>
  )
}
