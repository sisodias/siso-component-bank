"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { ChevronsUpDownIcon, XIcon } from "lucide-react";
import type React from "react";

// ── Utilities ──────────────────────────────────────────────────────────────

function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

// ── Input ──────────────────────────────────────────────────────────────────

type InputProps = Omit<
  InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
  "size"
> & {
  size?: "sm" | "default" | "lg" | number;
  unstyled?: boolean;
  nativeInput?: boolean;
};

function Input({
  className,
  size = "default",
  unstyled = false,
  nativeInput = false,
  ...props
}: InputProps): React.ReactElement {
  const inputClassName = cn(
    "h-8.5 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] leading-8.5 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72 sm:h-7.5 sm:leading-7.5",
    size === "sm" &&
      "h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5 sm:h-6.5 sm:leading-6.5",
    size === "lg" && "h-9.5 leading-9.5 sm:h-8.5 sm:leading-8.5",
    (props as any).type === "search" &&
      "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
    (props as any).type === "file" &&
      "text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
  );

  return (
    <span
      className={
        cn(
          !unstyled &&
            "relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
          className,
        ) || undefined
      }
      data-size={size}
      data-slot="input-control"
    >
      {nativeInput ? (
        <input
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          {...(props as any)}
        />
      ) : (
        <InputPrimitive
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          {...props}
        />
      )}
    </span>
  );
}

// ── ScrollArea ─────────────────────────────────────────────────────────────

function ScrollArea({
  className,
  children,
  scrollFade = false,
  scrollbarGutter = false,
  ...props
}: ScrollAreaPrimitive.Root.Props & {
  scrollFade?: boolean;
  scrollbarGutter?: boolean;
}): React.ReactElement {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("size-full min-h-0", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn(
          "h-full rounded-[inherit] outline-none transition-shadows focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-has-overflow-y:overscroll-y-contain data-has-overflow-x:overscroll-x-contain",
          scrollFade &&
            "mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]",
          scrollbarGutter &&
            "data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5",
        )}
        data-slot="scroll-area-viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props): React.ReactElement {
  return (
    <ScrollAreaPrimitive.Scrollbar
      className={cn(
        "m-1 flex opacity-0 transition-opacity delay-300 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-100",
        className,
      )}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        className="relative flex-1 rounded-full bg-foreground/20"
        data-slot="scroll-area-thumb"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

// ── Autocomplete ───────────────────────────────────────────────────────────

export const Autocomplete: typeof AutocompletePrimitive.Root =
  AutocompletePrimitive.Root;

export function AutocompleteInput({
  className,
  showTrigger = false,
  showClear = false,
  startAddon,
  size,
  triggerProps,
  clearProps,
  ...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> & {
  showTrigger?: boolean;
  showClear?: boolean;
  startAddon?: React.ReactNode;
  size?: "sm" | "default" | "lg" | number;
  ref?: React.Ref<HTMLInputElement>;
  triggerProps?: AutocompletePrimitive.Trigger.Props;
  clearProps?: AutocompletePrimitive.Clear.Props;
}): React.ReactElement {
  const sizeValue = (size ?? "default") as "sm" | "default" | "lg" | number;

  return (
    <AutocompletePrimitive.InputGroup
      className="relative not-has-[>*.w-full]:w-fit w-full text-foreground has-disabled:opacity-64"
      data-slot="autocomplete-input-group"
    >
      {startAddon && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5"
          data-slot="autocomplete-start-addon"
        >
          {startAddon}
        </div>
      )}
      <AutocompletePrimitive.Input
        className={cn(
          startAddon &&
            "data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7.5)-1px)] *:data-[slot=autocomplete-input]:ps-[calc(--spacing(8.5)-1px)] sm:data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7)-1px)] sm:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(8)-1px)]",
          sizeValue === "sm"
            ? "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-6.5"
            : "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-7",
          className,
        )}
        data-slot="autocomplete-input"
        render={<Input nativeInput size={sizeValue} />}
        {...props}
      />
      {showTrigger && (
        <AutocompleteTrigger
          className={cn(
            "absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-colors pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=autocomplete-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            sizeValue === "sm" ? "end-0" : "end-0.5",
          )}
          {...triggerProps}
        >
          <AutocompletePrimitive.Icon data-slot="autocomplete-icon">
            <ChevronsUpDownIcon />
          </AutocompletePrimitive.Icon>
        </AutocompleteTrigger>
      )}
      {showClear && (
        <AutocompleteClear
          className={cn(
            "absolute top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-colors pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=autocomplete-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            sizeValue === "sm" ? "end-0" : "end-0.5",
          )}
          {...clearProps}
        >
          <XIcon />
        </AutocompleteClear>
      )}
    </AutocompletePrimitive.InputGroup>
  );
}

export function AutocompletePopup({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  alignOffset,
  align = "start",
  anchor,
  ...props
}: AutocompletePrimitive.Popup.Props & {
  align?: AutocompletePrimitive.Positioner.Props["align"];
  sideOffset?: AutocompletePrimitive.Positioner.Props["sideOffset"];
  alignOffset?: AutocompletePrimitive.Positioner.Props["alignOffset"];
  side?: AutocompletePrimitive.Positioner.Props["side"];
  anchor?: AutocompletePrimitive.Positioner.Props["anchor"];
}): React.ReactElement {
  return (
    <AutocompletePrimitive.Portal>
      <AutocompletePrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50 select-none"
        data-slot="autocomplete-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <span
          className={cn(
            "relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            className,
          )}
        >
          <AutocompletePrimitive.Popup
            className="flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col text-foreground"
            data-slot="autocomplete-popup"
            {...props}
          >
            {children}
          </AutocompletePrimitive.Popup>
        </span>
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

export function AutocompleteItem({
  className,
  children,
  ...props
}: AutocompletePrimitive.Item.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Item
      className={cn(
        "flex min-h-8 cursor-default select-none items-center rounded-sm px-2 py-1 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm",
        className,
      )}
      data-slot="autocomplete-item"
      {...props}
    >
      {children}
    </AutocompletePrimitive.Item>
  );
}

export function AutocompleteSeparator({
  className,
  ...props
}: AutocompletePrimitive.Separator.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Separator
      className={cn("mx-2 my-1 h-px bg-border last:hidden", className)}
      data-slot="autocomplete-separator"
      {...props}
    />
  );
}

export function AutocompleteGroup({
  className,
  ...props
}: AutocompletePrimitive.Group.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Group
      className={cn("[[role=group]+&]:mt-1.5", className)}
      data-slot="autocomplete-group"
      {...props}
    />
  );
}

export function AutocompleteGroupLabel({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.GroupLabel
      className={cn(
        "px-2 py-1.5 font-medium text-muted-foreground text-xs",
        className,
      )}
      data-slot="autocomplete-group-label"
      {...props}
    />
  );
}

export function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Empty
      className={cn(
        "not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm",
        className,
      )}
      data-slot="autocomplete-empty"
      {...props}
    />
  );
}

