// This is file of your component

// You can use any dependencies from npm; we import them automatically in package.json
import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Button = ({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
};

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Component Example</Text>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.actions}>
        <Button onPress={() => setCount((prev) => prev - 1)}>-</Button>
        <Button onPress={() => setCount((prev) => prev + 1)}>+</Button>
      </View>
    </View>
  );
};


/// heelo
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 8,
  },
  title: {
    marginBottom: 8,
    fontSize: 24,
    fontWeight: "700",
  },
  count: {
    fontSize: 20,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    minWidth: 36,
    alignItems: "center",
    borderRadius: 6,
    borderColor: "#D4D4D8",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Component;
