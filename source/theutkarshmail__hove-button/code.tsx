import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
<div class="container-button">
  <div class="hover bt-1"></div>
  <div class="hover bt-2"></div>
  <div class="hover bt-3"></div>
  <div class="hover bt-4"></div>
  <div class="hover bt-5"></div>
  <div class="hover bt-6"></div>
  <button></button>
</div>
  );
};
