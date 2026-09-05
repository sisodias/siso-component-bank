import * as React from "react";
import { motion } from "framer-motion";
import { X, Phone, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils"; // Your utility for merging class names
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Props interface for type safety and reusability
interface PhoneVerificationFormProps {
  illustrationSrc: string;
  onClose: () => void;
  onProceed: (phoneNumber: string) => void;
  onGoogleSignIn: () => void;
  onSignUpClick: () => void;
  className?: string;
}

// Google Icon SVG Component
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.95-4.25 1.95-5.07 0-9.15-4.08-9.15-9.15s4.08-9.15 9.15-9.15c2.81 0 4.88 1.11 6.01 2.22l2.59-2.59c-1.6-1.5-3.6-2.34-6.1-2.34-10.04 0-18.15 8.12-18.15 18.15s8.11 18.15 18.15 18.15c9.57 0 17.02-6.44 17.02-17.35 0-1.11-.11-2.15-.3-3.12h-16.72z" />
  </svg>
);

export const PhoneVerificationForm = ({
  illustrationSrc,
  onClose,
  onProceed,
  onGoogleSignIn,
  onSignUpClick,
  className,
}: PhoneVerificationFormProps) => {
  const [phoneNumber, setPhoneNumber] = React.useState("");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-2xl",
        className
      )}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 h-8 w-8 rounded-full"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex w-full flex-col items-center text-center">
        {/* Illustration */}
        <img src={illustrationSrc} alt="Cinema Illustration" className="mb-6 h-32 w-32" />

        {/* Header */}
        <h1 className="text-2xl font-semibold tracking-tight">Verify Phone Number</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your phone number to proceed</p>

        {/* Form */}
        <div className="mt-8 w-full space-y-6">
          {/* Phone Input */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="Phone Number"
              className="pl-10"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* reCAPTCHA Placeholder */}
          <div className="flex items-center justify-between rounded-md border border-input bg-background p-3">
            <div className="flex items-center space-x-3">
              <div className="h-7 w-7 rounded border-2 border-muted bg-background" />
              <span className="text-sm text-foreground">I'm not a robot</span>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              <RefreshCw className="mx-auto mb-1 h-6 w-6" />
              <span>reCAPTCHA</span>
              <div className="space-x-2">
                <a href="#" className="hover:underline">Privacy</a>
                <span>-</span>
                <a href="#" className="hover:underline">Terms</a>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <Button
            className="w-full bg-yellow-500 text-yellow-950 hover:bg-yellow-500/90"
            onClick={() => onProceed(phoneNumber)}
          >
            Proceed
          </Button>
        </div>

        {/* Separator */}
        <div className="my-6 flex w-full items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs font-medium text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>
        
        {/* Social Sign-In */}
        <Button variant="outline" className="w-full" onClick={onGoogleSignIn}>
          <GoogleIcon className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
        
        {/* Sign-Up Link */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button onClick={onSignUpClick} className="font-medium text-primary underline-offset-4 hover:underline">
            Sign-Up
          </button>
        </p>
      </div>
    </motion.div>
  );
};