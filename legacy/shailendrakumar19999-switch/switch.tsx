import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
     <label className="rocker rocker-small">
    <input type="checkbox" />
    <span className="switch-left">Yes</span>
    <span className="switch-right">No</span>
    </label>
    </div>
  );
};
