"use client";

import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  CreditCard,
  User,
  DollarSign,
  BookOpen,
  Users,
  Key,
  Package,
  Globe,
} from "lucide-react";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 border-r border-[#2a2a2a] h-screen flex flex-col">
      {/* Logo */}
      <div className="px-4 py-6 border-b border-[#2a2a2a]">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5plHQknLLapYpgAZtf-XVSdel1RsS8ANT2A&s"
          alt="Acme"
          className="w-32 h-auto"
        />
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-4 overflow-y-auto">
        {/* Get Free Credits */}
        <div className="px-4 mb-4">
          <button className="w-full flex items-center px-3 py-2 text-sm text-green-400 bg-green-900/20 rounded-md hover:bg-green-900/30 transition-colors">
            <DollarSign className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">Get Free Credits</span>
            <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded">
              Free
            </span>
          </button>
        </div>

        {/* Invite */}
        <div className="px-4 mb-4">
          <button
            onClick={() => handleNavigation("/dashboard/invite")}
            className={`w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md ${
              isActive("/dashboard/invite")
                ? "bg-[#2a2a2a] text-white font-medium"
                : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
            }`}
          >
            <User className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">Invite</span>
          </button>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1 px-4 mb-6 border-t border-[#2a2a2a] pt-4">
          <button
            onClick={() => handleNavigation("/dashboard/projects")}
            className={`w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md ${
              isActive("/dashboard/projects")
                ? "bg-[#2a2a2a] text-white font-medium"
                : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
            }`}
          >
            <Home className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">Projects</span>
          </button>

          <button
            onClick={() => handleNavigation("/dashboard/community")}
            className={`w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md ${
              isActive("/dashboard/community")
                ? "bg-[#2a2a2a] text-white font-medium"
                : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">Community</span>
          </button>

          <button
            onClick={() => handleNavigation("/dashboard/api-keys")}
            className={`w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md ${
              isActive("/dashboard/api-keys")
                ? "bg-[#2a2a2a] text-white font-medium"
                : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
            }`}
          >
            <Key className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">API Keys</span>
          </button>

          <button
            onClick={() => handleNavigation("/dashboard/integration")}
            className={`w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md ${
              isActive("/dashboard/integration")
                ? "bg-[#2a2a2a] text-white font-medium"
                : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
            }`}
          >
            <Package className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">Integrations</span>
          </button>
        </div>

        {/* Docs and Follow Us */}
        <div className="space-y-1 px-4 mb-6 border-t border-[#2a2a2a] pt-4">
          <button
            onClick={() => handleNavigation("/dashboard/docs")}
            className={`w-full flex items-center px-3 py-2 text-sm transition-colors rounded-md ${
              isActive("/dashboard/docs")
                ? "bg-[#2a2a2a] text-white font-medium"
                : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">Docs</span>
          </button>

          <button
            onClick={() => window.open("https://twitter.com/acme", "_blank")}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors rounded-md"
          >
            <Users className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">Follow us for updates</span>
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#2a2a2a] py-4">
        {/* Upgrade to Pro */}
        <div className="px-4 mb-4">
          <button className="w-full flex items-center px-3 py-2 text-sm text-blue-400 bg-blue-900/20 rounded-md hover:bg-blue-900/30 transition-colors">
            <CreditCard className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">Upgrade to Pro</span>
            <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">
              Pro
            </span>
          </button>
        </div>

        <div className="px-4">
          <div className="flex items-center px-3 py-2 bg-[#2a2a2a] rounded-md cursor-pointer hover:bg-[#3a3a3a] transition-colors">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold">
              B
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm text-gray-400 truncate">
                bhomikproductivitylab@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
