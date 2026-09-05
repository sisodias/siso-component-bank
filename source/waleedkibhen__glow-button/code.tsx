import React, { forwardRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  label?: string;
  onClick?(): void;
  className?: string;
}

export const Component = forwardRef<HTMLButtonElement, ComponentProps>(
  ({ label = "Generate", onClick, className }, ref) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
      onClick?.();
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn("glow-btn", className)}
        onClick={handleClick}
        data-state={isClicked ? "clicked" : undefined}
      >
        <span className="flex items-center justify-center gap-1.5">
          {label}
          <Sparkles size={16} className="ml-0.5" />
        </span>
      </button>
    );
  }
);

Component.displayName = "Component";