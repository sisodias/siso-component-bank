"use client";

import type { LucideIcon } from "lucide-react";
import {
  CloudIcon,
  CodeIcon,
  FlaskConicalIcon,
  LayoutGridIcon,
  MonitorIcon,
  MousePointer2Icon,
} from "lucide-react";

import { cn } from "./qreatify-builder-toolbar-utils/utils";

export type QreatifyBuilderToolId =
  | "preview"
  | "canvas"
  | "edit"
  | "code"
  | "cloud"
  | "tests";

export type QreatifyBuilderTool = {
  id: QreatifyBuilderToolId;
  label: string;
  icon: LucideIcon;
};

export type QreatifyBuilderToolbarProps = {
  activeTool?: QreatifyBuilderToolId;
  tools?: QreatifyBuilderTool[];
  onToolChange?: (tool: QreatifyBuilderToolId) => void;
  className?: string;
};

const defaultTools: QreatifyBuilderTool[] = [
  { id: "preview", icon: MonitorIcon, label: "Preview" },
  { id: "canvas", icon: LayoutGridIcon, label: "Screens canvas" },
  { id: "edit", icon: MousePointer2Icon, label: "Edit" },
  { id: "code", icon: CodeIcon, label: "Code" },
  { id: "cloud", icon: CloudIcon, label: "Cloud" },
  { id: "tests", icon: FlaskConicalIcon, label: "Tests" },
];

export default function QreatifyBuilderToolbar({
  activeTool = "preview",
  tools = defaultTools,
  onToolChange,
  className,
}: QreatifyBuilderToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-md bg-muted/40 p-0.5",
        className,
      )}
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        const active = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onToolChange?.(tool.id)}
            className={cn(
              "grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-background text-foreground shadow-sm",
            )}
            title={tool.label}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
