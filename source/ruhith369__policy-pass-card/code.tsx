"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calendar, ShieldCheck, Car, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export interface PolicyPassCardProps {
  holderName: string
  policyNumber: string
  policyType: string
  vehicleName: string
  validTill: string
  qrCodeUrl: string
  onCopyPolicy?: () => void
  onRenew?: () => void
  className?: string
}

/**
 * PolicyPassCard — A modern horizontal glass-style summary card
 * for digital insurance display with QR code and smooth hover animation.
 */
export const PolicyPassCard: React.FC<PolicyPassCardProps> = ({
  holderName,
  policyNumber,
  policyType,
  vehicleName,
  validTill,
  qrCodeUrl,
  onCopyPolicy,
  onRenew,
  className,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(policyNumber)
    onCopyPolicy?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border bg-card/70 p-6 shadow-md backdrop-blur-md md:flex-row md:items-center md:justify-between",
        "transition-all hover:shadow-xl hover:bg-card/80",
        className
      )}
    >
      {/* Left Section */}
      <div className="flex flex-col justify-between gap-4 md:w-3/4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{holderName}</h2>
          <p className="text-sm text-muted-foreground">Insurance Holder</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Policy Number</span>
            <div className="mt-1 flex items-center gap-2 font-medium">
              {policyNumber}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCopy}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy Policy Number</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Policy Type</span>
            <span className="mt-1 flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {policyType}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Vehicle</span>
            <span className="mt-1 flex items-center gap-2 font-medium">
              <Car className="h-4 w-4 text-primary" />
              {vehicleName}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Valid Till</span>
            <span className="mt-1 flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              {validTill}
            </span>
          </div>
        </div>

        {onRenew && (
          <Button
            variant="default"
            size="lg"
            onClick={onRenew}
            className="mt-4 w-fit md:mt-2"
          >
            Renew Policy
          </Button>
        )}
      </div>

      {/* Right QR Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        whileHover={{ rotate: 3 }}
        className="mt-6 flex justify-center md:mt-0 md:justify-end"
      >
        <div className="flex flex-col items-center">
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="h-32 w-32 rounded-xl border border-border shadow-inner"
          />
          <p className="mt-2 text-xs text-muted-foreground">Scan to verify policy</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
