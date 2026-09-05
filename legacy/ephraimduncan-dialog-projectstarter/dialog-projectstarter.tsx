"use client";

import * as React from "react";
import { useState } from "react";
import { AppWindowIcon as Apps } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { XIcon, ChevronDownIcon, ChevronUpIcon, CheckIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

const Dialog = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
>((props, ref) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} ref={ref} />;
});
Dialog.displayName = DialogPrimitive.Root.displayName;

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>((props, ref) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} ref={ref} />;
});
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

const DialogPortal = DialogPrimitive.Portal;
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>((props, ref) => {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} ref={ref} />;
});
DialogClose.displayName = DialogPrimitive.Close.displayName;

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      ref={ref}
      {...props}
    />
  );
});
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      ref={ref}
      {...props}
    />
  );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

const Select = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>
>((props, ref) => {
  return <SelectPrimitive.Root data-slot="select" {...props} ref={ref} />;
});
Select.displayName = SelectPrimitive.Root.displayName;

const SelectGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>
>((props, ref) => {
  return <SelectPrimitive.Group data-slot="select-group" {...props} ref={ref} />;
});
SelectGroup.displayName = SelectPrimitive.Group.displayName;

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>((props, ref) => {
  return <SelectPrimitive.Value data-slot="select-value" {...props} ref={ref} />;
});
SelectValue.displayName = SelectPrimitive.Value.displayName;

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default";
  }
>(({ className, size = "default", children, ...props }, ref) => {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:-translate-y-1 relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[8rem] origin-[var(--radix-select-content-transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        ref={ref}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      ref={ref}
      {...props}
    />
  );
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      ref={ref}
      {...props}
    />
  );
});
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const SelectScrollUpButton = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      ref={ref}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
});
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      ref={ref}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
});
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Separator.displayName = SeparatorPrimitive.Root.displayName;

export default function Dialog11() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Initialize New Project</Button>
      </DialogTrigger>
      <DialogContent className="overflow-visible p-0 sm:max-w-2xl gap-0">
        <DialogHeader className="border-b px-6 py-4 mb-0">
          <DialogTitle>Initialize New Project</DialogTitle>
        </DialogHeader>

        <form action="#" method="POST">
          <div className="flex flex-col-reverse md:flex-row">
            <div className="flex flex-col justify-between md:w-80 md:border-r">
              <div className="flex-1 grow">
                <div className="border-t p-6 md:border-none">
                  <div className="flex items-center space-x-3">
                    <div className="inline-flex shrink-0 items-center justify-center rounded-sm bg-muted p-3">
                      <Apps
                        className="size-5 text-foreground"
                        aria-hidden={true}
                      />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium text-foreground">
                        Project Starter
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Configure your new codebase
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <h4 className="text-sm font-medium text-foreground">
                    Description
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Quickly set up the foundational tools for your project.
                  </p>
                  <h4 className="mt-6 text-sm font-medium text-foreground">
                    Info
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Select your preferred stack and configurations.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t p-4">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" size="sm">
                  Initialize
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-6 p-6 md:px-6 md:pb-8 md:pt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    1
                  </div>
                  <Label
                    htmlFor="framework"
                    className="text-sm font-medium text-foreground"
                  >
                    Select Framework
                  </Label>
                </div>
                <Select defaultValue="react">
                  <SelectTrigger
                    id="framework"
                    name="framework"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">Next.js</SelectItem>
                    <SelectItem value="vue">React Router</SelectItem>
                    <SelectItem value="angular">Tanstack Start</SelectItem>
                    <SelectItem value="svelte">SvelteKit</SelectItem>
                    <SelectItem value="vanilla">SolidStart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    2
                  </div>
                  <Label
                    htmlFor="package-manager"
                    className="text-sm font-medium text-foreground"
                  >
                    Choose Package Manager
                  </Label>
                </div>
                <Select defaultValue="npm">
                  <SelectTrigger
                    id="package-manager"
                    name="package-manager"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="npm">npm</SelectItem>
                    <SelectItem value="yarn">yarn</SelectItem>
                    <SelectItem value="pnpm">pnpm</SelectItem>
                    <SelectItem value="bun">bun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    3
                  </div>
                  <Label
                    htmlFor="linter"
                    className="text-sm font-medium text-foreground"
                  >
                    Configure Linter/Formatter
                  </Label>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ensure code quality and consistency.
                </p>
                <Select defaultValue="eslint-prettier">
                  <SelectTrigger
                    id="linter"
                    name="linter"
                    className="mt-4 w-full"
                  >
                    <SelectValue placeholder="Select tools" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eslint-prettier">
                      ESLint + Prettier
                    </SelectItem>
                    <SelectItem value="eslint">ESLint Only</SelectItem>
                    <SelectItem value="prettier">Prettier Only</SelectItem>
                    <SelectItem value="biome">Biome</SelectItem>
                    <SelectItem value="oxlint">Oxlint</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    4
                  </div>
                  <Label
                    htmlFor="testing-tool"
                    className="text-sm font-medium text-foreground"
                  >
                    Select Testing Tool
                  </Label>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Choose a framework for unit/integration tests.
                </p>
                <Select defaultValue="jest">
                  <SelectTrigger
                    id="testing-tool"
                    name="testing-tool"
                    className="mt-4 w-full"
                  >
                    <SelectValue placeholder="Select tool" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jest">Jest</SelectItem>
                    <SelectItem value="vitest">Vitest</SelectItem>
                    <SelectItem value="cypress">Cypress</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}