import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
   <button class="button" data-text="Awesome">
    <span class="actual-text">&nbsp;HIMAWARI&nbsp;</span>
    <span aria-hidden="true" class="hover-text ">&nbsp;HIMAWARI&nbsp;</span>
</button>
  );
};
