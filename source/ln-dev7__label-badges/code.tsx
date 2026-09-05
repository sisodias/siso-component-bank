// component.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface LabelInterface {
   id: string;
   name: string;
   color: string;
}

export const labels: LabelInterface[] = [
   { id: 'ui', name: 'UI Enhancement', color: '#a2eeef' },
   { id: 'bug', name: 'Bug', color: '#d73a4a' },
   { id: 'feature', name: 'Feature', color: '#0e8a16' },
   { id: 'documentation', name: 'Documentation', color: '#534cb3' },
   { id: 'refactor', name: 'Refactor', color: '#fcca42' },
   { id: 'performance', name: 'Performance', color: '#fbca04' },
   { id: 'design', name: 'Design', color: '#d876e3' },
   { id: 'security', name: 'Security', color: '#6a737d' },
   { id: 'accessibility', name: 'Accessibility', color: '#0052cc' },
   { id: 'testing', name: 'Testing', color: '#008672' },
];

interface LabelBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
   labels: LabelInterface[];
}

const LabelBadge = React.forwardRef<HTMLDivElement, LabelBadgeProps>(
   ({ labels, className, ...props }, ref) => {
      if (!labels || labels.length === 0) {
         return null;
      }

      return (
         <div ref={ref} className={cn('flex flex-wrap gap-2', className)} {...props}>
            {labels.map((l) => (
               <Badge
                  key={l.id}
                  variant="outline"
                  className="gap-1.5 rounded-full border bg-background text-foreground"
               >
                  <span
                     className="size-2 rounded-full"
                     style={{ backgroundColor: l.color }}
                     aria-hidden="true"
                  ></span>
                  {l.name}
               </Badge>
            ))}
         </div>
      );
   }
);
LabelBadge.displayName = 'LabelBadge';

export default LabelBadge;