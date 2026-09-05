// component.tsx
'use client';

import * as React from 'react';
import { cn } from "../_utils/cn";
import { ExternalLink, HelpCircle, Keyboard, Search } from 'lucide-react';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { Input } from "./input";

export interface HelpLink {
   icon: React.ComponentType<{ className?: string }>;
   name: string;
   href: string;
}

export interface WhatsNewItem {
   name: string;
   href: string;
   isNew: boolean;
}

export interface ShortcutItem {
   name: string;
   shortcut: string;
}

interface HelpButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
   socialLinks?: HelpLink[];
   supportLink?: HelpLink;
   whatsNewItems?: WhatsNewItem[];
   shortcutItems?: ShortcutItem[];
}

const HelpButton = React.forwardRef<HTMLButtonElement, HelpButtonProps>(
   (
      {
         className,
         socialLinks = [],
         supportLink,
         whatsNewItems = [],
         shortcutItems = [],
         ...props
      },
      ref
   ) => {
      return (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button ref={ref} size="icon" variant="outline" className={className} {...props}>
                  <HelpCircle className="size-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
               <div className="p-2">
                  <div className="relative">
                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input type="search" placeholder="Search for help..." className="pl-8" />
                  </div>
               </div>
               {shortcutItems.length > 0 && <DropdownMenuSeparator />}
               {shortcutItems.length > 0 && <DropdownMenuLabel>Shortcuts</DropdownMenuLabel>}
               {shortcutItems.map((item) => (
                  <DropdownMenuItem key={item.name}>
                     <Keyboard className="mr-2 h-4 w-4" />
                     <span>{item.name}</span>
                     <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
                  </DropdownMenuItem>
               ))}
               {socialLinks.length > 0 && <DropdownMenuSeparator />}
               {socialLinks.length > 0 && <DropdownMenuLabel>Follow us</DropdownMenuLabel>}
               {socialLinks.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                     <a href={item.href} target="_blank" rel="noopener noreferrer">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                        <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                     </a>
                  </DropdownMenuItem>
               ))}
               {supportLink && <DropdownMenuSeparator />}
               {supportLink && (
                  <DropdownMenuItem asChild>
                     <a href={supportLink.href} target="_blank" rel="noopener noreferrer">
                        <supportLink.icon className="mr-2 h-4 w-4" />
                        <span>{supportLink.name}</span>
                     </a>
                  </DropdownMenuItem>
               )}
               {whatsNewItems.length > 0 && <DropdownMenuSeparator />}
               {whatsNewItems.length > 0 && <DropdownMenuLabel>What's new</DropdownMenuLabel>}
               {whatsNewItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                     <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <div className="mr-2 flex h-4 w-4 items-center justify-center">
                           {item.isNew && (
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                           )}
                        </div>
                        <span>{item.name}</span>
                     </a>
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      );
   }
);
HelpButton.displayName = 'HelpButton';

export default HelpButton;