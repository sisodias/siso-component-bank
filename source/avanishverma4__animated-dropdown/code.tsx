import React, { useState } from 'react';
import { ChevronDown, Star, TrendingUp, Sparkles, Moon, Sun } from 'lucide-react';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Featured');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const categories = [
    {
      id: 'featured',
      name: 'Featured',
      icon: Star,
      description: 'Discover handpicked content',
      badge: null,
      timestamp: 'Just now'
    },
    {
      id: 'popular',
      name: 'Popular',
      icon: TrendingUp,
      description: 'Trending across the platform',
      badge: null,
      timestamp: '2 days ago'
    },
    {
      id: 'new',
      name: 'New',
      icon: Sparkles,
      description: 'Latest updates and features',
      badge: 'New',
      timestamp: 'Today'
    }
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
    setIsOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const selectedCat = categories.find(cat => cat.name === selectedCategory);
  const SelectedIcon = selectedCat ? selectedCat.icon : Star;

  const gridBackgroundStyle = {
    backgroundImage: isDarkMode 
      ? 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
      : 'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
    backgroundSize: '20px 20px'
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`} style={gridBackgroundStyle}>
      
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
            : 'bg-white text-gray-600 hover:bg-gray-100'
        } shadow-lg hover:shadow-xl transform hover:scale-105 z-30`}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="relative inline-block text-left z-10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center justify-between w-48 px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
            isDarkMode
              ? 'text-gray-200 bg-gray-800 border border-gray-700 hover:bg-gray-700 focus:ring-blue-400'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500'
          }`}
        >
          <div className="flex items-center space-x-2">
            <SelectedIcon className="w-4 h-4" />
            <span>{selectedCategory}</span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            <div className={`absolute right-0 z-20 w-80 mt-2 origin-top-right border divide-y rounded-lg shadow-lg ring-1 ring-opacity-5 transition-colors duration-200 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 divide-gray-700 ring-black'
                : 'bg-white border-gray-200 divide-gray-100 ring-black'
            }`}>
              <div className={`px-4 py-3 rounded-t-lg ${
                isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
              }`}>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>Categories</p>
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Choose your content preference</p>
              </div>
              
              <div className="py-1">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full px-4 py-3 text-left transition-colors duration-150 group ${
                        isDarkMode
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-50'
                      } ${
                        selectedCategory === category.name 
                          ? isDarkMode 
                            ? 'bg-blue-900 border-r-2 border-blue-400' 
                            : 'bg-blue-50 border-r-2 border-blue-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 p-2 rounded-full group-hover:scale-110 transition-transform duration-200 ${
                          category.id === 'featured' 
                            ? isDarkMode ? 'bg-amber-900 text-amber-300' : 'bg-amber-100 text-amber-600'
                            : category.id === 'popular' 
                            ? isDarkMode ? 'bg-rose-900 text-rose-300' : 'bg-rose-100 text-rose-600'
                            : isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              selectedCategory === category.name 
                                ? isDarkMode ? 'text-blue-200' : 'text-blue-900'
                                : isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            } ${isDarkMode ? 'group-hover:text-gray-100' : 'group-hover:text-gray-900'}`}>
                              {category.name}
                            </p>
                            {category.badge && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium animate-pulse ${
                                isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {category.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {category.description}
                          </p>
                          <p className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {category.timestamp}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className={`px-4 py-2 rounded-b-lg ${
                isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
              }`}>
                <p className={`text-xs text-center ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Latest updates and features
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
