import * as React from "react";
import { Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "../_utils/cn";
import { Button } from "./button";

// Define the props for the ImageUploader component
interface ImageUploaderProps {
  /** The current list of files. */
  files: File[];
  /** Callback function to update the file list. */
  onChange: (files: File[]) => void;
  /** Maximum number of files allowed. Defaults to 5. */
  maxFiles?: number;
  /** Maximum file size in MB. Defaults to 4. */
  maxSize?: number;
  /** Accepted file types. Defaults to "image/*". */
  accept?: string;
  /** ClassName for the root element. */
  className?: string;
}

/**
 * A reusable image uploader component with drag-and-drop, previews, and animations.
 */
export const ImageUploader = React.forwardRef<HTMLDivElement, ImageUploaderProps>(
  (
    {
      files,
      onChange,
      maxFiles = 5,
      maxSize = 4,
      accept = "image/*",
      className,
      ...props
    },
    ref
  ) => {
    // State to manage drag-over visual feedback
    const [isDragging, setIsDragging] = React.useState(false);
    // Ref for the hidden file input
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Memoize preview URLs to prevent re-rendering and memory leaks
    const previewUrls = React.useMemo(() => 
      files.map(file => URL.createObjectURL(file)),
      [files]
    );

    // Effect to clean up object URLs on unmount
    React.useEffect(() => {
      return () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
      };
    }, [previewUrls]);

    const handleFileChange = (newFiles: FileList | null) => {
      if (!newFiles) return;

      const filesArray = Array.from(newFiles);
      const uniqueNewFiles = filesArray.filter(
        (newFile) => !files.some((existingFile) => existingFile.name === newFile.name)
      );

      // Validate files and update the list
      const updatedFiles = [...files, ...uniqueNewFiles].slice(0, maxFiles);
      onChange(updatedFiles);
    };

    const handleRemoveFile = (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      onChange(updatedFiles);
    };

    // Drag and drop event handlers
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFileChange(e.dataTransfer.files);
    };

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/30 bg-transparent"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          aria-label="Image uploader dropzone"
          tabIndex={0}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
          />
          <div className="flex flex-col items-center gap-4">
            <Button type="button" variant="outline" size="icon" className="h-14 w-14 rounded-full">
              <Upload className="h-6 w-6" />
            </Button>
            <div>
              <p className="font-medium">
                Choose images or drag & drop it here
              </p>
              <p className="text-sm text-muted-foreground">
                JPG, JPEG, PNG and WEBP. Max {maxSize}MB.
              </p>
            </div>
          </div>
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {previewUrls.map((url, index) => (
                <motion.div
                  key={files[index].name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="relative group aspect-square"
                >
                  <img
                    src={url}
                    alt={`Preview of ${files[index].name}`}
                    className="object-cover w-full h-full rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    aria-label={`Remove ${files[index].name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }
);

ImageUploader.displayName = "ImageUploader";