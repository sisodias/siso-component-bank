"use client";

import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import type React from "react";

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function CheckboxGroup({
  className,
  ...props
}: CheckboxGroupPrimitive.Props): React.ReactElement {
  return (
    <CheckboxGroupPrimitive
      className={cn("flex flex-col items-start gap-3", className)}
      {...props}
    />
  );
}

export { CheckboxGroupPrimitive };
