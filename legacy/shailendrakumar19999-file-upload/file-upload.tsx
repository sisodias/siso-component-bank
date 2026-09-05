import { cn } from "../_utils/cn";
"use client";

import React, { useRef, useState, useCallback } from "react";

interface FileData {
  file: File;
  id: string;
  previewUrl?: string;
}

interface FilePreviewCardProps {
  fileData: FileData;
  onRemove: (id: string) => void;
  isUploading: boolean;
}

const FilePreviewCard: React.FC<FilePreviewCardProps> = ({
  fileData,
  onRemove,
  isUploading,
}) => {
  const { file, id, previewUrl } = fileData;
  const isImage = file.type.startsWith("image/");
  const fileSizeKB = Math.round(file.size / 1024);
  const fileSizeMB = fileSizeKB > 1024 ? (fileSizeKB / 1024).toFixed(1) : null;

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100">
        {isImage && previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">{getFileIcon(file.type)}</div>
              <div className="text-xs text-gray-500 font-medium">
                {file.type.split("/")[1]?.toUpperCase() || "FILE"}
              </div>
            </div>
          </div>
        )}

        {/* Overlay with file info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-2 left-2 right-2">
            <div className="text-white text-xs font-medium truncate">
              {file.name}
            </div>
            <div className="text-white/80 text-xs">
              {fileSizeMB ? `${fileSizeMB}MB` : `${fileSizeKB}KB`}
            </div>
          </div>
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(id)}
          disabled={isUploading}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          aria-label="Remove file"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Upload progress overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DropZoneProps {
  isDragging: boolean;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onClick: () => void;
  hasFiles: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({
  isDragging,
  onDrop,
  onDragOver,
  onDragLeave,
  onClick,
  hasFiles,
}) => (
  <div
    className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group ${
      isDragging
        ? "border-blue-500 bg-blue-50 scale-105"
        : hasFiles
          ? "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          : "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400 hover:from-blue-50 hover:to-blue-100"
    }`}
    style={{ minHeight: hasFiles ? 120 : 200 }}
    onClick={onClick}
    onDrop={onDrop}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
  >
    <div className="flex flex-col items-center justify-center h-full py-8">
      <div
        className={`transition-transform duration-300 ${isDragging ? "scale-110" : "group-hover:scale-105"}`}
      >
        <div className="relative">
          <div className="text-6xl mb-4 opacity-80">
            {isDragging ? "📂" : "📁"}
          </div>
          {isDragging && (
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
              ✨
            </div>
          )}
        </div>
      </div>

      <div className="text-center max-w-xs">
        <p className="text-lg font-semibold text-gray-700 mb-2">
          {isDragging ? "Drop files here!" : "Drag & drop your files"}
        </p>
        <p className="text-sm text-gray-500 mb-3">
          or{" "}
          <span className="text-blue-600 font-medium underline decoration-2 underline-offset-2">
            browse from device
          </span>
        </p>
        <p className="text-xs text-gray-400">
          Supports: Images, PDFs, Documents (Max 10MB each)
        </p>
      </div>
    </div>
  </div>
);

interface UploadProgressProps {
  progress: number;
  isVisible: boolean;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner animate-fade-in">
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer" />
      </div>
    </div>
  );
};

interface ToastNotificationProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  const icon = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
  }[type];

  return (
    <div
      className={`fixed top-6 right-6 z-50 ${bgColor} text-white px-6 py-4 rounded-xl shadow-xl animate-slide-in-right`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith("image/")) return "🖼️";
  if (fileType.includes("pdf")) return "📄";
  if (fileType.includes("video")) return "🎥";
  if (fileType.includes("audio")) return "🎵";
  if (fileType.includes("text")) return "📝";
  if (fileType.includes("zip") || fileType.includes("rar")) return "📦";
  return "📄";
};
export const Component = () => {
   const [fileDataList, setFileDataList] = useState<FileData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createFileData = useCallback((file: File): FileData => {
    const id = `${file.name}-${file.size}-${Date.now()}`;
    const fileData: FileData = { file, id };

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      fileData.previewUrl = url;
    }

    return fileData;
  }, []);

  const handleFiles = useCallback(
    (files: FileList) => {
      const newFiles = Array.from(files)
        .filter((file) => file.size <= 10 * 1024 * 1024) // 10MB limit
        .filter(
          (file) =>
            !fileDataList.some(
              (fd) => fd.file.name === file.name && fd.file.size === file.size
            )
        );

      if (newFiles.length !== files.length) {
        setToast({
          message: "Some files were skipped (duplicates or >10MB)",
          type: "info",
        });
      }

      const newFileData = newFiles.map(createFileData);
      setFileDataList((prev) => [...prev, ...newFileData]);
    },
    [fileDataList, createFileData]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        handleFiles(event.target.files);
      }
      event.target.value = "";
    },
    [handleFiles]
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        handleFiles(event.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setFileDataList((prev) => {
      const fileData = prev.find((fd) => fd.id === id);
      if (fileData?.previewUrl) {
        URL.revokeObjectURL(fileData.previewUrl);
      }
      return prev.filter((fd) => fd.id !== id);
    });
  }, []);

  const handleUpload = useCallback(() => {
    if (fileDataList.length === 0) return;

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setToast({
            message: `Successfully uploaded ${fileDataList.length} file${fileDataList.length > 1 ? "s" : ""}!`,
            type: "success",
          });

          // Clean up preview URLs
          fileDataList.forEach((fd) => {
            if (fd.previewUrl) {
              URL.revokeObjectURL(fd.previewUrl);
            }
          });
          setFileDataList([]);
          return 100;
        }
        return prev + Math.random() * 15 + 5; // More realistic progress
      });
    }, 150);
  }, [fileDataList]);

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      fileDataList.forEach((fd) => {
        if (fd.previewUrl) {
          URL.revokeObjectURL(fd.previewUrl);
        }
      });
    };
  }, [fileDataList]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            File Upload Studio
          </h1>
          <p className="text-gray-600 text-lg">
            Drag, drop, and upload your files with style
          </p>
        </div>

        {/* Main Upload Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <DropZone
            isDragging={isDragging}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleButtonClick}
            hasFiles={fileDataList.length > 0}
          />

          {/* File Preview Grid */}
          {fileDataList.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Selected Files ({fileDataList.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    fileDataList.forEach((fd) => {
                      if (fd.previewUrl) URL.revokeObjectURL(fd.previewUrl);
                    });
                    setFileDataList([]);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                {fileDataList.map((fileData) => (
                  <FilePreviewCard
                    key={fileData.id}
                    fileData={fileData}
                    onRemove={handleRemoveFile}
                    isUploading={uploading}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <UploadProgress progress={progress} isVisible={uploading} />

          {/* Upload Button */}
          <button
            type="button"
            disabled={fileDataList.length === 0 || uploading}
            onClick={handleUpload}
            className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg ${
              fileDataList.length > 0 && !uploading
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 active:scale-95 hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              {uploading ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Uploading... {Math.round(progress)}%</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>
                    Upload {fileDataList.length} File
                    {fileDataList.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};
