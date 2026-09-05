// components/ui/redeem-dialog.tsx

"use client";

import * as React from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "../_utils/cn";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Input } from "./input";

// Added 'cardBackgroundImage' to the props interface
interface RedeemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRedeem: (code: string) => Promise<void>;
  cardBackgroundImage?: string; // Optional prop for the card background image
}

export function RedeemDialog({ 
  open, 
  onOpenChange, 
  onRedeem,
  cardBackgroundImage 
}: RedeemDialogProps) {
  const [code, setCode] = React.useState("");
  const [isRedeeming, setIsRedeeming] = React.useState(false);

  const handleRedeemClick = async () => {
    if (!code) return;
    setIsRedeeming(true);
    try {
      await onRedeem(code);
    } catch (error) {
      console.error("Redemption failed:", error);
    } finally {
      setIsRedeeming(false);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setCode("");
      setIsRedeeming(false);
    }
  }, [open]);

  // Dynamic style for the card's background
  const cardStyle = cardBackgroundImage
    ? { backgroundImage: `url(${cardBackgroundImage})` }
    : {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="flex items-center justify-center pt-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
              "relative h-40 w-64 rounded-xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden bg-cover bg-center",
              !cardBackgroundImage && "bg-gradient-to-br from-gray-900 to-black" // Fallback gradient
            )}
            style={cardStyle}
          >
            {/* Overlay to ensure text readability over any image */}
            <div className="absolute inset-0 bg-black/50 z-0" />
            
            <div className="relative z-10 flex justify-end">
              <CreditCard className="h-8 w-8 text-gray-300" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-gray-300">Gifted Credits</p>
              <p className="text-3xl font-bold text-white">$0.00</p>
            </div>
          </motion.div>
        </div>
        
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Redeem a Code</DialogTitle>
          <DialogDescription>
            Enter a valid code below to claim your free credits.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 px-6">
          <Input
            id="redeem-code"
            placeholder="canihavecredits"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isRedeeming}
            className="h-10 text-base"
          />
        </div>

        <DialogFooter className="p-6 pt-4 bg-muted/50 rounded-b-lg">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isRedeeming}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRedeemClick} 
            disabled={!code || isRedeeming}
          >
            {isRedeeming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isRedeeming ? "Verifying..." : "Redeem"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}