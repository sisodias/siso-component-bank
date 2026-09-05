'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, FolderIcon, LayoutDashboard, Code2 } from 'lucide-react';

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


export type Project = {
  id: string;
  name: string;
  icon: React.ElementType;
};


export const projects: Project[] = [
  { id: 'proj1', name: 'Frontend Redesign', icon: LayoutDashboard },
  { id: 'proj2', name: 'API Integration', icon: Code2 },
  { id: 'proj3', name: 'Marketing Website', icon: FolderIcon },
];

interface ProjectSelectorProps {
  projectList: Project[];
  project: Project | undefined;
  onChange: (project: Project | undefined) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projectList, project, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const SelectedIcon = project ? project.icon : FolderIcon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between text-muted-foreground"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <SelectedIcon className="size-5 shrink-0" />
            <span className="truncate font-medium text-foreground">
              {project ? project.name : 'Select project...'}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Search project..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {projectList.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      onChange(item.id === project?.id ? undefined : item);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        project?.id === item.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <ItemIcon className="size-5 shrink-0 text-muted-foreground" />
                      <span>{item.name}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProjectSelector;