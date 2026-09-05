"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

export interface CopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text that gets written to the clipboard on click. */
  value: string;
  /** How long the "copied" state stays visible, in ms. */
  timeout?: number;
}

/**
 * A button that copies `value` to the clipboard and briefly swaps its icon
 * to a checkmark as confirmation. Falls back gracefully if the Clipboard API
 * is unavailable.
 */
export default function CopyButton({
  value,
  timeout = 1500,
  className,
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), timeout);
    } catch {
      // Clipboard blocked (no permission / insecure context) — no-op.
    }
  }, [value, timeout]);

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      data-copied={copied}
      className={
        "inline-flex items-center gap-2 rounded-md border border-neutral-200 " +
        "bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 " +
        "transition-colors hover:bg-neutral-50 active:bg-neutral-100 " +
        "dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 " +
        "dark:hover:bg-neutral-900 " +
        (className ?? "")
      }
      {...props}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" aria-hidden />
      ) : (
        <Copy className="h-4 w-4" aria-hidden />
      )}
      {children ?? (copied ? "Copied" : "Copy")}
    </button>
  );
}
