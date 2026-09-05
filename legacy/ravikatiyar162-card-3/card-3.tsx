import * as React from "react";
import { cn } from "../_utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Card, CardContent } from "./card-2";

/**
 * Type definition for individual stats.
 * This makes the 'stats' prop strongly-typed.
 */
interface Stat {
  label: string;
  value: string | number;
}

/**
 * Props for the ProfileCard component.
 * JSDoc comments explain the purpose of each prop.
 */
export interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL for the avatar image. */
  imageUrl: string;
  /** Fallback text for the avatar, typically user's initials. */
  fallbackText: string;
  /** The full name of the user. */
  name: string;
  /** The user's title or profession. */
  title: string;
  /** An array of stat objects to display. Must contain a label and a value. */
  stats: Stat[];
  /** The label for the primary action button. */
  primaryActionLabel: string;
  /** The label for the secondary action button. */
  secondaryActionLabel: string;
  /** Optional click handler for the primary action button. */
  onPrimaryAction?: () => void;
  /** Optional click handler for the secondary action button. */
  onSecondaryAction?: () => void;
}

/**
 * A responsive and theme-adaptive profile card component.
 * Note: This component uses path aliases (@/) standard in shadcn/ui.
 * Ensure your project's tsconfig.json and bundler are configured for them.
 */
const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  (
    {
      className,
      imageUrl,
      fallbackText,
      name,
      title,
      stats,
      primaryActionLabel,
      secondaryActionLabel,
      onPrimaryAction,
      onSecondaryAction,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        className={cn("w-full max-w-sm rounded-2xl", className)}
        ref={ref}
        {...props}
      >
        <CardContent className="p-6 flex flex-col gap-6">
          {/* Header: Avatar and Name/Title */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={imageUrl} alt={`${name}'s profile picture`} />
              <AvatarFallback>{fallbackText}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
          </div>

          {/* Stats Section: Dynamically rendered from props */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-muted rounded-lg p-3"
              >
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-card-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Action Buttons Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button size="lg" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </Button>
            <Button size="lg" variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);
ProfileCard.displayName = "ProfileCard";

export { ProfileCard };