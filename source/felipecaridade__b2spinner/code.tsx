import React from 'react';
import {cn} from '@/lib/utils'

interface SpinnerProps {
  color?: string;
  className?: string;
}

export const B2Spinner: React.FC<SpinnerProps> = ({ color, className }) => {
  return (
    <div className={cn('flex', className)}>
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-white-two border-t-primary"
        style={color ? { borderTopColor: color } : undefined}
      />
    </div>
  );
};

