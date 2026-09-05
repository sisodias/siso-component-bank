import { cn } from "@/lib/utils";
import { useState } from "react";
import { Zenitho } from "uvcanvas"

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <Zenitho />
  );
};
