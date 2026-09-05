import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, MousePointer2 } from 'lucide-react';
import { cn } from "../_utils/cn";

// Import required shadcn/ui components
import { Button } from "./button";
import { Input } from "./input";

/**
 * Props for the MissionSuccessDialog component.
 */
interface MissionSuccessDialogProps {
  /** Controls whether the dialog is open or closed. */
  isOpen: boolean;
  /** Function to call when the dialog should be closed. */
  onClose: () => void;
  /** URL for the main illustration image. */
  imageUrl: string;
  /** The main title of the dialog. */
  title: string;
  /** The descriptive text below the title. */
  description: string;
  /** Placeholder text for the input field. */
  inputPlaceholder?: string;
  /** Text for the primary action button. */
  primaryButtonText: string;
  /** Callback function when the primary button is clicked. Receives the input value. */
  onPrimaryClick: (inputValue: string) => void;
  /** Text for the secondary action link/button. */
  secondaryButtonText: string;
  /** Callback function when the secondary button is clicked. */
  onSecondaryClick: () => void;
  /** Optional text for the badge at the top. */
  badgeText?: string;
  /** Optional icon for the badge. */
  badgeIcon?: React.ReactNode;
}

export const MissionSuccessDialog: React.FC<MissionSuccessDialogProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
  inputPlaceholder = "Enter a value",
  primaryButtonText,
  onPrimaryClick,
  secondaryButtonText,
  onSecondaryClick,
  badgeText,
  badgeIcon,
}) => {
  const [inputValue, setInputValue] = React.useState('');

  // Handle primary action and close the dialog
  const handlePrimaryClick = () => {
    onPrimaryClick(inputValue);
    onClose();
  };

  // Handle secondary action and close the dialog
  const handleSecondaryClick = () => {
    onSecondaryClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Animated Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-xl"
          >
            <div className="relative p-8 text-center">
              {/* Optional Top Badge */}
              {badgeText && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {badgeIcon}
                  <span>{badgeText}</span>
                </div>
              )}

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 h-8 w-8 rounded-full"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Illustration Image */}
              <div className="mx-auto mb-4 flex h-48 w-48 items-center justify-center">
                <img src={imageUrl} alt="Mission illustration" className="max-h-full max-w-full object-contain drop-shadow-[0_10px_15px_rgba(150,120,255,0.4)]" />
              </div>

              <h2 className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-card-foreground">
                <Zap className="h-5 w-5 text-yellow-400" />
                {title}
              </h2>

              <p className="mb-6 text-sm text-muted-foreground">
                {description}
              </p>

              {/* Form elements */}
              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder={inputPlaceholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-secondary text-center text-secondary-foreground placeholder:text-muted-foreground"
                />
                <Button onClick={handlePrimaryClick} size="lg" className="w-full">
                  {primaryButtonText}
                </Button>
                <Button variant="link" onClick={handleSecondaryClick} className="text-muted-foreground">
                  {secondaryButtonText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};