"use client";

import * as React from "react";

type Key = string | number;

type ComboBoxContextValue = {
  allowsCustomValue?: boolean;
  disabledKeys: Set<Key>;
  fullWidth?: boolean;
  highlightedKey: Key | null;
  inputValue: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isOpen: boolean;
  isRequired?: boolean;
  menuTrigger: "focus" | "input" | "manual";
  name?: string;
  registerItem: (key: Key, textValue: string) => void;
  selectItem: (key: Key, textValue: string) => void;
  selectedKey: Key | null;
  setHighlightedKey: (key: Key | null) => void;
  setInputValue: (value: string) => void;
  setOpen: (open: boolean) => void;
  shouldShowItem: (textValue: string) => boolean;
  unregisterItem: (key: Key) => void;
  variant?: "primary" | "secondary";
};

const ComboBoxContext = React.createContext<ComboBoxContextValue | null>(null);

function useComboBoxContext(component: string) {
  const context = React.useContext(ComboBoxContext);
  if (!context) throw new Error(`${component} must be used inside ComboBox`);
  return context;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const styles = `
:root {
  --combo-background: #fff;
  --combo-foreground: #18181b;
  --combo-muted: #71717a;
  --combo-border: #d4d4d8;
  --combo-border-hover: #a1a1aa;
  --combo-field: #fff;
  --combo-field-hover: #fafafa;
  --combo-field-focus: #fff;
  --combo-placeholder: #71717a;
  --combo-default: #f4f4f5;
  --combo-default-hover: #e4e4e7;
  --combo-default-foreground: #3f3f46;
  --combo-overlay: #fff;
  --combo-surface: #fafafa;
  --combo-surface-foreground: #18181b;
  --combo-danger: #dc2626;
  --combo-focus: #2563eb;
  --combo-shadow-field: 0 1px 2px rgba(0,0,0,.04);
  --combo-shadow-overlay: 0 16px 40px rgba(0,0,0,.16), 0 2px 8px rgba(0,0,0,.08);
}
.dark {
  --combo-background: #09090b;
  --combo-foreground: #fafafa;
  --combo-muted: #a1a1aa;
  --combo-border: #3f3f46;
  --combo-border-hover: #52525b;
  --combo-field: #18181b;
  --combo-field-hover: #27272a;
  --combo-field-focus: #18181b;
  --combo-placeholder: #a1a1aa;
  --combo-default: #27272a;
  --combo-default-hover: #3f3f46;
  --combo-default-foreground: #e4e4e7;
  --combo-overlay: #18181b;
  --combo-surface: #18181b;
  --combo-surface-foreground: #fafafa;
  --combo-danger: #f87171;
  --combo-focus: #60a5fa;
  --combo-shadow-overlay: 0 18px 44px rgba(0,0,0,.55), 0 2px 8px rgba(0,0,0,.32);
}
.combo-box { position: relative; display: flex; flex-direction: column; gap: .25rem; color: var(--combo-foreground); overflow: visible; }
.combo-box--full-width { width: 100%; }
.combo-box [data-slot="label"] { width: fit-content; font-size: .875rem; line-height: 1.25rem; font-weight: 500; color: var(--combo-foreground); }
.combo-box [data-slot="description"] { padding-inline: .25rem; font-size: .875rem; line-height: 1.25rem; color: var(--combo-muted); }
.combo-box[data-invalid="true"] [data-slot="description"], .combo-box[aria-invalid="true"] [data-slot="description"] { display: none; }
.combo-box__input-group { position: relative; isolation: isolate; display: inline-flex; align-items: center; }
.combo-box__input-group--full-width { width: 100%; }
.input {
  width: 100%;
  min-width: 0;
  flex: 1 1 0%;
  border-radius: 12px;
  border: 1px solid var(--combo-border);
  background: var(--combo-field);
  color: var(--combo-foreground);
  box-shadow: var(--combo-shadow-field);
  outline: none;
  padding: .5rem .75rem;
  padding-inline-end: 1.75rem;
  font-size: .875rem;
  line-height: 1.25rem;
  transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
}
.input::placeholder { color: var(--combo-placeholder); opacity: 1; }
.input:hover:not(:focus) { border-color: var(--combo-border-hover); background: var(--combo-field-hover); }
.input:focus, .input[data-focused="true"] { border-color: var(--combo-focus); background: var(--combo-field-focus); box-shadow: 0 0 0 3px color-mix(in srgb, var(--combo-focus) 22%, transparent); }
.input[data-invalid="true"] { border-color: var(--combo-danger); box-shadow: 0 0 0 3px color-mix(in srgb, var(--combo-danger) 18%, transparent); }
.input:disabled, .input[data-disabled="true"], .input[aria-disabled="true"] { cursor: not-allowed; opacity: .5; }
.input--secondary { box-shadow: none; background: var(--combo-default); }
.input--secondary:hover:not(:focus) { background: var(--combo-default-hover); }
.input--full-width { width: 100%; }
.combo-box__trigger {
  position: absolute;
  inset-inline-end: 0;
  top: 50%;
  display: flex;
  height: 100%;
  flex-shrink: 0;
  transform: translateY(-50%);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--combo-placeholder);
  padding: 0 .5rem 0 0;
  outline: none;
  transition: color 150ms ease, opacity 150ms ease;
}
.combo-box__trigger:hover { color: var(--combo-foreground); }
.combo-box__trigger:focus-visible { border-radius: .25rem; box-shadow: 0 0 0 2px var(--combo-focus), 0 0 0 4px var(--combo-background); }
.combo-box__trigger[data-pressed="true"] { opacity: .7; }
.combo-box__trigger:disabled, .combo-box__trigger[data-disabled="true"], .combo-box__trigger[aria-disabled="true"] { cursor: not-allowed; opacity: .5; }
.combo-box__trigger [data-slot="combo-box-trigger-default-icon"] { width: 1rem; height: 1rem; transition: transform 150ms ease; }
.combo-box__trigger[data-open="true"] [data-slot="combo-box-trigger-default-icon"] { transform: rotate(180deg); }
.combo-box__popover {
  position: absolute;
  z-index: 50;
  top: calc(100% + .25rem);
  inset-inline-start: 0;
  width: max(100%, 256px);
  min-width: var(--trigger-width, 100%);
  max-height: min(320px, calc(100vh - 2rem));
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: min(32px, 1.5rem);
  background: var(--combo-overlay);
  color: var(--combo-foreground);
  box-shadow: var(--combo-shadow-overlay);
  padding: 0;
  font-size: .875rem;
  line-height: 1.25rem;
  transform-origin: top;
  animation: combo-popover-in 150ms ease both;
}
@keyframes combo-popover-in { from { opacity: 0; transform: translateY(-4px) scale(.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
.list-box { position: relative; display: flex; width: 100%; flex-direction: column; gap: .25rem; overflow: clip; padding: .375rem; outline: none; }
.list-box-item {
  position: relative;
  display: flex;
  min-height: 2.25rem;
  width: 100%;
  cursor: pointer;
  align-items: center;
  justify-content: flex-start;
  gap: .75rem;
  border: 0;
  border-radius: 1rem;
  background: transparent;
  color: var(--combo-foreground);
  padding: .375rem 2rem .375rem .625rem;
  text-align: start;
  outline: none;
  transition: transform 250ms cubic-bezier(.16,1,.3,1), box-shadow 150ms ease, background-color 150ms ease;
}
.list-box-item:hover, .list-box-item[data-highlighted="true"] { background: var(--combo-default); }
.list-box-item:active, .list-box-item[data-pressed="true"] { transform: scale(.98); }
.list-box-item:focus-visible, .list-box-item[data-focus-visible="true"] { box-shadow: 0 0 0 2px var(--combo-focus); }
.list-box-item[data-disabled="true"] { cursor: not-allowed; opacity: .5; }
.list-box-item__indicator { position: absolute; inset-inline-end: .5rem; top: 50%; display: flex; width: 1rem; height: 1rem; flex-shrink: 0; transform: translateY(-50%); align-items: center; justify-content: center; color: var(--combo-default-foreground); transition: opacity 250ms ease; opacity: 0; }
.list-box-item__indicator[data-visible="true"] { opacity: 1; }
.list-box-item__indicator [data-slot="list-box-item-indicator--checkmark"] { width: .625rem; height: .625rem; transition: stroke-dashoffset 250ms linear; }
.list-box-section { display: flex; flex-direction: column; align-items: stretch; gap: 0; }
.list-box-header { padding: .375rem .625rem .25rem; font-size: .75rem; line-height: 1rem; font-weight: 500; color: var(--combo-muted); }
.separator { height: 1px; width: 94%; margin: .25rem 3%; border: 0; background: var(--combo-border); }
.field-error { height: 0; overflow: hidden; padding-inline: .25rem; color: var(--combo-danger); font-size: .75rem; line-height: 1rem; opacity: 0; transition: opacity 150ms ease, height 350ms ease; }
.field-error[data-visible="true"] { height: auto; opacity: 1; }
.button { position: relative; display: inline-flex; height: 2.5rem; width: fit-content; align-items: center; justify-content: center; gap: .5rem; border: 0; border-radius: 1.5rem; background: var(--combo-default); color: var(--combo-default-foreground); padding: 0 1rem; font-size: .875rem; font-weight: 500; outline: none; transition: transform 250ms ease, background-color 100ms ease, box-shadow 100ms ease; }
.button:hover { background: var(--combo-default-hover); }
.button:active { transform: scale(.97); }
.button:focus-visible { box-shadow: 0 0 0 2px var(--combo-focus); }
.surface { position: relative; color: var(--combo-surface-foreground); background: var(--combo-surface); }
.combo-avatar { width: 2rem; height: 2rem; overflow: hidden; border-radius: 9999px; background: var(--combo-default); color: var(--combo-default-foreground); display: inline-flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 500; }
.combo-avatar img { width: 100%; height: 100%; object-fit: cover; }
`;

function ComboBoxStyles() {
  return <style>{styles}</style>;
}

type ComboBoxProps = {
  allowsCustomValue?: boolean;
  children: React.ReactNode;
  className?: string;
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
  defaultSelectedKey?: Key;
  disabledKeys?: Key[];
  fullWidth?: boolean;
  inputValue?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  menuTrigger?: "focus" | "input" | "manual";
  name?: string;
  onInputChange?: (value: string) => void;
  onSelectionChange?: (key: Key | null) => void;
  selectedKey?: Key | null;
  variant?: "primary" | "secondary";
};

function ComboBoxRoot({
  allowsCustomValue,
  children,
  className,
  defaultFilter,
  defaultSelectedKey,
  disabledKeys = [],
  fullWidth,
  inputValue: controlledInputValue,
  isDisabled,
  isInvalid,
  isRequired,
  menuTrigger = "focus",
  name,
  onInputChange,
  onSelectionChange,
  selectedKey: controlledSelectedKey,
  variant,
}: ComboBoxProps) {
  const [isOpen, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(new Map<Key, string>());
  const [uncontrolledInputValue, setUncontrolledInputValue] = React.useState("");
  const [uncontrolledSelectedKey, setUncontrolledSelectedKey] = React.useState<Key | null>(
    defaultSelectedKey ?? null,
  );
  const [highlightedKey, setHighlightedKey] = React.useState<Key | null>(null);

  const inputValue = controlledInputValue ?? uncontrolledInputValue;
  const selectedKey = controlledSelectedKey ?? uncontrolledSelectedKey;
  const disabledKeySet = React.useMemo(() => new Set<Key>(disabledKeys), [disabledKeys]);

  const setInputValue = React.useCallback(
    (value: string) => {
      if (controlledInputValue === undefined) setUncontrolledInputValue(value);
      if (controlledSelectedKey === undefined && uncontrolledSelectedKey != null) {
        const selectedTextValue = items.get(uncontrolledSelectedKey);
        if (selectedTextValue !== value) {
          setUncontrolledSelectedKey(null);
          onSelectionChange?.(null);
        }
      }
      onInputChange?.(value);
    },
    [controlledInputValue, controlledSelectedKey, items, onInputChange, onSelectionChange, uncontrolledSelectedKey],
  );

  const registerItem = React.useCallback(
    (key: Key, textValue: string) => {
      setItems((current) => {
        const next = new Map(current);
        next.set(key, textValue);
        return next;
      });
    },
    [],
  );

  const unregisterItem = React.useCallback((key: Key) => {
    setItems((current) => {
      const next = new Map(current);
      next.delete(key);
      return next;
    });
  }, []);

  React.useEffect(() => {
    if (selectedKey == null) return;
    const textValue = items.get(selectedKey);
    if (textValue) setInputValue(textValue);
  }, [items, selectedKey, setInputValue]);

  const shouldShowItem = React.useCallback(
    (textValue: string) => {
      if (!inputValue) return true;
      if (defaultFilter) return defaultFilter(textValue, inputValue);
      return textValue.toLowerCase().includes(inputValue.toLowerCase());
    },
    [defaultFilter, inputValue],
  );

  const selectItem = React.useCallback(
    (key: Key, textValue: string) => {
      if (disabledKeySet.has(key)) return;
      if (controlledSelectedKey === undefined) setUncontrolledSelectedKey(key);
      setInputValue(textValue);
      onSelectionChange?.(key);
      setOpen(false);
      setHighlightedKey(key);
    },
    [controlledSelectedKey, disabledKeySet, onSelectionChange, setInputValue],
  );

  const value = React.useMemo<ComboBoxContextValue>(
    () => ({
      allowsCustomValue,
      disabledKeys: disabledKeySet,
      fullWidth,
      highlightedKey,
      inputValue,
      isDisabled,
      isInvalid,
      isOpen,
      isRequired,
      menuTrigger,
      name,
      registerItem,
      selectItem,
      selectedKey,
      setHighlightedKey,
      setInputValue,
      setOpen,
      shouldShowItem,
      unregisterItem,
      variant,
    }),
    [
      allowsCustomValue,
      disabledKeySet,
      fullWidth,
      highlightedKey,
      inputValue,
      isDisabled,
      isInvalid,
      isOpen,
      isRequired,
      menuTrigger,
      name,
      registerItem,
      selectItem,
      selectedKey,
      setInputValue,
      shouldShowItem,
      unregisterItem,
      variant,
    ],
  );

  return (
    <ComboBoxContext.Provider value={value}>
      <div
        aria-disabled={isDisabled || undefined}
        aria-invalid={isInvalid || undefined}
        className={cn("combo-box", fullWidth && "combo-box--full-width", className)}
        data-disabled={isDisabled || undefined}
        data-invalid={isInvalid || undefined}
        data-slot="combo-box"
      >
        <ComboBoxStyles />
        {children}
        <input name={name} required={isRequired} type="hidden" value={selectedKey ?? ""} />
      </div>
    </ComboBoxContext.Provider>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  fullWidth?: boolean;
  variant?: "primary" | "secondary";
};

function Input({className, fullWidth, onKeyDown, placeholder, variant: variantProp, ...props}: InputProps) {
  const context = useComboBoxContext("Input");
  const variant = variantProp ?? context.variant;
  function moveHighlight(delta: 1 | -1) {
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-slot="list-box-item"]:not([hidden]):not([data-disabled="true"])'),
    );
    if (!buttons.length) return;
    const currentIndex = buttons.findIndex((button) => button.dataset.key === String(context.highlightedKey));
    const next = buttons[(currentIndex + delta + buttons.length) % buttons.length];
    const nextKey = next.dataset.key ?? null;
    context.setHighlightedKey(nextKey);
    next.scrollIntoView({block: "nearest"});
  }

  return (
    <input
      {...props}
      aria-autocomplete="list"
      aria-expanded={context.isOpen}
      aria-invalid={context.isInvalid || undefined}
      aria-required={context.isRequired || undefined}
      className={cn(
        "input",
        (fullWidth || context.fullWidth) && "input--full-width",
        variant === "secondary" && "input--secondary",
        className,
      )}
      data-disabled={context.isDisabled || undefined}
      data-invalid={context.isInvalid || undefined}
      data-slot="input"
      disabled={context.isDisabled}
      onChange={(event) => {
        context.setInputValue(event.currentTarget.value);
        if (context.menuTrigger === "input" || context.menuTrigger === "focus") context.setOpen(true);
      }}
      onFocus={(event) => {
        props.onFocus?.(event);
        if (context.menuTrigger === "focus") context.setOpen(true);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowDown") {
          event.preventDefault();
          context.setOpen(true);
          moveHighlight(1);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          context.setOpen(true);
          moveHighlight(-1);
        }
        if (event.key === "Enter" && context.highlightedKey != null) {
          const item = document.querySelector<HTMLButtonElement>(
            `[data-slot="list-box-item"][data-key="${CSS.escape(String(context.highlightedKey))}"]`,
          );
          if (item?.dataset.textValue) {
            event.preventDefault();
            context.selectItem(context.highlightedKey, item.dataset.textValue);
          }
        }
        if (event.key === "Escape") context.setOpen(false);
      }}
      placeholder={placeholder}
      role="combobox"
      value={context.inputValue}
    />
  );
}

