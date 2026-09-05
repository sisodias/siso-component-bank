// component.tsx
'use client';

import React from 'react';
import { format } from 'date-fns';
import { ContactRound } from 'lucide-react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
   className?: string;
}

const NoPriorityIcon = ({ className, ...props }: IconProps) => (
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

const BacklogIcon: React.FC = () => {
   return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
            className="progress"
            cx="7"
            cy="7"
            r="2"
            fill="none"
            stroke="#bec2c8"
            strokeWidth="4"
            strokeDasharray="0 100"
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         ></circle>
      </svg>
   );
};

const PausedIcon: React.FC = () => {
   return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
            className="progress"
            cx="7"
            cy="7"
            r="2"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="4"
            strokeDasharray="6.2517693806436885 100"
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         ></circle>
      </svg>
   );
};

const ToDoIcon: React.FC = () => {
   return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
            className="progress"
            cx="7"
            cy="7"
            r="2"
            fill="none"
            stroke="#e2e2e2"
            strokeWidth="4"
            strokeDasharray="0 100"
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         ></circle>
      </svg>
   );
};

const InProgressIcon: React.FC = () => {
   return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
            className="progress"
            cx="7"
            cy="7"
            r="2"
            fill="none"
            stroke="#facc15"
            strokeWidth="4"
            strokeDasharray="2.0839231268812295 100"
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         ></circle>
      </svg>
   );
};

const TechnicalReviewIcon: React.FC = () => {
   return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
            className="progress"
            cx="7"
            cy="7"
            r="2"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            strokeDasharray="4.167846253762459 100"
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         ></circle>
      </svg>
   );
};

const CompletedIcon: React.FC = () => {
   return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
};

export interface User {
   id: string;
   name: string;
   avatarUrl: string;
   email: string;
   status: 'online' | 'offline' | 'away';
   role: 'Member' | 'Admin' | 'Guest';
   joinedDate: string;
   teamIds: string[];
}

const avatarUrl = (seed: string) => `https://api.dicebear.com/9.x/glass/svg?seed=${seed}`;

export const statusUserColors = {
   online: '#00cc66',
   offline: '#969696',
   away: '#ffcc00',
};

