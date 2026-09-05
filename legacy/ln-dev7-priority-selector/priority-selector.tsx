'use client';

import React, { forwardRef, useState, HTMLAttributes } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from "../_utils/cn";
import { Button } from "./button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface IconProps extends React.SVGProps<SVGSVGElement> {
   className?: string;
}

export const NoPriorityIcon = ({ className, ...props }: IconProps) => (
   <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-label="No Priority"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <rect x="1.5" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9"></rect>
      <rect x="6.5" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9"></rect>
      <rect x="11.5" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9"></rect>
   </svg>
);

const UrgentPriorityIcon = ({ className, ...props }: IconProps) => (
   <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-label="Urgent Priority"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <path d="M3 1C1.91067 1 1 1.91067 1 3V13C1 14.0893 1.91067 15 3 15H13C14.0893 15 15 14.0893 15 13V3C15 1.91067 14.0893 1 13 1H3ZM7 4L9 4L8.75391 8.99836H7.25L7 4ZM9 11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10C8.55228 10 9 10.4477 9 11Z"></path>
   </svg>
);

const HighPriorityIcon = ({ className, ...props }: IconProps) => (
   <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-label="High Priority"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <rect x="1.5" y="8" width="3" height="6" rx="1"></rect>
      <rect x="6.5" y="5" width="3" height="9" rx="1"></rect>
      <rect x="11.5" y="2" width="3" height="12" rx="1"></rect>
   </svg>
);

const MediumPriorityIcon = ({ className, ...props }: IconProps) => (
   <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-label="Medium Priority"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <rect x="1.5" y="8" width="3" height="6" rx="1"></rect>
      <rect x="6.5" y="5" width="3" height="9" rx="1"></rect>
      <rect x="11.5" y="2" width="3" height="12" rx="1" fillOpacity="0.4"></rect>
   </svg>
);

const LowPriorityIcon = ({ className, ...props }: IconProps) => (
   <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-label="Low Priority"
      role="img"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
   >
      <rect x="1.5" y="8" width="3" height="6" rx="1"></rect>
      <rect x="6.5" y="5" width="3" height="9" rx="1" fillOpacity="0.4"></rect>
      <rect x="11.5" y="2" width="3" height="12" rx="1" fillOpacity="0.4"></rect>
   </svg>
);

export interface Priority {
   id: string;
   name: string;
   icon: React.FC<IconProps>;
}

export const priorities: Priority[] = [
   { id: 'no-priority', name: 'No priority', icon: NoPriorityIcon },
   { id: 'urgent', name: 'Urgent', icon: UrgentPriorityIcon },
   { id: 'high', name: 'High', icon: HighPriorityIcon },
   { id: 'medium', name: 'Medium', icon: MediumPriorityIcon },
   { id: 'low', name: 'Low', icon: LowPriorityIcon },
];

interface PrioritySelectorProps extends HTMLAttributes<HTMLDivElement> {
   value: string;
   onChange: (value: string) => void;
}

const PrioritySelector = forwardRef<HTMLDivElement, PrioritySelectorProps>(
   ({ value, onChange, className, ...props }, ref) => {
      const [open, setOpen] = useState(false);

      const handleSelect = (priorityId: string) => {
         onChange(priorityId);
         setOpen(false);
      };

      const selectedPriority = priorities.find((p) => p.id === value);
      const SelectedIcon = selectedPriority?.icon || NoPriorityIcon;

      return (
         <div ref={ref} className={cn(className)} {...props}>
            <Popover open={open} onOpenChange={setOpen}>
               <PopoverTrigger asChild>
                  <Button
                     variant="outline"
                     role="combobox"
                     aria-expanded={open}
                     className="w-[180px] justify-between"
                  >
                     <div className="flex items-center gap-2">
                        <SelectedIcon className="size-4 text-muted-foreground" />
                        <span>{selectedPriority?.name || 'Set priority...'}</span>
                     </div>
                     <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-[180px] p-0" align="start">
                  <Command>
                     <CommandInput placeholder="Set priority..." />
                     <CommandList>
                        <CommandEmpty>No priority found.</CommandEmpty>
                        <CommandGroup>
                           {priorities.map((item) => (
                              <CommandItem
                                 key={item.id}
                                 value={item.id}
                                 onSelect={() => handleSelect(item.id)}
                                 className="flex items-center justify-between"
                              >
                                 <div className="flex items-center gap-2">
                                    <item.icon className="size-4 text-muted-foreground" />
                                    <span>{item.name}</span>
                                 </div>
                                 {value === item.id && <Check size={16} className="ml-auto" />}
                              </CommandItem>
                           ))}
                        </CommandGroup>
                     </CommandList>
                  </Command>
               </PopoverContent>
            </Popover>
         </div>
      );
   }
);

PrioritySelector.displayName = 'PrioritySelector';

export default PrioritySelector;