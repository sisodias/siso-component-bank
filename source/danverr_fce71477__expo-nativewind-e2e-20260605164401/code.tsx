import ExpoCliLucideCard from "./expo-cli-lucide-e2e-20260604170912"
import { Text, View } from "react-native"
import { DependencyBadge } from "./expo-nativewind-e2e-20260605164401-utils/badge"

export default function ExpoNativewindE2E() {
  return (
    <View className="gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <View className="gap-1">
        <Text className="text-xs font-semibold uppercase text-emerald-700">
          Expo registry dependency
        </Text>
        <Text className="text-2xl font-extrabold text-zinc-950">
          NativeWind + nested imports
        </Text>
      </View>
      <DependencyBadge />
      <ExpoCliLucideCard />
    </View>
  )
}
