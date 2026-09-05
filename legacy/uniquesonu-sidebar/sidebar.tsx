import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  Home,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { name: 'Home', icon: Home, href: '#' },
    { name: 'Analytics', icon: BarChart3, href: '#' },
    { name: 'Profile', icon: User, href: '#' },
    { name: 'Settings', icon: Settings, href: '#' },
    { name: 'Logout', icon: LogOut, href: '#' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="relative">
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors duration-200 shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-64 shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-white tracking-wide">
                Logo
              </h1>
            )}
          </div>
          
          {/* Desktop Collapse Button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors duration-200"
          >
            <ChevronLeft 
              size={20} 
              className={`transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => setActiveItem(item.name)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon 
                  size={20} 
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && (
                  <span className="font-medium transition-colors duration-200">
                    {item.name}
                  </span>
                )}
                
                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  John Doe
                </p>
                <p className="text-xs text-slate-400 truncate">
                  john@example.com
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div
        className={`lg:ml-64 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <div className="p-8 ml-16 lg:ml-0">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Welcome to {activeItem}
            </h2>
            <p className="text-slate-600 mb-6">
              This is the main content area. The sidebar is fully responsive and works great on both desktop and mobile devices.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Card {i}</h3>
                  <p className="text-slate-600 text-sm">
                    Sample content card to demonstrate the layout with the sidebar.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;