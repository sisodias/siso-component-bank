"use client";

import React, { useState, useRef, useCallback, useMemo, startTransition } from 'react';

interface AIInputProps {
  onSubmit?: (message: string, model: string, thinkingMode: boolean, files: File[]) => void;
  placeholder?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  disabled?: boolean;
  loading?: boolean;
}

interface Model {
  readonly id: string;
  readonly name: string;
  readonly icon: React.ReactNode;
}

const MODELS: readonly Model[] = [
  {
    id: 'gpt-4',
    name: 'GPT 4.1',
    icon: (
      <img
        src="https://static-00.iconduck.com/assets.00/openai-icon-2021x2048-4rpe5x7n.png"
        alt="OpenAI GPT-4.1"
        className="w-5 h-5 rounded-sm"
        loading="lazy"
      />
    )
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'o4 mini',
    icon: (
      <img
        src="https://static-00.iconduck.com/assets.00/openai-icon-2021x2048-4rpe5x7n.png"
        alt="OpenAI o4 mini"
        className="w-5 h-5 rounded-sm"
        loading="lazy"
      />
    )
  },
  {
    id: 'claude-3',
    name: 'Claude Sonnet 4',
    icon: (
      <img
        src="https://zorgle.co.uk/wp-content/uploads/2024/11/Claude-ai-logo.png"
        alt="Claude Sonnet 4"
        className="w-5 h-5 rounded-sm"
        loading="lazy"
      />
    )
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    icon: (
      <img
        src="https://brandlogos.net/wp-content/uploads/2025/03/gemini_icon-logo_brandlogos.net_bqzeu-512x512.png"
        alt="Gemini 2.5 Pro"
        className="w-5 h-5 rounded-sm"
        loading="lazy"
      />
    )
  }
] as const;

const ACCEPTED_FILE_TYPES = 'image/*,.pdf,.txt,.doc,.docx,.json,.csv,.md';
const MAX_TEXTAREA_HEIGHT = 200;
const MIN_TEXTAREA_HEIGHT = 60;

