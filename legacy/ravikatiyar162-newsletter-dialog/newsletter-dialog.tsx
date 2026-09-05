// components/ui/newsletter-dialog.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X } from "lucide-react";

import { cn } from "../_utils/cn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "./dialog";
import { Input } from "./input";
import { Button } from "./button";

// Props interface for strong typing
interface NewsletterDialogProps {
  imageSrc: string;
  title: string;
  description: React.ReactNode;
  promoText: React.ReactNode;
  inputPlaceholder?: string;
  buttonText: string;
  onSubscribe: (email: string) => void;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NewsletterDialog = ({
  imageSrc,
  title,
  description,
  promoText,
  inputPlaceholder = "Enter your email here...",
  buttonText,
  onSubscribe,
  trigger,
  open,
  onOpenChange,
}: NewsletterDialogProps) => {
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubscribe(email);
      // Optionally close the dialog on submit
      if (onOpenChange) {
        onOpenChange(false);
      }
    }
  };

  // Staggered animation for content
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <AnimatePresence>
        {open !== false && ( // Conditionally render based on open state for exit animation
          <DialogContent
            className="sm:max-w-md p-0 gap-0 overflow-hidden"
            aria-describedby={undefined} // Remove default description binding
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="relative h-48 w-full">
                <img
                  src={imageSrc}
                  alt="Promotional banner"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <DialogHeader className="text-left">
                  <motion.div
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.1 }}
                  >
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                      {title}
                    </DialogTitle>
                  </motion.div>
                  <motion.div
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.2 }}
                  >
                    <DialogDescription className="text-muted-foreground mt-2">
                      {description}
                    </DialogDescription>
                  </motion.div>
                   <motion.div
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm text-muted-foreground mt-4">{promoText}</p>
                  </motion.div>
                </DialogHeader>

                <motion.form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-4"
                  variants={FADE_IN_ANIMATION_VARIANTS}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={inputPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-9"
                      aria-label="Email address"
                    />
                  </div>
                  <Button type="submit" className="w-full font-semibold" size="lg">
                    {buttonText}
                  </Button>
                </motion.form>
              </div>
            </motion.div>
             <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export { NewsletterDialog };