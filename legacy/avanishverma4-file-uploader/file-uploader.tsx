import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, Video, Music, Archive, Moon, Sun } from 'lucide-react';

const FileUploader = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return <Image className="w-4 h-4" />;
    if (['mp4', 'avi', 'mkv', 'mov', 'webm'].includes(ext)) return <Video className="w-4 h-4" />;
    if (['mp3', 'wav', 'flac', 'ogg', 'aac'].includes(ext)) return <Music className="w-4 h-4" />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadedAt: new Date()
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
  };

  const downloadFile = (file) => {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTotalSize = () => {
    return uploadedFiles.reduce((total, file) => total + file.size, 0);
  };

  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    uploadArea: isDragOver 
      ? (isDarkMode ? 'bg-blue-900/50 border-blue-500' : 'bg-blue-50 border-blue-400')
      : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'),
    fileBg: isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${themeClasses.background}`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className={`rounded-2xl shadow-xl border ${themeClasses.cardBg} ${themeClasses.border}`}>
          <div className="p-8">
            {/* Title and Theme Toggle */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${themeClasses.text}`}>File Uploader</h1>
                  <p className={`mt-1 ${themeClasses.textSecondary}`}>Upload and manage your files</p>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-lg ${themeClasses.border} ${themeClasses.inputBg} ${themeClasses.text}`}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </div>

            {/* Upload Statistics */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={`p-4 rounded-xl ${themeClasses.fileBg} ${themeClasses.border} border`}>
                  <div className={`text-2xl font-bold ${themeClasses.text}`}>{uploadedFiles.length}</div>
                  <div className={`text-sm ${themeClasses.textSecondary}`}>Files Uploaded</div>
                </div>
                <div className={`p-4 rounded-xl ${themeClasses.fileBg} ${themeClasses.border} border`}>
                  <div className={`text-2xl font-bold ${themeClasses.text}`}>{formatFileSize(getTotalSize())}</div>
                  <div className={`text-sm ${themeClasses.textSecondary}`}>Total Size</div>
                </div>
                <div className={`p-4 rounded-xl ${themeClasses.fileBg} ${themeClasses.border} border`}>
                  <button
                    onClick={clearAllFiles}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${themeClasses.uploadArea} hover:scale-[1.01]`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files)}
                multiple
                className="hidden"
              />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 mx-auto mb-6 p-4 rounded-full ${isDragOver ? 'bg-blue-500' : 'bg-gray-400'} transition-colors duration-300`}>
                  <Upload className="w-full h-full text-white" />
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${themeClasses.text}`}>
                  {isDragOver ? 'Drop your files here!' : 'Upload your files'}
                </h3>
                
                <p className={`mb-6 text-lg ${themeClasses.textSecondary}`}>
                  {isDragOver ? 'Release to upload' : 'Drag and drop files here, or click to browse'}
                </p>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Choose Files
                </button>
                
                <div className={`mt-4 text-sm ${themeClasses.textSecondary}`}>
                  Supports all file types • Maximum 100MB per file
                </div>
              </div>

              {isDragOver && (
                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl animate-pulse" />
              )}
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-8">
                <h4 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {uploadedFiles.map(file => (
                    <div 
                      key={file.id} 
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${themeClasses.border} ${themeClasses.fileBg} hover:scale-[1.01]`}
                    >
                      <div className="flex-shrink-0">
                        {getFileIcon(file.name)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${themeClasses.text}`}>{file.name}</p>
                        <div className={`flex items-center gap-4 mt-1 text-sm ${themeClasses.textSecondary}`}>
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.type || 'Unknown type'}</span>
                          <span>•</span>
                          <span>{file.uploadedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadFile(file)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${themeClasses.inputBg} ${themeClasses.text} hover:bg-green-500 hover:text-white`}
                          title="Download file"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => removeFile(file.id)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${themeClasses.textSecondary} hover:bg-red-500 hover:text-white`}
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;