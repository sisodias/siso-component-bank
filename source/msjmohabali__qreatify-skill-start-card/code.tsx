"use client";

import { PlusIcon } from "lucide-react";

export type SkillStartCardProps = {
  label?: string;
  onClick?: () => void;
};

export default function SkillStartCard({
  label = "Start from scratch",
  onClick,
}: SkillStartCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-36 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-black/20 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-black/35 hover:bg-slate-50 hover:shadow-sm"
    >
      <span className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-slate-950 group-hover:text-white">
        <PlusIcon className="size-5" />
      </span>
      <span className="font-medium text-slate-950">{label}</span>
    </button>
  );
}
