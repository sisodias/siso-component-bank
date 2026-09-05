"use client";

import * as React from "react";
import Link from "next/link";
import { Wallet, Sun, Network } from 'lucide-react'; 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from "@/components/blocks/sidebar";

const portalDestinations = [
  {
    label: "ArkFi",
    link: "#",
    Icon: Wallet,
  },
  {
    label: "Solaris",
    link: "#",
    Icon: Sun,
  },
  {
    label: "Nexus",
    link: "#",
    Icon: Network,
  },
];

export function ApplicationGateway({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(portalDestinations[0].label);

  const handleItemClick = (e: React.MouseEvent, label: string) => {
    e.preventDefault(); 
    setActiveItem(label);
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="h-[100vh] w-16 sm:w-20 border-r" {...props}>
        <SidebarHeader className="items-center py-4">
          <Link className="inline-flex" href="/" aria-label="Go to homepage">
            <svg
              className="text-foreground"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
            >
              <title>Logo</title>
              <path d="M16.8 32c8.465-.417 15.2-7.417 15.2-15.99 0-2.631-.634-5.114-1.758-7.304-4.506 2.604-6.76 3.905-8.463 5.66a17.614 17.614 0 0 0-4.313 7.474C16.8 24.193 16.8 26.796 16.8 32Zm-1.6 0C6.735 31.583 0 24.583 0 16.01c0-2.631.634-5.114 1.758-7.304 4.506 2.604 6.76 3.905 8.463 5.66a17.613 17.613 0 0 1 4.313 7.474c.666 2.353.666 4.956.666 10.16ZM2.56 7.32c4.505 2.604 6.758 3.905 9.129 4.505 2.83.715 5.793.715 8.622 0 2.371-.6 4.624-1.901 9.13-4.504C26.59 2.915 21.635 0 16 0 10.365 0 5.41 2.915 2.56 7.32Z" />
            </svg>
          </Link>
        </SidebarHeader>
        <SidebarContent className="overflow-visible">
          <SidebarGroup className="p-4">
            <SidebarMenu className="gap-4">
              {portalDestinations.map((destination) => (
                <SidebarMenuItem
                  key={destination.label}
                  className="flex items-center justify-center"
                >
                  <span className="relative has-data-[active=true]:before:absolute has-data-[active=true]:before:inset-0 has-data-[active=true]:before:rounded-full has-data-[active=true]:before:bg-sidebar-primary/48 has-data-[active=true]:before:blur-[10px] has-data-[active=true]:before:-left-2 has-data-[active=true]:after:absolute has-data-[active=true]:after:size-1 has-data-[active=true]:after:bg-foreground has-data-[active=true]:after:rounded-full has-data-[active=true]:after:right-full has-data-[active=true]:after:top-1/2 has-data-[active=true]:after:-translate-y-1/2 has-data-[active=true]:after:-translate-x-2">
                    <SidebarMenuButton
                      asChild
                      className="relative size-9 sm:size-11 p-0 items-center justify-center rounded-full bg-linear-to-b from-background/64 to-background dark:bg-none dark:bg-card/64 dark:hover:bg-card/80 shadow-[0_1px_1px_rgba(0,0,0,0.05),_0_2px_2px_rgba(0,0,0,0.05),_0_4px_4px_rgba(0,0,0,0.05),_0_6px_6px_rgba(0,0,0,0.05)] dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)]"
                      tooltip={{
                        children: destination.label,
                        hidden: false,
                      }}
                      isActive={activeItem === destination.label}
                    >
                      <a 
                        href={destination.link}
                        onClick={(e) => handleItemClick(e, destination.label)}
                      >
                        {/* Replaced image tags with Lucide React Icon component */}
                        <destination.Icon className="size-5 text-foreground" />
                        <span className="sr-only">{destination.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </span>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}