function ComboBoxInputGroup({children, className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  const context = useComboBoxContext("ComboBox.InputGroup");
  return (
    <div
      {...props}
      className={cn(
        "combo-box__input-group",
        context.fullWidth && "combo-box__input-group--full-width",
        className,
      )}
      data-slot="combo-box-input-group"
    >
      {children}
    </div>
  );
}

function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      aria-label="Chevron down icon"
      fill="none"
      height={16}
      role="presentation"
      viewBox="0 0 16 16"
      width={16}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function ChevronsExpandVertical(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" height={16} viewBox="0 0 16 16" width={16} {...props}>
      <path d="M8 1.7a.8.8 0 0 1 .57.24l3.2 3.2a.8.8 0 1 1-1.14 1.12L8 3.63 5.37 6.26a.8.8 0 1 1-1.14-1.13l3.2-3.2A.8.8 0 0 1 8 1.7Zm0 12.6a.8.8 0 0 1-.57-.24l-3.2-3.2a.8.8 0 1 1 1.14-1.12L8 12.37l2.63-2.63a.8.8 0 1 1 1.14 1.13l-3.2 3.2A.8.8 0 0 1 8 14.3Z" />
    </svg>
  );
}

function ComboBoxTrigger({
  children,
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = useComboBoxContext("ComboBox.Trigger");
  return (
    <button
      {...props}
      aria-label={props["aria-label"] ?? "Toggle suggestions"}
      className={cn("combo-box__trigger", className)}
      data-disabled={context.isDisabled || undefined}
      data-open={context.isOpen || undefined}
      data-slot="combo-box-trigger"
      disabled={context.isDisabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.setOpen(!context.isOpen);
      }}
      type="button"
    >
      {children ?? <IconChevronDown data-slot="combo-box-trigger-default-icon" />}
    </button>
  );
}

