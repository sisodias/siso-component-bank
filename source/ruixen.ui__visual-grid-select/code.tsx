"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandEmpty } from "@/components/ui/command";
import { Plus } from "lucide-react";

interface GridOption {
  value: string;
  label: string;
  previewUrl: string;
}

interface VisualGridSelectProps {
  options: GridOption[];
  columns?: number;
  onAddImage?: (file: File) => void;
}

export default function VisualGridSelect({
  options,
  columns = 3,
  onAddImage,
}: VisualGridSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredOptions = useMemo(() => {
    return options.filter(opt =>
      !search || opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const total = filteredOptions.length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!total) return;
    if (e.key === "ArrowRight") setHighlightIndex(prev => (prev + 1) % total);
    if (e.key === "ArrowLeft") setHighlightIndex(prev => (prev === 0 ? total - 1 : prev - 1));
    if (e.key === "ArrowDown") setHighlightIndex(prev => (prev + columns) % total);
    if (e.key === "ArrowUp") setHighlightIndex(prev => (prev - columns + total) % total);
    if (e.key === "Enter") {
      setSelectedIndex(highlightIndex);
      setSearch("");
    }
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onAddImage) onAddImage(e.target.files[0]);
  };

  useEffect(() => setHighlightIndex(0), [search, filteredOptions]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder="Select template..."
          readOnly
          onFocus={() => setIsOpen(true)}
        />
      </PopoverTrigger>

      <PopoverContent className="w-[750px] p-4 flex gap-4">
        {/* Grid with Inner Search */}
        <div className="flex-1">
          <Command>
            <div className="flex items-center mb-2 gap-2">
              <CommandInput
                placeholder="Search templates..."
                value={search}
                onValueChange={val => setSearch(val)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <label className="cursor-pointer">
                <Plus className="w-5 h-5 text-gray-500" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAddImage}
                />
              </label>
            </div>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>No templates found</CommandEmpty>
            ) : (
              <div
                className={`grid gap-4`}
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
              >
                {filteredOptions.map((opt, index) => (
                  <div
                    key={opt.value}
                    className={`border rounded-md p-1 cursor-pointer overflow-hidden transition-all
                      ${highlightIndex === index ? "border-blue-500" : "border-gray-200"}
                      ${selectedIndex === index ? "border-2 border-green-500" : ""}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <img
                      src={opt.previewUrl}
                      alt={opt.label}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <div className="text-center text-sm mt-1">{opt.label}</div>
                  </div>
                ))}
              </div>
            )}
          </Command>
        </div>

        {/* Live Preview Panel */}
        <div className="w-64 h-64 border rounded-md overflow-hidden flex-shrink-0">
          <img
            src={
              hoveredIndex !== null
                ? filteredOptions[hoveredIndex]?.previewUrl
                : selectedIndex !== null
                ? filteredOptions[selectedIndex]?.previewUrl
                : undefined
            }
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
