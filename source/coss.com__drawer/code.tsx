"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { ChevronRightIcon, XIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { createContext, useContext, forwardRef } from "react";

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

// ── Inline Button (subset needed for drawer) ────────────────────────────────

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-base outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: { size: "default", variant: "default" },
    variants: {
      size: {
        default: "h-9 px-[calc(--spacing(3)-1px)] sm:h-8",
        icon: "size-9 sm:size-8",
        sm: "h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:h-7",
      },
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        outline:
          "border-input bg-popover text-foreground shadow-xs/5 hover:bg-accent/50 dark:bg-input/32 dark:hover:bg-input/64",
        ghost: "border-transparent text-foreground hover:bg-accent",
      },
    },
  },
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  render?: React.ReactElement;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, render, children, ...props }, ref) => {
    if (render) {
      // Clone the render element with merged props
      const merged = {
        ...props,
        ref,
        className: cn(buttonVariants({ variant, size }), className),
      };
      return (
        <span {...merged}>
          {children}
        </span>
      );
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

// ── Drawer types ────────────────────────────────────────────────────────────

type DrawerPosition = "right" | "left" | "top" | "bottom";

const DrawerContext = createContext<{ position: DrawerPosition }>({
  position: "bottom",
});

const directionMap: Record<
  DrawerPosition,
  DrawerPrimitive.Root.Props["swipeDirection"]
> = {
  bottom: "down",
  left: "left",
  right: "right",
  top: "up",
};

export const DrawerCreateHandle: typeof DrawerPrimitive.createHandle =
  DrawerPrimitive.createHandle;

export function Drawer({
  swipeDirection,
  position = "bottom",
  ...props
}: DrawerPrimitive.Root.Props & {
  position?: DrawerPosition;
}): React.ReactElement {
  return (
    <DrawerContext.Provider value={{ position }}>
      <DrawerPrimitive.Root
        swipeDirection={swipeDirection ?? directionMap[position]}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

export const DrawerPortal: typeof DrawerPrimitive.Portal =
  DrawerPrimitive.Portal;

export function DrawerTrigger(
  props: DrawerPrimitive.Trigger.Props,
): React.ReactElement {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

export function DrawerClose(
  props: DrawerPrimitive.Close.Props,
): React.ReactElement {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

export function DrawerBackdrop({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props): React.ReactElement {
  return (
    <DrawerPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/32 opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-sm transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      data-slot="drawer-backdrop"
      {...props}
    />
  );
}

export function DrawerViewport({
  className,
  position,
  variant = "default",
  ...props
}: DrawerPrimitive.Viewport.Props & {
  position?: DrawerPosition;
  variant?: "default" | "straight" | "inset";
}): React.ReactElement {
  return (
    <DrawerPrimitive.Viewport
      className={cn(
        "fixed inset-0 z-50 [--bleed:--spacing(12)] [--inset:--spacing(0)]",
        "touch-none",
        position === "bottom" && "grid grid-rows-[1fr_auto] pt-12",
        position === "top" && "grid grid-rows-[auto_1fr] pb-12",
        position === "left" && "flex justify-start",
        position === "right" && "flex justify-end",
        variant === "inset" && "px-(--inset) sm:[--inset:--spacing(4)]",
        variant === "inset" && position !== "bottom" && "pt-(--inset)",
        variant === "inset" && position !== "top" && "pb-(--inset)",
      )}
      data-slot="drawer-viewport"
      {...props}
    />
  );
}

export function DrawerPopup({
  className,
  children,
  showCloseButton = false,
  position: positionProp,
  variant = "default",
  showBar = false,
  ...props
}: DrawerPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  position?: DrawerPosition;
  variant?: "default" | "straight" | "inset";
  showBar?: boolean;
}): React.ReactElement {
  const { position: contextPosition } = useContext(DrawerContext);
  const position = positionProp ?? contextPosition;

  return (
    <DrawerPortal>
      <DrawerBackdrop />
      <DrawerViewport position={position} variant={variant}>
        <DrawerPrimitive.Popup
          className={cn(
            "relative flex max-h-full min-h-0 w-full min-w-0 flex-col bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-none transition-[transform,box-shadow,height,background-color] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform [--peek:calc(--spacing(6)-1px)] [--scale-base:calc(max(0,1-(var(--nested-drawers)*var(--stack-step))))] [--scale:clamp(0,calc(var(--scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--shrink:calc(1-var(--scale))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-step:0.05] before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:bg-popover data-swiping:select-none data-nested-drawer-open:overflow-hidden data-nested-drawer-open:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(2%*(var(--nested-drawers)-var(--stack-progress))))] data-ending-style:shadow-transparent data-starting-style:shadow-transparent data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] dark:data-nested-drawer-open:bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(6%*(var(--nested-drawers)-var(--stack-progress))))] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            "touch-none",
            position === "bottom" &&
              "transform-[translateY(calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] data-ending-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)+var(--inset)))] data-starting-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)+var(--inset)))] row-start-2 -mb-[max(0px,calc(var(--drawer-snap-point-offset,0px)+clamp(0,1,var(--drawer-snap-point-offset,0px)/1px)*var(--drawer-swipe-movement-y,0px)))] border-t pb-[max(0px,calc(env(safe-area-inset-bottom,0px)+var(--drawer-snap-point-offset,0px)+clamp(0,1,var(--drawer-snap-point-offset,0px)/1px)*var(--drawer-swipe-movement-y,0px)))] not-data-starting-style:not-data-ending-style:transition-[transform,box-shadow,height,background-color,margin,padding] after:inset-x-0 after:top-full after:h-(--bleed) has-data-[slot=drawer-bar]:pt-2 data-ending-style:mb-0 data-starting-style:mb-0 data-ending-style:pb-0 data-starting-style:pb-0",
            position === "top" &&
              "data-starting-style:transform-[translateY(calc(-100%-var(--inset)))] data-ending-style:transform-[translateY(calc(-100%-var(--inset)))] transform-[translateY(var(--drawer-swipe-movement-y))] border-b after:inset-x-0 after:bottom-full after:h-(--bleed) has-data-[slot=drawer-bar]:pb-2",
            position === "left" &&
              "data-starting-style:transform-[translateX(calc(-100%-var(--inset)))] data-ending-style:transform-[translateX(calc(-100%-var(--inset)))] transform-[translateX(var(--drawer-swipe-movement-x))] w-[calc(100%-(--spacing(12)))] max-w-md border-e after:inset-y-0 after:end-full after:w-(--bleed) has-data-[slot=drawer-bar]:pe-2",
            position === "right" &&
              "transform-[translateX(var(--drawer-swipe-movement-x))] data-ending-style:transform-[translateX(calc(100%+var(--inset)))] data-starting-style:transform-[translateX(calc(100%+var(--inset)))] col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md border-s after:inset-y-0 after:start-full after:w-(--bleed) has-data-[slot=drawer-bar]:ps-2",
            variant !== "straight" &&
              cn(
                position === "bottom" && "rounded-t-2xl",
                position === "top" &&
                  "rounded-b-2xl **:data-[slot=drawer-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]",
                position === "left" &&
                  "rounded-e-2xl **:data-[slot=drawer-footer]:rounded-ee-[calc(var(--radius-2xl)-1px)]",
                position === "right" &&
                  "rounded-s-2xl **:data-[slot=drawer-footer]:rounded-es-[calc(var(--radius-2xl)-1px)]",
              ),
            variant === "default" &&
              cn(
                position === "bottom" &&
                  "before:rounded-t-[calc(var(--radius-2xl)-1px)]",
                position === "top" &&
                  "before:rounded-b-[calc(var(--radius-2xl)-1px)]",
                position === "left" &&
                  "before:rounded-e-[calc(var(--radius-2xl)-1px)]",
                position === "right" &&
                  "before:rounded-s-[calc(var(--radius-2xl)-1px)]",
              ),
            variant === "inset" &&
              "before:hidden sm:rounded-2xl sm:border sm:after:bg-transparent sm:before:rounded-[calc(var(--radius-2xl)-1px)] sm:**:data-[slot=drawer-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]",
            variant === "straight" && "[--stack-step:0]",
            (position === "bottom" || position === "top") &&
              "h-(--drawer-height,auto) [--height:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height))))] data-nested-drawer-open:h-(--height)",
            position === "bottom" &&
              "data-nested-drawer-open:transform-[translateY(calc(var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--shrink)*var(--height))))_scale(var(--scale))] origin-[50%_calc(100%-var(--inset))]",
            position === "top" &&
              "data-nested-drawer-open:transform-[translateY(calc(var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--shrink)*var(--height))))_scale(var(--scale))] origin-[50%_var(--inset)]",
            position === "left" &&
              "data-nested-drawer-open:transform-[translateX(calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)))_scale(var(--scale))] origin-right",
            position === "right" &&
              "data-nested-drawer-open:transform-[translateX(calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)))_scale(var(--scale))] origin-left",
            className,
          )}
          data-slot="drawer-popup"
          {...props}
        >
          {children}
          {showCloseButton && (
            <DrawerPrimitive.Close
              aria-label="Close"
              className="absolute end-2 top-2"
              render={<Button size="icon" variant="ghost" />}
            >
              <XIcon />
            </DrawerPrimitive.Close>
          )}
          {showBar && <DrawerBar />}
        </DrawerPrimitive.Popup>
      </DrawerViewport>
    </DrawerPortal>
  );
}

export function DrawerHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pb-3 max-sm:pb-4 cursor-default",
        className,
      )}
      data-slot="drawer-header"
      {...props}
    >
      {children}
    </div>
  );
}

export function DrawerFooter({
  className,
  variant = "default",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "bare";
}): React.ReactElement {
  return (
    <DrawerPrimitive.Content
      render={
        <div
          className={cn(
            "flex flex-col-reverse gap-2 px-6 pb-(--safe-area-inset-bottom,0px) sm:flex-row sm:justify-end",
            variant === "default" &&
              "border-t bg-muted/72 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+--spacing(4))]",
            variant === "bare" &&
              "in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pt-3 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+--spacing(6))]",
            className,
          )}
          data-slot="drawer-footer"
          {...props}
        />
      }
    >
      {children}
    </DrawerPrimitive.Content>
  );
}

export function DrawerTitle({
  className,
  ...props
}: DrawerPrimitive.Title.Props): React.ReactElement {
  return (
    <DrawerPrimitive.Title
      className={cn(
        "font-heading font-semibold text-xl leading-none",
        className,
      )}
      data-slot="drawer-title"
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props): React.ReactElement {
  return (
    <DrawerPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="drawer-description"
      {...props}
    />
  );
}

export function DrawerPanel({
  className,
  scrollable = true,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  scrollable?: boolean;
}): React.ReactElement {
  const content = (
    <DrawerPrimitive.Content
      render={
        <div
          className={cn(
            "p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-header])]:pt-1 in-[[data-slot=drawer-popup]:has([data-slot=drawer-footer]:not(.border-t))]:pb-1",
            className,
          )}
          data-slot="drawer-panel"
          {...props}
        />
      }
    >
      {children}
    </DrawerPrimitive.Content>
  );

  if (scrollable) {
    return (
      <div className="touch-auto overflow-y-auto min-h-0">
        {content}
      </div>
    );
  }

  return content;
}

export function DrawerBar({
  className,
  position: positionProp,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  position?: DrawerPosition;
}): React.ReactElement {
  const { position: contextPosition } = useContext(DrawerContext);
  const position = positionProp ?? contextPosition;
  const horizontal = position === "left" || position === "right";
  return (
    <div
      aria-hidden
      className={cn(
        "absolute flex touch-none items-center justify-center p-3 before:rounded-full before:bg-input",
        horizontal
          ? "inset-y-0 before:h-12 before:w-1"
          : "inset-x-0 before:h-1 before:w-12",
        position === "top" && "bottom-0",
        position === "bottom" && "top-0",
        position === "left" && "right-0",
        position === "right" && "left-0",
        className,
      )}
      data-slot="drawer-bar"
      {...props}
    />
  );
}

export const DrawerContent: typeof DrawerPrimitive.Content =
  DrawerPrimitive.Content;

export function DrawerMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>): React.ReactElement {
  return (
    <nav
      className={cn("-m-2 flex flex-col", className)}
      data-slot="drawer-menu"
      {...props}
    >
      {children}
    </nav>
  );
}

export function DrawerMenuItem({
  className,
  variant = "default",
  disabled,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive";
}): React.ReactElement {
  return (
    <button
      className={cn(
        "flex min-h-9 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-64 data-[variant=destructive]:text-destructive-foreground sm:min-h-8 sm:text-sm [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none [&>svg]:-mx-0.5 [&>svg]:shrink-0",
        className,
      )}
      data-slot="drawer-menu-item"
      data-variant={variant}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function DrawerMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn("mx-2 my-1 h-px bg-border", className)}
      data-slot="drawer-menu-separator"
      {...props}
    />
  );
}

export function DrawerMenuGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn("flex flex-col", className)}
      data-slot="drawer-menu-group"
      {...props}
    >
      {children}
    </div>
  );
}

