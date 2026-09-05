"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils"; // Your utility for merging class names
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Assuming you have Dialog components

// Define the props for the component
interface OtpVerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  imageUrl: string;
  phoneNumber: string;
  onComplete: (otp: string) => void;
  isLoading?: boolean;
  countdownSeconds?: number;
}

const OTP_LENGTH = 6;

export function OtpVerificationDialog({
  isOpen,
  onOpenChange,
  imageUrl,
  phoneNumber,
  onComplete,
  isLoading = false,
  countdownSeconds = 30,
}: OtpVerificationDialogProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(countdownSeconds);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Focus effect
  useEffect(() => {
    if (isOpen) {
        inputRefs.current[0]?.focus();
        // Reset state on open
        setOtp(Array(OTP_LENGTH).fill(""));
        setTimeLeft(countdownSeconds);
    }
  }, [isOpen, countdownSeconds]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to the next input if a value is entered
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to the previous input on backspace if the current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasteData)) return; // Only allow numbers

    const newOtp = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);
    inputRefs.current[pasteData.length -1]?.focus();
  };

  const handleSubmit = () => {
    const otpString = otp.join("");
    if (otpString.length === OTP_LENGTH) {
      onComplete(otpString);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const formattedTime = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-8 rounded-xl">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <DialogHeader className="text-center items-center">
                 <motion.img 
                    src={imageUrl} 
                    alt="Cinema" 
                    className="w-32 h-32 mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                />
                <DialogTitle className="text-2xl font-bold">Verify OTP</DialogTitle>
                <DialogDescription className="mt-2">
                  We've sent a code to your phone number <br />
                  <span className="font-semibold text-foreground">{phoneNumber}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-center gap-2 my-8" onPaste={handlePaste}>
                {otp.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                  >
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={cn(
                        "w-12 h-14 text-center text-2xl font-semibold rounded-lg border",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all",
                        "bg-background text-foreground",
                        "border-border focus:border-primary focus:ring-primary/50"
                      )}
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="text-center text-sm text-muted-foreground mb-6">
                {timeLeft > 0 ? (
                  <p>{formattedTime}</p>
                ) : (
                  <Button variant="link" size="sm" onClick={() => setTimeLeft(countdownSeconds)}>
                    Resend Code
                  </Button>
                )}
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
                  disabled={!isOtpComplete || isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Proceed
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}