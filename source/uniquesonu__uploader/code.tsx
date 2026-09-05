import React, { useState, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui Progress

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
interface UploadedFile {
  name: string;
  size: number;
  progress: number; // 0 to 100
  status: 'pending' | 'uploading' | 'complete' | 'error';
}

// --- 📦 API (Props) Definition ---
export interface FileUploaderCardProps {
  /** The maximum size allowed per file in MB. */
  maxFileSizeMB?: number;
  /** The list of acceptable file extensions (e.g., ['.pdf', '.csv', '.xlsx']). */
  acceptFileTypes?: string[];
  /** Callback function when a file is successfully processed (simulated). */
  onFileUploadComplete?: (fileName: string) => void;
  /** Optional class name for the card container. */
  className?: string;
}

/**
 * An animated, drag-and-drop file uploader component, perfect for asset management dashboards.
 * Uses Framer Motion for interactive feedback and smooth progress visualization.
 */
const FileUploaderCard: React.FC<FileUploaderCardProps> = ({
  maxFileSizeMB = 10,
  acceptFileTypes = ['.pdf', '.csv', '.xlsx', '.zip'],
  onFileUploadComplete,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptString = useMemo(() => acceptFileTypes.join(','), [acceptFileTypes]);
  const isUploadActive = file && file.status === 'uploading';
  const isComplete = file && file.status === 'complete';
  const isError = file && file.status === 'error';

  // --- Internal Handlers ---
  
  // Simulation for file upload
  const startUploadSimulation = useCallback((newFile: File) => {
    if (newFile.size > maxFileSizeMB * 1024 * 1024) {
      setFile({
        name: newFile.name,
        size: newFile.size,
        progress: 0,
        status: 'error',
      });
      return;
    }

    let progress = 0;
    setFile({
      name: newFile.name,
      size: newFile.size,
      progress: 0,
      status: 'uploading',
    });

    const interval = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 20); // Simulate network jitter
      setFile(prev => prev ? ({ ...prev, progress: Math.min(100, progress) }) : null);

      if (progress >= 100) {
        clearInterval(interval);
        setFile(prev => prev ? ({ ...prev, status: 'complete', progress: 100 }) : null);
        onFileUploadComplete?.(newFile.name);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [maxFileSizeMB, onFileUploadComplete]);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      startUploadSimulation(files[0]);
    }
    setIsDragging(false);
  }, [startUploadSimulation]);
  
  // Drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleFileChange]);
  
  const handleRetry = () => {
    setFile(null); // Reset file to trigger input open
    fileInputRef.current?.click();
  };
  
  const handleSelectFileClick = () => {
    if (!isUploadActive && file?.status !== 'complete') {
        fileInputRef.current?.click();
    }
  };

  // --- Framer Motion Variants ---
  const dropZoneVariants = {
    initial: { scale: 1, boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
    drag: { scale: 1.01, boxShadow: "0 0 0 4px hsl(var(--primary) / 0.5)", transition: { type: 'spring', stiffness: 300 } },
    error: { borderColor: "hsl(var(--destructive))", transition: { duration: 0.1 } },
  };


  return (
    <Card className={cn("w-full max-w-lg mx-auto shadow-lg", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
            <UploadCloud className="h-5 w-5 mr-2 text-primary" />
            Upload New Asset
        </CardTitle>
        <CardDescription>
            Drop file here or click to upload ({maxFileSizeMB}MB max, {acceptFileTypes.join(', ')})
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Drop Zone */}
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          variants={dropZoneVariants}
          animate={isError ? "error" : (isDragging ? "drag" : "initial")}
          className={cn(
            "flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer text-center",
            isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:bg-muted/30",
            isError && "border-destructive/80 bg-destructive/10"
          )}
          onClick={handleSelectFileClick}
          aria-disabled={isUploadActive || isComplete}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            accept={acceptString}
            disabled={isUploadActive || isComplete}
          />
          
          <UploadCloud className={cn("h-8 w-8 mb-2", isError ? "text-destructive" : "text-muted-foreground")} />
          <p className="text-sm font-medium text-foreground">Drag and drop file here</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
        </motion.div>

        {/* File Status & Progress */}
        <div>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "mt-4 p-4 border rounded-lg space-y-3 transition-colors duration-200",
              isComplete ? "border-green-500/50 bg-green-500/10" : isError ? "border-destructive/50 bg-destructive/10" : "border-border bg-card"
            )}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center min-w-0 pr-2">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                <span className="font-medium truncate text-foreground">{file.name}</span>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-2 shrink-0">
                {isUploadActive && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                {isComplete && <CheckCircle className="h-4 w-4 text-green-500" />}
                {isError && <X className="h-4 w-4 text-destructive" />}
                <span className={cn("text-xs", isError ? "text-destructive" : "text-muted-foreground")}>
                    {isComplete ? 'Done' : isError ? 'Failed' : `${Math.floor(file.progress)}%`}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            {!isComplete && !isError && (
              <Progress value={file.progress} className="h-2 transition-all duration-300" />
            )}
            
            {/* Action Buttons on Error */}
            {isError && (
                <div className="flex justify-end pt-2 space-x-2">
                    <Button onClick={handleRetry} size="sm" variant="destructive" className="transition-shadow duration-150">
                        Retry Upload
                    </Button>
                    <Button onClick={() => setFile(null)} size="sm" variant="ghost">
                        Clear File
                    </Button>
                </div>
            )}
            {isComplete && (
                 <div className="flex justify-end pt-2 space-x-2">
                    <Button onClick={() => setFile(null)} size="sm" variant="outline">
                        Upload Another
                    </Button>
                </div>
            )}
          </motion.div>
        )}
        </div>
      </CardContent>
    </Card>
  );
};



const ExampleUsage = () => {
  const handleComplete = (fileName: string) => {
    console.log(`File upload complete: ${fileName}`);
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-xl mx-auto shadow-md">
      <FileUploaderCard
        maxFileSizeMB={5}
        acceptFileTypes={['.pdf', '.csv']}
        onFileUploadComplete={handleComplete}
      />
    </div>
  );
};

export default ExampleUsage;