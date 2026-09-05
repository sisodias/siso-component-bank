import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  const menuItems = ["Home", "About", "Services", "Portfolio", "Contact"];

  return (
    <div className="relative min-h-32 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000 opacity-70"></div>
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-pink-500/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        
        {/* Flowing particles */}
        <div className="absolute top-4 left-10 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-8 right-20 w-1 h-1 bg-purple-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-12 left-1/3 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-bounce delay-1100"></div>
        <div className="absolute top-6 right-1/3 w-1 h-1 bg-indigo-400/60 rounded-full animate-bounce delay-1500"></div>
      </div>

      {/* Header */}
      <header className="relative z-20">
        <nav className={cn(
          "backdrop-blur-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5",
          "border-b border-white/10 shadow-2xl shadow-purple-500/10",
          "px-6 lg:px-8 py-5 transition-all duration-500"
        )}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/25">
                  <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-black text-lg">N</span>
                  </div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
                  NovaTech
                </h1>
                <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">Innovation Lab</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-12">
              {menuItems.map((item, index) => (
                <button
                  key={item}
                  onClick={() => setActiveItem(item)}
                  className={cn(
                    "relative group px-4 py-2 text-sm font-semibold transition-all duration-500",
                    "hover:text-white transform hover:scale-110",
                    activeItem === item 
                      ? "text-white" 
                      : "text-gray-300 hover:text-cyan-200"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10">{item}</span>
                  {activeItem === item && (
                    <>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-lg backdrop-blur-sm"></div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-lg transition-all duration-500"></div>
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className={cn(
                "px-4 py-2 text-sm font-medium text-gray-300",
                "hover:text-white transition-all duration-300",
                "border border-white/20 rounded-full hover:border-white/40",
                "backdrop-blur-sm hover:bg-white/5"
              )}>
                Sign In
              </button>
              <button className={cn(
                "relative px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500",
                "text-white font-semibold rounded-full text-sm",
                "hover:shadow-2xl hover:shadow-purple-500/25",
                "transform hover:scale-105 transition-all duration-500",
                "overflow-hidden group"
              )}>
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 text-white hover:text-cyan-200 transition-colors duration-300 rounded-xl hover:bg-white/5"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                <div className={cn(
                  "w-full h-0.5 bg-current transition-all duration-300 rounded-full",
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                )}></div>
                <div className={cn(
                  "w-full h-0.5 bg-current transition-all duration-300 rounded-full",
                  isMenuOpen ? "opacity-0 scale-0" : ""
                )}></div>
                <div className={cn(
                  "w-full h-0.5 bg-current transition-all duration-300 rounded-full",
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                )}></div>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={cn(
            "lg:hidden overflow-hidden transition-all duration-500",
            isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="px-6 py-8 mt-6 space-y-6 bg-gradient-to-br from-black/30 via-purple-900/20 to-black/30 rounded-2xl backdrop-blur-xl border border-white/10">
              {menuItems.map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveItem(item);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "block w-full text-left px-4 py-3 text-white font-medium",
                    "hover:bg-gradient-to-r hover:from-cyan-500/10 hover:via-purple-500/10 hover:to-pink-500/10",
                    "rounded-xl transition-all duration-300 transform hover:scale-105",
                    activeItem === item && "bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"
                  )}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {item}
                </button>
              ))}
              <div className="pt-4 space-y-3 border-t border-white/10">
                <button className={cn(
                  "w-full px-4 py-3 text-white font-medium",
                  "border border-white/20 rounded-xl hover:border-white/40",
                  "hover:bg-white/5 transition-all duration-300"
                )}>
                  Sign In
                </button>
                <button className={cn(
                  "w-full px-4 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500",
                  "text-white font-semibold rounded-xl",
                  "hover:shadow-lg hover:shadow-purple-500/25",
                  "transform hover:scale-105 transition-all duration-300"
                )}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};