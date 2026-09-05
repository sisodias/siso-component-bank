import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div > 
<button class="brutalist-button">
  <div class="ms-logo">
    <div class="ms-logo-square"></div>
    <div class="ms-logo-square"></div>
    <div class="ms-logo-square"></div>
    <div class="ms-logo-square"></div>
  </div>
  <div class="button-text">
    <span>Get it from</span>
    <span>Microsoft</span>
  </div>
</button>

    </div>
  );
};
