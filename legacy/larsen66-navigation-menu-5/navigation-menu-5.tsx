"use client"

import { useId, useState } from "react"
import * as React from "react"

import {
  FileTextIcon,
  GlobeIcon,
  HomeIcon,
  LayersIcon,
  UsersIcon,
  MoonIcon,
  SunIcon,
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
  ChevronDownIcon,
} from "lucide-react"

import { cva } from "class-variance-authority"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import { cn } from "../_utils/cn"

import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { Toggle } from "./toggle"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium hover:bg-black/10 hover:text-black focus:bg-black/10 focus:text-black disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-black/10 data-[state=open]:text-black data-[state=open]:focus:bg-black/10 data-[state=open]:bg-black/5 focus-visible:ring-black/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 dark:bg-black dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 dark:focus:text-white dark:data-[state=open]:hover:bg-white/10 dark:data-[state=open]:text-white dark:data-[state=open]:focus:bg-white/10 dark:data-[state=open]:bg-white/5 dark:focus-visible:ring-white/50"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-white group-data-[viewport=false]/navigation-menu:text-black group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none dark:group-data-[viewport=false]/navigation-menu:bg-black dark:group-data-[viewport=false]/navigation-menu:text-white dark:group-data-[viewport=false]/navigation-menu:border-white/20",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-white text-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)] dark:bg-black dark:text-white dark:border-white/20",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active]:focus:bg-black/10 data-[active]:hover:bg-black/10 data-[active]:bg-black/10 data-[active]:text-black hover:bg-black/10 focus:bg-black/10 focus:text-black focus-visible:ring-black/50 [&_svg:not([class*='text-'])]:text-black/60 flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4 dark:data-[active]:focus:bg-white/10 dark:data-[active]:hover:bg-white/10 dark:data-[active]:bg-white/10 dark:data-[active]:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:text-white dark:focus-visible:ring-white/50 dark:[&_svg:not([class*='text-'])]:text-white/60",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-black/20 relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md dark:bg-white/20" />
    </NavigationMenuPrimitive.Indicator>
  )
}

const navigationLinks = [
  { href: "#", label: "Dashboard", icon: HomeIcon, active: true },
  { href: "#", label: "Projects", icon: LayersIcon },
  { href: "#", label: "Documentation", icon: FileTextIcon },
  { href: "#", label: "Team", icon: UsersIcon },
]

const languages = [
  { value: "en", label: "En" },
  { value: "es", label: "Es" },
  { value: "fr", label: "Fr" },
  { value: "de", label: "De" },
  { value: "ja", label: "Ja" },
]

export default function Component() {
  const id = useId()
  const [theme, setTheme] = useState<string>("light") // Initial theme state

  return (
    <header className="w-full border-b border-black/10 dark:border-white/10 bg-white text-black dark:bg-black dark:text-white">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 max-w-screen-2xl mx-auto">
        <div className="flex flex-1 items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden text-black dark:text-white"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden bg-white dark:bg-black border-black/10 dark:border-white/10">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className="flex-row items-center gap-2 py-1.5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                          active={link.active}
                        >
                          <Icon
                            size={16}
                            className="text-black/60 dark:text-white/60"
                            aria-hidden="true"
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            <a href="#" className="text-black hover:text-black/80 dark:text-white dark:hover:text-white/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33"
                height="33"
                fill="currentColor"
              >
                <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
                <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
              </svg>
            </a>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-2">
                <TooltipProvider>
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem key={link.label}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavigationMenuLink
                            href={link.href}
                            className="flex size-8 items-center justify-center p-1.5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                          >
                            <link.icon size={20} aria-hidden="true" />
                            <span className="sr-only">{link.label}</span>
                          </NavigationMenuLink>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="px-2 py-1 text-xs bg-white text-black dark:bg-black dark:text-white"
                        >
                          <p>{link.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </NavigationMenuItem>
                  ))}
                </TooltipProvider>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <Toggle
              variant="outline"
              className="group data-[state=on]:hover:bg-black/10 dark:data-[state=on]:hover:bg-white/10 text-black/60 dark:text-white/60 data-[state=on]:text-black/60 dark:data-[state=on]:text-white/60 data-[state=on]:hover:text-black dark:data-[state=on]:hover:text-white size-8 rounded-full border-none shadow-none data-[state=on]:bg-transparent"
              pressed={theme === "dark"}
              onPressedChange={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <MoonIcon
                size={16}
                className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
                aria-hidden="true"
              />
              <SunIcon
                size={16}
                className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
                aria-hidden="true"
              />
            </Toggle>
          </div>
          <Select defaultValue="en">
            <SelectTrigger
              id={`language-${id}`}
              className="[&>svg]:text-black/80 hover:bg-black/10 hover:text-black dark:[&>svg]:text-white/80 dark:hover:bg-white/10 dark:hover:text-white h-8 border-none px-2 shadow-none [&>svg]:shrink-0 bg-white dark:bg-black text-black dark:text-white"
              aria-label="Select language"
            >
              <GlobeIcon size={16} aria-hidden="true" />
              <SelectValue className="hidden sm:inline-flex" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 bg-white dark:bg-black text-black dark:text-white border-black/10 dark:border-white/10">
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="hover:bg-black/10 dark:hover:bg-white/10">
                  <span className="flex items-center gap-2">
                    <span className="truncate">{lang.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                <Avatar>
                  <AvatarImage src="./avatar.jpg" alt="Profile image" />
                  <AvatarFallback className="bg-black/20 text-black dark:bg-white/20 dark:text-white">KK</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64 bg-white dark:bg-black text-black dark:text-white border-black/10 dark:border-white/10" align="end">
              <DropdownMenuLabel className="flex min-w-0 flex-col">
                <span className="text-black truncate text-sm font-medium dark:text-white">
                  Keith Kennedy
                </span>
                <span className="text-black/60 truncate text-xs font-normal dark:text-white/60">
                  k.kennedy@originui.com
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="hover:bg-black/10 dark:hover:bg-white/10">
                  <BoltIcon size={16} className="opacity-60 text-black/70 dark:text-white/70" aria-hidden="true" />
                  <span>Option 1</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-black/10 dark:hover:bg-white/10">
                  <Layers2Icon size={16} className="opacity-60 text-black/70 dark:text-white/70" aria-hidden="true" />
                  <span>Option 2</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-black/10 dark:hover:bg-white/10">
                  <BookOpenIcon size={16} className="opacity-60 text-black/70 dark:text-white/70" aria-hidden="true" />
                  <span>Option 3</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="hover:bg-black/10 dark:hover:bg-white/10">
                  <PinIcon size={16} className="opacity-60 text-black/70 dark:text-white/70" aria-hidden="true" />
                  <span>Option 4</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-black/10 dark:hover:bg-white/10">
                  <UserPenIcon size={16} className="opacity-60 text-black/70 dark:text-white/70" aria-hidden="true" />
                  <span>Option 5</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
              <DropdownMenuItem className="hover:bg-black/10 dark:hover:bg-white/10">
                <LogOutIcon size={16} className="opacity-60 text-black/70 dark:text-white/70" aria-hidden="true" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}