import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
<div class="container">
  <label class="label">
    <input type="checkbox" class="input" />
    <span class="circle"
      ><svg
        class="icon"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 19V5m0 14-4-4m4 4 4-4"
        ></path>
      </svg>
      <div class="square"></div>
    </span>
    <p class="title">Download</p>
    <p class="title">Open</p>
  </label>
</div>
  );
};
