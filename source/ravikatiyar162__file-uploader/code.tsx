"use client";

import * as React from "react";
import { useState, useRef, DragEvent } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  File,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current status of the uploader.
   */
  status: "idle" | "uploading" | "success" | "error";
  /**
   * Handler for when files are selected or dropped.
   * @param file The selected file.
   */
  onFileSelect: (file: File) => void;
  /**
   * A string of accepted file types, e.g., "text/csv", "image/*".
   */
  acceptedFileTypes: string;
  /**
   * Maximum file size allowed in megabytes (MB).
   */
  maxFileSizeMb: number;
  /**
   * The name of the file (shown in success/error states).
   */
  fileName?: string;
  /**
   * The size of the file in bytes (shown in success state).
   */
  fileSize?: number;
  /**
   * An error message to display (shown in error state).
   */
  errorMessage?: string;
}

export const FileUploader = React.forwardRef<
  HTMLDivElement,
  FileUploaderProps
>(
  (
    {
      className,
      status,
      onFileSelect,
      acceptedFileTypes,
      maxFileSizeMb,
      fileName,
      fileSize,
      errorMessage,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // --- Event Handlers ---

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    };

    const handleFile = (file: File) => {
      onFileSelect(file);
    };

    const triggerFileInput = () => {
      inputRef.current?.click();
    };

    // --- Child Components ---

    const IdleView = () => (
      <motion.div
        key="idle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center"
        onClick={triggerFileInput}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="File upload dropzone"
      >
        <UploadCloud
          className={cn(
            "h-12 w-12 text-muted-foreground",
            isDragging && "text-primary"
          )}
        />
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          {isDragging
            ? "Drop your file here"
            : "Drag & drop file or click to browse"}
        </p>
      </motion.div>
    );

    const UploadingView = () => (
      <motion.div
        key="uploading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-12 text-center"
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium text-primary">Uploading...</p>
      </motion.div>
    );

    const SuccessView = () => (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-green-500/50 bg-green-500/5 p-12 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <p className="mt-4 text-sm font-medium text-green-600">
          Document added successfully
        </p>
      </motion.div>
    );

    const ErrorView = () => (
      <motion.div
        key="error"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/5 p-12 text-center"
      >
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-sm font-medium text-destructive">
          {errorMessage || "An unknown error occurred"}
        </p>
      </motion.div>
    );

    return (
      <Card
        ref={ref}
        className={cn(
          "w-full max-w-lg transition-all",
          isDragging && "border-primary shadow-lg",
          className
        )}
        {...props}
      >
        <CardContent className="space-y-4 p-6">
          <AnimatePresence mode="wait">
            {status === "idle" && <IdleView />}
            {status === "uploading" && <UploadingView />}
            {status === "success" && <SuccessView />}
            {status === "error" && <ErrorView />}
          </AnimatePresence>

          {(status === "success" || status === "error") && fileName && (
            <div className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{fileName}</span>
                  {status === "success" && fileSize && (
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(fileSize)}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFileSelect(null as any)} // A way to reset
              >
                Change
              </Button>
            </div>
          )}

          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Supports: {acceptedFileTypes}</p>
            <p>Maximum file size: {maxFileSizeMb}MB</p>
          </div>
        </CardContent>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFileTypes}
          className="hidden"
          onChange={handleFileChange}
        />
      </Card>
    );
  }
);

FileUploader.displayName = "FileUploader";