export function AutocompleteRow({
  className,
  ...props
}: AutocompletePrimitive.Row.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Row
      className={className}
      data-slot="autocomplete-row"
      {...props}
    />
  );
}

export function AutocompleteValue({
  ...props
}: AutocompletePrimitive.Value.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Value data-slot="autocomplete-value" {...props} />
  );
}

export function AutocompleteList({
  className,
  ...props
}: AutocompletePrimitive.List.Props): React.ReactElement {
  return (
    <ScrollArea scrollbarGutter scrollFade>
      <AutocompletePrimitive.List
        className={cn(
          "not-empty:scroll-py-1 not-empty:p-1 in-data-has-overflow-y:pe-3",
          className,
        )}
        data-slot="autocomplete-list"
        {...props}
      />
    </ScrollArea>
  );
}

export function AutocompleteClear({
  className,
  ...props
}: AutocompletePrimitive.Clear.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Clear
      className={cn(
        "absolute end-0.5 top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-[color,background-color,box-shadow,opacity] pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="autocomplete-clear"
      {...props}
    >
      <XIcon />
    </AutocompletePrimitive.Clear>
  );
}

export function AutocompleteStatus({
  className,
  ...props
}: AutocompletePrimitive.Status.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Status
      className={cn(
        "px-3 py-2 font-medium text-muted-foreground text-xs empty:m-0 empty:p-0",
        className,
      )}
      data-slot="autocomplete-status"
      {...props}
    />
  );
}

export function AutocompleteCollection({
  ...props
}: AutocompletePrimitive.Collection.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Collection
      data-slot="autocomplete-collection"
      {...props}
    />
  );
}

export function AutocompleteTrigger({
  className,
  children,
  ...props
}: AutocompletePrimitive.Trigger.Props): React.ReactElement {
  return (
    <AutocompletePrimitive.Trigger
      className={className}
      data-slot="autocomplete-trigger"
      {...props}
    >
      {children}
    </AutocompletePrimitive.Trigger>
  );
}

export const useAutocompleteFilter: typeof AutocompletePrimitive.useFilter =
  AutocompletePrimitive.useFilter;

export { AutocompletePrimitive };
