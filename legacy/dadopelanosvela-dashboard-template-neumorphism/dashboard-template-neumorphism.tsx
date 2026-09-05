import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'projects', icon: '📁', label: 'Proyects' },
    { id: 'tasks', icon: '✅', label: 'Tasks' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'team', icon: '👥', label: 'Team' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  };

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-300",
      isDarkMode ? "bg-gray-800" : "bg-gray-200"
    )}>
      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 ease-in-out p-4",
        isDarkMode ? "bg-gray-800" : "bg-gray-200",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className={cn(
          "h-full rounded-3xl p-6 transition-colors duration-300",
          
          isDarkMode 
            ? "bg-gray-800 shadow-[15px_15px_30px_#1a1a1a,-15px_-15px_30px_#404040]"
            : "bg-gray-200 shadow-[15px_15px_30px_#bebebe,-15px_-15px_30px_#ffffff]"
        )}>
          
          <div className="flex items-center justify-between mb-8">
            {!isCollapsed && (
              <div className={cn(
                "px-4 py-2 rounded-xl transition-colors duration-300",
                isDarkMode
                  ? "bg-gray-800 shadow-[inset_6px_6px_12px_#1a1a1a,inset_-6px_-6px_12px_#404040]"
                  : "bg-gray-200 shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff]"
              )}>
                <h1 className={cn(
                  "text-lg font-bold transition-colors duration-300",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>Template</h1>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                  isDarkMode
                    ? "bg-gray-800 text-yellow-400 shadow-[6px_6px_12px_#1a1a1a,-6px_-6px_12px_#404040] hover:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#404040]"
                    : "bg-gray-200 text-gray-600 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]",
                  "active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]"
                )}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          
          <nav className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 font-medium",
                  isDarkMode ? "bg-gray-800" : "bg-gray-200",
                  activeItem === item.id
                    ? isDarkMode
                      ? "shadow-[inset_8px_8px_16px_#1a1a1a,inset_-8px_-8px_16px_#404040] text-blue-400"
                      : "shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] text-blue-600"
                    : isDarkMode
                      ? "text-gray-400 shadow-[6px_6px_12px_#1a1a1a,-6px_-6px_12px_#404040] hover:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#404040] hover:text-blue-400"
                      : "text-gray-600 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] hover:text-blue-500",
                  isCollapsed && "justify-center"
                )}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          
          <div className={cn(
            "mt-8 pt-6 transition-colors duration-300",
            isDarkMode ? "border-t border-gray-600" : "border-t border-gray-300"
          )}>
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-colors duration-300",
              isDarkMode
                ? "bg-gray-800 shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#404040]"
                : "bg-gray-200 shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]",
              isCollapsed && "justify-center"
            )}>
             
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors duration-300",
                isDarkMode
                  ? "bg-gray-800 shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#404040]"
                  : "bg-gray-200 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"
              )}>
                👤
              </div>
              
              {!isCollapsed && (
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>DalexDev</p>
                  <p className={cn(
                    "text-xs transition-colors duration-300",
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  )}>byDalexDev@exm.com</p>
                </div>
              )}
            </div>
          </div>

          
          <div className="mt-4">
            <div className={cn(
              "flex items-center gap-2 p-2 rounded-lg transition-colors duration-300",
              isDarkMode
                ? "bg-gray-800 shadow-[inset_3px_3px_6px_#1a1a1a,inset_-3px_-3px_6px_#404040]"
                : "bg-gray-200 shadow-[inset_3px_3px_6px_#bebebe,inset_-3px_-3px_6px_#ffffff]",
              isCollapsed && "justify-center"
            )}>
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm"></div>
              {!isCollapsed && (
                <span className={cn(
                  "text-xs transition-colors duration-300",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>Online</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-8">
        <div className={cn(
          "h-full rounded-3xl p-8 transition-colors duration-300",
          isDarkMode
            ? "bg-gray-800 shadow-[inset_10px_10px_20px_#1a1a1a,inset_-10px_-10px_20px_#404040]"
            : "bg-gray-200 shadow-[inset_10px_10px_20px_#bebebe,inset_-10px_-10px_20px_#ffffff]"
        )}>
          <div className={cn(
            "h-full rounded-2xl p-6 flex flex-col items-center justify-center transition-colors duration-300",
            isDarkMode
              ? "bg-gray-800 shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#404040]"
              : "bg-gray-200 shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]"
          )}>
            <h2 className={cn(
              "text-3xl font-bold mb-4 transition-colors duration-300",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>
              {menuItems.find(item => item.id === activeItem)?.label}
            </h2>
            <p className={cn(
              "text-center max-w-md transition-colors duration-300",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
                You selected {menuItems.find(item => item.id === activeItem)?.label}.
                This is the main content area where the information corresponding to the selected section would be displayed.
            </p>
            
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={cn(
                    "w-24 h-24 rounded-2xl flex items-center justify-center font-bold transition-all duration-200",
                    isDarkMode
                      ? "bg-gray-800 text-gray-400 shadow-[6px_6px_12px_#1a1a1a,-6px_-6px_12px_#404040] hover:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#404040]"
                      : "bg-gray-200 text-gray-600 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]"
                  )}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};