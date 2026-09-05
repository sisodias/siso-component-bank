import { cn } from "@/lib/utils";
import React, { forwardRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Plus, Trash2, Heart } from "lucide-react";

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const buttonVariants = cva(
  // Base styles - common to all buttons
  [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white",
    "disabled:pointer-events-none disabled:opacity-50 disabled:transform-none",
    "select-none transform active:scale-95",
    "shadow-lg hover:shadow-xl",
    "border-b-4 hover:border-b-2 hover:translate-y-0.5",
  ],
  {
    variants: {
      variant: {
        // Primary button - main call-to-action
        primary: [
          "bg-blue-600 text-white shadow-blue-600/25",
          "hover:bg-blue-700 active:bg-blue-800",
          "focus:ring-blue-500",
          "border-blue-700 hover:border-blue-800",
        ],
        // Secondary button - secondary actions
        secondary: [
          "bg-gray-100 text-gray-900 shadow-gray-400/25",
          "hover:bg-gray-200 active:bg-gray-300",
          "focus:ring-gray-500",
          "border-gray-300 hover:border-gray-400",
        ],
        // Outline button - subtle actions
        outline: [
          "border-2 border-gray-300 bg-white text-gray-700 shadow-gray-400/25",
          "hover:bg-gray-50 active:bg-gray-100",
          "focus:ring-gray-500",
          "border-b-gray-400 hover:border-b-gray-500",
        ],
        // Link button - text-like appearance
        link: [
          "text-blue-600 underline-offset-4 shadow-none border-b-0",
          "hover:underline active:text-blue-800",
          "focus:ring-blue-500",
          "hover:translate-y-0",
        ],
        // Success button - positive actions
        success: [
          "bg-green-600 text-white shadow-green-600/25",
          "hover:bg-green-700 active:bg-green-800",
          "focus:ring-green-500",
          "border-green-700 hover:border-green-800",
        ],
        // Warning button - caution actions
        warning: [
          "bg-yellow-500 text-white shadow-yellow-500/25",
          "hover:bg-yellow-600 active:bg-yellow-700",
          "focus:ring-yellow-500",
          "border-yellow-600 hover:border-yellow-700",
        ],
        // Danger button - destructive actions
        danger: [
          "bg-red-600 text-white shadow-red-600/25",
          "hover:bg-red-700 active:bg-red-800",
          "focus:ring-red-500",
          "border-red-700 hover:border-red-800",
        ],
      },
      size: {
        // Small size - compact buttons
        sm: "h-8 px-3 text-sm shadow-md",
        // Medium size - default
        md: "h-10 px-4 text-sm shadow-lg",
        // Large size - prominent buttons
        lg: "h-12 px-6 text-base shadow-xl",
        // Extra large size - hero buttons
        xl: "h-14 px-8 text-lg shadow-2xl",
        // Icon only size - square buttons for icons
        "icon-sm": "h-8 w-8 p-0 shadow-md",
        "icon-md": "h-10 w-10 p-0 shadow-lg",
        "icon-lg": "h-12 w-12 p-0 shadow-xl",
        "icon-xl": "h-14 w-14 p-0 shadow-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Loading state - shows spinner and disables button */
  loading?: boolean;
  /** Icon to display (React component) */
  icon?: React.ComponentType<{ className?: string }>;
  /** Position of the icon relative to text */
  iconPosition?: "left" | "right";
  /** Screen reader label for icon-only buttons */
  "aria-label"?: string;
  /** Additional CSS classes */
  className?: string;
  /** Button content */
  children?: React.ReactNode;
}


const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      icon: Icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isIconOnly = !children;
    const isDisabled = disabled || loading;

    // Determine icon size based on button size
    const getIconSize = () => {
      if (size === "sm" || size === "icon-sm") return "h-4 w-4";
      if (size === "lg" || size === "icon-lg") return "h-5 w-5";
      if (size === "xl" || size === "icon-xl") return "h-6 w-6";
      return "h-4 w-4"; // default for md
    };

    const iconSize = getIconSize();

    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {loading && <Spinner className={iconSize} />}

        {/* Icon - left position or icon-only */}
        {Icon && !loading && (iconPosition === "left" || isIconOnly) && (
          <Icon className={iconSize} aria-hidden="true" />
        )}

        {/* Button text/content */}
        {children && (
          <span className={loading ? "opacity-0" : ""}>{children}</span>
        )}

        {/* Icon - right position */}
        {Icon && !loading && iconPosition === "right" && !isIconOnly && (
          <Icon className={iconSize} aria-hidden="true" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export const Component = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(42);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert("Saved successfully!");
  };

  const handleLike = () => {
    setLikeCount((count) => count + 1);
  };

  const [count, setCount] = useState(0);

 return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Button Component Examples
        </h1>

        {/* Basic buttons */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Basic Examples
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => alert("Primary clicked!")}>
              Primary
            </Button>
            <Button
              variant="secondary"
              onClick={() => alert("Secondary clicked!")}
            >
              Secondary
            </Button>
            <Button variant="outline" onClick={() => alert("Outline clicked!")}>
              Outline
            </Button>
            <Button variant="danger" onClick={() => alert("Danger clicked!")}>
              Delete
            </Button>
          </div>
        </div>

        {/* Interactive example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Interactive Example
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="success"
                loading={isLoading}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Document"}
              </Button>
              <Button
                variant="outline"
                icon={Heart}
                iconPosition="left"
                onClick={handleLike}
              >
                Like ({likeCount})
              </Button>
              <Button
                variant="outline"
                size="icon-md"
                icon={Trash2}
                aria-label="Delete"
                onClick={() =>
                  confirm("Delete this item?") && alert("Deleted!")
                }
              />
            </div>
          </div>
        </div>

        {/* Form example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Form Example</h2>
          <form
            className="bg-white p-6 rounded-lg shadow-sm space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Form submitted!");
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="your@email.com"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon={Plus}
                iconPosition="left"
              >
                Subscribe
              </Button>
            </div>
          </form>
        </div>

        {/* Size examples */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Size Examples</h2>
          <div className="flex flex-wrap items-end gap-3">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="primary" size="xl">
              Extra Large
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
