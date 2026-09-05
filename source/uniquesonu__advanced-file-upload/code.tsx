import React, { useState, useRef, useCallback } from 'react';

const FileUpload = ({
  accept = "*/*",
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  onFilesSelect = () => {},
  onFilesRemove = () => {},
  disabled = false,
  className = ""
}) => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const errors = [];
    
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`);
    }
    
    if (accept !== "*/*" && !accept.split(',').some(type => 
      file.type.match(type.trim().replace('*', '.*'))
    )) {
      errors.push(`File type not supported`);
    }
    
    return errors;
  };

  const processFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    const validFiles = [];
    const fileErrors = [];

    fileArray.forEach(file => {
      const fileValidationErrors = validateFile(file);
      if (fileValidationErrors.length === 0) {
        validFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        });
      } else {
        fileErrors.push(`${file.name}: ${fileValidationErrors.join(', ')}`);
      }
    });

    if (!multiple) {
      setFiles(validFiles.slice(0, 1));
      onFilesSelect(validFiles.slice(0, 1));
    } else {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesSelect(updatedFiles);
    }

    setErrors(fileErrors);
  }, [files, multiple, maxSize, accept, onFilesSelect]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e) => {
    if (disabled) return;
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesRemove(updatedFiles);
    
    // Clean up preview URL
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    return '📎';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          ${isDragOver 
            ? 'border-ring bg-muted/50' 
            : 'border-input hover:border-border hover:bg-muted/20'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="space-y-3">
          <div className="text-4xl">📁</div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground">
              {accept === "*/*" ? "Any file type" : accept} • Max {(maxSize / (1024 * 1024)).toFixed(1)}MB
              {multiple ? " • Multiple files allowed" : " • Single file only"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-xs text-destructive">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Selected files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-md border bg-muted/20"
              >
                <div className="text-lg">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  disabled={disabled}
                  className="text-muted-foreground hover:text-destructive transition-colors duration-200 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Professional demo component
const FileUploadDemo = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadType, setUploadType] = useState('any');
  const [isMultiple, setIsMultiple] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  const acceptTypes = {
    any: "*/*",
    images: "image/*",
    documents: ".pdf,.doc,.docx,.txt",
    media: "image/*,video/*,audio/*"
  };

  const handleFilesSelect = (files) => {
    setSelectedFiles(files);
    console.log('Files selected:', files);
  };

  const handleFilesRemove = (files) => {
    setSelectedFiles(files);
    console.log('Files updated:', files);
  };

  const clearAll = () => {
    setSelectedFiles([]);
  };


  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <style jsx global>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 222.2 47.4% 11.2%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 222.2 47.4% 11.2%;
          --radius: 0.5rem;
        }
        
        .dark {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 210 40% 98%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 212.7 26.8% 83.9%;
        }
        
        * {
          border-color: hsl(var(--border));
        }
        
        body {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        .bg-background { background-color: hsl(var(--background)); }
        .text-foreground { color: hsl(var(--foreground)); }
        .bg-card { background-color: hsl(var(--card)); }
        .text-card-foreground { color: hsl(var(--card-foreground)); }
        .bg-muted { background-color: hsl(var(--muted)); }
        .text-muted-foreground { color: hsl(var(--muted-foreground)); }
        .bg-secondary { background-color: hsl(var(--secondary)); }
        .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
        .border-input { border-color: hsl(var(--input)); }
        .border-border { border-color: hsl(var(--border)); }
        .border-ring { border-color: hsl(var(--ring)); }
        .border-destructive { border-color: hsl(var(--destructive)); }
        .text-destructive { color: hsl(var(--destructive)); }
        .bg-muted\\/20 { background-color: hsl(var(--muted) / 0.2); }
        .bg-muted\\/50 { background-color: hsl(var(--muted) / 0.5); }
        .hover\\:bg-muted\\/20:hover { background-color: hsl(var(--muted) / 0.2); }
        .hover\\:text-destructive:hover { color: hsl(var(--destructive)); }
        .hover\\:border-border:hover { border-color: hsl(var(--border)); }
        .hover\\:bg-accent:hover { background-color: hsl(var(--accent)); }
        .hover\\:text-accent-foreground:hover { color: hsl(var(--accent-foreground)); }
        .hover\\:bg-secondary\\/80:hover { background-color: hsl(var(--secondary) / 0.8); }
      `}</style>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            {/* Header */}
            <div className="space-y-2 mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">File Upload</h1>
              <p className="text-sm text-muted-foreground">
                Upload your files with drag and drop support
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">File Type</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                >
                  <option value="any">Any file</option>
                  <option value="images">Images only</option>
                  <option value="documents">Documents</option>
                  <option value="media">Media files</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Multiple Files</label>
                <button
                  onClick={() => setIsMultiple(!isMultiple)}
                  className={`w-full rounded-md border px-3 py-2 text-sm transition-colors ${
                    isMultiple 
                      ? 'bg-secondary text-secondary-foreground border-input' 
                      : 'bg-background border-input hover:bg-accent'
                  }`}
                >
                  {isMultiple ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">State</label>
                <button
                  onClick={() => setIsDisabled(!isDisabled)}
                  className={`w-full rounded-md border px-3 py-2 text-sm transition-colors ${
                    isDisabled 
                      ? 'bg-secondary text-secondary-foreground border-input' 
                      : 'bg-background border-input hover:bg-accent'
                  }`}
                >
                  {isDisabled ? 'Disabled' : 'Enabled'}
                </button>
              </div>
            </div>

            {/* File Upload Component */}
            <FileUpload
              accept={acceptTypes[uploadType]}
              multiple={isMultiple}
              maxSize={10 * 1024 * 1024} // 10MB
              onFilesSelect={handleFilesSelect}
              onFilesRemove={handleFilesRemove}
              disabled={isDisabled}
            />

            {/* Actions */}
            {selectedFiles.length > 0 && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={clearAll}
                  disabled={isDisabled}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
                >
                  Clear All
                </button>
                <button
                  disabled={isDisabled}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                >
                  Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default FileUploadDemo;