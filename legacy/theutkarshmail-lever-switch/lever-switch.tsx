import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  

  return (

<div class="toggle-container">
  <input class="toggle-input" type="checkbox"/>
  <div class="toggle-handle-wrapper">
    <div class="toggle-handle">
      <div class="toggle-handle-knob"></div>
      <div class="toggle-handle-bar-wrapper">
        <div class="toggle-handle-bar"></div>
      </div>
    </div>
  </div>
  <div class="toggle-base">
    <div class="toggle-base-inside"></div>
  </div>
</div>
  );
};
