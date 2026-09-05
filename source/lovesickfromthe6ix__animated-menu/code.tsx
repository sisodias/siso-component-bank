import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const baseClasses = "relative w-12 h-12 flex flex-col justify-center items-center bg-transparent border-none cursor-pointer focus:outline-none rounded-md transition-all duration-300 ease-in-out p-2";

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300"
    )}>
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4">
        <button
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-lg transition-all duration-300",
            isDarkMode 
              ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" 
              : "bg-white hover:bg-gray-100 text-gray-800 shadow-md"
          )}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Menu Container */}
      <div className="p-8">
        <button 
          onClick={toggleMenu} 
          className={cn(
            baseClasses,
            isDarkMode 
              ? "hover:bg-gray-800" 
              : "hover:bg-gray-200"
          )}
        >
          <span className={cn(
            "absolute w-6 h-0.5 rounded-full transition-all duration-300 ease-in-out transform-gpu",
            isDarkMode ? "bg-white" : "bg-gray-800",
            isOpen ? "rotate-45" : "rotate-90"
          )} />
          <span className={cn(
            "absolute w-6 h-0.5 rounded-full transition-all duration-300 ease-in-out transform-gpu",
            isDarkMode ? "bg-white" : "bg-gray-800",
            isOpen ? "-rotate-45" : "rotate-0"
          )} />
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out rounded-lg mt-2",
            isDarkMode 
              ? "bg-gray-800" 
              : "bg-white shadow-lg",
            isOpen 
              ? "max-h-48 opacity-100 py-4 px-6" 
              : "max-h-0 opacity-0 py-0 px-6"
          )}
        >
          <nav className="flex flex-col gap-2">
            <a 
              href="#" 
              className={cn(
                "transition-colors py-1",
                isDarkMode 
                  ? "text-gray-300 hover:text-red-400" 
                  : "text-gray-700 hover:text-red-600"
              )}
            >
              Home
            </a>
            <a 
              href="#" 
              className={cn(
                "transition-colors py-1",
                isDarkMode 
                  ? "text-gray-300 hover:text-red-400" 
                  : "text-gray-700 hover:text-red-600"
              )}
            >
              About
            </a>
            <a 
              href="#" 
              className={cn(
                "transition-colors py-1",
                isDarkMode 
                  ? "text-gray-300 hover:text-red-400" 
                  : "text-gray-700 hover:text-red-600"
              )}
            >
              Services
            </a>
            <a 
              href="#" 
              className={cn(
                "transition-colors py-1",
                isDarkMode 
                  ? "text-gray-300 hover:text-red-400" 
                  : "text-gray-700 hover:text-red-600"
              )}
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};