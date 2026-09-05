import * as React from "react";
import { cn } from "../_utils/cn";

export default function InlineCode({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
      {...props}
    />
  );
}
