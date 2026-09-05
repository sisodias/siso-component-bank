import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Moon, Sun } from 'lucide-react';

/**
 * Pagination Component
 * 
 * A fully responsive, animated pagination component with dark/light mode support.
 * 
 * @param {Object} props - Component props
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.currentPage - Current active page
 * @param {function} props.onPageChange - Callback function when page changes
 * @param {boolean} props.isDark - Theme mode (true for dark, false for light)
 * 
 * @example
 * <Pagination
 *   totalPages={20}
 *   currentPage={5}
 *   onPageChange={(page) => console.log(page)}
 *   isDark={true}
 * />
 */
const Pagination = ({ totalPages, currentPage, onPageChange, isDark }) => {
  /**
   * Generates array of page numbers with ellipsis for large page counts
   * Logic:
   * - If total pages <= 7, show all pages
   * - If current page is near start (≤3), show first 4 pages + ellipsis + last page
   * - If current page is near end (≥totalPages-2), show first page + ellipsis + last 4 pages
   * - Otherwise, show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
   * 
   * @returns {Array} Array of page numbers and ellipsis strings
   */
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    // Show all pages if total is 7 or less
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Current page is near the beginning
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    // Current page is near the end
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // Current page is in the middle
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pageNumbers = getPageNumbers();

  // Theme-based colors
  const colors = {
    button: {
      bg: isDark ? '#1f2937' : '#ffffff',
      text: isDark ? '#e5e7eb' : '#1f2937'
    },
    active: {
      bg: isDark ? '#ffffff' : '#111827',
      text: isDark ? '#111827' : '#ffffff'
    },
    ellipsis: isDark ? '#9ca3af' : '#6b7280'
  };

  return (
    <div className="w-screen flex items-center justify-center gap-1 sm:gap-2">
      {/* Jump to First Page Button - Hidden on mobile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="hidden sm:flex items-center justify-center w-9 h-9 rounded disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-xl transition-all"
        style={{ 
          backgroundColor: colors.button.bg,
          color: colors.button.text
        }}
        aria-label="Go to first page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </motion.button>

      {/* Previous Page Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 rounded disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-xl transition-all"
        style={{ 
          backgroundColor: colors.button.bg,
          color: colors.button.text
        }}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-2">
        <AnimatePresence mode="popLayout">
          {pageNumbers.map((page, index) => (
            <motion.div
              key={`${page}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {page === '...' ? (
                // Ellipsis for skipped pages
                <span 
                  className="w-9 h-9 flex items-center justify-center font-medium" 
                  style={{ color: colors.ellipsis }}
                  aria-hidden="true"
                >
                  ...
                </span>
              ) : (
                // Individual page button
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(page)}
                  className={`relative w-9 h-9 rounded font-semibold text-sm transition-all overflow-hidden ${
                    currentPage === page
                      ? 'shadow-xl'
                      : 'shadow-md hover:shadow-xl'
                  }`}
                  style={currentPage === page ? {} : {
                    backgroundColor: colors.button.bg,
                    color: colors.button.text
                  }}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {/* Animated background for active page */}
                  {currentPage === page && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0"
                      style={{ backgroundColor: colors.active.bg }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span 
                    className="relative z-10" 
                    style={currentPage === page ? { color: colors.active.text } : {}}
                  >
                    {page}
                  </span>
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Next Page Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-xl transition-all"
        style={{ 
          backgroundColor: colors.button.bg,
          color: colors.button.text
        }}
        aria-label="Go to next page"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>

      {/* Jump to Last Page Button - Hidden on mobile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-xl transition-all"
        style={{ 
          backgroundColor: colors.button.bg,
          color: colors.button.text
        }}
        aria-label="Go to last page"
      >
        <ChevronsRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

/**
 * Demo Application Component
 * 
 * Demonstrates the Pagination component with theme switching functionality.
 * This serves as both a demo and a template for implementation.
 */
const App = () => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [isDark, setIsDark] = useState(true);
  
  // Configuration
  const totalPages = 20;

  /**
   * Handles page change events
   * @param {number} page - The page number to navigate to
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Add your custom logic here (e.g., fetch data, scroll to top, etc.)
    console.log(`Navigated to page ${page}`);
  };

  /**
   * Toggles between dark and light theme
   */
  const toggleTheme = () => {
    setIsDark(prevIsDark => !prevIsDark);
  };

  // Theme-based colors for the demo
  const themeColors = {
    background: isDark ? '#030712' : '#f3f4f6',
    card: isDark ? '#111827' : '#ffffff',
    heading: isDark ? '#ffffff' : '#111827',
    subtext: isDark ? '#9ca3af' : '#4b5563',
    contentText: isDark ? '#d1d5db' : '#374151',
    itemBg: isDark ? '#1f2937' : '#f3f4f6',
    itemText: isDark ? '#ffffff' : '#111827',
    themeButton: {
      bg: isDark ? '#ffffff' : '#111827',
      text: isDark ? '#111827' : '#ffffff'
    },
    footer: isDark ? '#9ca3af' : '#4b5563'
  };

  return (
    <div 
      className={isDark ? 'dark' : ''} 
      style={{ colorScheme: isDark ? 'dark' : 'light' }}
    >
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-300 relative"
        style={{ backgroundColor: themeColors.background }}
      >
        {/* Orthogonal Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl relative z-10"
        >
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ color: themeColors.heading }}
              >
                Pagination Component
              </h1>
              <p 
                className="text-sm sm:text-base font-medium"
                style={{ color: themeColors.subtext }}
              >
                Page {currentPage} of {totalPages}
              </p>
            </div>
            
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all"
              style={{ 
                backgroundColor: themeColors.themeButton.bg,
                color: themeColors.themeButton.text
              }}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl shadow-2xl p-8 sm:p-12 mb-8"
            style={{ backgroundColor: themeColors.card }}
          >
            {/* Page Number Display */}
            <div className="text-center mb-8">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-7xl sm:text-8xl font-black mb-4"
                style={{ color: themeColors.heading }}
              >
                {currentPage}
              </motion.div>
              <p 
                className="text-base sm:text-lg font-medium"
                style={{ color: themeColors.contentText }}
              >
                Content for page {currentPage}
              </p>
            </div>

            {/* Demo Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item * 0.1 }}
                  className="p-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: themeColors.itemBg }}
                >
                  <div 
                    className="h-24 flex items-center justify-center font-semibold"
                    style={{ color: themeColors.itemText }}
                  >
                    Item {(currentPage - 1) * 3 + item}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Component */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              isDark={isDark}
            />
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm font-medium"
            style={{ color: themeColors.footer }}
          >
            <p>Built with React, Framer Motion, Tailwind CSS & shadcn/ui</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default App;