function ComboBoxPopover({children, className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  const context = useComboBoxContext("ComboBox.Popover");
  if (!context.isOpen) return null;
  return (
    <div
      {...props}
      className={cn("combo-box__popover", className)}
      data-placement="bottom"
      data-slot="combo-box-popover"
      role="presentation"
    >
      {children}
    </div>
  );
}

function ListBoxRoot({children, className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("list-box", className)} data-slot="list-box" role="listbox">
      {children}
    </div>
  );
}

type ListBoxItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  id: Key;
  textValue: string;
};

const ListBoxItemContext = React.createContext<{isSelected: boolean} | null>(null);

function ListBoxItem({children, className, id, textValue, onClick, ...props}: ListBoxItemProps) {
  const context = useComboBoxContext("ListBox.Item");
  const isSelected = context.selectedKey === id;
  const isDisabled = context.disabledKeys.has(id) || props.disabled;
  const isHidden = !context.shouldShowItem(textValue);

  React.useEffect(() => {
    context.registerItem(id, textValue);
    return () => context.unregisterItem(id);
  }, [context.registerItem, context.unregisterItem, id, textValue]);

  return (
    <ListBoxItemContext.Provider value={{isSelected}}>
      <button
        {...props}
        aria-disabled={isDisabled || undefined}
        aria-selected={isSelected}
        className={cn("list-box-item", className)}
        data-disabled={isDisabled || undefined}
        data-highlighted={context.highlightedKey === id || undefined}
        data-key={String(id)}
        data-selected={isSelected || undefined}
        data-slot="list-box-item"
        data-text-value={textValue}
        hidden={isHidden}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.selectItem(id, textValue);
        }}
        onMouseEnter={() => context.setHighlightedKey(id)}
        role="option"
        type="button"
      >
        {children}
      </button>
    </ListBoxItemContext.Provider>
  );
}

