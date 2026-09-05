import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Mic, 
  Image as ImageIcon, 
  PenTool, 
  Video, 
  GraduationCap, 
  Sparkles, 
  ChevronDown, 
  Search,
  Paperclip,
  HardDrive,
  FileCode,
  Notebook,
  Globe,
  Palette,
  Layout,
  Zap,
  Brain,
  Check
} from 'lucide-react';
import { cn } from "@/lib/utils";

// --- Types & Data ---

type MenuId = 'plus' | 'tools' | 'model' | null;

const SuggestionChip = ({ icon: Icon, label, gradient }: { icon: any, label: string, gradient?: string }) => (
  <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors text-sm font-medium text-gray-600 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300">
    <div className={cn("p-1 rounded-full", gradient || "bg-blue-100 text-blue-600")}>
      <Icon className="w-3.5 h-3.5" />
    </div>
    {label}
  </button>
);

// --- Component ---

export default function GeminiInput() {
  const [value, setValue] = useState("");
  const [activeMenu, setActiveMenu] = useState<MenuId>(null);
  const [selectedModel, setSelectedModel] = useState("Pro");
  
  // Close menus when clicking outside
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current &&!containerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },);

  const toggleMenu = (menu: MenuId) => {
    setActiveMenu(activeMenu === menu? null : menu);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 min-h-[500px] flex flex-col justify-center" ref={containerRef}>
      
      {/* Main Input Container */}
      <div className="relative group bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-[32px] p-4 transition-shadow focus-within:shadow-md">
        
        {/* Text Area */}
        <div className="min-h-[60px] flex flex-col">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask Gemini 3"
            className="w-full bg-transparent border-none outline-none text-lg text-gray-800 dark:text-gray-100 placeholder:text-gray-500 px-2"
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-2 px-1 relative">
          
          {/* Left Actions: Add & Tools */}
          <div className="flex items-center gap-2">
            
            {/* PLUS MENU (Uploads) */}
            <div className="relative">
              <button 
                onClick={() => toggleMenu('plus')}
                className={cn(
                  "p-2 rounded-full transition-colors text-gray-600",
                  activeMenu === 'plus'? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                <Plus className="w-6 h-6" />
              </button>

              {activeMenu === 'plus' && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-[#1e1f20] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20 py-2">
                  <MenuItem icon={Paperclip} label="Upload files" />
                  <MenuItem icon={HardDrive} label="Add from Drive" />
                  <MenuItem icon={ImageIcon} label="Photos" />
                  <MenuItem icon={FileCode} label="Import code" />
                  <MenuItem icon={Notebook} label="NotebookLM" />
                </div>
              )}
            </div>

            {/* TOOLS MENU */}
            <div className="relative">
              <button 
                onClick={() => toggleMenu('tools')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors text-sm font-medium text-gray-600",
                  activeMenu === 'tools'? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                <Search className="w-4 h-4" />
                Tools
              </button>

              {activeMenu === 'tools' && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-[#1e1f20] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20 py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</div>
                  <MenuItem icon={Globe} label="Deep Research" />
                  <MenuItem icon={Video} label="Create videos (Veo 3.1)" />
                  <MenuItem icon={ImageIcon} label="Create images" />
                  <MenuItem icon={Layout} label="Canvas" />
                  <MenuItem icon={GraduationCap} label="Guided Learning" />
                </div>
              )}
            </div>
          </div>

          {/* Right Actions: Pro & Mic */}
          <div className="flex items-center gap-3">
            
            {/* MODEL SELECTOR (Gemini 3) */}
            <div className="relative">
              <button 
                onClick={() => toggleMenu('model')}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium text-gray-600 px-3 py-1.5 rounded-full transition-colors",
                  activeMenu === 'model'? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {selectedModel}
                <ChevronDown className="w-4 h-4" />
              </button>

              {activeMenu === 'model' && (
                <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-[#1e1f20] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20 p-2">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">Gemini 3</div>
                  
                  <ModelItem 
                    title="Fast" 
                    desc="Answers quickly" 
                    badge="New"
                    onClick={() => { setSelectedModel("Fast"); setActiveMenu(null); }}
                    isSelected={selectedModel === "Fast"}
                  />
                  <ModelItem 
                    title="Thinking" 
                    desc="Solves complex problems" 
                    onClick={() => { setSelectedModel("Thinking"); setActiveMenu(null); }}
                    isSelected={selectedModel === "Thinking"}
                  />
                  <ModelItem 
                    title="Pro" 
                    desc="Thinks longer for advanced math & code" 
                    onClick={() => { setSelectedModel("Pro"); setActiveMenu(null); }}
                    isSelected={selectedModel === "Pro"}
                  />
                </div>
              )}
            </div>
            
            {/* Active State Indicator (Purple Dot) */}
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
            
            <button className="p-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        <SuggestionChip icon={ImageIcon} label="Create image" gradient="bg-purple-100 text-purple-600" />
        <SuggestionChip icon={PenTool} label="Write anything" gradient="bg-blue-100 text-blue-600" />
        <SuggestionChip icon={Video} label="Create video" gradient="bg-pink-100 text-pink-600" />
        <SuggestionChip icon={GraduationCap} label="Help me learn" gradient="bg-green-100 text-green-600" />
        <SuggestionChip icon={Sparkles} label="Boost my day" gradient="bg-orange-100 text-orange-600" />
      </div>

    </div>
  );
}
export { GeminiInput as Component };

// --- Helper Components for Cleanliness ---

const MenuItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
    <Icon className="w-5 h-5 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200" />
    <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
  </button>
);

const ModelItem = ({ title, desc, badge, onClick, isSelected }: { title: string, desc: string, badge?: string, onClick: () => void, isSelected?: boolean }) => (
  <button onClick={onClick} className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors text-left relative">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800 dark:text-gray-200">{title}</span>
        {badge && (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
    {isSelected && (
      <div className="bg-blue-600 rounded-full p-0.5 mt-1">
        <Check className="w-3 h-3 text-white" />
      </div>
    )}
  </button>
);

