import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "../_utils/cn";
import { Check, Send } from 'lucide-react';

// Define the props for the NotificationCard component
interface NotificationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  avatarSrc: string;
  avatarFallback: string;
  isOnline?: boolean;
  userName: string;
  userRole: string;
  message: string;
  timestamp: string;
  readStatus?: 'Read' | 'Unread';
  onReply?: () => void;
}

const NotificationCard = React.forwardRef<HTMLDivElement, NotificationCardProps>(
  (
    {
      className,
      title = 'Notifications',
      avatarSrc,
      avatarFallback,
      isOnline = false,
      userName,
      userRole,
      message,
      timestamp,
      readStatus = 'Unread',
      onReply,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'w-full max-w-md overflow-hidden rounded-2xl border-none bg-card/80 p-2 shadow-lg backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500',
          className
        )}
        {...props}
      >
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-semibold text-card-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-start justify-between space-x-4">
            {/* User Info Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={avatarSrc} alt={`${userName}'s avatar`} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-2">
                <p className="text-sm font-semibold text-card-foreground">{userName}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-primary">{userRole} </p>
              </div>

              {/* Message Bubble */}
              <div className="mb-3 rounded-lg rounded-tl-none bg-muted p-3 text-sm text-muted-foreground">
                <p>{message}</p>
              </div>

              {/* Footer with Timestamp and Read Status */}
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{timestamp}</span>
                <span>&middot;</span>
                {readStatus === 'Read' && (
                  <>
                    <span>Read</span>
                    <Check className="h-3.5 w-3.5" />
                  </>
                )}
                {readStatus === 'Unread' && <span>Unread</span>}
              </div>
            </div>
            
            {/* Reply Button */}
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full transition-colors hover:bg-primary/10"
                onClick={onReply}
                aria-label="Reply to notification"
              >
                <Send className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
NotificationCard.displayName = 'NotificationCard';

export { NotificationCard };