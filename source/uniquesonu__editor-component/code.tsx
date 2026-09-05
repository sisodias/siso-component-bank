"use client"

import type React from "react"

import { ArrowRight, Play, Settings, Layers, Move, Square, Circle, Minus, Plus, X } from "lucide-react"

// Custom Button Component
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: {
  children: React.ReactNode
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
  [key: string]: any
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  }

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Custom Badge Component
const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode
  variant?: "default" | "outline"
  className?: string
}) => {
  const baseClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    outline: "text-foreground",
  }

  return <div className={`${baseClasses} ${variants[variant]} ${className}`}>{children}</div>
}

export default function RiveEditorHero() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 py-8 lg:py-16 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="border-orange-500 text-orange-500 bg-orange-500/10 px-4 py-2 text-sm font-medium"
              >
                📱 RIVE EDITOR
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                THE DESIGN TOOL THAT CREATES <span className="text-orange-500">PRODUCTION-READY</span> GRAPHICS
              </h1>

              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg">
                Use Rive's familiar design and animation tools with our ground-breaking State Machine to create
                interactive content for your products, apps, sites, and games.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-8 py-4 text-lg font-medium group transition-all duration-200"
            >
              LEARN MORE
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          {/* Right Content - Design Tool Interface */}
          <div className="relative">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
              {/* Top Tabs */}
              <div className="bg-gray-800 px-4 py-2 flex items-center gap-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">hero</div>
                  <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm flex items-center gap-2 hover:bg-gray-600 transition-colors">
                    Framer Car
                    <X className="w-3 h-3 hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex h-96 lg:h-[500px]">
                {/* Left Sidebar */}
                <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                  {/* Toolbar */}
                  <div className="p-3 border-b border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <button className="p-1 h-8 w-8 hover:bg-gray-700 rounded transition-colors">
                        <Move className="w-4 h-4" />
                      </button>
                      <button className="p-1 h-8 w-8 hover:bg-gray-700 rounded transition-colors">
                        <Square className="w-4 h-4" />
                      </button>
                      <button className="p-1 h-8 w-8 hover:bg-gray-700 rounded transition-colors">
                        <Circle className="w-4 h-4" />
                      </button>
                      <button className="p-1 h-8 w-8 hover:bg-gray-700 rounded transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Layers Panel */}
                  <div className="p-3 flex-1 overflow-y-auto">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm mb-3 font-medium">Handbot</div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                        <Layers className="w-4 h-4" />
                        <span>Group</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        {[
                          "Glow_light",
                          "Butterfly",
                          "Group",
                          "Custom Shape",
                          "Path",
                          "Custom Shape",
                          "Path",
                          "Shape",
                          "Path",
                          "Path",
                        ].map((item, index) => (
                          <div key={index} className="text-gray-400 hover:text-gray-300 cursor-pointer py-1">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Animations Panel */}
                  <div className="p-3 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300 font-medium">Animations</span>
                      <div className="flex gap-1">
                        <button className="p-1 h-6 w-6 hover:bg-gray-700 rounded transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button className="p-1 h-6 w-6 hover:bg-gray-700 rounded transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                        <Settings className="w-4 h-4" />
                        <span>State Machine 1</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        {["Stop", "Light", "Idle"].map((item, index) => (
                          <div key={index} className="text-gray-400 hover:text-gray-300 cursor-pointer py-1">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 bg-gray-900 relative">
                  <div className="absolute inset-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-purple-800/30 via-blue-800/30 to-gray-800/30 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto opacity-80"></div>
                        <div className="text-gray-400 text-sm">Robot Animation Canvas</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-gray-300 font-medium">100%</span>
                          <span className="text-sm text-gray-400">Light</span>
                          <span className="text-sm text-gray-400">Idle</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-gray-700 px-2 py-1 rounded text-xs font-medium hover:bg-gray-600 cursor-pointer transition-colors">
                            Entry
                          </div>
                          <div className="bg-blue-600 px-2 py-1 rounded text-xs font-medium hover:bg-blue-500 cursor-pointer transition-colors">
                            Idle
                          </div>
                          <div className="bg-gray-700 px-2 py-1 rounded text-xs font-medium hover:bg-gray-600 cursor-pointer transition-colors">
                            Stop
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Properties Panel */}
                <div className="w-64 bg-gray-800 border-l border-gray-700 p-3 overflow-y-auto">
                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="text-gray-300 mb-2 font-medium">Transform</h3>
                      <div className="space-y-2">
                        <div className="text-gray-400 hover:text-gray-300 cursor-pointer">Position</div>
                        <div className="text-gray-400 hover:text-gray-300 cursor-pointer">Size</div>
                        <div className="text-gray-400 hover:text-gray-300 cursor-pointer">Origin</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-gray-300 mb-2 font-medium">Matrix</h3>
                      <div className="text-gray-400 hover:text-gray-300 cursor-pointer">Entry</div>
                    </div>

                    <div>
                      <h3 className="text-gray-300 mb-2 font-medium">Fill</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded border border-gray-600"></div>
                        <span className="text-gray-400 hover:text-gray-300 cursor-pointer">Linear</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-gray-300 mb-2 font-medium">Stroke</h3>
                      <div className="text-gray-400 hover:text-gray-300 cursor-pointer font-mono">0F:071</div>
                    </div>

                    <div>
                      <h3 className="text-gray-300 mb-2 font-medium">Effects</h3>
                      <div className="space-y-1">
                        <div className="text-gray-400 hover:text-gray-300 cursor-pointer">Shadow</div>
                        <div className="text-gray-400 hover:text-gray-300 cursor-pointer">Glow</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
