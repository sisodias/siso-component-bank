'use client';

import * as React from 'react';
import { cn } from "../_utils/cn";
import {
   ContextMenuContent,
   ContextMenuGroup,
   ContextMenuItem,
   ContextMenuSeparator,
   ContextMenuShortcut,
   ContextMenuSub,
   ContextMenuSubContent,
   ContextMenuSubTrigger,
} from "./context-menu";
import {
   CircleCheck,
   User,
   BarChart3,
   Tag,
   Pencil,
   Link as LinkIcon,
   Copy as CopyIcon,
   Bell,
   Star,
   AlarmClock,
   Trash2,
   Clipboard,
   LucideIcon,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

export const BacklogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle
         cx="7"
         cy="7"
         r="6"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeDasharray="1.4 1.74"
         strokeDashoffset="0.65"
      />
   </svg>
);

export const PausedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
   </svg>
);

export const ToDoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
   </svg>
);

export const InProgressIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M 7 1 A 6 6 0 0 1 13 7" stroke="currentColor" strokeWidth="2" fill="none" />
   </svg>
);

export const CompletedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
         d="M4.5 7L6.5 9L9.5 5"
         stroke="currentColor"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

export interface Status {
   id: string;
   name: string;
   icon: React.FC<React.SVGProps<SVGSVGElement>>;
   color: string;
}
export interface Priority {
   id: string;
   name: string;
   icon: LucideIcon;
}
export interface User {
   id: string;
   name: string;
   avatarUrl: string;
}
export interface Label {
   id: string;
   name: string;
   color: string;
}

interface IssueContextMenuProps extends React.ComponentPropsWithoutRef<typeof ContextMenuContent> {
   statusList: Status[];
   priorityList: Priority[];
   userList: User[];
   labelList: Label[];
   isSubscribed?: boolean;
   isFavorite?: boolean;
   onAction: (action: string, value?: any) => void;
}

const IssueContextMenu = React.forwardRef<
   React.ElementRef<typeof ContextMenuContent>,
   IssueContextMenuProps
>(
   (
      {
         className,
         statusList,
         priorityList,
         userList,
         labelList,
         isSubscribed,
         isFavorite,
         onAction,
         ...props
      },
      ref
   ) => (
      <ContextMenuContent ref={ref} className={cn('w-64', className)} {...props}>
         <ContextMenuGroup>
            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <CircleCheck className="mr-2 size-4" /> Status
               </ContextMenuSubTrigger>
               <ContextMenuSubContent className="w-48">
                  {statusList.map((s) => (
                     <ContextMenuItem key={s.id} onClick={() => onAction('status', s.id)}>
                        <s.icon className="mr-2 size-3.5" style={{ color: s.color }} />
                        <span>{s.name}</span>
                     </ContextMenuItem>
                  ))}
               </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <User className="mr-2 size-4" /> Assignee
               </ContextMenuSubTrigger>
               <ContextMenuSubContent className="w-48">
                  <ContextMenuItem onClick={() => onAction('assignee', null)}>
                     <User className="mr-2 size-4" /> Unassigned
                  </ContextMenuItem>
                  {userList.map((user) => (
                     <ContextMenuItem key={user.id} onClick={() => onAction('assignee', user.id)}>
                        <Avatar className="mr-2 size-5">
                           <AvatarImage src={user.avatarUrl} alt={user.name} />
                           <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                     </ContextMenuItem>
                  ))}
               </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <BarChart3 className="mr-2 size-4" /> Priority
               </ContextMenuSubTrigger>
               <ContextMenuSubContent className="w-48">
                  {priorityList.map((p) => (
                     <ContextMenuItem key={p.id} onClick={() => onAction('priority', p.id)}>
                        <p.icon className="mr-2 size-4" /> <span>{p.name}</span>
                     </ContextMenuItem>
                  ))}
               </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSub>
               <ContextMenuSubTrigger>
                  <Tag className="mr-2 size-4" /> Labels
               </ContextMenuSubTrigger>
               <ContextMenuSubContent className="w-48">
                  {labelList.map((label) => (
                     <ContextMenuItem key={label.id} onClick={() => onAction('label', label.id)}>
                        <span
                           className="mr-2 inline-block size-2 rounded-full"
                           style={{ backgroundColor: label.color }}
                        />
                        <span>{label.name}</span>
                     </ContextMenuItem>
                  ))}
               </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuItem onClick={() => onAction('rename')}>
               <Pencil className="mr-2 size-4" /> Rename...
               <ContextMenuShortcut>R</ContextMenuShortcut>
            </ContextMenuItem>
         </ContextMenuGroup>

         <ContextMenuSeparator />

         <ContextMenuItem onClick={() => onAction('addLink')}>
            <LinkIcon className="mr-2 size-4" /> Add link...
         </ContextMenuItem>
         <ContextMenuItem onClick={() => onAction('duplicate')}>
            <CopyIcon className="mr-2 size-4" /> Make a copy...
         </ContextMenuItem>

         <ContextMenuSeparator />

         <ContextMenuItem onClick={() => onAction('subscribe')}>
            <Bell className="mr-2 size-4" /> {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            <ContextMenuShortcut>S</ContextMenuShortcut>
         </ContextMenuItem>
         <ContextMenuItem onClick={() => onAction('favorite')}>
            <Star className="mr-2 size-4" /> {isFavorite ? 'Unfavorite' : 'Favorite'}
            <ContextMenuShortcut>F</ContextMenuShortcut>
         </ContextMenuItem>
         <ContextMenuItem onClick={() => onAction('copyId')}>
            <Clipboard className="mr-2 size-4" /> Copy issue ID
         </ContextMenuItem>
         <ContextMenuItem onClick={() => onAction('remind')}>
            <AlarmClock className="mr-2 size-4" /> Remind me
            <ContextMenuShortcut>H</ContextMenuShortcut>
         </ContextMenuItem>

         <ContextMenuSeparator />

         <ContextMenuItem variant="destructive" onClick={() => onAction('delete')}>
            <Trash2 className="mr-2 size-4" /> Delete...
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
         </ContextMenuItem>
      </ContextMenuContent>
   )
);
IssueContextMenu.displayName = 'IssueContextMenu';

export default IssueContextMenu;