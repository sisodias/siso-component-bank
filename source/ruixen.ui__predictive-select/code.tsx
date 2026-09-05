"use client";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";

interface Option {
  value: string;
  label: string;
  score?: number; // Dynamic AI/Context score
}

interface PredictiveSelectProps {
  userRole: string;
  userHistory: string[];
  recentActivity: string[];
}

export default function PredictiveSelect({ userRole, userHistory, recentActivity }: PredictiveSelectProps) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Option | null>(null);

  // High-level options (could be dynamic / API fetched)
  const baseOptions: Option[] = useMemo(() => [
    { value: "approve_request", label: "Approve Request" },
    { value: "account_settings", label: "Account Settings" },
    { value: "analytics_dashboard", label: "Analytics Dashboard" },
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ], []);

  const [options, setOptions] = useState<Option[]>(baseOptions);

useEffect(() => {
  const lowerInput = input.toLowerCase();
  const safeRecentActivity = recentActivity || []; // default to empty array

  const scored = baseOptions.map((opt) => {
    let score = 0;

    // 1. Context-based
    if (userRole === "admin" && opt.value.includes("approve")) score += 50;

    // 2. History-based
    if (userHistory) {
      score += userHistory.filter((h) => h === opt.value).length * 20;
    }

    // 3. Recent activity
    if (safeRecentActivity.includes(opt.value)) score += 10;

    // 4. Input matching
    if (opt.label.toLowerCase().startsWith(lowerInput)) score += 30;

    return { ...opt, score };
  });

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  setOptions(scored);
}, [input, userRole, userHistory, recentActivity]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Input
          placeholder="Start typing..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No matching options</CommandEmpty>
          <CommandGroup>
            {options.map(opt => (
              <CommandItem key={opt.value} onSelect={() => { setSelected(opt); setInput(opt.label); }}>
                {opt.label} {opt.score && <span className="text-xs text-gray-400">({opt.score})</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
