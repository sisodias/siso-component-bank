// component.tsx
'use client';

import * as React from 'react';
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
import { CheckIcon } from 'lucide-react';

export interface Status {
   id: string;
   name: string;
   color: string;
   icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const BacklogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle
         cx="7"
         cy="7"
         r="6"
         fill="none"
         stroke="#bec2c8"
         strokeWidth="2"
         strokeDasharray="1.4 1.74"
         strokeDashoffset="0.65"
      ></circle>
      <circle
         cx="7"
         cy="7"
         r="2"
         fill="none"
         stroke="#bec2c8"
         strokeWidth="4"
         transform="rotate(-90 7 7)"
      ></circle>
   </svg>
);

export const PausedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle
         cx="7"
         cy="7"
         r="6"
         fill="none"
         stroke="#0ea5e9"
         strokeWidth="2"
         strokeDasharray="3.14 0"
         strokeDashoffset="-0.7"
      ></circle>
      <circle
         cx="7"
         cy="7"
         r="2"
         fill="none"
         stroke="#0ea5e9"
         strokeWidth="4"
         transform="rotate(-90 7 7)"
      ></circle>
   </svg>
);

export const ToDoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle
         cx="7"
         cy="7"
         r="6"
         fill="none"
         stroke="#e2e2e2"
         strokeWidth="2"
         strokeDasharray="3.14 0"
         strokeDashoffset="-0.7"
      ></circle>
      <circle
         cx="7"
         cy="7"
         r="2"
         fill="none"
         stroke="#e2e2e2"
         strokeWidth="4"
         transform="rotate(-90 7 7)"
      ></circle>
   </svg>
);

export const InProgressIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle
         cx="7"
         cy="7"
         r="6"
         fill="none"
         stroke="#facc15"
         strokeWidth="2"
         strokeDasharray="3.14 0"
         strokeDashoffset="-0.7"
      ></circle>
      <circle
         cx="7"
         cy="7"
         r="2"
         fill="none"
         stroke="#facc15"
         strokeWidth="4"
         transform="rotate(-90 7 7)"
      ></circle>
   </svg>
);

export const TechnicalReviewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle
         cx="7"
         cy="7"
         r="6"
         fill="none"
         stroke="#22c55e"
         strokeWidth="2"
         strokeDasharray="3.14 0"
         strokeDashoffset="-0.7"
      ></circle>
      <circle
         cx="7"
         cy="7"
         r="2"
         fill="none"
         stroke="#22c55e"
         strokeWidth="4"
         transform="rotate(-90 7 7)"
      ></circle>
   </svg>
);

export const CompletedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle
         cx="7"
         cy="7"
         r="6"
         fill="none"
         stroke="#8b5cf6"
         strokeWidth="2"
         strokeDasharray="3.14 0"
         strokeDashoffset="-0.7"
      ></circle>
      <path
         d="M4.5 7L6.5 9L9.5 5"
         stroke="#8b5cf6"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

export const allStatus: Status[] = [
   { id: 'backlog', name: 'Backlog', color: '#ec4899', icon: BacklogIcon },
   { id: 'to-do', name: 'Todo', color: '#f97316', icon: ToDoIcon },
   { id: 'in-progress', name: 'In Progress', color: '#facc15', icon: InProgressIcon },
   {
      id: 'technical-review',
      name: 'Technical Review',
      color: '#22c55e',
      icon: TechnicalReviewIcon,
   },
   { id: 'paused', name: 'Paused', color: '#0ea5e9', icon: PausedIcon },
   { id: 'completed', name: 'Completed', color: '#8b5cf6', icon: CompletedIcon },
];

interface StatusSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
   status: Status;
   onChange: (newStatus: Status) => void;
}

const StatusSelector = React.forwardRef<HTMLDivElement, StatusSelectorProps>(
   ({ status, onChange, className, ...props }, ref) => {
      const id = React.useId();
      const [open, setOpen] = React.useState<boolean>(false);
      const [value, setValue] = React.useState<string>(status.id);

      React.useEffect(() => {
         setValue(status.id);
      }, [status.id]);

      const handleStatusChange = (statusId: string) => {
         const newStatus = allStatus.find((s) => s.id === statusId);
         if (newStatus) {
            setValue(newStatus.id);
            onChange(newStatus);
         }
         setOpen(false);
      };

      const SelectedIcon = allStatus.find((item) => item.id === value)?.icon || ToDoIcon;

      return (
         <div ref={ref} className={cn(className)} {...props}>
            <Popover open={open} onOpenChange={setOpen}>
               <PopoverTrigger asChild>
                  <Button
                     id={id}
                     className="flex size-7 items-center justify-center"
                     size="icon"
                     variant="ghost"
                     role="combobox"
                     aria-expanded={open}
                  >
                     <SelectedIcon />
                  </Button>
               </PopoverTrigger>
               <PopoverContent
                  className="w-[200px] border-input p-0"
                  align="start"
               >
                  <Command>
                     <CommandInput placeholder="Set status..." />
                     <CommandList>
                        <CommandEmpty>No status found.</CommandEmpty>
                        <CommandGroup>
                           {allStatus.map((item) => (
                              <CommandItem
                                 key={item.id}
                                 value={item.id}
                                 onSelect={handleStatusChange}
                                 className="flex cursor-pointer items-center justify-between"
                              >
                                 <div className="flex items-center gap-2">
                                    <item.icon />
                                    <span>{item.name}</span>
                                 </div>
                                 {value === item.id && <CheckIcon size={16} className="ml-auto" />}
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
StatusSelector.displayName = 'StatusSelector';

export default StatusSelector;