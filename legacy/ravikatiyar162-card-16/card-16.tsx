import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, X } from 'lucide-react';

import { cn } from "../_utils/cn"; // Make sure you have this utility from shadcn
import { Button } from "./button"; // Assuming you have a Button component
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"; // Assuming you have an Avatar component

/**
 * @typedef IncomingCallProps
 * @property {string} callerName - The name of the person calling.
 * @property {string} [callerInfo] - Additional information about the caller (e.g., "Driver", "Mobile").
 * @property {string} statusText - The text displayed below the name (e.g., "is calling...").
 * @property {string} [avatarUrl] - The URL for the caller's avatar image.
 * @property {() => void} onAccept - Callback function for the accept action.
 * @property {() => void} onDecline - Callback function for the decline action.
 * @property {() => void} onClose - Callback function to close/dismiss the notification.
 * @property {string} [className] - Optional additional class names for styling the container.
 * @property {boolean} [isOpen=false] - Controls the visibility of the component for animations.
 */
export interface IncomingCallProps {
  callerName: string;
  callerInfo?: string;
  statusText: string;
  avatarUrl?: string;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
  className?: string;
  isOpen?: boolean;
}

const IncomingCall = React.forwardRef<HTMLDivElement, IncomingCallProps>(
  (
    {
      className,
      callerName,
      callerInfo,
      statusText,
      avatarUrl,
      onAccept,
      onDecline,
      onClose,
      isOpen = false,
      ...props
    },
    ref
  ) => {
    // Generates initials from the caller's name for the avatar fallback.
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('');
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
              'fixed bottom-5 right-5 z-50 w-full max-w-sm rounded-2xl border bg-card/80 p-6 text-card-foreground shadow-2xl backdrop-blur-lg',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="incoming-call-name"
            {...props}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-7 w-7 rounded-full"
              onClick={onClose}
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              {/* Pulsing Avatar */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative rounded-full p-1.5 bg-card"
              >
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarImage src={avatarUrl} alt={callerName} />
                  <AvatarFallback className="text-3xl bg-muted">
                    {getInitials(callerName)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* Caller Information */}
              <div>
                <h2 id="incoming-call-name" className="text-2xl font-bold tracking-tight">
                  {callerName}
                  {callerInfo && <span className="text-muted-foreground font-normal"> ({callerInfo})</span>}
                </h2>
                <p className="text-muted-foreground">{statusText}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid w-full grid-cols-2 gap-4 pt-4">
                <Button
                  size="lg"
                  className="w-full bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                  onClick={onAccept}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Accept
                </Button>
                <Button size="lg" variant="destructive" className="w-full" onClick={onDecline}>
                  <PhoneOff className="mr-2 h-5 w-5" />
                  Decline
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
IncomingCall.displayName = 'IncomingCall';

export { IncomingCall };