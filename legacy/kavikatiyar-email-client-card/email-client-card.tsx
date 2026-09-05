import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming you have a utils file for `cn`

// ShadCN UI Primitives (install via CLI)
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Input } from "./input";

const cardVariants = cva(
  'w-full max-w-2xl mx-auto rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col transition-colors',
  {
    variants: {
      isExpanded: {
        true: 'h-auto',
        false: 'h-auto', // Placeholder for potential collapsed styles
      },
    },
    defaultVariants: {
      isExpanded: true,
    },
  },
);

export interface EmailClientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  avatarSrc: string;
  avatarFallback: string;
  senderName: string;
  senderEmail: string;
  timestamp: string;
  message: string;
  actions?: React.ReactNode[];
  reactions?: string[];
  onReactionClick?: (reaction: string) => void;
  onActionClick?: (index: number) => void;
}

const EmailClientCard = React.forwardRef<HTMLDivElement, EmailClientCardProps>(
  (
    {
      className,
      avatarSrc,
      avatarFallback,
      senderName,
      senderEmail,
      timestamp,
      message,
      actions = [],
      reactions = [],
      onReactionClick,
      onActionClick,
      isExpanded,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState('');

    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          staggerChildren: 0.05,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ isExpanded }), className)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {/* Card Header */}
        <motion.div
          className="p-4 sm:p-6 flex items-start gap-4 border-b"
          variants={itemVariants}
        >
          <Avatar className="w-10 h-10 border">
            <AvatarImage src={avatarSrc} alt={senderName} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="font-semibold text-card-foreground">{senderName}</p>
            <p className="text-sm text-muted-foreground">{senderEmail}</p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs hidden sm:inline">{timestamp}</span>
            {actions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => onActionClick?.(index)}
                  aria-label={`Action ${index + 1}`}
                >
                  {action}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Card Body */}
        <motion.div
          className="p-4 sm:p-6 text-sm text-foreground/90 leading-relaxed"
          variants={itemVariants}
        >
          <p>{message}</p>
        </motion.div>

        {/* Card Footer with Reply */}
        <motion.div
          className="p-3 sm:p-4 mt-auto border-t bg-muted/50"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type here..."
              className="flex-grow bg-background focus-visible:ring-1 focus-visible:ring-offset-0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex items-center gap-1">
              {reactions.map((reaction, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-xl"
                    onClick={() => onReactionClick?.(reaction)}
                    aria-label={`React with ${reaction}`}
                  >
                    {reaction}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  },
);

EmailClientCard.displayName = 'EmailClientCard';

export { EmailClientCard, cardVariants };