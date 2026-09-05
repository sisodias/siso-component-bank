import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return ( 
<div class="loader">
  <div class="box box-1">
    <div class="side-left"></div>
    <div class="side-right"></div>
    <div class="side-top"></div>
  </div>
  <div class="box box-2">
    <div class="side-left"></div>
    <div class="side-right"></div>
    <div class="side-top"></div>
  </div>
  <div class="box box-3">
    <div class="side-left"></div>
    <div class="side-right"></div>
    <div class="side-top"></div>
  </div>
  <div class="box box-4">
    <div class="side-left"></div>
    <div class="side-right"></div>
    <div class="side-top"></div>
  </div>
</div>
  );
};
