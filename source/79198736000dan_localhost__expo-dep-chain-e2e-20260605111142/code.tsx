import { Text, View } from "react-native";
import RegistryDependency from "./expo-e2e-011649";

export const Component = () => {
  return (
    <View className="gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      <Text className="text-lg font-bold text-zinc-950">Expo dependency chain</Text>
      <RegistryDependency />
    </View>
  );
};

export default Component;
