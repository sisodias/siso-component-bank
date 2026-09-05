import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export const Component = () => {
 const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('File');

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { name: 'File', icon: '📁', color: 'from-blue-400 to-cyan-400', shadow: 'shadow-cyan-500/50' },
    { name: 'Pricing', icon: '💰', color: 'from-green-400 to-emerald-400', shadow: 'shadow-emerald-500/50' },
    { name: 'About', icon: 'ℹ️', color: 'from-purple-400 to-pink-400', shadow: 'shadow-purple-500/50' },
    { name: 'Contact', icon: '✉️', color: 'from-orange-400 to-red-400', shadow: 'shadow-orange-500/50' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden w-full">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="absolute top-20 left-20 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-48 h-48 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-1/2 w-48 h-48 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-150"></div>
      
      <nav className={`fixed top-2 sm:top-4 left-2 right-2 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 transition-all duration-1000 ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl sm:rounded-2xl px-2 py-1 sm:p-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex justify-around sm:justify-center sm:gap-3">
              {menuItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedSection(item.name)}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                  }}
                  className={`
                    relative px-2 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold
                    transition-all duration-500 ease-out transform
                    ${selectedSection === item.name 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-md sm:shadow-xl ${item.shadow}` 
                      : 'bg-transparent sm:bg-gray-100 dark:bg-transparent sm:dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                    hover:shadow-md sm:hover:shadow-xl
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <span className="relative z-10 flex flex-col sm:flex-row items-center gap-0 sm:gap-2">
                    <span className={`
                      text-lg sm:text-lg transition-all duration-500
                      ${selectedSection === item.name ? 'animate-bounce' : ''}
                    `}>
                      {item.icon}
                    </span>
                    <span className={`
                      text-[10px] sm:text-sm transition-all duration-300
                      ${selectedSection === item.name ? 'font-bold' : ''}
                    `}>
                      {item.name}
                    </span>
                  </span>
                  
                  {selectedSection === item.name && (
                    <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
                  )}
                  
                  {hoveredIndex === index && (
                    <>
                      <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-gradient-to-br from-white/50 to-transparent rounded-tl-xl animate-ping"></span>
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-tl from-white/50 to-transparent rounded-br-xl animate-ping"></span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
      </nav>

      <div className="min-h-screen pt-20">
        <div className={`w-full h-full transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {selectedSection === 'File' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-4 sm:p-8 lg:p-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  File Manager
                </h2>
                
                <div className="max-w-6xl mx-auto space-y-8">
                  {/* File Categories */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="group relative p-4 sm:p-6 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 dark:from-violet-700 dark:via-purple-700 dark:to-indigo-800 backdrop-blur-lg rounded-2xl border border-violet-300/50 dark:border-violet-600/30 hover:shadow-2xl hover:shadow-violet-500/40 transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="text-3xl sm:text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">📄</div>
                        <h3 className="text-sm sm:text-base font-bold text-white">Documents</h3>
                        <p className="text-xl sm:text-2xl font-black text-white/95 mt-1">2,345</p>
                        <p className="text-xs sm:text-sm text-white/80 font-medium">125.4 MB</p>
                      </div>
                      <div className="absolute bottom-2 right-2 text-white/60 text-3xl transform translate-x-2 group-hover:translate-x-0 transition-transform">→</div>
                    </div>
                    
                    <div className="group relative p-4 sm:p-6 bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 dark:from-rose-700 dark:via-pink-700 dark:to-fuchsia-800 backdrop-blur-lg rounded-2xl border border-rose-300/50 dark:border-rose-600/30 hover:shadow-2xl hover:shadow-rose-500/40 transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="text-3xl sm:text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">🖼️</div>
                        <h3 className="text-sm sm:text-base font-bold text-white">Images</h3>
                        <p className="text-xl sm:text-2xl font-black text-white/95 mt-1">1,234</p>
                        <p className="text-xs sm:text-sm text-white/80 font-medium">2.3 GB</p>
                      </div>
                      <div className="absolute bottom-2 right-2 text-white/60 text-3xl transform translate-x-2 group-hover:translate-x-0 transition-transform">→</div>
                    </div>
                    
                    <div className="group relative p-4 sm:p-6 bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-600 dark:from-sky-700 dark:via-blue-700 dark:to-cyan-800 backdrop-blur-lg rounded-2xl border border-sky-300/50 dark:border-sky-600/30 hover:shadow-2xl hover:shadow-sky-500/40 transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="text-3xl sm:text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">📹</div>
                        <h3 className="text-sm sm:text-base font-bold text-white">Videos</h3>
                        <p className="text-xl sm:text-2xl font-black text-white/95 mt-1">567</p>
                        <p className="text-xs sm:text-sm text-white/80 font-medium">15.7 GB</p>
                      </div>
                      <div className="absolute bottom-2 right-2 text-white/60 text-3xl transform translate-x-2 group-hover:translate-x-0 transition-transform">→</div>
                    </div>
                    
                    <div className="group relative p-4 sm:p-6 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 dark:from-amber-700 dark:via-orange-700 dark:to-red-800 backdrop-blur-lg rounded-2xl border border-amber-300/50 dark:border-amber-600/30 hover:shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="text-3xl sm:text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">🎵</div>
                        <h3 className="text-sm sm:text-base font-bold text-white">Audio</h3>
                        <p className="text-xl sm:text-2xl font-black text-white/95 mt-1">892</p>
                        <p className="text-xs sm:text-sm text-white/80 font-medium">4.1 GB</p>
                      </div>
                      <div className="absolute bottom-2 right-2 text-white/60 text-3xl transform translate-x-2 group-hover:translate-x-0 transition-transform">→</div>
                    </div>
                  </div>

                  {/* Storage & Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6">
                      <h3 className="text-lg font-bold mb-4">Storage</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Used Space</span>
                          <span className="font-bold">22.2 GB / 50 GB</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '44%' }}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Documents</p>
                            <p className="text-sm font-bold">125 MB</p>
                          </div>
                          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Images</p>
                            <p className="text-sm font-bold">2.3 GB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6">
                      <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
                          <span className="text-xl">⬆️</span>
                          <p className="text-xs font-semibold mt-1">Upload</p>
                        </button>
                        <button className="p-3 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg transition-colors">
                          <span className="text-xl">➕</span>
                          <p className="text-xs font-semibold mt-1">New Folder</p>
                        </button>
                        <button className="p-3 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors">
                          <span className="text-xl">🔍</span>
                          <p className="text-xs font-semibold mt-1">Search</p>
                        </button>
                        <button className="p-3 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 rounded-lg transition-colors">
                          <span className="text-xl">⭐</span>
                          <p className="text-xs font-semibold mt-1">Starred</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'Pricing' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-gradient-to-br from-zinc-100 to-slate-100 dark:from-zinc-900 dark:to-slate-900 p-4 sm:p-8 lg:p-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Pricing
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  <div className="group relative p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-800/50 dark:via-slate-800/50 dark:to-zinc-800/50 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-200/40 to-transparent rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">Basic</h3>
                      <div className="flex items-baseline mb-6">
                        <span className="text-5xl font-black bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">$9</span>
                        <span className="text-sm font-medium text-gray-500 ml-2">/month</span>
                      </div>
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">10 GB Storage</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">5 Projects</span>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl font-bold text-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                        Start Free Trial
                      </button>
                    </div>
                  </div>

                  <div className="group relative p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 backdrop-blur-xl rounded-3xl border-2 border-gradient-to-r from-emerald-400 to-teal-400 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 overflow-hidden sm:col-span-2 lg:col-span-1">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-bold shadow-lg">
                      ⭐ MOST POPULAR
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-300/40 to-transparent rounded-full blur-3xl"></div>
                    <div className="relative z-10 mt-2">
                      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Pro</h3>
                      <div className="flex items-baseline mb-6">
                        <span className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">$29</span>
                        <span className="text-sm font-medium text-emerald-600/70 ml-2">/month</span>
                      </div>
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                          <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">100 GB Storage</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                          <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">Unlimited Projects</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                          <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">Priority Support</span>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm hover:shadow-xl shadow-emerald-500/50 transform hover:-translate-y-0.5 transition-all duration-200">
                        Get Started Now
                      </button>
                    </div>
                  </div>

                  <div className="group relative p-6 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-900/30 dark:via-violet-900/30 dark:to-indigo-900/30 backdrop-blur-xl rounded-3xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-300/40 to-transparent rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Enterprise</h3>
                      <div className="flex items-baseline mb-6">
                        <span className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">$99</span>
                        <span className="text-sm font-medium text-purple-600/70 ml-2">/month</span>
                      </div>
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">Unlimited Storage</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">Custom Features</span>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'About' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-900 dark:to-slate-900 p-4 sm:p-8 lg:p-12">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    About
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="group relative p-8 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 dark:from-blue-600/20 dark:via-indigo-600/10 dark:to-purple-600/20 backdrop-blur-xl rounded-2xl border border-blue-200/50 dark:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 overflow-hidden text-center">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">🚀</div>
                        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Innovation</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Cutting-edge technology solutions</p>
                      </div>
                    </div>
                    
                    <div className="group relative p-8 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-600/20 dark:via-teal-600/10 dark:to-cyan-600/20 backdrop-blur-xl rounded-2xl border border-emerald-200/50 dark:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 overflow-hidden text-center">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">👥</div>
                        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Expert Team</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">World-class professionals</p>
                      </div>
                    </div>
                    
                    <div className="group relative p-8 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-pink-500/10 dark:from-orange-600/20 dark:via-red-600/10 dark:to-pink-600/20 backdrop-blur-xl rounded-2xl border border-orange-200/50 dark:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 overflow-hidden text-center sm:col-span-2 lg:col-span-1">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/30 to-transparent rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">🎯</div>
                        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Our Mission</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Quality-first approach</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6 sm:p-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-purple-600">2020</div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Founded</p>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-pink-600">500+</div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Projects</p>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-purple-600">50+</div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Team</p>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-pink-600">98%</div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Happy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'Contact' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-gradient-to-br from-stone-100 to-gray-100 dark:from-stone-900 dark:to-gray-900 p-4 sm:p-8 lg:p-12">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Contact
                  </h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-4">Message</h3>
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          placeholder="Name" 
                          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                        />
                        <input 
                          type="email" 
                          placeholder="Email" 
                          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                        />
                        <textarea 
                          placeholder="Message" 
                          rows={4}
                          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                        />
                        <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                          Send
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="text-3xl mb-2 text-center">📧</div>
                        <h4 className="font-bold text-sm text-center">Email</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">hello@site.com</p>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="text-3xl mb-2 text-center">📱</div>
                        <h4 className="font-bold text-sm text-center">Phone</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">+1 555-0123</p>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="text-3xl mb-2 text-center">💬</div>
                        <h4 className="font-bold text-sm text-center">Chat</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Live 24/7</p>
                      </div>
                      
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="text-3xl mb-2 text-center">📍</div>
                        <h4 className="font-bold text-sm text-center">Office</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">SF, CA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </main>
  )
};
