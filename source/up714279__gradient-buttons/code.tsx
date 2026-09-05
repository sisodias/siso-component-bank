import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div >
  
<div class="button-container">
  <button class="button-3d">
    <div class="button-top">
      <span class="material-icons">❮</span>
    </div>
    <div class="button-bottom"></div>
    <div class="button-base"></div>
  </button>
  <button class="button-3d">
    <div class="button-top">
      <span class="material-icons">❯</span>
    </div>
    <div class="button-bottom"></div>
    <div class="button-base"></div>
  </button>
</div>

    </div>
  );
};