export const users: User[] = [
   {
      id: 'ln',
      name: 'leonel.ngoya',
      avatarUrl: avatarUrl('ln'),
      email: 'leonelngoya@gmail.com',
      status: 'online',
      role: 'Admin',
      joinedDate: '2022-01-01',
      teamIds: ['CORE', 'PERF', 'DESIGN', 'WEB'],
   },
   {
      id: 'sophia',
      name: 'sophia.reed',
      avatarUrl: avatarUrl('sophiareed'),
      email: 'sophiareed@gmail.com',
      status: 'offline',
      role: 'Admin',
      joinedDate: '2023-06-04',
      teamIds: ['CORE', 'PERF'],
   },
   {
      id: 'mason',
      name: 'mason.carter',
      avatarUrl: avatarUrl('mason'),
      email: 'masoncarter@gmail.com',
      status: 'away',
      role: 'Member',
      joinedDate: '2023-11-01',
      teamIds: ['CORE', 'DESIGN'],
   },
   {
      id: 'emma',
      name: 'emma.jones',
      avatarUrl: avatarUrl('emmajones'),
      email: 'emmajones@gmail.com',
      status: 'online',
      role: 'Member',
      joinedDate: '2023-03-20',
      teamIds: ['CORE'],
   },
   {
      id: 'alex',
      name: 'alex.zhang',
      avatarUrl: avatarUrl('alexzhang'),
      email: 'alexzhang@gmail.com',
      status: 'online',
      role: 'Member',
      joinedDate: '2023-05-15',
      teamIds: ['DESIGN', 'PERF'],
   },
   {
      id: 'olivia',
      name: 'olivia.wilson',
      avatarUrl: avatarUrl('oliviawilson'),
      email: 'oliviawilson@gmail.com',
      status: 'offline',
      role: 'Admin',
      joinedDate: '2022-08-22',
      teamIds: ['PERF'],
   },
   {
      id: 'lucas',
      name: 'lucas.martin',
      avatarUrl: avatarUrl('lucasmartin'),
      email: 'lucasmartin@gmail.com',
      status: 'away',
      role: 'Member',
      joinedDate: '2023-02-14',
      teamIds: ['CORE', 'DESIGN', 'PERF'],
   },
   {
      id: 'isabella',
      name: 'isabella.garcia',
      avatarUrl: avatarUrl('isabellagarcia'),
      email: 'isabellagarcia@gmail.com',
      status: 'online',
      role: 'Member',
      joinedDate: '2022-11-30',
      teamIds: ['DESIGN'],
   },
   {
      id: 'ethan',
      name: 'ethan.brown',
      avatarUrl: avatarUrl('ethanbrown'),
      email: 'ethanbrown@gmail.com',
      status: 'offline',
      role: 'Member',
      joinedDate: '2023-07-18',
      teamIds: ['PERF'],
   },
   {
      id: 'amelia',
      name: 'amelia.kim',
      avatarUrl: avatarUrl('ameliakim'),
      email: 'ameliakim@gmail.com',
      status: 'online',
      role: 'Guest',
      joinedDate: '2022-05-09',
      teamIds: ['DESIGN'],
   },
   {
      id: 'noah',
      name: 'noah.davis',
      avatarUrl: avatarUrl('noahdavis'),
      email: 'noahdavis@gmail.com',
      status: 'away',
      role: 'Member',
      joinedDate: '2023-09-27',
      teamIds: ['PERF', 'DESIGN'],
   },
   {
      id: 'charlotte',
      name: 'charlotte.miller',
      avatarUrl: avatarUrl('charlottemiller'),
      email: 'charlottemiller@gmail.com',
      status: 'online',
      role: 'Guest',
      joinedDate: '2022-04-03',
      teamIds: ['PERF'],
   },
   {
      id: 'aiden',
      name: 'aiden.thompson',
      avatarUrl: avatarUrl('aidenthompson'),
      email: 'aidenthompson@gmail.com',
      status: 'offline',
      role: 'Admin',
      joinedDate: '2023-01-12',
      teamIds: ['DESIGN'],
   },
   {
      id: 'mia',
      name: 'mia.patel',
      avatarUrl: avatarUrl('miapatel'),
      email: 'miapatel@gmail.com',
      status: 'online',
      role: 'Member',
      joinedDate: '2022-10-05',
      teamIds: ['DESIGN', 'PERF'],
   },
   {
      id: 'logan',
      name: 'logan.wright',
      avatarUrl: avatarUrl('loganwright'),
      email: 'loganwright@gmail.com',
      status: 'away',
      role: 'Guest',
      joinedDate: '2023-08-14',
      teamIds: ['PERF', 'DESIGN'],
   },
   {
      id: 'harper',
      name: 'harper.robinson',
      avatarUrl: avatarUrl('harperrobinson'),
      email: 'harperrobinson@gmail.com',
      status: 'offline',
      role: 'Member',
      joinedDate: '2022-07-29',
      teamIds: ['PERF'],
   },
   {
      id: 'gabriel',
      name: 'gabriel.nguyen',
      avatarUrl: avatarUrl('gabrielnguyen'),
      email: 'gabrielnguyen@gmail.com',
      status: 'online',
      role: 'Member',
      joinedDate: '2023-04-17',
      teamIds: ['DESIGN'],
   },
   {
      id: 'victoria',
      name: 'victoria.lee',
      avatarUrl: avatarUrl('victorialee'),
      email: 'victorialee@gmail.com',
      status: 'away',
      role: 'Guest',
      joinedDate: '2022-12-08',
      teamIds: ['DESIGN'],
   },
   {
      id: 'daniel',
      name: 'daniel.taylor',
      avatarUrl: avatarUrl('danieltaylor'),
      email: 'danieltaylor@gmail.com',
      status: 'offline',
      role: 'Member',
      joinedDate: '2023-10-21',
      teamIds: ['PERF'],
   },
   {
      id: 'abigail',
      name: 'abigail.moore',
      avatarUrl: avatarUrl('abigailmoore'),
      email: 'abigailmoore@gmail.com',
      status: 'online',
      role: 'Member',
      joinedDate: '2022-06-17',
      teamIds: ['DESIGN', 'PERF'],
   },
];

