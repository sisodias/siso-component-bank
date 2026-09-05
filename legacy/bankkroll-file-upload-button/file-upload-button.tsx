import { Button } from "./button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { cn } from "../_utils/cn";
import { Edit, File, Trash2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export interface FileUploadButtonProps {
  onFileSelect: (file: File) => Promise<void>;
  maxSize?: number;
  allowedTypes?: string[];
  className?: string;
  disabled?: boolean;
}

function getFileExtension(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toUpperCase() : "";
}

export function FileUploadButton({
  onFileSelect,
  maxSize = 10 * 1024 * 1024,
  allowedTypes = ["image/*", "application/pdf", "text/*"],
  className,
  disabled = false,
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      setPreviewUrl(null);
      setSelectedFile(null);
      try {
        if (file.size > maxSize) {
          setError(
            `File too large. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`,
          );
          return;
        }
        if (allowedTypes && allowedTypes.length > 0) {
          const valid = allowedTypes.some((type) =>
            file.type.match(type.replace("*", ".*")),
          );
          if (!valid) {
            setError("File type not allowed");
            return;
          }
        }
        if (file.type.startsWith("image/")) {
          setPreviewUrl(URL.createObjectURL(file));
        } else {
          setPreviewUrl(null);
        }
        setSelectedFile(file);
        await onFileSelect(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onFileSelect, maxSize, allowedTypes],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setPopoverOpen(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleEdit = () => {
    setPopoverOpen(false);
    inputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const isImage = selectedFile && selectedFile.type.startsWith("image/");
  const fileExt = selectedFile ? getFileExtension(selectedFile.name) : "";

  return (
    <div
      className={cn(
        "relative flex items-center",
        dragActive && "ring-2 ring-primary/60 bg-primary/5",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled && !uploading) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={allowedTypes.join(",")}
        className="hidden"
        onChange={onInputChange}
        disabled={disabled || uploading}
      />
      {selectedFile ? (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={isImage ? "View image preview" : "View file details"}
              disabled={disabled}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 overflow-hidden rounded-lg"
            >
              {isImage && previewUrl ? (
                <img
                  src={previewUrl}
                  alt={selectedFile.name}
                  className="object-cover w-full h-full rounded-lg"
                  style={{ display: "block" }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground leading-none mt-0.5">
                    {fileExt}
                  </span>
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-64 p-0" align="start">
            <div className="p-3 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
                  {selectedFile.name}
                </span>
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
            </div>
            <div className="p-3">
              {isImage && previewUrl ? (
                <img
                  src={previewUrl}
                  alt={selectedFile.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-40 bg-muted rounded-lg mb-3">
                  <File className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {fileExt}
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex-1"
                  aria-label="Change file"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Change
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="flex-1"
                  aria-label="Remove file"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Attach file"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="h-8 w-8 sm:h-9 sm:w-9"
        >
          {uploading ? (
            <Upload className="h-4 w-4 animate-spin" />
          ) : (
            <File className="h-4 w-4" />
          )}
        </Button>
      )}
      {error && (
        <div className="absolute left-full ml-1 sm:ml-2 bg-destructive/90 text-white text-xs rounded px-1 sm:px-2 py-0.5 sm:py-1 z-10 flex items-center gap-1 max-w-32 sm:max-w-48">
          <X className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}
    </div>
  );
}
