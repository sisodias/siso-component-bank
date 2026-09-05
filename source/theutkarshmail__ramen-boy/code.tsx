import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
  <div class="frame">
  <div class="scene1">
    <div class="boy">
      <div class="boy__head">
        <div class="boy__hair"></div>
        <div class="boy__eyes"></div>
        <div class="boy__mouth"></div>
        <div class="boy__cheeks"></div>
      </div>
      <div class="noodle"></div>
      <div class="boy__leftArm">
        <div class="chopsticks"></div>
      </div>
    </div>
    <div class="plate"></div>
    <div class="rightArm"></div>
  </div>
  <div class="scene2">5 minutes later</div>
</div>

  );
};
