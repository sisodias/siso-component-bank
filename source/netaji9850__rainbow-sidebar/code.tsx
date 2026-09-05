"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  FolderOpen,
  MessageSquare,
  LogOut,
  Command
} from "lucide-react";

const customStyles = `
  @keyframes bg-spin {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-bg-spin {
    background-size: 200% 200%;
    animation: bg-spin 4s linear infinite;
  }
`;

export function Component({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(true); 
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Analytics", icon: BarChart3 },
    { name: "Projects", icon: FolderOpen },
    { name: "Team", icon: Users },
    { name: "Messages", icon: MessageSquare },
    { name: "Settings", icon: Settings },
  ];

  return (
    <>
      <style>{customStyles}</style>
      
      <div 
        className={cn(
            "relative flex flex-col h-screen z-50 p-4 transition-all duration-300 ease-in-out shrink-0", 
            isCollapsed ? "w-[100px]" : "w-[340px]",
            className
        )}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
          {/* Background Glow */}
          <div
            className={cn(
              "absolute inset-4 rounded-[28px] animate-bg-spin blur-xl transition-all duration-500 -z-10",
              !isCollapsed 
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 opacity-70" 
                : "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30" 
            )}
          />

          <aside
            className={cn(
              "flex h-full w-full flex-col overflow-hidden rounded-[24px] border transition-all duration-300 shadow-xl",
              "bg-white/80 border-white/50 backdrop-blur-xl",
              "dark:bg-zinc-900/90 dark:border-zinc-800/50"
            )}
          >
            {/* --- HEADER FIX ---
               1. Removed 'px-6', changed to 'px-4' to match Nav Items exactly.
               2. Ensure the 'Logo Box' (h-10 w-10) is centered exactly like the Nav Items.
            */}
            <div className={cn(
                "flex items-center h-20 w-full transition-all duration-300",
                // Both states now use px-4 (or equiv spacing) to ensure left-alignment is identical when open
                isCollapsed ? "justify-center" : "justify-start px-4 gap-3" 
            )}>
                {/* Logo Box */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                    <Command size={22} />
                </div>
                
                {/* Text Container */}
                <div className={cn(
                    "flex flex-col transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden",
                     isCollapsed ? "opacity-0 w-0 scale-90" : "opacity-100 w-auto scale-100"
                )}>
                    <span className="font-bold text-lg text-gray-800 dark:text-zinc-100 tracking-tight leading-none">
                        Acme Corp
                    </span>
                    <span className="text-[12px] text-gray-500 font-medium">Enterprise</span>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-2 px-3 py-4 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.name;

                    return (
                        <button
                            key={item.name}
                            onClick={() => setActiveItem(item.name)}
                            className={cn(
                                "group relative flex items-center w-full rounded-xl transition-all duration-200 overflow-hidden whitespace-nowrap",
                                // MATCHING ALIGNMENT:
                                // Collapsed: center. Expanded: px-4 (Matches Header exactly)
                                isCollapsed ? "justify-center px-0 py-3" : "justify-start px-4 py-3 gap-3",
                                isActive 
                                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                                    : "text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
                            )}
                        >
                            {/* Icon Wrapper: We don't use a background box here, but we center the icon */}
                            <Icon 
                                size={22} 
                                className={cn(
                                    "shrink-0 transition-transform duration-300", 
                                    !isActive && "group-hover:scale-110",
                                    isActive && "scale-105"
                                )} 
                            />
                            
                            <span className={cn(
                                "font-medium text-sm transition-all duration-300 origin-left",
                                isCollapsed ? "opacity-0 w-0 -translate-x-4" : "opacity-100 w-auto translate-x-0"
                            )}>
                                {item.name}
                            </span>

                            {isActive && isCollapsed && (
                                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-zinc-900" />
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-3 border-t border-gray-200 dark:border-zinc-800/50">
                <button className={cn(
                    "flex items-center w-full rounded-xl transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/10 group overflow-hidden whitespace-nowrap",
                    // Footer Alignment matches Header and Nav
                    isCollapsed ? "justify-center p-2" : "p-3 gap-3"
                )}>
                    <div className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 transition-colors",
                        "group-hover:text-red-500 dark:group-hover:text-red-400"
                    )}>
                       <LogOut size={18} className="ml-0.5" />
                    </div>
                    
                    <div className={cn(
                        "flex flex-col items-start text-sm transition-all duration-300 origin-left",
                        isCollapsed ? "opacity-0 w-0 -translate-x-4" : "opacity-100 w-auto translate-x-0"
                    )}>
                        <span className="font-semibold text-gray-700 dark:text-zinc-200">Logout</span>
                        <span className="text-xs text-gray-400">jdoe@acme.com</span>
                    </div>
                </button>
            </div>
          </aside>
      </div>
    </>
  );
}