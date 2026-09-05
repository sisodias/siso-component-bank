import React from 'react';
import { 
  ChevronDown, 
  RotateCcw, 
  PanelLeft, 
  MonitorPlay, 
  Cloud, 
  Globe, 
  Code2, 
  Activity, 
  Plus, 
  Monitor, 
  RefreshCw, 
  ExternalLink, 
  Share, 
  Github, 
  FileEdit, 
  ChevronRight, 
  Bookmark, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  MoreHorizontal, 
  Zap, 
  ArrowUpRight, 
  MessageSquare, 
  ArrowUp, 
  Scan,
  SlidersHorizontal
} from 'lucide-react';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-white text-gray-900 font-sans overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Top Header */}
      <header className="flex items-center justify-between h-[52px] px-4 border-b border-gray-200 bg-white shrink-0">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <div className="absolute w-3.5 h-3.5 bg-orange-500 rounded-sm top-0 left-0 opacity-80 mix-blend-multiply"></div>
              <div className="absolute w-3.5 h-3.5 bg-indigo-500 rounded-full bottom-0 right-0 opacity-80 mix-blend-multiply"></div>
            </div>
            <span className="font-medium text-sm text-gray-700">Elegant Portfolio</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-800 transition-colors">
              <RotateCcw size={16} />
            </button>
            <button className="text-gray-500 hover:text-gray-800 transition-colors">
              <PanelLeft size={16} />
            </button>
          </div>
        </div>

        {/* Center */}
        <div className="flex items-center justify-center flex-1 ml-10">
          <div className="flex items-center gap-1.5 mr-4">
            <button className="flex items-center gap-1.5 bg-[#eaf1ff] text-[#3366ff] px-3 py-1.5 rounded-md text-sm font-medium">
              <MonitorPlay size={15} />
              Preview
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50"><Cloud size={16} /></button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50"><Globe size={16} /></button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50"><Code2 size={16} /></button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50"><Activity size={16} /></button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50"><Plus size={16} /></button>
          </div>

          <div className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-md px-3 py-1.5 w-[360px]">
            <div className="flex items-center gap-2 text-gray-500">
              <Monitor size={14} />
              <span className="text-sm">/</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <button className="hover:text-gray-600"><RefreshCw size={14} /></button>
              <button className="hover:text-gray-600"><ExternalLink size={14} /></button>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#c2512a] text-white flex items-center justify-center text-xs font-medium">
              S
            </div>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Share
            </button>
          </div>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Github size={18} />
          </button>
          <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
            Publish
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar (Assistant) */}
        <div className="w-[360px] flex-shrink-0 border-r border-gray-200 bg-[#fdfdfd] flex flex-col relative z-10">
          
          <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">
            
            {/* Context Badge */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
              <FileEdit size={13} />
              Edited <span className="bg-gray-100/80 border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">App.tsx</span>
            </div>

            {/* AI Message */}
            <div className="text-[13.5px] text-gray-800 leading-[1.6] mb-6">
              Your elegant UI/UX portfolio is ready! It features a warm cream palette with sage green accents, Playfair Display typography, smooth animations, and a clean minimal aesthetic.
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-[13.5px] text-gray-900 mb-3">What's next?</h3>
              <ul className="space-y-3 text-[13.5px]">
                <li className="flex gap-2.5 items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                  <span className="text-gray-700 leading-relaxed">
                    <strong className="text-gray-900 font-semibold">Refine & Customize:</strong> Update the name, bio, projects, and contact info via prompts or Visual Edits
                  </span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                  <span className="text-gray-700 leading-relaxed">
                    <strong className="text-gray-900 font-semibold">Add project images:</strong> I can generate hero images for each project to make them more visual
                  </span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                  <span className="text-gray-700 leading-relaxed">
                    <strong className="text-gray-900 font-semibold">Master Prompting:</strong> Use "chat mode" to plan changes without editing code
                  </span>
                </li>
              </ul>
            </div>

            <div className="text-[13.5px] text-gray-800 leading-[1.6] mb-5">
              Need to save contact form submissions or add a blog?<br/>
              <strong className="font-semibold text-gray-900">Lovable Cloud</strong> provides built-in database and authentication.
            </div>

            {/* Action Box */}
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-[#dae5ff] rounded-xl p-3.5 flex-1 flex justify-between items-center border border-[#c1d3f9] relative">
                <div>
                  <div className="font-semibold text-[13px] text-gray-900 mb-0.5 tracking-tight">Refactor styling and routing</div>
                  <div className="text-[12px] text-gray-700/80">Previewing latest version</div>
                </div>
                <ChevronRight size={16} className="text-gray-600" />
                
                {/* Overlapping Code Badge */}
                <div className="absolute -bottom-3 right-6 bg-white border border-gray-200 shadow-sm rounded-md px-2 py-1 flex items-center gap-1 text-[10px] font-semibold text-gray-600">
                  <span className="font-mono text-[9px] font-bold">&lt;/&gt;</span> Code
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Bookmark size={18} />
              </button>
            </div>

            {/* Feedback Icons */}
            <div className="flex items-center gap-3.5 text-gray-400 mb-6 mt-6 ml-1">
              <button className="hover:text-gray-600"><ThumbsUp size={14} /></button>
              <button className="hover:text-gray-600"><ThumbsDown size={14} /></button>
              <button className="hover:text-gray-600"><Copy size={14} /></button>
              <button className="hover:text-gray-600"><MoreHorizontal size={14} /></button>
            </div>

            {/* Integration Buttons with Tree Lines */}
            <div className="relative ml-2 space-y-3 mb-8">
              {/* Vertical connecting line */}
              <div className="absolute top-4 bottom-4 left-0 w-px bg-gray-200"></div>
              
              <div className="relative pl-6 flex items-center">
                <div className="absolute top-1/2 left-0 w-6 h-px bg-gray-200 -translate-y-px"></div>
                <button className="flex items-center gap-2 bg-[#f4fbf6] border border-[#e1f0e8] hover:bg-[#ebf5ef] rounded-md px-3 py-1.5 text-[13px] font-medium text-gray-800 transition-colors">
                  <Zap size={14} className="text-green-500 fill-green-500" /> Connect Supabase
                </button>
              </div>
              
              <div className="relative pl-6 flex items-center">
                <div className="absolute top-1/2 left-0 w-6 h-px bg-gray-200 -translate-y-px"></div>
                <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-md px-3 py-1.5 text-[13px] font-medium text-gray-800 transition-colors">
                  <ArrowUpRight size={14} className="text-gray-500" /> Visit docs
                </button>
              </div>
            </div>

          </div>

          {/* Sticky Bottom Area */}
          <div className="bg-[#fdfdfd] pt-2 pb-4 px-4 flex flex-col gap-3 border-t border-transparent z-20">
            {/* Suggestion Pills */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              <button className="whitespace-nowrap bg-white border border-gray-200 shadow-sm rounded-full px-3.5 py-1.5 text-[12px] text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Add Project Images
              </button>
              <button className="whitespace-nowrap bg-white border border-gray-200 shadow-sm rounded-full px-3.5 py-1.5 text-[12px] text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Add Contact Form
              </button>
              <button className="whitespace-nowrap bg-white border border-gray-200 shadow-sm rounded-full px-3.5 py-1.5 text-[12px] text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Add Scroll Animations
              </button>
            </div>

            {/* Input Box */}
            <div className="bg-[#f3f2ee] rounded-[20px] p-3 flex flex-col shadow-sm border border-[#e8e7e3]">
              <input 
                type="text" 
                placeholder="Ask Lovable..." 
                className="bg-transparent text-[14px] w-full outline-none placeholder-gray-500 text-gray-800 mb-3 px-1" 
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-500 hover:text-gray-800 border border-gray-100">
                    <Plus size={15} />
                  </button>
                  <button className="px-3 py-1 rounded-full bg-white flex items-center gap-1.5 shadow-sm text-[12px] font-medium text-gray-700 hover:text-gray-900 border border-gray-100">
                    <Scan size={13} className="text-gray-400" /> Visual edits
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium hover:text-gray-900">
                    <SlidersHorizontal size={13} /> Chat
                  </button>
                  <button className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white cursor-not-allowed">
                    <ArrowUp size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Pane */}
        <div className="flex-1 bg-[#f3f4f6] flex items-center justify-center w-full shadow-inner">
          <span className="text-gray-400 font-semibold text-xl tracking-[0.2em] uppercase">preview</span>
        </div>

      </div>
    </div>
  );
}