function ListBoxItemIndicator({children, className, ...props}: React.HTMLAttributes<HTMLSpanElement>) {
  const itemContext = React.useContext(ListBoxItemContext);
  const isSelected = Boolean(itemContext?.isSelected);
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn("list-box-item__indicator", className)}
      data-slot="list-box-item-indicator"
      data-visible={isSelected || undefined}
    >
      {children ?? (
        <svg
          aria-hidden="true"
          data-slot="list-box-item-indicator--checkmark"
          fill="none"
          role="presentation"
          stroke="currentColor"
          strokeDasharray={22}
          strokeDashoffset={isSelected ? 44 : 66}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 17 18"
        >
          <polyline points="1 9 7 14 15 4" />
        </svg>
      )}
    </span>
  );
}

function ListBoxSection({children, className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("list-box-section", className)} role="group">
      {children}
    </div>
  );
}

function Label({children, className, ...props}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...props} className={className} data-slot="label">
      {children}
    </label>
  );
}

function Description({children, className, ...props}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...props} className={className} data-slot="description">
      {children}
    </p>
  );
}

function Header({children, className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("list-box-header", className)} data-slot="header">
      {children}
    </div>
  );
}

function Separator(props: React.HTMLAttributes<HTMLHRElement>) {
  return <hr {...props} className={cn("separator", props.className)} data-orientation="horizontal" data-slot="separator" />;
}

function FieldError({children, className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(ComboBoxContext);
  const visible = Boolean(context?.isInvalid);
  return (
    <div {...props} className={cn("field-error", className)} data-slot="field-error" data-visible={visible}>
      {children}
    </div>
  );
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={cn("button", props.className)} />;
}

function Form(props: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form {...props} />;
}

function Surface({children, className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("surface", className)}>
      {children}
    </div>
  );
}

function Avatar({children, className, ...props}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} className={cn("combo-avatar", className)}>
      {children}
    </span>
  );
}

function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} alt={props.alt ?? ""} />;
}

function AvatarFallback(props: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} />;
}

const ComboBox = Object.assign(ComboBoxRoot, {
  InputGroup: ComboBoxInputGroup,
  Popover: ComboBoxPopover,
  Trigger: ComboBoxTrigger,
});

const ListBox = Object.assign(ListBoxRoot, {
  Item: ListBoxItem,
  ItemIndicator: ListBoxItemIndicator,
  Section: ListBoxSection,
});

export {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ChevronsExpandVertical,
  ComboBox,
  Description,
  FieldError,
  Form,
  Header,
  Input,
  Label,
  ListBox,
  Separator,
  Surface,
};
