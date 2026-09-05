'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function TwoStepVerification() {
  const [code, setCode] = useState<string[]>(new Array(5).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value)) || element.value === ' ') {
      element.value = '';
      return;
    }

    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    if (element.value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 5);
    if (!/^\d+$/.test(pasteData)) return;

    const newCode = new Array(5).fill('');
    for (let i = 0; i < pasteData.length; i++) newCode[i] = pasteData[i];
    setCode(newCode);
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md mx-auto p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl relative overflow-hidden">

        {/* Animated Lock Icon */}
        <div className="absolute inset-x-0 top-0 flex justify-center mt-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="bg-blue-600 dark:bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40"
          >
            <Lock className="w-9 h-9 text-white" strokeWidth={2.5} />
          </motion.div>
        </div>

        <CardHeader className="text-center mt-12">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Two-Step Verification
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
            Enter the 5-digit code we sent to{" "}
            <span className="font-medium text-gray-900 dark:text-gray-200">
              **********060
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div
            className="flex justify-center gap-3 mt-6 mb-6"
            onPaste={handlePaste}
          >
            {code.map((data, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="tel"
                maxLength={1}
                value={data}
                placeholder="•"
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(-1)}
                className={cn(
                  "w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-semibold transition-all",
                  "rounded-xl bg-gray-50 dark:bg-[#161B22] border border-gray-300 dark:border-gray-700",
                  "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500",
                  focusedIndex === index && "border-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                )}
              />
            ))}
          </div>

          <Button className="w-full text-base font-semibold mt-2">
            Verify & Continue
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-gray-500 dark:text-gray-400">
          Didn’t get a code?
          <Button variant="link" className="text-blue-600 dark:text-blue-400 px-1 font-medium">
            Resend
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
