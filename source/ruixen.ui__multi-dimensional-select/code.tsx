"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Option {
  value: string;
  label: string;
  color: string;
  size: string;
  category: string;
  popularity: number; // higher is better
}

interface MultiDimensionalSelectProps {
  options: Option[];
}

export default function MultiDimensionalSelect({ options }: MultiDimensionalSelectProps) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Option | null>(null);
  const [filters, setFilters] = useState({
    color: [] as string[],
    size: [] as string[],
    category: [] as string[],
  });
  const [sortByPopularity, setSortByPopularity] = useState(false);

  const attributeValues = useMemo(() => {
    const colors = Array.from(new Set(options.map(o => o.color)));
    const sizes = Array.from(new Set(options.map(o => o.size)));
    const categories = Array.from(new Set(options.map(o => o.category)));
    return { colors, sizes, categories };
  }, [options]);

  const filteredOptions = useMemo(() => {
    return options
      .filter(opt =>
        (!filters.color.length || filters.color.includes(opt.color)) &&
        (!filters.size.length || filters.size.includes(opt.size)) &&
        (!filters.category.length || filters.category.includes(opt.category)) &&
        opt.label.toLowerCase().includes(input.toLowerCase())
      )
      .sort((a, b) => (sortByPopularity ? b.popularity - a.popularity : 0));
  }, [options, filters, input, sortByPopularity]);

  const toggleFilter = (key: "color" | "size" | "category", value: string) => {
    setFilters(prev => {
      const list = prev[key];
      if (list.includes(value)) {
        return { ...prev, [key]: list.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...list, value] };
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Input
          placeholder={selected ? selected.label : "Select option..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <div className="p-2 border-b space-y-2">
            <div className="flex flex-wrap gap-2">
              <span>Color:</span>
              {attributeValues.colors.map(c => (
                <Checkbox
                  key={c}
                  checked={filters.color.includes(c)}
                  onCheckedChange={() => toggleFilter("color", c)}
                >{c}</Checkbox>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span>Size:</span>
              {attributeValues.sizes.map(s => (
                <Checkbox
                  key={s}
                  checked={filters.size.includes(s)}
                  onCheckedChange={() => toggleFilter("size", s)}
                >{s}</Checkbox>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span>Category:</span>
              {attributeValues.categories.map(cat => (
                <Checkbox
                  key={cat}
                  checked={filters.category.includes(cat)}
                  onCheckedChange={() => toggleFilter("category", cat)}
                >{cat}</Checkbox>
              ))}
            </div>
            <div className="mt-1">
              <Checkbox
                checked={sortByPopularity}
                onCheckedChange={(val) => setSortByPopularity(!!val)}
              >
                Sort by popularity
              </Checkbox>
            </div>
          </div>
          <CommandEmpty>No matching options</CommandEmpty>
          <CommandGroup>
            {filteredOptions.map(opt => (
              <CommandItem
                key={opt.value}
                onSelect={() => { setSelected(opt); setInput(opt.label); }}
              >
                {opt.label} <span className="text-xs text-gray-400 ml-2">({opt.color}, {opt.size}, {opt.category}, ★{opt.popularity})</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
