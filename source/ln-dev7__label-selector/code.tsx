'use client';

import { forwardRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { Check, TagIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Interface and example data remain the same
export interface LabelInterface {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export const labels: LabelInterface[] = [
  { id: 'bug', name: 'Bug', color: '#d73a4a' },
  { id: 'feature', name: 'Feature', color: '#0e8a16' },
  { id: 'enhancement', name: 'Enhancement', color: '#a2eeef' },
  { id: 'documentation', name: 'Documentation', color: '#534cb3' },
  { id: 'design', name: 'Design', color: '#d876e3' },
  { id: 'question', name: 'Question', color: '#fcca42' },
  { id: 'performance', name: 'Performance', color: '#fbca04' },
];

interface LabelSelectorProps extends HTMLAttributes<HTMLDivElement> {
  selectedLabels: LabelInterface[];
  onChange: (labels: LabelInterface[]) => void;
}

const LabelSelector = forwardRef<HTMLDivElement, LabelSelectorProps>(
  ({ className, selectedLabels, onChange, ...props }, ref) => {
    const [open, setOpen] = useState(false);

    const handleLabelToggle = (label: LabelInterface) => {
      const isSelected = selectedLabels.some((l) => l.id === label.id);
      const newLabels = isSelected
        ? selectedLabels.filter((l) => l.id !== label.id)
        : [...selectedLabels, label];
      onChange(newLabels);
    };

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-auto justify-start px-2"
              role="combobox"
              aria-expanded={open}
            >
              {selectedLabels.length > 0 ? (
                // --- ИЗМЕНЕНИЕ ЗДЕСЬ / CHANGE IS HERE ---
                // Добавлен `py-0.5` для вертикальных отступов внутри бейджа
                // Added `py-0.5` for vertical padding inside the badge
                <Badge
                  variant="secondary"
                  className="flex items-center gap-x-1 rounded-sm px-1.5 py-0.5 font-normal"
                >
                  <TagIcon className="size-4" />
                  <div className="flex -space-x-1.5">
                    {selectedLabels.slice(0, 3).map((label) => (
                      <div
                        key={label.id}
                        className="size-4 rounded-full border-2 border-background"
                        style={{ backgroundColor: label.color }}
                      />
                    ))}
                    {selectedLabels.length > 3 && (
                      <div className="flex size-4 items-center justify-center rounded-full border-2 border-background bg-muted text-xs text-muted-foreground">
                        +{selectedLabels.length - 3}
                      </div>
                    )}
                  </div>
                </Badge>
              ) : (
                <div className="flex items-center gap-2">
                  <TagIcon className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Set label...</span>
                </div>
              )}
            </Button>
          </PopoverTrigger>
          {/* Popover Content remains the same */}
          <PopoverContent
            className="w-full min-w-[var(--radix-popper-anchor-width)] p-0"
            align="start"
          >
            <Command>
              <CommandInput placeholder="Search labels..." />
              <CommandList>
                <CommandEmpty>No labels found.</CommandEmpty>
                <CommandGroup>
                  {labels.map((label) => {
                    const isSelected = selectedLabels.some((l) => l.id === label.id);
                    return (
                      <CommandItem
                        key={label.id}
                        value={label.name}
                        onSelect={() => handleLabelToggle(label)}
                      >
                        <div
                          className={cn(
                            'mr-2 flex size-4 items-center justify-center rounded-sm border',
                            isSelected ? 'border-primary' : 'border-muted-foreground'
                          )}
                        >
                          {isSelected && <Check className="size-3 text-primary" />}
                        </div>
                        <div
                          className="mr-2 size-3 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        <span>{label.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
LabelSelector.displayName = 'LabelSelector';

export default LabelSelector;