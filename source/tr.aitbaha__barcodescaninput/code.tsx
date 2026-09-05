"use client";

import { useEffect, useRef, useState } from "react";

export type BarcodeScanInputProps = {
  /** Fired with the trimmed code when the user submits (scanner Enter or the button). */
  onScan: (code: string) => void;
  placeholder?: string;
  /** Helper text shown under the field. */
  hint?: string;
  /** Text for the submit button. */
  buttonLabel?: string;
  /** Auto-focus on mount and refocus after each scan (back-to-back scanning). Default: true. */
  autoFocus?: boolean;
  /** Clear the field after each scan. Default: true. */
  clearOnScan?: boolean;
  className?: string;
};

/**
 * BarcodeScanInput
 *
 * A scanner-friendly text field. USB/Bluetooth barcode scanners act as a
 * keyboard ("keyboard-wedge"): they type the code and press Enter. This input
 * auto-focuses, re-selects, and fires `onScan` on submit, then refocuses so an
 * operator can scan one item after another without touching the mouse. Works
 * for manual typing too.
 */
export default function BarcodeScanInput({
  onScan,
  placeholder = "Scan or type a barcode…",
  hint,
  buttonLabel = "Scan",
  autoFocus = true,
  clearOnScan = true,
  className = "",
}: BarcodeScanInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (autoFocus) {
      ref.current?.focus();
      ref.current?.select();
    }
  }, [autoFocus]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = value.trim();
    if (!code) return;
    onScan(code);
    if (clearOnScan) setValue("");
    if (autoFocus) ref.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          aria-label={placeholder}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {buttonLabel}
        </button>
      </div>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </form>
  );
}
