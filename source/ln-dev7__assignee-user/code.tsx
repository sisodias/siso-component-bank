'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, CircleUserRound, Send, User } from 'lucide-react';

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
];

interface AssigneeUserProps extends HTMLAttributes<HTMLDivElement> {
   value: User | null;
   onChange: (user: User | null) => void;
   userList: User[];
}

const AssigneeUser = forwardRef<HTMLDivElement, AssigneeUserProps>(
   ({ value, onChange, userList, className, ...props }, ref) => {
      return (
         <div ref={ref} className={cn(className)} {...props}>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="h-8 w-auto rounded-full px-2">
                     <div className="flex items-center gap-2">
                        {value ? (
                           <>
                              <div className="relative">
                                 <Avatar className="size-6 shrink-0">
                                    <AvatarImage src={value.avatarUrl} alt={value.name} />
                                    <AvatarFallback>{value.name[0]}</AvatarFallback>
                                 </Avatar>
                                 <span
                                    className="border-background absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full border-2"
                                    style={{ backgroundColor: statusUserColors[value.status] }}
                                 />
                              </div>
                              <span className="font-medium">{value.name}</span>
                           </>
                        ) : (
                           <>
                              <CircleUserRound className="size-5 text-muted-foreground" />
                              <span className="text-muted-foreground">Assign to...</span>
                           </>
                        )}
                     </div>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="w-[206px]">
                  <DropdownMenuLabel>Assign to...</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => onChange(null)}>
                     <div className="flex flex-1 items-center gap-2">
                        <User className="size-5" />
                        <span>No assignee</span>
                     </div>
                     {!value && <Check className="ml-auto size-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {userList.map((user) => (
                     <DropdownMenuItem key={user.id} onSelect={() => onChange(user)}>
                        <div className="flex flex-1 items-center gap-2">
                           <Avatar className="size-5">
                              <AvatarImage src={user.avatarUrl} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                           </Avatar>
                           <span>{user.name}</span>
                        </div>
                        {value?.id === user.id && <Check className="ml-auto size-4" />}
                     </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>New user</DropdownMenuLabel>
                  <DropdownMenuItem>
                     <div className="flex items-center gap-2">
                        <Send className="size-4" />
                        <span>Invite and assign...</span>
                     </div>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      );
   }
);

AssigneeUser.displayName = 'AssigneeUser';

export default AssigneeUser;