const AIInput: React.FC<AIInputProps> = ({ 
  onSubmit,
  placeholder = "Ask me anything...",
  maxFiles = 10,
  maxFileSize = 10, // 10MB default
  disabled = false,
  loading = false
}) => {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const [thinkingMode, setThinkingMode] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoized values
  const selectedModelData = useMemo(() => 
    MODELS.find(model => model.id === selectedModel) || MODELS[0], 
    [selectedModel]
  );

  const isSubmitDisabled = useMemo(() => 
    disabled || loading || (!message.trim() && files.length === 0), 
    [disabled, loading, message, files.length]
  );

  const totalFileSize = useMemo(() => 
    files.reduce((sum, file) => sum + file.size, 0), 
    [files]
  );

  // Validation helpers
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File "${file.name}" exceeds ${maxFileSize}MB limit`;
    }
    return null;
  }, [maxFileSize]);

  const validateFiles = useCallback((newFiles: File[]): { valid: File[], errors: string[] } => {
    const errors: string[] = [];
    const valid: File[] = [];

    if (files.length + newFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { valid: [], errors };
    }

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        valid.push(file);
      }
    });

    return { valid, errors };
  }, [files.length, maxFiles, validateFile]);

  // Event handlers
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setError(null);
    
    startTransition(() => {
      onSubmit?.(message.trim(), selectedModel, thinkingMode, files);
      setMessage('');
      setFiles([]);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
      }
    });
  }, [isSubmitDisabled, onSubmit, message, selectedModel, thinkingMode, files]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const { valid, errors } = validateFiles(selectedFiles);
    
    if (errors.length > 0) {
      setError(errors[0]);
    } else {
      setError(null);
      setFiles(prev => [...prev, ...valid]);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [validateFiles]);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !isSubmitDisabled) {
      e.preventDefault();
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(syntheticEvent);
    }
    if (e.key === 'Escape') {
      setIsModelDropdownOpen(false);
    }
  }, [handleSubmit, isSubmitDisabled]);

  const handleModelSelect = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    setIsModelDropdownOpen(false);
  }, []);

  const toggleThinkingMode = useCallback(() => {
    setThinkingMode(prev => !prev);
  }, []);

  const toggleModelDropdown = useCallback(() => {
    setIsModelDropdownOpen(prev => !prev);
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const { valid, errors } = validateFiles(droppedFiles);
    
    if (errors.length > 0) {
      setError(errors[0]);
    } else {
      setError(null);
      setFiles(prev => [...prev, ...valid]);
    }
  }, [validateFiles]);

  // Click outside handler with improved logic
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsModelDropdownOpen(false);
    }
  }, []);

  // Effect for click outside
  React.useEffect(() => {
    if (isModelDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isModelDropdownOpen, handleClickOutside]);


  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error display */}
        {error && (
          <div 
            className="bg-red-900/20 border border-red-600/30 text-red-400 px-4 py-2 rounded-lg text-sm"
            role="alert"
            aria-live="polite"
          >
            {error}
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-2 text-red-400 hover:text-red-300"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Input Area with Controls */}
        <div 
          className={`relative bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-200 ${
            dragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-neutral-700 hover:border-neutral-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept={ACCEPTED_FILE_TYPES}
            disabled={disabled}
            aria-label="Attach files"
          />

          {/* File attachment button */}
          <div className="absolute left-4 top-4 z-10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || files.length >= maxFiles}
              className="flex items-center justify-center w-8 h-8 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 bg-neutral-900/50 rounded-lg hover:bg-neutral-800/50 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none"
              title={`Attach files (${files.length}/${maxFiles})`}
              aria-label={`Attach files. Currently ${files.length} of ${maxFiles} files attached.`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              {files.length > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {files.length}
                </span>
              )}
            </button>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full bg-transparent border-none rounded-t-2xl pl-14 pr-4 pt-5 pb-4 text-neutral-100 placeholder-neutral-400 resize-none focus:ring-0 focus:outline-none min-h-[60px] max-h-[200px] overflow-y-auto disabled:cursor-not-allowed"
              rows={1}
              style={{ height: `${MIN_TEXTAREA_HEIGHT}px` }}
              aria-label="Message input"
              aria-describedby="keyboard-shortcut-hint"
            />
            {!disabled && (
              <div 
                id="keyboard-shortcut-hint"
                className="sr-only"
              >
                Press Ctrl+Enter or Cmd+Enter to send message
              </div>
            )}
          </div>

          {/* Drag overlay */}
          {dragActive && (
            <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-2xl flex items-center justify-center z-20">
              <div className="text-blue-400 text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium">Drop files here</p>
              </div>
            </div>
          )}

          {/* Separator */}
          <div className="border-t border-neutral-600"></div>

          {/* Bottom Section */}
          <div className="p-4 rounded-b-2xl">
            {/* File Preview */}
            {files.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2" role="list" aria-label="Attached files">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      role="listitem"
                      className="flex items-center gap-2 bg-neutral-800/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm border border-neutral-600 group"
                    >
                      <span className="text-neutral-300 text-xs truncate max-w-[150px]" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-neutral-500 text-xs">
                        ({(file.size / 1024 / 1024).toFixed(1)}MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        disabled={disabled}
                        className="text-neutral-400 hover:text-red-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500 focus:outline-none rounded"
                        aria-label={`Remove ${file.name}`}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Total size: {(totalFileSize / 1024 / 1024).toFixed(1)}MB
                </div>
              </div>
            )}

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Model Selection Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={toggleModelDropdown}
                    disabled={disabled}
                    className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 text-neutral-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center gap-2 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Current model: ${selectedModelData.name}`}
                    aria-expanded={isModelDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    {selectedModelData.icon}
                    <span>{selectedModelData.name}</span>
                    <svg
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                        isModelDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isModelDropdownOpen && (
                    <div 
                      className="absolute top-full mt-1 left-0 right-0 bg-neutral-800 border border-neutral-600 rounded-lg shadow-xl z-50 overflow-hidden"
                      role="listbox"
                      aria-label="Select AI model"
                    >
                      {MODELS.map((model) => (
                        <button
                          key={model.id}
                          type="button"
                          role="option"
                          aria-selected={selectedModel === model.id}
                          onClick={() => handleModelSelect(model.id)}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-neutral-700 transition-colors duration-200 focus:bg-neutral-700 focus:outline-none ${
                            selectedModel === model.id ? 'bg-neutral-700 text-blue-400' : 'text-neutral-100'
                          }`}
                        >
                          {model.icon}
                          <span className="flex-1">{model.name}</span>
                          {selectedModel === model.id && (
                            <svg
                              className="w-4 h-4 ml-auto text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thinking Mode Toggle */}
                <button
                  type="button"
                  onClick={toggleThinkingMode}
                  disabled={disabled}
                  className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-neutral-800/50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  title={`Thinking mode: ${thinkingMode ? 'On' : 'Off'}`}
                  aria-label={`Toggle thinking mode. Currently ${thinkingMode ? 'on' : 'off'}`}
                  aria-pressed={thinkingMode}
                >
                  <svg
                    className={`w-6 h-6 transition-colors duration-200 ${
                      thinkingMode ? 'text-green-500' : 'text-neutral-400'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M12 5a3 3 0 1 0-5.997.125a4 4 0 0 0-2.526 5.77a4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                      <path d="M12 5a3 3 0 1 1 5.997.125a4 4 0 0 1 2.526 5.77a4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                      <path d="M15 13a4.5 4.5 0 0 1-3-4a4.5 4.5 0 0 1-3 4m8.599-6.5a3 3 0 0 0 .399-1.375m-11.995 0A3 3 0 0 0 6.401 6.5m-2.924 4.396a4 4 0 0 1 .585-.396m15.876 0a4 4 0 0 1 .585.396M6 18a4 4 0 0 1-1.967-.516m15.934 0A4 4 0 0 1 18 18"/>
                    </g>
                  </svg>
                </button>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label={`Send message${files.length > 0 ? ` with ${files.length} file${files.length > 1 ? 's' : ''}` : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M3.402 6.673c-.26-2.334 2.143-4.048 4.266-3.042l11.944 5.658c2.288 1.083 2.288 4.339 0 5.422L7.668 20.37c-2.123 1.006-4.525-.708-4.266-3.042L3.882 13H12a1 1 0 1 0 0-2H3.883z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AIInput;