export function DrawerMenuGroupLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn(
        "px-2 py-1.5 font-medium text-muted-foreground text-xs",
        className,
      )}
      data-slot="drawer-menu-group-label"
      {...props}
    >
      {children}
    </div>
  );
}

export function DrawerMenuTrigger({
  className,
  children,
  ...props
}: DrawerPrimitive.Trigger.Props): React.ReactElement {
  return (
    <DrawerTrigger
      className={cn(
        "flex min-h-9 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none hover:bg-accent hover:text-accent-foreground sm:min-h-8 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="drawer-menu-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto -me-0.5 opacity-80" />
    </DrawerTrigger>
  );
}

export function DrawerMenuCheckboxItem({
  className,
  children,
  checked,
  defaultChecked,
  onCheckedChange,
  variant = "default",
  disabled,
  ...props
}: Omit<CheckboxPrimitive.Root.Props, "render"> & {
  variant?: "default" | "switch";
}): React.ReactElement {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      className={cn(
        "grid min-h-9 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
        variant === "switch"
          ? "grid-cols-[1fr_auto] gap-4 pe-1.5"
          : "grid-cols-[1rem_1fr] pe-4",
        className,
      )}
      data-slot="drawer-menu-checkbox-item"
      defaultChecked={defaultChecked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      {variant === "switch" ? (
        <>
          <span className="col-start-1">{children}</span>
          <CheckboxPrimitive.Indicator
            className="inset-shadow-[0_1px_--theme(--color-black/4%)] col-start-2 inline-flex h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)] shrink-0 items-center rounded-full p-px outline-none transition-[background-color,box-shadow] duration-200 [--thumb-size:--spacing(4)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-checked:bg-primary data-unchecked:bg-input data-disabled:opacity-64 sm:[--thumb-size:--spacing(3)]"
            keepMounted
          >
            <span className="pointer-events-none block aspect-square h-full in-[[data-slot=drawer-menu-checkbox-item][data-checked]]:origin-[var(--thumb-size)_50%] origin-left in-[[data-slot=drawer-menu-checkbox-item][data-checked]]:translate-x-[calc(var(--thumb-size)-4px)] in-[[data-slot=drawer-menu-checkbox-item]:active]:not-data-disabled:scale-x-110 in-[[data-slot=drawer-menu-checkbox-item]:active]:rounded-[var(--thumb-size)/calc(var(--thumb-size)*1.10)] rounded-(--thumb-size) bg-background shadow-sm/5 will-change-transform [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s]" />
          </CheckboxPrimitive.Indicator>
        </>
      ) : (
        <>
          <CheckboxPrimitive.Indicator className="col-start-1">
            <svg
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
            </svg>
          </CheckboxPrimitive.Indicator>
          <span className="col-start-2">{children}</span>
        </>
      )}
    </CheckboxPrimitive.Root>
  );
}

export function DrawerMenuRadioGroup({
  className,
  ...props
}: RadioGroupPrimitive.Props): React.ReactElement {
  return (
    <RadioGroupPrimitive
      className={cn("flex flex-col", className)}
      data-slot="drawer-menu-radio-group"
      {...props}
    />
  );
}

export function DrawerMenuRadioItem({
  className,
  children,
  value,
  disabled,
  ...props
}: Omit<RadioPrimitive.Root.Props, "render"> & {
  value: string;
}): React.ReactElement {
  return (
    <RadioPrimitive.Root
      className={cn(
        "grid min-h-9 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
        "grid-cols-[1rem_1fr] items-center pe-4",
        className,
      )}
      data-slot="drawer-menu-radio-item"
      disabled={disabled}
      value={value}
      {...props}
    >
      <RadioPrimitive.Indicator className="col-start-1">
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
        </svg>
      </RadioPrimitive.Indicator>
      <span className="col-start-2">{children}</span>
    </RadioPrimitive.Root>
  );
}

export { DrawerPrimitive, Button };
