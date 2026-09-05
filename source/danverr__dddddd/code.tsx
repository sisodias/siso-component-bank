import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

const Button = ({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress}>
      <Text className="text-base text-zinc-950">{children}</Text>
    </Pressable>
  );
};

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <View className="items-center gap-4 rounded-lg p-4">
      <Text className="mb-2 text-2xl font-bold text-zinc-950">
        Component Example
      </Text>
      <Text className="text-xl font-semibold text-zinc-950">{count}</Text>
      <View className="flex-row gap-2">
        <Button onPress={() => setCount((prev) => prev - 1)}>-</Button>
        <Button onPress={() => setCount((prev) => prev + 1)}>+</Button>
      </View>
    </View>
  );
};

export default Component;
