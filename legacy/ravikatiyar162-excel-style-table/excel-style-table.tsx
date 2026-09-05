"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../_utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Cell {
  value: string;
  row: number;
  col: number;
}

interface ExcelTableProps {
  data: string[][];
  headers?: string[];
  editable?: boolean;
  className?: string;
  onCellChange?: (row: number, col: number, value: string) => void;
}

interface SelectionRange {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export const ExcelTable: React.FC<ExcelTableProps> = ({
  data,
  headers,
  editable = false,
  className,
  onCellChange,
}) => {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [selectionRange, setSelectionRange] = useState<SelectionRange | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [draggedCell, setDraggedCell] = useState<{ row: number; col: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleCellClick = (row: number, col: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Don't interfere with double-click
    if (e.detail === 2) return;
    
    if (e.shiftKey && selectionRange) {
      // Shift+click for range selection
      const newRange: SelectionRange = {
        startRow: selectionRange.startRow,
        startCol: selectionRange.startCol,
        endRow: row,
        endCol: col,
      };
      setSelectionRange(newRange);
      updateSelectedCells(newRange);
    } else {
      // Normal click - only on single click
      if (e.detail === 1) {
        const newRange = { startRow: row, startCol: col, endRow: row, endCol: col };
        setSelectionRange(newRange);
        updateSelectedCells(newRange);
      }
    }
  };

  const handleCellDoubleClick = (row: number, col: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Stop any ongoing drag selection
    setIsSelecting(false);
    setDraggedCell(null);
    
    if (editable) {
      setEditingCell({ row, col });
      setEditValue(data[row]?.[col] || "");
    }
  };

  const handleRowHeaderClick = (rowIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRange: SelectionRange = {
      startRow: rowIndex,
      startCol: 0,
      endRow: rowIndex,
      endCol: (data[0]?.length || 1) - 1,
    };
    setSelectionRange(newRange);
    updateSelectedCells(newRange);
  };

  const handleColHeaderClick = (colIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRange: SelectionRange = {
      startRow: 0,
      startCol: colIndex,
      endRow: data.length - 1,
      endCol: colIndex,
    };
    setSelectionRange(newRange);
    updateSelectedCells(newRange);
  };

  const handleTableHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRange: SelectionRange = {
      startRow: 0,
      startCol: 0,
      endRow: data.length - 1,
      endCol: (data[0]?.length || 1) - 1,
    };
    setSelectionRange(newRange);
    updateSelectedCells(newRange);
  };

  const updateSelectedCells = (range: SelectionRange) => {
    const cells = new Set<string>();
    const minRow = Math.min(range.startRow, range.endRow);
    const maxRow = Math.max(range.startRow, range.endRow);
    const minCol = Math.min(range.startCol, range.endCol);
    const maxCol = Math.max(range.startCol, range.endCol);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        cells.add(getCellKey(r, c));
      }
    }
    setSelectedCells(cells);
  };

  const handleMouseDown = (row: number, col: number, e: React.MouseEvent) => {
    if (!editable) return;
    e.preventDefault(); // Prevent text selection
    e.stopPropagation(); // Prevent event bubbling
    
    // Clear any existing text selection immediately
    const clearSelection = () => {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    };
    
    clearSelection();
    
    // Also clear selection on next tick to catch any delayed selection
    setTimeout(clearSelection, 0);
    
    setIsSelecting(true);
    setDraggedCell({ row, col });
    
    const newRange = { startRow: row, startCol: col, endRow: row, endCol: col };
    setSelectionRange(newRange);
    updateSelectedCells(newRange);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting && draggedCell) {
      const newRange: SelectionRange = {
        startRow: draggedCell.row,
        startCol: draggedCell.col,
        endRow: row,
        endCol: col,
      };
      setSelectionRange(newRange);
      updateSelectedCells(newRange);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setDraggedCell(null);
  };

  const handleEditSubmit = () => {
    if (editingCell && onCellChange) {
      onCellChange(editingCell.row, editingCell.col, editValue);
    }
    setEditingCell(null);
    setEditValue("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditingCell(null);
      setEditValue("");
    }
  };

  const copyToClipboard = useCallback(() => {
    if (selectedCells.size === 0) return;

    const sortedCells = Array.from(selectedCells)
      .map(key => {
        const [row, col] = key.split("-").map(Number);
        return { row, col, value: data[row]?.[col] || "" };
      })
      .sort((a, b) => a.row - b.row || a.col - b.col);

    const rows = new Map<number, string[]>();
    sortedCells.forEach(cell => {
      if (!rows.has(cell.row)) {
        rows.set(cell.row, []);
      }
      rows.get(cell.row)!.push(cell.value);
    });

    const clipboardText = Array.from(rows.values())
      .map(row => row.join("\t"))
      .join("\n");

    // Try multiple methods for copying
    const copyText = async (text: string) => {
      try {
        // Method 1: Modern clipboard API
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        try {
          // Method 2: Fallback using document.execCommand
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          return successful;
        } catch (err2) {
          console.error('Failed to copy text: ', err2);
          return false;
        }
      }
    };

    copyText(clipboardText);
    
    // Show success toast
    toast.success(`Copied ${selectedCells.size} cell${selectedCells.size > 1 ? 's' : ''} to clipboard`);
  }, [selectedCells, data]);

  const exportToCSV = useCallback(() => {
    const csvContent = [
      ...(headers ? [headers.join(",")] : []),
      ...data.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table-data.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    // Show success toast
    toast.success("Table exported as CSV file");
  }, [data, headers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        copyToClipboard();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [copyToClipboard]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsSelecting(false);
      setDraggedCell(null);
    };

    const handleGlobalSelectionChange = () => {
      if (isSelecting) {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          selection.removeAllRanges();
        }
      }
    };

    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (isSelecting) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleGlobalSelectStart = (e: Event) => {
      if (isSelecting) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleGlobalDragStart = (e: DragEvent) => {
      if (isSelecting) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("selectionchange", handleGlobalSelectionChange);
    document.addEventListener("mousedown", handleGlobalMouseDown, true);
    document.addEventListener("selectstart", handleGlobalSelectStart, true);
    document.addEventListener("dragstart", handleGlobalDragStart, true);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("selectionchange", handleGlobalSelectionChange);
      document.removeEventListener("mousedown", handleGlobalMouseDown, true);
      document.removeEventListener("selectstart", handleGlobalSelectStart, true);
      document.removeEventListener("dragstart", handleGlobalDragStart, true);
    };
  }, [isSelecting]);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      // Focus the input and select all text
      inputRef.current.focus();
      inputRef.current.select();
      
      // Also try to focus on next tick in case the first attempt fails
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    }
  }, [editingCell]);

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.has(getCellKey(row, col));
  };

  const isRowSelected = (row: number) => {
    for (let col = 0; col < (data[0]?.length || 0); col++) {
      if (!selectedCells.has(getCellKey(row, col))) return false;
    }
    return selectedCells.size > 0;
  };

  const isColSelected = (col: number) => {
    for (let row = 0; row < data.length; row++) {
      if (!selectedCells.has(getCellKey(row, col))) return false;
    }
    return selectedCells.size > 0;
  };

  return (
    <div className={cn("w-full", className)} ref={tableRef}>
      <style jsx>{`
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
        .no-select * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Excel Table</h3>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            Copy (Ctrl+C)
          </button>
          <button
            onClick={exportToCSV}
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className={cn("border border-border rounded-lg overflow-hidden bg-background", isSelecting && "no-select")}>
        <div className="overflow-auto max-h-96">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th 
                  onClick={handleTableHeaderClick}
                  className="w-12 h-8 border border-border bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/70"
                >
                  #
                </th>
                {headers?.map((header, colIndex) => (
                  <th
                    key={colIndex}
                    onClick={(e) => handleColHeaderClick(colIndex, e)}
                    className={cn(
                      "min-w-24 h-8 border border-border px-2 text-xs font-medium text-muted-foreground text-left cursor-pointer hover:bg-muted/70",
                      isColSelected(colIndex) && "border-t-2 border-b-2 border-primary"
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.02 }}
                  className={cn(
                    "hover:bg-muted/30",
                    isRowSelected(rowIndex) && "border-l-2 border-r-2 border-primary"
                  )}
                >
                  <td 
                    onClick={(e) => handleRowHeaderClick(rowIndex, e)}
                    className="w-12 h-8 border border-border bg-muted/50 text-xs font-medium text-muted-foreground text-center cursor-pointer hover:bg-muted/70"
                  >
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        "min-w-24 h-8 border border-border px-2 text-sm relative cursor-pointer",
                        "hover:bg-muted/50 transition-colors",
                        isCellSelected(rowIndex, colIndex) && "border-2 border-primary",
                        editingCell?.row === rowIndex && editingCell?.col === colIndex && "p-0"
                      )}
                      onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                      onDoubleClick={(e) => handleCellDoubleClick(rowIndex, colIndex, e)}
                      onMouseDown={(e) => handleMouseDown(rowIndex, colIndex, e)}
                      onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      onMouseUp={handleMouseUp}
                    >
                      {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleEditSubmit}
                          onKeyDown={handleEditKeyDown}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="w-full h-full px-2 text-sm bg-background border-0 outline-none focus:ring-0 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="truncate block">{cell}</span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        {selectedCells.size > 0 && (
          <span>
            {selectedCells.size} cell{selectedCells.size > 1 ? "s" : ""} selected
          </span>
        )}
        {editable && (
          <span className="ml-4">
            Double-click to edit • Drag to select range
          </span>
        )}
      </div>
    </div>
  );
};