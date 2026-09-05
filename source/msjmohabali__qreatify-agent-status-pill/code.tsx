"use client";

import { AlertTriangleIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";

import { cn } from "./qreatify-agent-status-pill-utils/utils";

export type QreatifyAgentStatus = "ready" | "retry" | "running" | "error";

export type QreatifyAgentStatusPillProps = {
  status?: QreatifyAgentStatus;
  label?: string;
  onClick?: () => void;
  className?: string;
};

export default function QreatifyAgentStatusPill({
  status = "ready",
  label,
  onClick,
  className,
}: QreatifyAgentStatusPillProps) {
  const Icon =
    status === "ready"
      ? CheckCircleIcon
      : status === "running"
        ? Loader2Icon
        : AlertTriangleIcon;
  const text =
    label ??
    {
      ready: "Setup ready",
      retry: "Retry setup",
      running: "Running",
      error: "Needs attention",
    }[status];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors",
        status === "ready" && "bg-emerald-500/10 text-emerald-500",
        status === "running" && "bg-blue-500/10 text-blue-500",
        status === "retry" && "bg-amber-500/10 text-amber-500 hover:bg-amber-500/15",
        status === "error" && "bg-destructive/10 text-destructive",
        className,
      )}
    >
      <Icon
        className={cn("size-3.5", status === "running" && "animate-spin")}
      />
      {text}
    </button>
  );
}
