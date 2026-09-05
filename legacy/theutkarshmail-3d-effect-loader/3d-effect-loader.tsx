import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
   <div class="pl">
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__dot"></div>
	<div class="pl__text">Loading…</div>
</div>
  );
};
