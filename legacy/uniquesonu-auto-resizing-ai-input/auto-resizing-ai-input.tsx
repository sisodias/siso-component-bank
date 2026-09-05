import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Paperclip, Plus, Send, X, Sparkles } from 'lucide-react';

function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(
    (reset) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const MIN_HEIGHT = 56;
const MAX_HEIGHT = 200;

const AnimatedPlaceholder = ({ showSearch }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={showSearch ? "search" : "ask"}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pointer-events-none flex items-center gap-2 text-slate-500 dark:text-slate-400"
    >
      {showSearch ? (
        <>
          <Globe className="w-4 h-4" />
          <span>Search the web for real-time information...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span>Ask AI anything...</span>
        </>
      )}
    </motion.div>
  </AnimatePresence>
);

export default function ModernAiInput() {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });
  const [showSearch, setShowSearch] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = () => {
    if (!value.trim() && !imagePreview) return;
    console.log('Submitting:', { text: value, hasImage: !!imagePreview, useSearch: showSearch });
    setValue("");
    adjustHeight(true);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const canSubmit = value.trim() || imagePreview;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div 
        className={`relative transition-all duration-300 ${
          isDragOver ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Main Input Container */}
        <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
          
          {/* Image Preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border-b border-gray-100 dark:border-gray-800"
              >
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700"
                  />
                  <button
                    onClick={handleImageClose}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Input Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder=""
              className="w-full px-6 py-4 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-gray-100 text-base leading-relaxed placeholder-transparent"
              style={{ minHeight: MIN_HEIGHT, maxHeight: MAX_HEIGHT }}
            />
            
            {/* Animated Placeholder */}
            {!value && (
              <div className="absolute left-6 top-4">
                <AnimatedPlaceholder showSearch={showSearch} />
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl">
            
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              
              {/* File Upload */}
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer p-2.5 rounded-xl transition-all duration-200 ${
                  imagePreview
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Paperclip className="w-4 h-4" />
              </motion.label>

              {/* Search Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(!showSearch)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                  showSearch
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <motion.div
                  animate={{ rotate: showSearch ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Globe className="w-4 h-4" />
                </motion.div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium overflow-hidden whitespace-nowrap"
                    >
                      Web Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              
              {/* Character Count (optional) */}
              {value && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-gray-400 dark:text-gray-500 px-2"
                >
                  {value.length}
                </motion.div>
              )}

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: canSubmit ? 1.05 : 1 }}
                whileTap={{ scale: canSubmit ? 0.95 : 1 }}
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  canSubmit
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm border border-emerald-200 dark:border-emerald-800">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Web search enabled
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag & Drop Overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 border-2 border-dashed border-blue-500 dark:border-blue-400 rounded-2xl flex items-center justify-center backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  <Paperclip className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Drop your image here
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}