// Original floating dock navigation with smooth hover effects
// Inspired by macOS dock with unique interactions

import { cn } from "../_utils/cn";
import { useState } from "react";
import { Home, Search, Bell, User, Settings, Mail } from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export const FloatingDockNav = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems: NavItem[] = [
    { icon: <Home size={20} />, label: "Home" },
    { icon: <Search size={20} />, label: "Search" },
    { icon: <Bell size={20} />, label: "Notifications" },
    { icon: <Mail size={20} />, label: "Messages" },
    { icon: <User size={20} />, label: "Profile" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(hoveredIndex - index);
    if (distance === 0) return 1.4;
    if (distance === 1) return 1.2;
    if (distance === 2) return 1.1;
    return 1;
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-3 border border-gray-200/50">
        <div className="flex items-end gap-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative flex flex-col items-center justify-center",
                "rounded-xl transition-all duration-300 ease-out",
                "hover:bg-gray-100",
                activeIndex === index && "bg-blue-50"
              )}
              style={{
                width: '48px',
                height: '48px',
                transform: `scale(${getScale(index)})`,
                transformOrigin: 'bottom'
              }}
            >
              <div className={cn(
                "transition-colors duration-200",
                activeIndex === index ? "text-blue-600" : "text-gray-700"
              )}>
                {item.icon}
              </div>
              
              {/* Tooltip */}
              {hoveredIndex === index && (
                <div className="absolute bottom-full mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap">
                  {item.label}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                    <div className="border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              )}

              {/* Active indicator */}
              {activeIndex === index && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