export interface Priority {
   id: string;
   name: string;
   icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const priorities: Priority[] = [
   { id: 'no-priority', name: 'No priority', icon: NoPriorityIcon },
   { id: 'urgent', name: 'Urgent', icon: UrgentPriorityIcon },
   { id: 'high', name: 'High', icon: HighPriorityIcon },
   { id: 'medium', name: 'Medium', icon: MediumPriorityIcon },
   { id: 'low', name: 'Low', icon: LowPriorityIcon },
];

export interface Status {
   id: string;
   name: string;
   color: string;
   icon: React.FC;
}

export const status: Status[] = [
   { id: 'in-progress', name: 'In Progress', color: '#facc15', icon: InProgressIcon },
   {
      id: 'technical-review',
      name: 'Technical Review',
      color: '#22c55e',
      icon: TechnicalReviewIcon,
   },
   { id: 'completed', name: 'Completed', color: '#8b5cf6', icon: CompletedIcon },
   { id: 'paused', name: 'Paused', color: '#0ea5e9', icon: PausedIcon },
   { id: 'to-do', name: 'Todo', color: '#f97316', icon: ToDoIcon },
   { id: 'backlog', name: 'Backlog', color: '#ec4899', icon: BacklogIcon },
];

interface Health {
   id: 'no-update' | 'off-track' | 'on-track' | 'at-risk';
   name: string;
   color: string;
   description: string;
}

export const health: Health[] = [
   {
      id: 'no-update',
      name: 'No Update',
      color: '#FF0000',
      description: 'The project has not been updated in the last 30 days.',
   },
   {
      id: 'off-track',
      name: 'Off Track',
      color: '#FF0000',
      description: 'The project is not on track and may be delayed.',
   },
   {
      id: 'on-track',
      name: 'On Track',
      color: '#00FF00',
      description: 'The project is on track and on schedule.',
   },
   {
      id: 'at-risk',
      name: 'At Risk',
      color: '#FF0000',
      description: 'The project is at risk and may be delayed.',
   },
];

export interface Project {
   id: string;
   name: string;
   status: Status;
   icon: any;
   percentComplete: number;
   startDate: string;
   lead: User;
   priority: Priority;
   health: Health;
}

export const projects: Project[] = [
   {
      id: '1',
      name: 'LNDev UI - Core Components',
      status: status[0],
      icon: 'Cuboid',
      percentComplete: 80,
      startDate: '2025-03-08',
      lead: users[2],
      priority: priorities[1],
      health: health[0],
   },
   {
      id: '2',
      name: 'LNDev UI - Theming',
      status: status[1],
      icon: 'Blocks',
      percentComplete: 50,
      startDate: '2025-03-14',
      lead: users[0],
      priority: priorities[0],
      health: health[3],
   },
   {
      id: '3',
      name: 'LNDev UI - Modals',
      status: status[2],
      icon: 'Vault',
      percentComplete: 0,
      startDate: '2025-03-09',
      lead: users[1],
      priority: priorities[2],
      health: health[1],
   },
   {
      id: '4',
      name: 'LNDev UI - Navigation',
      status: status[3],
      icon: 'BrickWall',
      percentComplete: 0,
      startDate: '2025-03-10',
      lead: users[2],
      priority: priorities[0],
      health: health[2],
   },
   {
      id: '5',
      name: 'LNDev UI - Layout',
      status: status[4],
      icon: 'Wallpaper',
      percentComplete: 0,
      startDate: '2025-03-11',
      lead: users[0],
      priority: priorities[0],
      health: health[3],
   },
   {
      id: '6',
      name: 'LNDev UI - Sidebar',
      status: status[5],
      icon: 'TrafficCone',
      percentComplete: 0,
      startDate: '2025-03-12',
      lead: users[1],
      priority: priorities[0],
      health: health[1],
   },
   {
      id: '7',
      name: 'LNDev UI - Cards',
      status: status[1],
      icon: 'Grid2X2',
      percentComplete: 0,
      startDate: '2025-03-13',
      lead: users[2],
      priority: priorities[0],
      health: health[2],
   },
   {
      id: '8',
      name: 'LNDev UI - Tooltip',
      status: status[2],
      icon: 'Bomb',
      percentComplete: 0,
      startDate: '2025-03-14',
      lead: users[0],
      priority: priorities[0],
      health: health[3],
   },
   {
      id: '9',
      name: 'LNDev UI - Dropdown',
      status: status[3],
      icon: 'Shapes',
      percentComplete: 50,
      startDate: '2025-03-15',
      lead: users[1],
      priority: priorities[0],
      health: health[3],
   },
   {
      id: '10',
      name: 'LNDev UI - Data Tables',
      status: status[0],
      icon: 'Table',
      percentComplete: 65,
      startDate: '2025-03-18',
      lead: users[2],
      priority: priorities[1],
      health: health[0],
   },
];

export interface Team {
   id: string;
   name: string;
   icon: string;
   joined: boolean;
   color: string;
   members: User[];
   projects: Project[];
}

export const teams: Team[] = [
   {
      id: 'CORE',
      name: 'LNDev Core',
      icon: '🛠️',
      joined: true,
      color: '#FF0000',
      members: [users[8], users[10], users[2], users[3], users[4]],
      projects: [projects[5], projects[8], projects[3]],
   },
   {
      id: 'DESIGN',
      name: 'Design System',
      icon: '🎨',
      joined: true,
      color: '#00FF00',
      members: [users[7], users[3]],
      projects: [projects[1], projects[1], projects[2], projects[3]],
   },
   {
      id: 'PERF',
      name: 'Performance Lab',
      icon: '☀️',
      joined: false,
      color: '#0000FF',
      members: [users[5], users[0], users[1], users[2], users[3], users[4], users[6]],
      projects: [projects[8], projects[8]],
   },
];

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
   return (
      <AvatarPrimitive.Root
         data-slot="avatar"
         className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
         {...props}
      />
   );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
   return (
      <AvatarPrimitive.Image
         data-slot="avatar-image"
         className={cn('aspect-square size-full', className)}
         {...props}
      />
   );
}

