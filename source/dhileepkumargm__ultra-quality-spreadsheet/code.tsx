"use client";

import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

const ROWS = 50;
const COLS = 26;
const COL_LABELS = Array.from({ length: COLS }, (_, i) =>
  String.fromCharCode(65 + i)
);

type DataMap = Record<string, string>;

export function UltraQualitySpreadsheet() {
  const [data, setData] = useState<DataMap>({
    A1: "10",
    A2: "20",
    A3: "=SUM(A1:A2)",
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [selected, setSelected] = useState("A1");
  const containerRef = useRef<HTMLDivElement>(null);

  // Basic SUM(range) parser
  const computeValue = (raw: string) => {
    if (!raw.startsWith("=")) return raw;
    const m = raw.match(/^=SUM\(\s*([A-Z]\d+):([A-Z]\d+)\s*\)$/i);
    if (m) {
      const [_, start, end] = m;
      const col1 = start.charCodeAt(0);
      const row1 = parseInt(start.slice(1), 10);
      const col2 = end.charCodeAt(0);
      const row2 = parseInt(end.slice(1), 10);
      let sum = 0;
      for (let c = Math.min(col1, col2); c <= Math.max(col1, col2); c++) {
        for (let r = Math.min(row1, row2); r <= Math.max(row1, row2); r++) {
          const key = String.fromCharCode(c) + r;
          const v = parseFloat(data[key] || "0");
          sum += isNaN(v) ? 0 : v;
        }
      }
      return String(sum);
    }
    return raw; // unsupported formula
  };

  // Handle arrow-key navigation
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (editing) return;
    const col = selected.charCodeAt(0);
    const row = parseInt(selected.slice(1), 10);
    let nc = col,
      nr = row;
    switch (e.key) {
      case "ArrowRight":
        nc = Math.min(col + 1, 65 + COLS - 1);
        break;
      case "ArrowLeft":
        nc = Math.max(col - 1, 65);
        break;
      case "ArrowDown":
        nr = Math.min(row + 1, ROWS);
        break;
      case "ArrowUp":
        nr = Math.max(row - 1, 1);
        break;
      case "Enter":
        setEditing(selected);
        return;
      default:
        return;
    }
    e.preventDefault();
    const next = String.fromCharCode(nc) + nr;
    setSelected(next);
    scrollIntoView(next);
  };

  // Ensure selected cell is visible
  const scrollIntoView = (cellId: string) => {
    const el = containerRef.current?.querySelector<HTMLElement>(
      `[data-cell="${cellId}"]`
    );
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  // Handle blur/save
  const onBlur = (cell: string, raw: string) => {
    setEditing(null);
    setData((d) => ({ ...d, [cell]: raw }));
  };

  // Handle copy/paste
  const onCopy = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = data[selected] || "";
    e.clipboardData.setData("text/plain", text);
  };
  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    setData((d) => ({ ...d, [selected]: text }));
  };

  // Focus container for key events
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onCopy={onCopy}
      onPaste={onPaste}
      className="w-full h-full overflow-auto outline-none"
    >
      <div
        className="inline-block"
        style={{
          display: "grid",
          gridTemplateColumns: `50px repeat(${COLS}, minmax(100px,1fr))`,
          gridTemplateRows: `50px repeat(${ROWS}, minmax(30px, auto))`,
        }}
      >
        {/* top-left blank */}
        <div className="sticky top-0 left-0 z-20 bg-black-100 border"></div>
        {/* column headers */}
        {COL_LABELS.map((lbl) => (
          <div
            key={lbl}
            className="sticky top-0 bg-black-100 border text-center font-medium"
          >
            {lbl}
          </div>
        ))}
        {/* row headers & cells */}
        {Array.from({ length: ROWS }).flatMap((_, i) => {
          const r = i + 1;
          return [
            // row label
            <div
              key={`row-${r}`}
              className="sticky left-0 bg-black-100 border text-right pr-2 select-none"
            >
              {r}
            </div>,
            // cells
            ...COL_LABELS.map((col) => {
              const id = col + r;
              const raw = data[id] || "";
              const display = computeValue(raw);
              const isSelected = id === selected;
              const isEditing = id === editing;
              return (
                <div
                  key={id}
                  data-cell={id}
                  onClick={() => setSelected(id)}
                  onDoubleClick={() => setEditing(id)}
                  className={`border p-1 text-sm relative ${
                    isSelected
                      ? "border-blue-500"
                      : "border-black-200 hover:border-black-400"
                  } ${isEditing ? "bg-white" : ""}`}
                >
                  {isEditing ? (
                    <input
                      autoFocus
                      defaultValue={raw}
                      onBlur={(e) => onBlur(id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="w-full h-full outline-none text-sm"
                    />
                  ) : (
                    <span className="block select-none">
                      {display}
                    </span>
                  )}
                </div>
              );
            }),
          ];
        })}
      </div>
    </div>
  );
}
