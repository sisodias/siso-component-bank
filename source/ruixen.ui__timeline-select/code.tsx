"use client";

import * as React from "react";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface EventOption {
  value: string;
  label: string;
  date: string;
}

interface TimelineSelectProps {
  options: EventOption[];
}

export default function TimelineSelect({ options }: TimelineSelectProps) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<EventOption | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Filter options
  const filteredOptions = options
    .filter((opt) => !input || opt.label.toLowerCase().includes(input.toLowerCase()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const timelineStart = filteredOptions[0] ? new Date(filteredOptions[0].date).getTime() : 0;
  const timelineEnd = filteredOptions[filteredOptions.length - 1]
    ? new Date(filteredOptions[filteredOptions.length - 1].date).getTime()
    : 1;
  const timelineRange = Math.max(timelineEnd - timelineStart, 1);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder={selected ? selected.label : "Select event..."}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Command>
          <CommandInput
            placeholder="Search events..."
            value={input}
            onValueChange={(val) => setInput(val)}
            onFocus={() => setIsOpen(true)}
          />
          <CommandEmpty>No events found</CommandEmpty>
          <CommandGroup>
            {filteredOptions.map((opt) => {
              const dateFormatted = format(new Date(opt.date), "MMM dd, yyyy");
              const progressWidth =
                ((new Date(opt.date).getTime() - timelineStart) / timelineRange) * 100;

              return (
                <CommandItem
                  key={opt.value}
                  onSelect={() => {
                    setSelected(opt);
                    setInput(opt.label);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between mb-1">
                      <span>{opt.label}</span>
                      <span className="text-xs text-gray-500">{dateFormatted}</span>
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-full">
                      <div
                        className="h-1 bg-gray-400 rounded-full"
                        style={{ width: `${progressWidth}%` }}
                      />
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
