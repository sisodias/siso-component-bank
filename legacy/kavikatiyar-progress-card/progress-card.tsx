import * as React from "react"
import { motion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { X, File, CheckCircle2 } from "lucide-react"

import { cn } from "../_utils/cn"
import { Progress } from "./progress"
import { Button } from "./button"

// Utility to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const cardVariants = cva(
  "relative flex w-full max-w-md items-center space-x-4 overflow-hidden rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all",
  {
    variants: {
      status: {
        uploading: "border-border",
        complete: "border-green-500/50",
        error: "border-destructive/50",
      },
    },
    defaultVariants: {
      status: "uploading",
    },
  }
)

export interface UploadProgressCardProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  /** The name of the file being uploaded. */
  fileName: string;
  /** The total size of the file in bytes. */
  fileSize: number;
  /** The upload progress percentage (0-100). */
  progress: number;
  /** A ReactNode to display as the file icon. */
  icon?: React.ReactNode;
  /** Callback function invoked when the cancel button is clicked. */
  onCancel: () => void;
}

const UploadProgressCard = React.forwardRef<
  HTMLDivElement,
  UploadProgressCardProps
>(({ className, status, fileName, fileSize, progress, icon, onCancel, ...props }, ref) => {
  const uploadedSize = (fileSize * progress) / 100;
  const isComplete = progress === 100;

  return (
    <motion.div
      ref={ref}
      className={cn(cardVariants({ status }), className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      {...props}
    >
      {/* File Icon */}
      <div className="shrink-0 text-muted-foreground">
        {isComplete ? (
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        ) : (
          icon || <File className="h-8 w-8" />
        )}
      </div>

      {/* File Details & Progress Bar */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{fileName}</p>
        <div className="mt-2 space-y-1">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {isComplete ? formatFileSize(fileSize) : `${formatFileSize(uploadedSize)} of ${formatFileSize(fileSize)}`}
            </span>
            <span>{isComplete ? "Complete" : `${Math.round(progress)}%`}</span>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      {!isComplete && (
         <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={onCancel}
            aria-label="Cancel upload"
          >
            <X className="h-4 w-4" />
          </Button>
      )}
    </motion.div>
  );
});
UploadProgressCard.displayName = "UploadProgressCard";

export { UploadProgressCard };