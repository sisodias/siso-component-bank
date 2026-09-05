import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
  <button class="button">
  <p>Button</p>
</button>
  );
};
