import React, { useRef, useState } from 'react';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    setPreviewUrl(null);
    return undefined;
  }, [file]);

  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 shadow-sm border border-gray-200 mb-2 animate-fade-in">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-16 h-16 object-cover rounded-md border border-gray-200"
        />
      ) : (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md text-gray-500 text-xl">
          <span role="img" aria-label="file">📄</span>
        </div>
      )}
      <div className="flex-1 truncate">
        <div className="font-medium text-gray-800 truncate">{file.name}</div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 px-2 py-1 text-xs flex items-center gap-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition border border-red-200 shadow-sm"
        aria-label="Remove file"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white animate-fade-in ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
    role="alert"
  >
    <div className="flex items-center gap-2">
      {type === 'success' ? '✅' : '❌'}
      <span>{message}</span>
      <button onClick={onClose} className="ml-3 text-white/80 hover:text-white text-lg" aria-label="Close">×</button>
    </div>
  </div>
);

export const Component = () => {
 const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const fileArr = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...fileArr.filter(f => !prev.some(p => p.name === f.name && p.size === f.size))]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFiles(event.target.files);
    }
    // Reset input value so the same file can be selected again
    event.target.value = '';
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    // Also reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setToast({ message: 'Files uploaded successfully!', type: 'success' });
          setSelectedFiles([]);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-4 w-full">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md border border-gray-100 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">Upload Files</h1>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          aria-label="File input"
          multiple
        />
        <div
          className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-200 mb-5 cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}`}
          style={{ minHeight: 120 }}
          onClick={handleButtonClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center py-6">
            <span className="text-4xl mb-2 animate-bounce">📁</span>
            <span className="text-gray-700 font-medium">Drag & drop files here, or <span className="text-blue-600 underline">browse</span></span>
            <span className="text-xs text-gray-400 mt-1">(PNG, JPG, PDF, etc. up to 5MB each)</span>
          </div>
        </div>
        {selectedFiles.length === 1 && (
          <div className="mb-4">
            <FilePreview file={selectedFiles[0]} onRemove={() => handleRemoveFile(0)} />
          </div>
        )}
        {selectedFiles.length > 1 && (
          <div className="mb-4" style={{ maxHeight: 180, overflowY: 'auto' }}>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, idx) => (
                <span
                  key={file.name + file.size}
                  className="inline-flex items-center max-w-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium shadow-sm border border-gray-200 truncate"
                  style={{ minWidth: 0 }}
                  title={file.name}
                >
                  <span className="truncate max-w-[120px] text-xs">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="ml-2 p-0.5 rounded-full hover:bg-red-100 text-red-600 transition border border-transparent focus:outline-none focus:ring-2 focus:ring-red-200"
                    aria-label="Remove file"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden animate-fade-in">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <button
          type="button"
          disabled={selectedFiles.length === 0 || uploading}
          onClick={handleUpload}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-base transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-lg flex items-center justify-center gap-2
            ${selectedFiles.length > 0 && !uploading
              ? 'bg-gray-700 text-white hover:bg-gray-800 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
          style={{ minHeight: 40 }}
        >
          {uploading && (
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease;
        }
      `}</style>
    </div>
  );
};
