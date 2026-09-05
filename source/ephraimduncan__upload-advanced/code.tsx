"use client";

import * as React from "react";
import { useState, useRef, useEffect, type RefObject } from "react";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { File, Trash, CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

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

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

interface InputProps extends React.ComponentProps<"input"> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
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
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {}
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
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
  }
);
Label.displayName = "Label";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}
Select.displayName = "Select";

interface SelectGroupProps
  extends React.ComponentProps<typeof SelectPrimitive.Group> {}
function SelectGroup({ ...props }: SelectGroupProps) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}
SelectGroup.displayName = "SelectGroup";

interface SelectValueProps
  extends React.ComponentProps<typeof SelectPrimitive.Value> {}
function SelectValue({ ...props }: SelectValueProps) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}
SelectValue.displayName = "SelectValue";

interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  size?: "sm" | "default";
}
const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
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
SelectTrigger.displayName = "SelectTrigger";

interface SelectContentProps
  extends React.ComponentProps<typeof SelectPrimitive.Content> {}
const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectContentProps
>(({ className, children, position = "popper", ...props }, ref) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[8rem] origin-[var(--radix-select-content-transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
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
SelectContent.displayName = "SelectContent";

interface SelectLabelProps
  extends React.ComponentProps<typeof SelectPrimitive.Label> {}
function SelectLabel({ ...props }: SelectLabelProps) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", props.className)}
      {...props}
    />
  );
}
SelectLabel.displayName = "SelectLabel";

interface SelectItemProps
  extends React.ComponentProps<typeof SelectPrimitive.Item> {}
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
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
  }
);
SelectItem.displayName = "SelectItem";

interface SelectSeparatorProps
  extends React.ComponentProps<typeof SelectPrimitive.Separator> {}
function SelectSeparator({ ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", props.className)}
      {...props}
    />
  );
}
SelectSeparator.displayName = "SelectSeparator";

interface SelectScrollUpButtonProps
  extends React.ComponentProps<typeof SelectPrimitive.ScrollUpButton> {}
function SelectScrollUpButton({ ...props }: SelectScrollUpButtonProps) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", props.className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}
SelectScrollUpButton.displayName = "SelectScrollUpButton";

interface SelectScrollDownButtonProps
  extends React.ComponentProps<typeof SelectPrimitive.ScrollDownButton> {}
function SelectScrollDownButton({ ...props }: SelectScrollDownButtonProps) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", props.className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}
SelectScrollDownButton.displayName = "SelectScrollDownButton";

interface SeparatorProps
  extends React.ComponentProps<typeof SeparatorPrimitive.Root> {}
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
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
  )
);
Separator.displayName = "Separator";

export default function FileUpload03() {
  const [files, setFiles] = React.useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
  });

  const filesList = files.map((file) => (
    <li key={file.name} className="relative">
      <Card className="relative p-4">
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove file"
            onClick={() =>
              setFiles((prevFiles) =>
                prevFiles.filter((prevFile) => prevFile.name !== file.name)
              )
            }
          >
            <Trash className="h-5 w-5" aria-hidden={true} />
          </Button>
        </div>
        <CardContent className="flex items-center space-x-3 p-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <File className="h-5 w-5 text-foreground" aria-hidden={true} />
          </span>
          <div>
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {file.size} bytes
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  ));

  return (
    <div className="flex items-center justify-center p-10">
      <Card className="sm:mx-auto sm:max-w-xl">
        <CardHeader>
          <CardTitle>Set up your first cloud storage</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="#" method="post">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full sm:col-span-3">
                <Label htmlFor="bucket-name" className="font-medium">
                  Bucket name
                </Label>
                <Input
                  type="text"
                  id="bucket-name"
                  name="bucket-name"
                  placeholder="Bucket name"
                  className="mt-2"
                />
              </div>
              <div className="col-span-full sm:col-span-3">
                <Label htmlFor="visibility" className="font-medium">
                  Visibility
                </Label>
                <Select defaultValue="private" disabled>
                  <SelectTrigger
                    id="visibility"
                    name="visibility"
                    className="mt-2 w-full"
                  >
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-2 text-sm text-muted-foreground">
                  Only admins can change visibility.
                </p>
              </div>
              <div className="col-span-full">
                <Label htmlFor="file-upload-2" className="font-medium">
                  File(s) upload
                </Label>
                <div
                  {...getRootProps()}
                  className={cn(
                    isDragActive
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                      : "border-border",
                    "mt-2 flex justify-center rounded-md border border-dashed px-6 py-20 transition-colors duration-200"
                  )}
                >
                  <div>
                    <File
                      className="mx-auto h-12 w-12 text-muted-foreground/80"
                      aria-hidden={true}
                    />
                    <div className="mt-4 flex text-muted-foreground">
                      <p>Drag and drop or</p>
                      <label
                        htmlFor="file"
                        className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:text-primary/80 hover:underline hover:underline-offset-4"
                      >
                        <span>choose file(s)</span>
                        <input
                          {...getInputProps()}
                          id="file-upload-2"
                          name="file-upload-2"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">to upload</p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
                  <span>All file types are allowed to upload.</span>
                  <span className="pl-1 sm:pl-0">Max. size per file: 50MB</span>
                </p>
                {filesList.length > 0 && (
                  <>
                    <h4 className="mt-6 font-medium text-foreground">
                      File(s) to upload
                    </h4>
                    <ul role="list" className="mt-4 space-y-4">
                      {filesList}
                    </ul>
                  </>
                )}
              </div>
            </div>
            <Separator className="my-6" />
            <div className="flex items-center justify-end space-x-3">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Upload</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}