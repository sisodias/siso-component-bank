"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import { HelpCircle, Upload, Trash2, Check, ChevronDown } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    {children}
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export function Form() {
  return (
    <div className="px-6 pb-4 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="projectName" className="mb-2">
            Project name
          </Label>
          <Input
            id="projectName"
            type="text"
            defaultValue="Open Source Stripe"
          />
        </div>

        <div>
          <Label htmlFor="projectLead" className="mb-2">
            Project lead
          </Label>
          <Select defaultValue="1">
            <SelectTrigger id="projectLead" className="ps-2">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">
                  <img
                    className="size-5 rounded"
                    src="https://blocks.so/avatar-01.png"
                    alt="Ephraim Duncan"
                    width={20}
                    height={20}
                  />
                  <span className="truncate">Ephraim Duncan</span>
                </SelectItem>
                <SelectItem value="2">
                  <img
                    className="size-5 rounded"
                    src="https://blocks.so/avatar-03.png"
                    alt="Lucas Smith"
                    width={20}
                    height={20}
                  />
                  <span className="truncate">Lucas Smith</span>
                </SelectItem>
                <SelectItem value="3">
                  <img
                    className="size-5 rounded"
                    src="https://blocks.so/avatar-02.jpg"
                    alt="Timur Ercan"
                    width={20}
                    height={20}
                  />
                  <span className="truncate">Timur Ercan</span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

interface UploadedFileItemProps {
  file: File;
  progress: number;
  onRemove: (filename: string) => void;
}

export function UploadedFileItem({
  file,
  progress,
  onRemove,
}: UploadedFileItemProps) {
  const imageUrl = URL.createObjectURL(file);

  useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  return (
    <div
      className="border border-border rounded-lg p-2 flex flex-col"
      key={file.name}
    >
      <div className="flex items-center gap-2">
        <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
          <img
            src={imageUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 pr-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground truncate max-w-[250px]">
                {file.name}
              </span>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {Math.round(file.size / 1024)} KB
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 !bg-transparent hover:text-red-500"
              onClick={() => onRemove(file.name)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${progress || 0}%`,
                }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {Math.round(progress || 0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UploadedFileListProps {
  uploadedFiles: File[];
  fileProgresses: Record<string, number>;
  removeFile: (filename: string) => void;
}

export function FileList({
  uploadedFiles,
  fileProgresses,
  removeFile,
}: UploadedFileListProps) {
  if (uploadedFiles.length === 0) {
    return null;
  }

  return (
    <div className={cn("px-6 pb-5 space-y-3 mt-4")}>
      {uploadedFiles.map((file, index) => (
        <UploadedFileItem
          key={file.name + index}
          file={file}
          progress={fileProgresses[file.name] || 0}
          onRemove={removeFile}
        />
      ))}
    </div>
  );
}

interface FileDropzoneProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleBoxClick: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (files: FileList | null) => void;
}

export function FileDropzone({
  fileInputRef,
  handleBoxClick,
  handleDragOver,
  handleDrop,
  handleFileSelect,
}: FileDropzoneProps) {
  return (
    <div className="px-6">
      <div
        className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="mb-2 bg-muted rounded-full p-3">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Upload a project image
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          or,{" "}
          <label
            htmlFor="fileUpload"
            className="text-primary hover:text-primary/90 font-medium cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            click to browse
          </label>{" "}
          (4MB max)
        </p>
        <input
          type="file"
          id="fileUpload"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>
    </div>
  );
}

export default function FileUpload01() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>(
    {}
  );

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFileProgresses((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 100),
        }));
      }, 300);
    });
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));
    setFileProgresses((prev) => {
      const newProgresses = { ...prev };
      delete newProgresses[filename];
      return newProgresses;
    });
  };

  return (
    <div className="flex items-center justify-center p-10">
      <Card className="w-full mx-auto max-w-lg bg-background rounded-lg p-0 shadow-md">
        <CardContent className="p-0">
          <div className="p-6 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium text-foreground">
                  Create a new project
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag and drop files to create a new project.
                </p>
              </div>
            </div>
          </div>
          <Form />
          <FileDropzone
            fileInputRef={fileInputRef}
            handleBoxClick={handleBoxClick}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileSelect={handleFileSelect}
          />
          <FileList
            uploadedFiles={uploadedFiles}
            fileProgresses={fileProgresses}
            removeFile={removeFile}
          />
          <div className="px-6 py-3 border-t border-border bg-muted rounded-b-lg flex justify-between items-center">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Need help?
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="py-3 bg-background text-foreground border">
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium">Need assistance?</p>
                    <p className="text-muted-foreground dark:text-muted-background text-xs max-w-[200px]">
                      Upload project images by dragging and dropping files or
                      using the file browser. Supported formats: JPG, PNG, SVG.
                      Maximum file size: 4MB.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-9 px-4 text-sm font-medium"
              >
                Cancel
              </Button>
              <Button className="h-9 px-4 text-sm font-medium">Continue</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}