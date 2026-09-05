import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [activeTab, setActiveTab] = useState<"tsx" | "css">("tsx");
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-6 transition-all duration-500 ease-in-out", 
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>

      {/* Enhanced glassmorphism container with multiple depth layers */}
      <div className="relative">
        {/* Background glow effect - adaptive to theme */}
        <div className={cn(
          "absolute -inset-1 rounded-3xl blur-xl opacity-60 animate-pulse transition-all duration-500 ease-in-out",
          isDarkMode 
            ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20"
            : "bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-blue-400/30"
        )}></div>
        
        {/* Main glassmorphism container - adaptive to theme */}
        <div className={cn(
          "relative backdrop-blur-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all duration-500 ease-in-out",
          isDarkMode 
            ? "bg-black/10 border-white/20" 
            : "bg-white/20 border-gray-300/30"
        )}>
          {/* Inner glass layer for extra depth - adaptive to theme */}
          <div className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-500 ease-in-out",
            isDarkMode 
              ? "bg-gradient-to-br from-white/5 via-transparent to-black/20"
              : "bg-gradient-to-br from-white/30 via-transparent to-gray-200/20"
          )}></div>
          
          {/* Tab Bar with enhanced glassmorphism - adaptive to theme */}
          <div className={cn(
            "relative flex items-center backdrop-blur-xl border-b shadow-lg transition-all duration-500 ease-in-out",
            isDarkMode 
              ? "bg-black/20 border-white/20" 
              : "bg-white/30 border-gray-300/30"
          )}>
            {/* Enhanced close buttons with glassmorphism - adaptive to theme */}
            <div className="flex gap-1.5 px-4 py-3">
              <div className={cn(
                "w-3 h-3 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out hover:scale-110",
                isDarkMode 
                  ? "bg-red-500/90 border-red-400/30 hover:shadow-red-500/50"
                  : "bg-red-500/80 border-red-400/50 hover:shadow-red-500/40"
              )}></div>
              <div className={cn(
                "w-3 h-3 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out hover:scale-110",
                isDarkMode 
                  ? "bg-yellow-500/90 border-yellow-400/30 hover:shadow-yellow-500/50"
                  : "bg-yellow-500/80 border-yellow-400/50 hover:shadow-yellow-500/40"
              )}></div>
              <div className={cn(
                "w-3 h-3 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out hover:scale-110",
                isDarkMode 
                  ? "bg-green-500/90 border-green-400/30 hover:shadow-green-500/50"
                  : "bg-green-500/80 border-green-400/50 hover:shadow-green-500/40"
              )}></div>
            </div>
            
            {/* Enhanced TSX Tab - adaptive to theme */}
            <div
              className={cn(
                "flex items-center gap-3 px-6 py-4 cursor-pointer transition-all duration-500 ease-in-out group relative overflow-hidden",
                activeTab === "tsx"
                  ? cn(
                      "backdrop-blur-xl border-r shadow-lg",
                      isDarkMode 
                        ? "bg-gradient-to-r from-blue-500/20 to-blue-600/30 border-white/10"
                        : "bg-gradient-to-r from-blue-400/30 to-blue-500/40 border-gray-300/20"
                    )
                  : cn(
                      "hover:backdrop-blur-lg",
                      isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100/20"
                    )
              )}
              onMouseEnter={() => setActiveTab("tsx")}
            >
              {/* Animated background gradient - adaptive to theme */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out",
                isDarkMode 
                  ? "via-white/5" 
                  : "via-gray-200/10"
              )}></div>
              
              {/* Enhanced React icon with glassmorphism - adaptive to theme */}
              <div className={cn(
                "relative w-5 h-5 rounded-sm backdrop-blur-sm flex items-center justify-center border shadow-lg transition-all duration-300 ease-in-out group-hover:scale-110",
                isDarkMode 
                  ? "bg-blue-500/30 border-blue-400/30 group-hover:shadow-blue-500/50"
                  : "bg-blue-500/40 border-blue-400/50 group-hover:shadow-blue-500/40"
              )}>
                <svg className={cn(
                  "w-3 h-3 transition-all duration-300 ease-in-out",
                  isDarkMode 
                    ? "text-blue-300 group-hover:text-blue-200"
                    : "text-blue-600 group-hover:text-blue-700"
                )} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.866.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.788-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
                </svg>
              </div>
              
              <span className={cn(
                "relative text-sm font-medium transition-all duration-300 ease-in-out",
                isDarkMode 
                  ? "text-gray-200 group-hover:text-white"
                  : "text-gray-700 group-hover:text-gray-900"
              )}>page.tsx</span>
              
              {/* Enhanced active indicator - adaptive to theme */}
              {activeTab === "tsx" && (
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 shadow-lg transition-all duration-500 ease-in-out",
                  isDarkMode 
                    ? "bg-gradient-to-r from-blue-400/80 to-blue-600/80 shadow-blue-500/50"
                    : "bg-gradient-to-r from-blue-500/90 to-blue-600/90 shadow-blue-500/40"
                )}></div>
              )}
            </div>

            {/* Enhanced CSS Tab - adaptive to theme */}
            <div
              className={cn(
                "flex items-center gap-3 px-6 py-4 cursor-pointer transition-all duration-500 ease-in-out group relative overflow-hidden",
                activeTab === "css"
                  ? cn(
                      "backdrop-blur-xl border-r shadow-lg",
                      isDarkMode 
                        ? "bg-gradient-to-r from-purple-500/20 to-purple-600/30 border-white/10"
                        : "bg-gradient-to-r from-purple-400/30 to-purple-500/40 border-gray-300/20"
                    )
                  : cn(
                      "hover:backdrop-blur-lg",
                      isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100/20"
                    )
              )}
              onMouseEnter={() => setActiveTab("css")}
            >
              {/* Animated background gradient - adaptive to theme */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out",
                isDarkMode 
                  ? "via-white/5" 
                  : "via-gray-200/10"
              )}></div>
              
              {/* Enhanced CSS icon with glassmorphism - adaptive to theme */}
              <div className={cn(
                "relative w-5 h-5 rounded-sm backdrop-blur-sm flex items-center justify-center border shadow-lg transition-all duration-300 ease-in-out group-hover:scale-110",
                isDarkMode 
                  ? "bg-purple-500/30 border-purple-400/30 group-hover:shadow-purple-500/50"
                  : "bg-purple-500/40 border-purple-400/50 group-hover:shadow-purple-500/40"
              )}>
                <svg className={cn(
                  "w-3 h-3 transition-all duration-300 ease-in-out",
                  isDarkMode 
                    ? "text-purple-300 group-hover:text-purple-200"
                    : "text-purple-600 group-hover:text-purple-700"
                )} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.413l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
                </svg>
              </div>
              
              <span className={cn(
                "relative text-sm font-medium transition-all duration-300 ease-in-out",
                isDarkMode 
                  ? "text-gray-300 group-hover:text-white"
                  : "text-gray-600 group-hover:text-gray-800"
              )}>globals.css</span>
              
              {/* Enhanced active indicator - adaptive to theme */}
              {activeTab === "css" && (
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 shadow-lg transition-all duration-500 ease-in-out",
                  isDarkMode 
                    ? "bg-gradient-to-r from-purple-400/80 to-purple-600/80 shadow-purple-500/50"
                    : "bg-gradient-to-r from-purple-500/90 to-purple-600/90 shadow-purple-500/40"
                )}></div>
              )}
            </div>
          </div>

          {/* Enhanced Code Content with layered glassmorphism - adaptive to theme */}
          <div className={cn(
            "relative backdrop-blur-2xl min-h-[500px] p-6 font-mono text-sm leading-relaxed transition-all duration-500 ease-in-out",
            isDarkMode 
              ? "bg-black/20" 
              : "bg-white/30"
          )}>
            {/* Inner content layer */}
            <div className="relative z-10">
              {activeTab === "tsx" ? (
                <div className="space-y-1">
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>import</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>{"{ cn }"}</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>from</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"@/lib/utils"</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>;</span>
                  </div>
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>import</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>clsx</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>from</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"clsx"</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>;</span>
                  </div>
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>import</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>{"{ PropsWithChildren }"}</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>from</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"react"</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>;</span>
                  </div>
                  
                  <div className="pt-4"></div>
                  
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>type</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>NoteProps</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>=</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>PropsWithChildren</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>&</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>{"{"}</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>title?</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>:</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-300" : "text-green-600")}>string</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>;</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>type?</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>:</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"note"</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>|</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"danger"</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>|</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"warning"</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>|</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"success"</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>;</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>className?</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>:</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-300" : "text-green-600")}>string</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>;</span>
                  </div>
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-yellow-300 hover:text-yellow-200" : "text-yellow-600 hover:text-yellow-700"
                  )}>{"}"}<span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>;</span></div>
                  
                  <div className="pt-4"></div>
                  
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>export default function</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>Note</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>{"({"}</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>children</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>,</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>title</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>=</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"Note"</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>,</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>type</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>=</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"note"</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>,</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>className</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>,</span>
                  </div>
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-yellow-300 hover:text-yellow-200" : "text-yellow-600 hover:text-yellow-700"
                  )}>{"}: NoteProps) {"}</div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>@import</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"tailwindcss"</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>;</span>
                  </div>
                  
                  <div className="pt-2"></div>
                  
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>@plugin</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"tailwindcss-animate"</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>;</span>
                  </div>
                  
                  <div className="pt-2"></div>
                  
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>@import</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"../styles/syntax.css"</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>layer</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>(</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>utilities</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>);</span>
                  </div>
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>@import</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-green-400" : "text-green-600")}>"../styles/theme.css"</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>layer</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>(</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>utilities</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>);</span>
                  </div>
                  
                  <div className="pt-2"></div>
                  
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>@custom-variant</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>dark</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>(</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>&:where(.dark, .dark *)</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>);</span>
                  </div>
                  
                  <div className="pt-2"></div>
                  
                  <div className={cn(
                    "transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-purple-400" : "text-purple-600")}>@theme</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>inline</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>{"{"}</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>--color-brand</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>:</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>var</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>(</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>--brand</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>);</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>--color-brand-foreground</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>:</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>var</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>(</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>--brand-foreground</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>);</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>--color-light</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>:</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>var</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>(</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>--light</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>);</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>--color-light-foreground</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>:</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>var</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>(</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>--light-foreground</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>);</span>
                  </div>
                  <div className={cn(
                    "pl-4 transition-all duration-300 ease-in-out hover:opacity-80",
                    isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                  )}>
                    <span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>--color-background</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>:</span> <span className={cn("transition-colors duration-300", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>var</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>(</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-blue-300" : "text-blue-600")}>--background</span><span className={cn("transition-colors duration-300", isDarkMode ? "text-gray-300" : "text-gray-500")}>);</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Subtle animated background pattern - adaptive to theme */}
            <div className="absolute inset-0 opacity-5">
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br via-transparent animate-pulse transition-all duration-500 ease-in-out",
                isDarkMode 
                  ? "from-blue-500/10 to-purple-500/10"
                  : "from-blue-400/20 to-purple-400/20"
              )}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
