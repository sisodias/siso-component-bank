// components/ui/destructive-action-dialog.tsx

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Props interface for component reusability
export interface DestructiveActionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: React.ReactNode;
  warningText: string;
  itemToConfirm: string; // The exact string user must type to confirm
  onConfirm: () => void;
  isLoading?: boolean;
  children: React.ReactNode; // To render the details of the item being deleted
}

export function DestructiveActionDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  warningText,
  itemToConfirm,
  onConfirm,
  isLoading = false,
  children,
}: DestructiveActionDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  
  // Resets input value when dialog is closed
  React.useEffect(() => {
    if (!isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  const isConfirmationMatching = inputValue === itemToConfirm;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-4">
            {/* Warning Alert */}
            <Alert variant="destructive" className="border-red-500/50 text-red-500 dark:border-red-500/50">
              <AlertTriangle className="h-4 w-4 pr-1 !text-red-500" />
              <AlertDescription className="text-xs text-red-500 dark:text-red-400">
                {warningText}
              </AlertDescription>
            </Alert>
            
            {/* Item to be deleted */}
            <div className="rounded-lg border bg-background p-4">{children}</div>

            {/* Confirmation Input */}
            <div>
              <label htmlFor="confirmation-input" className="text-sm font-medium text-muted-foreground">
                To delete, type the workspace name <span className="font-bold text-foreground">{itemToConfirm}</span> below
              </label>
              <div className="relative mt-2">
                <Trash2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmation-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Enter ${itemToConfirm}`}
                  className="pl-9"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="bg-muted/40 p-6 mt-6 rounded-b-lg">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={!isConfirmationMatching || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Delete Workspace
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}