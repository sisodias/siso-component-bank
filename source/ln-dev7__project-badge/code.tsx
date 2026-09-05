// component.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Component, Book, BarChart, LucideIcon } from 'lucide-react';

export interface Project {
   id: string;
   name: string;
   icon: LucideIcon;
}

export const projects: Project[] = [
   { id: 'proj-1', name: 'UI Components', icon: Component },
   { id: 'proj-2', name: 'Documentation', icon: Book },
   { id: 'proj-3', name: 'Analytics Dashboard', icon: BarChart },
];

interface ProjectBadgeProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
   project: Project;
}

const ProjectBadge = React.forwardRef<HTMLAnchorElement, ProjectBadgeProps>(
   ({ project, className, ...props }, ref) => {
      const Icon = project.icon;

      return (
         <a ref={ref} className={cn('inline-block', className)} {...props}>
            <Badge
               variant="outline"
               className="gap-1.5 rounded-full bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
               <Icon className="size-3.5" />
               {project.name}
            </Badge>
         </a>
      );
   }
);
ProjectBadge.displayName = 'ProjectBadge';

export default ProjectBadge;