function AvatarFallback({
   className,
   ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
   return (
      <AvatarPrimitive.Fallback
         data-slot="avatar-fallback"
         className={cn(
            'bg-muted flex size-full items-center justify-center rounded-full',
            className
         )}
         {...props}
      />
   );
}

function TooltipProvider({
   delayDuration = 0,
   ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
   return (
      <TooltipPrimitive.Provider
         data-slot="tooltip-provider"
         delayDuration={delayDuration}
         {...props}
      />
   );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
   return (
      <TooltipProvider>
         <TooltipPrimitive.Root data-slot="tooltip" {...props} />
      </TooltipProvider>
   );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
   return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
   className,
   sideOffset = 8,
   children,
   ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
   return (
      <TooltipPrimitive.Portal>
         <TooltipPrimitive.Content
            data-slot="tooltip-content"
            sideOffset={sideOffset}
            className={cn(
               'bg-background border text-muted-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance',
               className
            )}
            {...props}
         >
            {children}
         </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
   );
}

interface TeamsTooltipProps {
   teamIds: string[];
}

function TeamsTooltip({ teamIds }: TeamsTooltipProps) {
   return (
      <Tooltip delayDuration={0}>
         <TooltipTrigger className="flex items-center gap-0.5 truncate">
            <ContactRound className="text-muted-foreground size-4 mr-1 shrink-0" />
            {teamIds.slice(0, 2).map((teamId, index) => (
               <span key={teamId} className="mt-0.5">
                  {teamId}
                  {index < Math.min(teamIds.length, 2) - 1 && ', '}
               </span>
            ))}
            {teamIds.length > 2 && <span className="mt-0.5">+ {teamIds.length - 2}</span>}
         </TooltipTrigger>
         <TooltipContent className="p-2">
            <div className="flex flex-col gap-1">
               {teams
                  .filter((team) => teamIds.includes(team.id))
                  .map((team) => (
                     <div key={team.id} className="text-xs flex items-center gap-2">
                        <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
                           <div className="text-sm">{team.icon}</div>
                        </div>
                        <span className="font-medium">{team.name}</span>
                     </div>
                  ))}
            </div>
         </TooltipContent>
      </Tooltip>
   );
}

interface MemberLineProps {
   user: User;
}

function MemberLine({ user }: MemberLineProps) {
   return (
      <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm last:border-b-0">
         <div className="flex-grow flex items-center gap-2 overflow-hidden">
            <div className="relative">
               <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
               </Avatar>
               <span
                  className="border-background absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full border-2"
                  style={{ backgroundColor: statusUserColors[user.status] }}
               >
                  <span className="sr-only">{user.status}</span>
               </span>
            </div>
            <div className="flex flex-col items-start overflow-hidden">
               <span className="font-medium truncate w-full">{user.name}</span>
               <span className="text-xs text-muted-foreground truncate w-full">{user.email}</span>
            </div>
         </div>
         <div className="w-32 shrink-0 text-xs text-muted-foreground">{user.role}</div>
         <div className="w-32 shrink-0 text-xs text-muted-foreground">
            {format(new Date(user.joinedDate), 'MMM yyyy')}
         </div>
         <div className="w-40 shrink-0 flex text-xs text-muted-foreground">
            <TeamsTooltip teamIds={user.teamIds} />
         </div>
      </div>
   );
}

const MemberList = React.forwardRef<
   HTMLDivElement,
   React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
   <div
      ref={ref}
      className={cn(
         'w-full h-full bg-white dark:bg-black text-black dark:text-white transition-colors duration-300',
         className
      )}
      {...props}
   >
      <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
         <div className="flex-grow">Name</div>
         <div className="w-32 shrink-0">Status</div>
         <div className="w-32 shrink-0">Joined</div>
         <div className="w-40 shrink-0">Teams</div>
      </div>
      <div className="w-full">
         {users.map((user) => (
            <MemberLine key={user.id} user={user} />
         ))}
      </div>
   </div>
));
MemberList.displayName = 'MemberList';

export default MemberList;