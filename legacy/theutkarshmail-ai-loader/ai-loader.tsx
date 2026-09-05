import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={""}>
     
<div class="loader-wrapper">
  <span class="loader-letter">G</span>
  <span class="loader-letter">e</span>
  <span class="loader-letter">n</span>
  <span class="loader-letter">e</span>
  <span class="loader-letter">r</span>
  <span class="loader-letter">a</span>
  <span class="loader-letter">t</span>
  <span class="loader-letter">i</span>
  <span class="loader-letter">n</span>
  <span class="loader-letter">g</span>

  <div class="loader"></div>
</div>

    </div>
  );
};
