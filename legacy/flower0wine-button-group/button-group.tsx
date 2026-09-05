import * as React from 'react'
import { cn } from "../_utils/cn"
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-text',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground text-text',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const ButtonGroupContext = React.createContext<{
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  hasDivider?: boolean
  itemClassName?: string
  dividerClassName?: string
  itemCount: number
  itemIndex: number
}>({
  itemCount: 0,
  itemIndex: 0
})

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: VariantProps<typeof buttonVariants>['variant']
    size?: VariantProps<typeof buttonVariants>['size']
    hasDivider?: boolean
    itemClassName?: string
    dividerClassName?: string
  }
>(({ 
  children, 
  variant = 'default', 
  size = 'default', 
  hasDivider = true, 
  className,
  itemClassName,
  dividerClassName,
  ...props 
}, ref) => {
  const childrenArray = React.Children.toArray(children)
  const itemCount = childrenArray.length

  let index = 0

  return (
    <div 
      ref={ref}
      className={cn(
        'inline-flex relative items-center',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child

        return (
          <ButtonGroupContext.Provider
            value={{
              variant,
              size,
              hasDivider,
              itemClassName,
              dividerClassName,
              itemCount,
              itemIndex: index++
            }}
          >
            {child}
          </ButtonGroupContext.Provider>
        )
      })}
    </div>
  )
})

ButtonGroup.displayName = 'ButtonGroup'

const useButtonGroupContext = () => {
  const context = React.useContext(ButtonGroupContext)
  if (!context) {
    throw new Error('ButtonGroupItem must be used within ButtonGroup')
  }
  return context
}

const ButtonGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & {
    variant?: VariantProps<typeof buttonVariants>['variant']
    size?: VariantProps<typeof buttonVariants>['size']
    roundedRadius?: string
  }
>(({ className, variant, size, children, roundedRadius = '2', ...props }, ref) => {
  const {
    variant: contextVariant,
    size: contextSize,
    hasDivider,
    itemClassName,
    dividerClassName,
    itemCount,
    itemIndex
  } = useButtonGroupContext()

  const positionClassName = 
    itemCount === 1 ? `rounded-${roundedRadius}` :
    itemIndex === 0 ? `rounded-l-${roundedRadius} rounded-r-none` :
    itemIndex === itemCount - 1 ? `rounded-r-${roundedRadius} rounded-l-none` :
    `rounded-none`

  return (
    <React.Fragment>
      <button
        ref={ref}
        className={cn(
          buttonVariants({ 
            variant: variant || contextVariant, 
            size: size || contextSize 
          }),
          positionClassName,
          'relative',
          itemClassName,
          className,
          cn(hasDivider && itemIndex < itemCount - 1 && "border-r-2", dividerClassName),
          cn(hasDivider && itemIndex > 0 && "border-l-0")
        )}
        {...props}
      >
        {children}
      </button>
      
    </React.Fragment>
  )
})

ButtonGroupItem.displayName = 'ButtonGroupItem'

export { ButtonGroup, ButtonGroupItem } 