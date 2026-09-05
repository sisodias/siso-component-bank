import React, { useState } from 'react';
import { ChevronRight, ChevronDown, MoreHorizontal, Sun, Moon } from 'lucide-react';

const Breadcrumb = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'
    }`}>
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
              : 'bg-white hover:bg-gray-100 text-gray-600 shadow-sm border'
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Breadcrumb Container */}
      <div className="pt-20 px-8">
        <nav className="flex items-center space-x-1 text-sm">
          {/* Home */}
          <button className={`px-2 py-1 rounded transition-colors ${
            isDarkMode 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}>
            Home
          </button>

          {/* Separator */}
          <ChevronRight size={16} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />

          {/* Dropdown Section */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className={`flex items-center px-2 py-1 rounded transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <MoreHorizontal size={16} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Dropdown Content */}
                <div className={`absolute top-full left-0 mt-1 z-20 w-40 rounded-md shadow-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="py-1">
                    <button className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}>
                      Documentation
                    </button>
                    <button className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}>
                      Themes
                    </button>
                    <button className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}>
                      GitHub
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Separator */}
          <ChevronRight size={16} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />

          {/* Components */}
          <button className={`px-2 py-1 rounded transition-colors ${
            isDarkMode 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}>
            Components
          </button>

          {/* Separator */}
          <ChevronRight size={16} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />

          {/* Current Page - Breadcrumb */}
          <span className={`px-2 py-1 font-medium ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Breadcrumb
          </span>
        </nav>
      </div>

      {/* Demo Content */}
      <div className="px-8 mt-8">
        <div className={`p-6 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm border'
        }`}>
          <h2 className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Breadcrumb Component
          </h2>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            This breadcrumb component supports both light and dark modes. Click the theme toggle in the top-right corner to switch between modes. The dropdown menu contains the items from your screenshot: Documentation, Themes, and GitHub.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;