"use client";

import { useState } from "react";

export interface PinItem {
  id: string;
  label: string;
  pinned?: boolean;
}

export interface PinListProps {
  items: PinItem[];
  onPinChange?: (id: string, pinned: boolean) => void;
}

export default function PinList({ items, onPinChange }: PinListProps) {
  const [state, setState] = useState(items);

  const toggle = (id: string) => {
    setState((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, pinned: !i.pinned } : i))
        .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned))
    );
    const next = state.find((i) => i.id === id);
    onPinChange?.(id, !next?.pinned);
  };

  return (
    <ul className="flex flex-col gap-1">
      {state.map((i) => (
        <li
          key={i.id}
          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
        >
          <span>{i.label}</span>
          <button
            type="button"
            onClick={() => toggle(i.id)}
            className="text-xs underline opacity-70 hover:opacity-100"
            aria-pressed={!!i.pinned}
          >
            {i.pinned ? "unpin" : "pin"}
          </button>
        </li>
      ))}
    </ul>
  );
}
