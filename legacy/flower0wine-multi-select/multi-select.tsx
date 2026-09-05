import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from "../_utils/cn"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, Cross2Icon } from '@radix-ui/react-icons'

interface MultiSelectProps extends Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>, 'value' | 'onValueChange'> {
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  separator?: string
  renderSelectedValues?: (selectedValues: string[]) => React.ReactNode
}

interface MultiSelectContextValue {
  selectedValues: string[]
  onValueChange: (value: string[]) => void
  onSelect: (value: string) => void
  onRemove: (value: string) => void
  renderSelectedValues?: (selectedValues: string[]) => React.ReactNode
}

const MultiSelectContext = React.createContext<MultiSelectContextValue | undefined>(undefined)

function useMultiSelect() {
  const context = React.useContext(MultiSelectContext)
  if (!context) {
    throw new Error('useMultiSelect must be used within a MultiSelectProvider')
  }
  return context
}

const MultiSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  MultiSelectProps
>(({ value, onValueChange, children, separator = ',', renderSelectedValues, ...props }, ref) => {
  const stringValue = value.join(separator)
  
  const handleValueChange = React.useCallback(
    (val: string) => {
      // if select empty value, return
      if (!val) return
      
      // if select already selected value, remove it
      if (value.includes(val)) {
        onValueChange(value.filter((v) => v !== val))
      } else {
        // else add to selected values
        onValueChange([...value, val])
      }
    },
    [value, onValueChange]
  )

  const contextValue = React.useMemo(
    () => ({
      selectedValues: value,
      onValueChange,
      onSelect: (val: string) => {
        if (!value.includes(val)) {
          onValueChange([...value, val])
        }
      },
      onRemove: (val: string) => {
        onValueChange(value.filter((v) => v !== val))
      },
      renderSelectedValues,
    }),
    [value, onValueChange, renderSelectedValues]
  )

  return (
    <MultiSelectContext.Provider value={contextValue}>
      <SelectPrimitive.Root
        {...props}
        value={stringValue}
        onValueChange={handleValueChange}
      >
        {children}
      </SelectPrimitive.Root>
    </MultiSelectContext.Provider>
  )
})
MultiSelect.displayName = 'MultiSelect'

const MultiSelectGroup = SelectPrimitive.Group

const MultiSelectValue = SelectPrimitive.Value

const MultiSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
        className,
      'text-text flex w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_span]:line-clamp-1',
    )}
    {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
MultiSelectTrigger.displayName = 'MultiSelectTrigger'

const MultiSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}>
      <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
        <ChevronUpIcon className="h-4 w-4" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
        <ChevronDownIcon className="h-4 w-4" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
MultiSelectContent.displayName = 'MultiSelectContent'

const MultiSelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props} />
))
MultiSelectLabel.displayName = 'MultiSelectLabel'

const MultiSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & { value: string, icons?: React.ReactNode }
>(({ className, children, value, icons, ...props }, ref) => {
  const { selectedValues } = useMultiSelect()
  const isSelected = selectedValues.includes(value)

  return (
    <div ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:opacity-50 transition-all duration-300',
        isSelected && 'bg-accent/50',
        className
      )}
      {...props}>
      <div className="flex items-center justify-center mr-2">
        {icons}
      </div>
      <div>{children}</div>
    </div>
  )
})
MultiSelectItem.displayName = 'MultiSelectItem'

const MultiSelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
))
MultiSelectSeparator.displayName = 'MultiSelectSeparator'

export {
  MultiSelect,
  MultiSelectGroup,
  MultiSelectValue,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectLabel,
  MultiSelectItem,
  MultiSelectSeparator,
} 