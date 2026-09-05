import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
<div class="wrapper-grid ">
  <div class="cube">
    <div class="face face-front">L</div>
    <div class="face face-back"></div>
    <div class="face face-right"></div>
    <div class="face face-left"></div>
    <div class="face face-top"></div>
    <div class="face face-bottom"></div>
  </div>

  <div class="cube">
    <div class="face face-front">O</div>
    <div class="face face-back"></div>
    <div class="face face-right"></div>
    <div class="face face-left"></div>
    <div class="face face-top"></div>
    <div class="face face-bottom"></div>
  </div>

  <div class="cube">
    <div class="face face-front">A</div>
    <div class="face face-back"></div>
    <div class="face face-right"></div>
    <div class="face face-left"></div>
    <div class="face face-top"></div>
    <div class="face face-bottom"></div>
  </div>

  <div class="cube">
    <div class="face face-front">D</div>
    <div class="face face-back"></div>
    <div class="face face-right"></div>
    <div class="face face-left"></div>
    <div class="face face-top"></div>
    <div class="face face-bottom"></div>
  </div>

  <div class="cube">
    <div class="face face-front">I</div>
    <div class="face face-back"></div>
    <div class="face face-right"></div>
    <div class="face face-left"></div>
    <div class="face face-top"></div>
    <div class="face face-bottom"></div>
  </div>

  <div class="cube">
    <div class="face face-front">N</div>
    <div class="face face-back"></div>
    <div class="face face-right"></div>
    <div class="face face-left"></div>
    <div class="face face-top"></div>
    <div class="face face-bottom"></div>
  </div>

  <div class="cube">
    <div class="face face-front">G</div>
    <div class="face face-back"></div>
    <div class="face face-right"></div>
    <div class="face face-left"></div>
    <div class="face face-top"></div>
    <div class="face face-bottom"></div>
  </div>
</div>

  );
};
