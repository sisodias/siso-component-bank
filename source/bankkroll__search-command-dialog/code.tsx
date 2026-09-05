"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface CommandItem {
  id: string
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  action: () => void
  keywords?: string[]
}

interface CommandGroup {
  heading: string
  items: CommandItem[]
}

interface SearchCommandProps {
  trigger?: React.ReactNode
  commands?: CommandGroup[]
  placeholder?: string
  emptyMessage?: string
  className?: string
}

const SearchCommand = React.forwardRef<
  HTMLDivElement,
  SearchCommandProps
>(({ 
  trigger, 
  commands = [], 
  placeholder = "Type a command or search...", 
  emptyMessage = "No results found.",
  className,
  ...props 
}, ref) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Filter commands based on search
  const filteredGroups = React.useMemo(() => {
    if (!search) return commands
    
    return commands
      .map(group => ({
        ...group,
        items: group.items.filter(item => {
          const searchLower = search.toLowerCase()
          return (
            item.title.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower) ||
            item.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
          )
        })
      }))
      .filter(group => group.items.length > 0)
  }, [commands, search])

  // Focus input when dialog opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  // Global keyboard shortcut (⌘K or Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = (item: CommandItem) => {
    item.action()
    setOpen(false)
    setSearch("")
  }

  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Trigger asChild>
          {trigger || (
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm",
                "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              <Search className="h-4 w-4" />
              Search command dialog...
              <kbd className="ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          )}
        </DialogPrimitive.Trigger>
        
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className={cn(
              "fixed inset-0 z-50 bg-black/80",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            )}
          />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
              "border bg-background shadow-lg sm:rounded-lg",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
              "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
            )}
          >
            <CommandPrimitive className="flex h-full w-full flex-col">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandPrimitive.Input
                  ref={inputRef}
                  value={search}
                  onValueChange={setSearch}
                  placeholder={placeholder}
                  className={cn(
                    "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none",
                    "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
                <DialogPrimitive.Close
                  className={cn(
                    "rounded-sm opacity-70 transition-opacity hover:opacity-100",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  )}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              </div>
              <CommandPrimitive.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </CommandPrimitive.Empty>
                {filteredGroups.map((group) => (
                  <CommandPrimitive.Group
                    key={group.heading}
                    heading={group.heading}
                    className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {group.items.map((item) => (
                      <CommandPrimitive.Item
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                          "hover:bg-accent hover:text-accent-foreground",
                          "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                        )}
                      >
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          )}
                        </div>
                      </CommandPrimitive.Item>
                    ))}
                  </CommandPrimitive.Group>
                ))}
              </CommandPrimitive.List>
              <div className="border-t px-3 py-2 text-xs text-muted-foreground">
                Use ↑↓ to navigate, ↵ to select, ⌘K to toggle
              </div>
            </CommandPrimitive>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
})

SearchCommand.displayName = "SearchCommand"

export { SearchCommand, type CommandItem, type CommandGroup, type SearchCommandProps }