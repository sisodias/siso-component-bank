"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, CircleDollarSign, Ban } from "lucide-react";
import { cn } from "@/lib/utils"; // Your utility for merging Tailwind classes

// --- TYPE DEFINITIONS ---
export interface CancellationTier {
  icon: "refund" | "partial-refund" | "no-refund";
  title: string;
  description: string;
  isEmphasized?: boolean; // To style the primary refund option
}

export interface CancellationPolicyProps {
  isOpen: boolean;
  onClose: () => void;
  showtime: string;
  cancellationTiers: CancellationTier[];
  infoNote: string;
  thingsToKnow: string[];
}

// --- ICON MAP ---
const iconMap = {
  "refund": (
    <CircleDollarSign className="h-6 w-6 text-green-500" aria-hidden="true" />
  ),
  "partial-refund": (
    <CircleDollarSign className="h-6 w-6 text-yellow-500" aria-hidden="true" />
  ),
  "no-refund": <Ban className="h-6 w-6 text-red-500" aria-hidden="true" />,
};

// --- COMPONENT ---
export const CancellationPolicy = ({
  isOpen,
  onClose,
  showtime,
  cancellationTiers,
  infoNote,
  thingsToKnow,
}: CancellationPolicyProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancellation-policy-title"
            className="relative m-4 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4 sm:p-6">
              <h2
                id="cancellation-policy-title"
                className="text-lg font-semibold"
              >
                Theatre cancellation policy
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6">
              {/* Showtime Info */}
              <p className="mb-6 text-sm text-muted-foreground">
                Showtime - {showtime}
              </p>

              {/* Refund Tiers */}
              <div className="space-y-4">
                {cancellationTiers.map((tier, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className={cn(
                        "mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted",
                        { "bg-green-500/10": tier.icon === "refund" },
                        { "bg-yellow-500/10": tier.icon === "partial-refund" },
                        { "bg-red-500/10": tier.icon === "no-refund" }
                      )}
                    >
                      {iconMap[tier.icon]}
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">
                        {tier.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tier.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Note */}
              <div className="mt-6 flex items-start gap-3 rounded-lg bg-muted p-4 text-muted-foreground">
                <Info className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <p className="text-xs">{infoNote}</p>
              </div>

              {/* Things to Know */}
              <div className="mt-6">
                <h3 className="mb-3 font-semibold text-card-foreground">
                  Things to know
                </h3>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {thingsToKnow.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};