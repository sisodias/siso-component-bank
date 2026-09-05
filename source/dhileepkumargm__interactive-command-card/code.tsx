"use client";

import * as React from "react";
import { Settings } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as DialogPrimitive from "@radix-ui/react-dialog";

// --- Utility Function (as used in shadcn/ui) ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Reusable UI Primitives (Styled for Theming) ---

const Command = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Settings className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 sm:rounded-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * A self-contained card that opens a searchable command palette for quick actions.
 * It's themeable, accessible, and follows modern UI/UX patterns.
 * @param {object} props
 * @param {string} props.title - The main title of the card.
 * @param {string} props.description - A short description displayed on the card.
 * @param {string} props.ctaText - The text for the button that opens the command palette.
 * @param {Array<object>} props.commands - An array of command actions available in the palette.
 * @param {string} [props.placeholder="Search for an action..."] - Placeholder for the search input.
 * @param {string} [props.emptyStateMessage="No results found."] - Message when no commands match search.
 * @param {string} [props.className] - Optional additional CSS classes for the card container.
 */
const InteractiveCommandCard = React.forwardRef(
  (
    {
      title,
      description,
      ctaText,
      commands,
      placeholder = "Search for an action...",
      emptyStateMessage = "No results found.",
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      const down = (e) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((open) => !open);
        }
      };
      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command) => {
      setOpen(false);
      command();
    }, []);

    const groupedCommands = React.useMemo(() => {
      return commands.reduce((acc, command) => {
        const group = command.group || "General";
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(command);
        return acc;
      }, {});
    }, [commands]);

    return (
      <>
        <div
          ref={ref}
          className={cn(
            "rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-md overflow-hidden",
            className
          )}
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="px-6 pb-6 pt-0">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="w-full justify-start text-sm font-medium text-muted-foreground bg-background border rounded-md px-3 py-2 flex items-center hover:bg-accent transition-colors">
                  <span>{ctaText}</span>
                  <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">{description}</DialogPrimitive.Description>
                <Command>
                  <CommandInput placeholder={placeholder} />
                  <CommandList>
                    <CommandEmpty>{emptyStateMessage}</CommandEmpty>
                    {Object.entries(groupedCommands).map(([groupName, commands]) => (
                      <CommandGroup key={groupName} heading={groupName}>
                        {commands.map((command, index) => (
                          <CommandItem
                            key={`${groupName}-${index}`}
                            value={command.label}
                            onSelect={() => runCommand(command.action)}
                          >
                            <command.icon className="mr-2 h-4 w-4" />
                            <span>{command.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </>
    );
  }
);
InteractiveCommandCard.displayName = "InteractiveCommandCard";

export default InteractiveCommandCard;
