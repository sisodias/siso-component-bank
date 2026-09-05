import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
   
<button class="button">
  <div class="icon">
    <span class="text-icon hide">Icon</span>
    <svg
      class="css-i6dzq1"
      stroke-linejoin="round"
      stroke-linecap="round"
      fill="none"
      stroke-width="2"
      stroke="currentColor"
      height="24"
      width="24"
      viewBox="0 0 24 24"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  </div>
  <span class="title"> Anatomy </span>
  <div class="padding-left hide">
    <div class="padding-left-line">
      <span class="padding-left-text">Left Padding</span>
    </div>
  </div>
  <div class="padding-right hide">
    <div class="padding-right-line">
      <span class="padding-right-text">Right Padding</span>
    </div>
  </div>
  <div class="background hide">
    <span class="background-text">Background</span>
  </div>
  <div class="border hide">
    <span class="border-text">Border Radius</span>
  </div>
</button>

  );
};
