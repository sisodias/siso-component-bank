"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";
import { Eye, EyeOff, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "../_utils/cn";

/** --- Types --- */
type Row = {
  id: number;
  name: string;
  email: string;
  role: string;
  location: string;
  status: "Active" | "Inactive" | "Suspended";
  balance: number;
};

type ColumnDef = {
  key: keyof Row;
  label: string;
  width?: string; // optional width
  sticky?: boolean;
};

/** --- Example data --- */
const defaultRows: Row[] = [
  { id: 1, name: "Arjun Mehta", email: "arjun.mehta@company.com", role: "Manager", location: "Bangalore", status: "Active", balance: 1250 },
  { id: 2, name: "Hannah Park", email: "hannah.park@company.com", role: "Designer", location: "Seoul", status: "Active", balance: 600 },
  { id: 3, name: "Oliver Scott", email: "oliver.scott@company.com", role: "Engineer", location: "Manchester", status: "Inactive", balance: 650 },
  { id: 4, name: "Camila Torres", email: "camila.torres@company.com", role: "HR", location: "Bogotá", status: "Active", balance: 0 },
  { id: 5, name: "Kenji Tanaka", email: "kenji.tanaka@company.com", role: "Developer", location: "Osaka", status: "Suspended", balance: -1000 },
];

/** --- Default columns --- */
const defaultColumns: ColumnDef[] = [
  { key: "name", label: "Name", width: "220px", sticky: true },
  { key: "email", label: "Email", width: "260px" },
  { key: "role", label: "Role", width: "140px" },
  { key: "location", label: "Location", width: "160px" },
  { key: "status", label: "Status", width: "120px" },
  { key: "balance", label: "Balance", width: "120px" },
];

/** --- localStorage keys --- */
const LS_ORDER = "reorderable_table_order_v1";
const LS_VISIBLE = "reorderable_table_visible_v1";

/** --- Component --- */
export default function ReorderableTable() {
  const [rows] = useState<Row[]>(defaultRows);
  const columnKeys = defaultColumns.map((c) => c.key as string);

  // load saved order or default order
  const [columnOrder, setColumnOrder] = useState<string[]>(
    () => JSON.parse(localStorage.getItem(LS_ORDER) || "null") || columnKeys
  );

  // visible columns
  const [visible, setVisible] = useState<Record<string, boolean>>(() => {
    const saved = JSON.parse(localStorage.getItem(LS_VISIBLE) || "null");
    if (saved) return saved;
    const initial: Record<string, boolean> = {};
    columnKeys.forEach((k) => (initial[k] = true));
    return initial;
  });

  // simple search
  const [query, setQuery] = useState("");

  // ensure columnOrder contains all keys (if columns changed)
  useEffect(() => {
    const all = columnKeys;
    setColumnOrder((prev) => {
      const missing = all.filter((k) => !prev.includes(k));
      const next = [...prev.filter((k) => all.includes(k)), ...missing];
      return next;
    });
  }, [/* runs once on mount, columnKeys static */]);

  // persist on change
  useEffect(() => {
    localStorage.setItem(LS_ORDER, JSON.stringify(columnOrder));
  }, [columnOrder]);

  useEffect(() => {
    localStorage.setItem(LS_VISIBLE, JSON.stringify(visible));
  }, [visible]);

  // derive visible ordered columns
  const orderedColumns = useMemo(() => {
    return columnOrder
      .map((key) => defaultColumns.find((c) => c.key === key))
      .filter(Boolean) as ColumnDef[];
  }, [columnOrder]);

  // filtered rows
  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      [r.name, r.email, r.role, r.location, r.status].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [rows, query]);

  /** --- Drag & Drop handlers for header columns --- */
  const dragSrcRef = React.useRef<number | null>(null);

  function onDragStart(e: React.DragEvent, index: number) {
    dragSrcRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(index));
    } catch {
      /* some browsers may throw */
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = "move";
  }

  function onDrop(e: React.DragEvent, targetIndex: number) {
    e.preventDefault();
    const srcIndex = dragSrcRef.current ?? parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (isNaN(srcIndex)) return;
    if (srcIndex === targetIndex) return;
    // compute new order array by moving src to target
    setColumnOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(srcIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    dragSrcRef.current = null;
  }

  /** --- Move left / right for accessibility --- */
  function moveColumn(key: string, direction: -1 | 1) {
    setColumnOrder((prev) => {
      const idx = prev.indexOf(key);
      if (idx === -1) return prev;
      const newIndex = idx + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  }

  /** --- Toggle visibility --- */
  function toggleVisible(key: string) {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  /** --- Reset layout --- */
  function resetLayout() {
    setColumnOrder(columnKeys);
    const defaultVis: Record<string, boolean> = {};
    columnKeys.forEach((k) => (defaultVis[k] = true));
    setVisible(defaultVis);
    localStorage.removeItem(LS_ORDER);
    localStorage.removeItem(LS_VISIBLE);
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex gap-2 items-center">
          <Input placeholder="Search name, email, role..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-[320px]" />
          <Button variant="outline" onClick={() => setQuery("")}>
            Clear
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Columns</Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col gap-2">
                {defaultColumns.map((col) => (
                  <label key={String(col.key)} className="flex items-center gap-2">
                    <Checkbox checked={!!visible[String(col.key)]} onCheckedChange={() => toggleVisible(String(col.key))} />
                    <span className="text-sm">{col.label}</span>
                  </label>
                ))}
                <div className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={resetLayout}>Reset</Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    // move all visible to front (simple utility)
                    const visKeys = Object.entries(visible).filter(([, v]) => v).map(([k]) => k);
                    setColumnOrder((prev) => [...visKeys, ...prev.filter(k => !visKeys.includes(k))]);
                  }}>Bring visible front</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table container with sticky header */}
      <div className="border rounded-md overflow-auto">
        <Table className="min-w-full border-separate border-spacing-0">
          <TableHeader className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm">
            <TableRow>
              {/* Render header cells according to columnOrder */}
              {orderedColumns.map((colDef, idx) => {
                const key = String(colDef.key);
                if (!visible[key]) return null;
                return (
                  <TableHead
                    // using div inside TableHead to attach drag events
                    key={key}
                    style={{ width: colDef.width }}
                  >
                    <div
                      draggable
                      onDragStart={(e) => onDragStart(e, idx)}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, idx)}
                      className="flex items-center justify-between gap-2 select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{colDef.label}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => moveColumn(key, -1)} aria-label={`Move ${colDef.label} left`}>
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => moveColumn(key, 1)} aria-label={`Move ${colDef.label} right`}>
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/10">
                {orderedColumns.map((colDef) => {
                  const key = String(colDef.key);
                  if (!visible[key]) return null;
                  const value = row[colDef.key];
                  // simple renderers for certain keys
                  let content: React.ReactNode = String(value);
                  if (colDef.key === "balance") {
                    content = `$${(value as number).toLocaleString()}`;
                  }
                  if (colDef.key === "status") {
                    content = (
                      <span className={cn("inline-block px-2 py-0.5 rounded-md text-sm font-medium",
                        value === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30" :
                        value === "Inactive" ? "bg-slate-100 text-slate-800 dark:bg-slate-800/30" :
                        "bg-red-100 text-red-800 dark:bg-red-900/30")}>
                        {value}
                      </span>
                    );
                  }
                  return <TableCell key={key}>{content}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>

          <TableFooter className="bg-background/90 sticky bottom-0">
            <TableRow>
              {/* footer: show total label and sum of visible balance column */}
              <TableCell colSpan={orderedColumns.filter(c => visible[String(c.key)]).length - 1} className="font-medium">
                Total ({filtered.length} rows)
              </TableCell>
              {/* compute sum of balance if balance column visible */}
              {orderedColumns.some((c) => c.key === "balance" && visible[String(c.key)]) ? (
                <TableCell className="text-right font-semibold">
                  ${filtered.reduce((acc, r) => acc + r.balance, 0).toLocaleString()}
                </TableCell>
              ) : (
                <TableCell className="text-right font-semibold">—</TableCell>
              )}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
