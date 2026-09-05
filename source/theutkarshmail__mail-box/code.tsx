import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
<span
  class="💀"
  data-content="📫"
  data-hover-content="📪"
  data-active-content="📬"
></span>

  );
};
