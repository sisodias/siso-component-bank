import React, { useState } from 'react';
import { Search, Calendar, MessageSquare, Bell, ChevronLeft, Sun, Moon } from 'lucide-react';

export default function ProjectMNavBar() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    } flex items-center justify-center p-4`}>
      <div className={`w-full max-w-6xl rounded-2xl border transition-all duration-300 ${
        isDark 
          ? 'bg-gray-800/70 backdrop-blur-lg border-gray-700/50 shadow-2xl shadow-black/20' 
          : 'bg-white/70 backdrop-blur-lg border-white/50 shadow-2xl shadow-gray-900/10'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          <button className={`p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm ${
            isDark 
              ? 'hover:bg-gray-700/50 text-gray-300 border border-gray-700/30' 
              : 'hover:bg-white/50 text-gray-600 border border-gray-200/30'
          }`}>
            <ChevronLeft size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="white" strokeWidth="2"/>
                <path d="M22 7L12 12L2 7" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <span className={`font-semibold text-lg ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Project M.
            </span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search for anything..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm backdrop-blur-sm ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-600/50 text-white placeholder-gray-400' 
                  : 'bg-white/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm ${
              isDark 
                ? 'hover:bg-gray-700/50 text-gray-300 border border-gray-700/30' 
                : 'hover:bg-white/50 text-gray-600 border border-gray-200/30'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Calendar Icon */}
          <button className={`p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm ${
            isDark 
              ? 'hover:bg-gray-700/50 text-gray-300 border border-gray-700/30' 
              : 'hover:bg-white/50 text-gray-600 border border-gray-200/30'
          }`}>
            <Calendar size={18} />
          </button>
          
          {/* Message Icon */}
          <button className={`p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm ${
            isDark 
              ? 'hover:bg-gray-700/50 text-gray-300 border border-gray-700/30' 
              : 'hover:bg-white/50 text-gray-600 border border-gray-200/30'
          }`}>
            <MessageSquare size={18} />
          </button>
          
          {/* Notification Icon */}
          <button className={`relative p-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm ${
            isDark 
              ? 'hover:bg-gray-700/50 text-gray-300 border border-gray-700/30' 
              : 'hover:bg-white/50 text-gray-600 border border-gray-200/30'
          }`}>
            <Bell size={18} />
          </button>

          {/* User Profile */}
          <div className={`flex items-center space-x-3 ml-4 pl-4 border-l backdrop-blur-sm ${
            isDark ? 'border-gray-600/50' : 'border-gray-300/50'
          }`}>
            <div className="text-right hidden sm:block">
              <p className={`font-medium text-sm ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Anima Agrawal
              </p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                U.P. India
              </p>
            </div>
            <button className="relative group">
              <img
                src="https://media.licdn.com/dms/image/v2/D5603AQFtCWvQWKvXag/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1724771332739?e=1755734400&v=beta&t=Mt3gUAHmbOahWjSiENemNGCz_nAuZvuTbfldDy9MuNU"
                alt="Ravi Katiyar"
                className={`w-8 h-8 rounded-full ring-2 group-hover:ring-white/40 transition-all duration-200 ${
                  isDark ? 'ring-white/20' : 'ring-gray-300/40'
                }`}
              />
            </button>
          </div>
        </div>
              </div>
      </div>
    </div>
  );
}