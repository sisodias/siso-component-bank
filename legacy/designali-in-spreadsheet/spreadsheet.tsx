"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "../_utils/cn"

interface Cell {
  value: string
  formula?: string
}

interface SpreadsheetProps {
  rows?: number
  cols?: number
  className?: string
}

export function Spreadsheet({ rows = 20, cols = 10, className }: SpreadsheetProps) {
  const [cells, setCells] = useState<Record<string, Cell>>({})
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate column letters (A, B, C, ..., Z, AA, AB, ...)
  const getColumnLetter = (index: number): string => {
    let result = ""
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result
      index = Math.floor(index / 26) - 1
    }
    return result
  }

  // Get cell key from row and column
  const getCellKey = (row: number, col: number): string => {
    return `${getColumnLetter(col)}${row + 1}`
  }

  // Get cell value or empty string
  const getCellValue = (row: number, col: number): string => {
    const key = getCellKey(row, col)
    return cells[key]?.value || ""
  }

  // Update cell value
  const updateCell = (row: number, col: number, value: string) => {
    const key = getCellKey(row, col)
    setCells((prev) => ({
      ...prev,
      [key]: { value },
    }))
  }

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    const key = getCellKey(row, col)
    setSelectedCell(key)
    setEditingCell(null)
  }

  // Handle cell double click to start editing
  const handleCellDoubleClick = (row: number, col: number) => {
    const key = getCellKey(row, col)
    setSelectedCell(key)
    setEditingCell(key)
    setEditValue(getCellValue(row, col))
  }

  // Handle input change during editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  // Handle input key press
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (e.key === "Enter") {
      updateCell(row, col, editValue)
      setEditingCell(null)
      // Move to next row
      if (row < rows - 1) {
        setSelectedCell(getCellKey(row + 1, col))
      }
    } else if (e.key === "Escape") {
      setEditingCell(null)
      setEditValue("")
    } else if (e.key === "Tab") {
      e.preventDefault()
      updateCell(row, col, editValue)
      setEditingCell(null)
      // Move to next column
      if (col < cols - 1) {
        setSelectedCell(getCellKey(row, col + 1))
      }
    }
  }

  // Handle input blur
  const handleInputBlur = (row: number, col: number) => {
    updateCell(row, col, editValue)
    setEditingCell(null)
  }

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedCell || editingCell) return

      const match = selectedCell.match(/([A-Z]+)(\d+)/)
      if (!match) return

      const colStr = match[1]
      const rowNum = Number.parseInt(match[2]) - 1

      // Convert column string back to index
      let colNum = 0
      for (let i = 0; i < colStr.length; i++) {
        colNum = colNum * 26 + (colStr.charCodeAt(i) - 64)
      }
      colNum -= 1

      let newRow = rowNum
      let newCol = colNum

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          newRow = Math.max(0, rowNum - 1)
          break
        case "ArrowDown":
          e.preventDefault()
          newRow = Math.min(rows - 1, rowNum + 1)
          break
        case "ArrowLeft":
          e.preventDefault()
          newCol = Math.max(0, colNum - 1)
          break
        case "ArrowRight":
          e.preventDefault()
          newCol = Math.min(cols - 1, colNum + 1)
          break
        case "Enter":
          e.preventDefault()
          setEditingCell(selectedCell)
          setEditValue(getCellValue(rowNum, colNum))
          break
        case "Delete":
        case "Backspace":
          e.preventDefault()
          updateCell(rowNum, colNum, "")
          break
        default:
          // Start editing if alphanumeric key is pressed
          if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
            setEditingCell(selectedCell)
            setEditValue(e.key)
          }
          return
      }

      if (newRow !== rowNum || newCol !== colNum) {
        setSelectedCell(getCellKey(newRow, newCol))
      }
    },
    [selectedCell, editingCell, rows, cols],
  )

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  return (
    <div className={cn("border border-gray-300 rounded-lg overflow-hidden bg-white", className)}>
    
      {/* Header with selected cell info */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-4">
        <div className="font-mono text-sm">
          {selectedCell && (
            <>
              <span className="font-semibold text-gray-600">{selectedCell}</span>
              <span className="ml-2 text-gray-600">
                {getCellValue(
                  Number.parseInt(selectedCell.match(/\d+/)?.[0] || "1") - 1,
                  selectedCell.match(/[A-Z]+/)?.[0].charCodeAt(0) - 65 || 0,
                )}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Spreadsheet grid */}
      <div ref={containerRef} className="overflow-auto text-gray-600 max-h-96" tabIndex={0}>
        <table className="border-collapse">
          <thead>
            <tr>
              {/* Empty corner cell */}
              <th className="w-12 h-8 bg-gray-100 border border-gray-300 text-xs font-medium text-gray-600"></th>
              {/* Column headers */}
              {Array.from({ length: cols }, (_, col) => (
                <th key={col} className="w-20 h-8 bg-gray-100 border border-gray-300 text-xs font-medium text-gray-600">
                  {getColumnLetter(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, row) => (
              <tr key={row}>
                {/* Row header */}
                <td className="w-12 h-8 bg-gray-100 border border-gray-300 text-xs font-medium text-gray-600 text-center">
                  {row + 1}
                </td>
                {/* Data cells */}
                {Array.from({ length: cols }, (_, col) => {
                  const cellKey = getCellKey(row, col)
                  const isSelected = selectedCell === cellKey
                  const isEditing = editingCell === cellKey

                  return (
                    <td
                      key={col}
                      className={cn(
                        "w-20 h-8 border border-gray-300 relative cursor-cell",
                        isSelected && "bg-blue-100 border-blue-500",
                        !isSelected && "hover:bg-gray-50",
                      )}
                      onClick={() => handleCellClick(row, col)}
                      onDoubleClick={() => handleCellDoubleClick(row, col)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={handleInputChange}
                          onKeyDown={(e) => handleInputKeyDown(e, row, col)}
                          onBlur={() => handleInputBlur(row, col)}
                          className="w-full h-full px-1 text-xs border-none outline-none bg-white"
                        />
                      ) : (
                        <div className="w-full h-full px-1 text-xs flex items-center overflow-hidden">
                          {getCellValue(row, col)}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  )
}
