"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

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

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

export default function FormLayout01() {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="sm:mx-auto sm:max-w-2xl">
        <h3 className="text-2xl font-semibold text-foreground dark:text-foreground">
          Register to workspace
        </h3>
        <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
          Take a few moments to register for your company's workspace
        </p>
        <form action="#" method="post" className="mt-8">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <Label
                htmlFor="first-name"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                First name
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="first-name"
                name="first-name"
                autoComplete="first-name"
                placeholder="First name"
                className="mt-2"
                required
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <Label
                htmlFor="last-name"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                Last name
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="last-name"
                name="last-name"
                autoComplete="last-name"
                placeholder="Last name"
                className="mt-2"
                required
              />
            </div>
            <div className="col-span-full">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                Email
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Email"
                className="mt-2"
                required
              />
            </div>
            <div className="col-span-full">
              <Label
                htmlFor="address"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                Address
              </Label>
              <Input
                type="text"
                id="address"
                name="address"
                autoComplete="street-address"
                placeholder="Address"
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-2">
              <Label
                htmlFor="city"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                City
              </Label>
              <Input
                type="text"
                id="city"
                name="city"
                autoComplete="address-level2"
                placeholder="City"
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-2">
              <Label
                htmlFor="state"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                State
              </Label>
              <Input
                type="text"
                id="state"
                name="state"
                autoComplete="address-level1"
                placeholder="State"
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-2">
              <Label
                htmlFor="postal-code"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                Postal code
              </Label>
              <Input
                id="postal-code"
                name="postal-code"
                autoComplete="postal-code"
                placeholder="Postal code"
                className="mt-2"
              />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              className="whitespace-nowrap"
            >
              Cancel
            </Button>
            <Button type="submit" className="whitespace-nowrap">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}