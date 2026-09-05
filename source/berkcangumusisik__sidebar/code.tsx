import React, { useState } from 'react';
import { 
  Home, 
  User, 
  Settings, 
  Bell, 
  Search, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  Calendar,
  LogOut,
  Mail,
  Bookmark
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

export const MinimalIconSidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('home');

  const menuItems: MenuItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 7 },
    { id: 'mail', label: 'Mail', icon: Mail },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  return (
    <>
      {/* Sidebar Container */}
      <div className="fixed left-6 top-6 bottom-6 w-16 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden z-50">
        
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4 space-y-2 px-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <div
                key={item.id}
                className="relative group"
                onClick={() => handleItemClick(item.id)}
              >
                <button
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg transform scale-110' 
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50 hover:scale-105'
                    }
                  `}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  <Icon className="w-5 h-5 transition-transform duration-300" />
                  
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1">
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    </div>
                  )}
                </button>

                {/* Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 delay-300">
                  <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {/* Tooltip Arrow */}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-r-4 border-r-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="p-2 border-t border-gray-100">
          <div className="relative group">
            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 hover:scale-105">
              <LogOut className="w-5 h-5" />
            </button>
            
            {/* Logout Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 delay-300">
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                Logout
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-r-4 border-r-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
};