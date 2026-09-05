import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight, Command, Search } from "lucide-react";

export const Component = () => {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center bg-black font-sans text-white selection:bg-white selection:text-black">
      
      {/* 
        Ultra-minimal navigation border 
        Grounds the layout without drawing attention
      */}
      <div className="absolute top-0 w-full border-b border-white/[0.08] h-16 bg-black" />

      <main className="flex w-full max-w-[1000px] flex-col items-center px-6 pt-32 text-center md:pt-40 z-10">
        
        {/* Pill Badge - Linear inspired */}
        <div className="group mb-8 flex cursor-pointer items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] py-1.5 pl-1.5 pr-3 text-xs font-medium text-neutral-400 backdrop-blur-md transition-colors hover:bg-white/[0.06]">
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
            Update
          </span>
          <span>Next-Gen Architecture</span>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-500 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* 
          Headline - Vercel inspired typography 
          Using tracking-tighter and text-balance for perfect typographic lockup
        */}
        <h1 className="mb-6 max-w-4xl text-balance text-5xl font-medium tracking-tighter text-white sm:text-7xl lg:text-8xl">
          Build faster. <br className="hidden sm:block" />
          <span className="text-neutral-600">Scale infinitely.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-[600px] text-balance text-base leading-relaxed text-neutral-400 sm:text-lg">
          The ultimate platform for modern software teams. Ship production-ready applications with an uncompromising, distraction-free workflow.
        </p>

        {/* Call to Actions - High contrast, sharp edges */}
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-medium text-black transition-all hover:bg-neutral-200 active:scale-[0.98] sm:w-auto">
            Start Building
            <ArrowRight className="h-4 w-4" />
          </button>
          <button className="flex h-11 w-full items-center justify-center rounded-md border border-white/[0.12] bg-transparent px-6 text-sm font-medium text-white transition-all hover:bg-white/[0.05] active:scale-[0.98] sm:w-auto">
            Documentation
          </button>
        </div>

        {/* 
          Mock UI Component / Bento Element
          Provides real-world context and visual weight without useless graphics 
        */}
        <div className="mt-20 w-full max-w-4xl rounded-t-xl border border-white/[0.12] bg-[#050505] shadow-2xl overflow-hidden">
          {/* Mock Header */}
          <div className="flex items-center gap-4 border-b border-white/[0.08] bg-white/[0.02] px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
            </div>
            
            {/* Mock Command Palette */}
            <div className="mx-auto flex h-7 w-full max-w-md items-center gap-2 rounded-md border border-white/[0.08] bg-black/50 px-2.5 text-xs text-neutral-500">
              <Search className="h-3.5 w-3.5" />
              <span>Search components, commands, or settings...</span>
              <div className="ml-auto flex items-center gap-1 opacity-60">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </div>
          </div>
          
          {/* Mock Terminal/Editor Window */}
          <div className="h-64 w-full bg-[#050505] p-6 text-left font-mono text-sm leading-relaxed text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="text-white">~</span> 
              <span>npx create-modern-app@latest</span>
            </div>
            <div className="mt-4 text-neutral-600">
              <p>✔ Resolving packages...</p>
              <p>✔ Fetching dependencies...</p>
              <p>✔ Linking dependencies...</p>
              <p>✔ Initializing configuration...</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="text-white">Ready to deploy.</span>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};