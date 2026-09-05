// components/ui/shared-file-card-standalone.tsx
'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronRight, ClipboardCopy, Check } from 'lucide-react';

import { cn } from "../_utils/cn";

// --- Start of Bundled Dependencies ---

// 1. Card Component
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

// 2. Button Component
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
Button.displayName = 'Button';

// 3. Avatar Component
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-lg', className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// --- End of Bundled Dependencies ---

// --- Main SharedFileCard Component ---

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  fallback: string;
}

export interface SharedFileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  users: User[];
  fileUrl: string;
  onSeeAllClick?: () => void;
  onUserClick?: (userId: string) => void;
}

export const SharedFileCard = React.forwardRef<HTMLDivElement, SharedFileCardProps>(
  ({ title, users, fileUrl, onSeeAllClick, onUserClick, className, ...props }, ref) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(fileUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    };

    return (
      <Card
        ref={ref}
        className={cn('w-full max-w-sm overflow-hidden', className)}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {onSeeAllClick && (
            <Button variant="ghost" size="sm" onClick={onSeeAllClick}>
              See All
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id}>
                <button
                  onClick={() => onUserClick?.(user.id)}
                  className="w-full flex items-center p-2 rounded-lg text-left transition-all duration-200 ease-in-out hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`View details for ${user.name}`}
                >
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.fallback}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-medium text-sm text-card-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-grow flex items-center h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground overflow-hidden whitespace-nowrap">
              <span className="truncate">{fileUrl}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Copy file link"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <ClipboardCopy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);
SharedFileCard.displayName = 'SharedFileCard';