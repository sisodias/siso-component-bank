import React from "react";
import { cn } from "@/lib/utils";

// Get variant classes that go to the wrapper div
const getVariantClasses = ({ variant }: { variant: string }) => {
  let classes: string[] = [];

  // Add variant classes (these need to be on the wrapper for CSS selectors like .rb-button__error.rb-button__text)
  switch (variant) {
    case 'stroke':
      classes.push('rb-button__stroke');
      break;
    case 'text':
      classes.push('rb-button__text');
      break;
    case 'secondary':
      classes.push('rb-button__secondary');
      break;
    case 'tertiary':
      classes.push('rb-button__tertiary');
      break;
    case 'error':
      classes.push('rb-button__error');
      break;
    case 'secondary-stroke':
      classes.push('rb-button__secondary', 'rb-button__stroke');
      break;
    case 'secondary-text':
      classes.push('rb-button__secondary', 'rb-button__text');
      break;
    case 'tertiary-stroke':
      classes.push('rb-button__tertiary', 'rb-button__stroke');
      break;
    case 'tertiary-text':
      classes.push('rb-button__tertiary', 'rb-button__text');
      break;
    case 'error-stroke':
      classes.push('rb-button__error', 'rb-button__stroke');
      break;
    case 'error-text':
      classes.push('rb-button__error', 'rb-button__text');
      break;
    default:
      // default variant (fill primary)
      break;
  }

  return classes;
};

// Get size classes that go to the button element (Tailwind utilities)
const getSizeClasses = ({ size }: { size: string }) => {
  let classes = [
    "inline-flex items-center justify-center whitespace-nowrap",
    "transition-all duration-200",
    "focus-visible:outline-none disabled:pointer-events-none",
    "cursor-pointer select-none"
  ];

  // Add size classes
  switch (size) {
    case 'sm':
      classes.push('h-8 px-3 text-sm');
      break;
    case 'lg':
      classes.push('h-12 px-6 text-base');
      break;
    case 'icon':
      classes.push('p-0');
      break;
    default:
      classes.push('px-4');
      break;
  }

  return classes.join(' ');
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: string;
  size?: string;
  loading?: boolean;
  animation?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  loading = false,
  animation = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  iconPosition = 'left',
  ...props 
}, ref) => {
  const isDisabled = disabled || loading;
  // Fix: Include loading state in only-icon logic like rb-button.tsx
  const isOnlyIcon = !children && (leftIcon || rightIcon || loading);
  
  // Get variant classes for wrapper div
  const variantClasses = getVariantClasses({ variant });
  
  // ALL classes go to the wrapper div for CSS selectors to work (like rb-button.tsx)
  const buttonClasses = cn(
    "rb-button",
    variantClasses,
    {
      "rb-button__loading": loading,
      "rb-button__animation": animation,
      "rb-button__only-icon": isOnlyIcon,
      "rb-button__disabled": isDisabled,
    }
  );

  // Only element and size classes go to the button element
  const elementClasses = cn("rb-button__element", getSizeClasses({ size }));

  return (
    <div className={buttonClasses}>
      <button
        className={cn(elementClasses, className)}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading icon - respects iconPosition */}
        {loading && iconPosition === 'left' && (
          <div className="rb-button__icon rb-button__icon--left">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
        )}
        
        {!loading && leftIcon && (
          <div className="rb-button__icon rb-button__icon--left">
            {leftIcon}
          </div>
        )}
        
        {children && (
          <span className="rb-button__label relative z-10">
            {children}
          </span>
        )}
        
        {!loading && rightIcon && (
          <div className="rb-button__icon rb-button__icon--right">
            {rightIcon}
          </div>
        )}
        
        {/* Loading icon on the right */}
        {loading && iconPosition === 'right' && (
          <div className="rb-button__icon rb-button__icon--right">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
        )}
      </button>
    </div>
  );
});

Button.displayName = "Button";

export { Button };