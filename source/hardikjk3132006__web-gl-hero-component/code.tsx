import React, { useState } from 'react';

export const NoiseOverlay: React.FC = () => (
  <div className="fixed inset-0 z-20 pointer-events-none opacity-[0.03] contrast-150 brightness-150">
    <svg className="h-full w-full">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
);

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="fixed top-6 md:top-8 left-0 w-full z-50 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto flex items-center gap-4 md:gap-12 px-5 md:px-10 py-3 md:py-4 rounded-full 
                      bg-black/40 backdrop-blur-2xl border border-white/10 
                      shadow-[0_12px_40px_rgba(0,0,0,0.5)] 
                      animate-[navSlideDown_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]
                      hover:border-cyan-500/30 transition-all duration-700">
        
        <div className="cursor-pointer group flex items-center gap-3 md:gap-4">
          <div className="relative w-3 h-3 flex items-center justify-center">
            <div className="absolute inset-0 border border-white/40 group-hover:rotate-180 group-hover:border-cyan-400 transition-all duration-1000" />
            <div className="w-1 h-1 bg-white group-hover:bg-cyan-400 transition-colors duration-500" />
          </div>
          <span className="text-[10px] md:text-[11px] font-syncopate tracking-[0.4em] md:tracking-[0.8em] uppercase text-white font-bold group-hover:text-cyan-400 transition-colors duration-500">
            Aether
          </span>
        </div>

        <div className="hidden md:block h-5 w-px bg-white/10" />

        <nav className="hidden md:flex items-center gap-10">
          <a href="#" className="text-[10px] font-['Inter'] uppercase tracking-[0.5em] text-white/40 hover:text-white transition-all duration-500">Manifesto</a>
          <a href="#" className="text-[10px] font-['Inter'] uppercase tracking-[0.5em] text-white/40 hover:text-white transition-all duration-500">Archives</a>
          <a href="#" className="text-[10px] font-['Inter'] uppercase tracking-[0.5em] text-cyan-400/80 hover:text-cyan-300 transition-all duration-500 font-semibold">Initiative</a>
        </nav>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none group"
          aria-label="Toggle Menu"
        >
          <div className={`w-5 h-px bg-white/60 transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-2 bg-white' : ''}`} />
          <div className={`w-5 h-px bg-white/60 transition-all duration-500 ${isOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-px bg-white/60 transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-2 bg-white' : ''}`} />
        </button>
      </div>

      <div className={`fixed inset-0 z-[-1] bg-black/95 backdrop-blur-3xl transition-all duration-700 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center justify-center h-full gap-12">
          {['Manifesto', 'Archives', 'Initiative'].map((item) => (
            <a key={item} href="#" onClick={() => setIsOpen(false)} className={`text-xs uppercase tracking-[1em] ${item === 'Initiative' ? 'text-cyan-400' : 'text-white/40'} hover:text-white transition-all duration-500`}>
              {item}
            </a>
          ))}
          <div className="absolute bottom-12 text-[10px] uppercase tracking-[0.5em] text-white/20">Aether Labs // 2025</div>
        </nav>
      </div>

      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </header>
  );
};

export const OverlayContent: React.FC = () => (
  <div className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6">
    <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
      <div className="mb-6 opacity-0 animate-[fadeIn_1.5s_ease-out_0.2s_forwards]">
        <span className="text-[10px] uppercase tracking-[1.2em] text-white/40 font-medium">Alpha Release 01</span>
      </div>
      <h1 className="relative flex flex-col items-center mb-8 select-none group">
        <span className="text-7xl md:text-[9rem] font-bold tracking-[-0.04em] text-white leading-none font-['Space_Grotesk'] opacity-0 animate-[scaleIn_1s_ease-out_forwards]">ORIGIN</span>
        <span className="text-2xl md:text-[3rem] font-syncopate font-light tracking-[1.2em] text-cyan-400 -mt-1 md:-mt-2 uppercase opacity-0 animate-[fadeIn_2s_ease-out_0.4s_forwards]">Logic</span>
        <div className="mt-12 w-12 h-[1px] bg-white/20 group-hover:w-32 transition-all duration-1000 ease-in-out" />
      </h1>
      <div className="max-w-md mx-auto mb-16 opacity-0 animate-[fadeIn_2s_ease-out_0.8s_forwards]">
        <p className="text-xs md:text-sm text-white/50 leading-[2.4] tracking-[0.2em] font-light uppercase">
          Where artificial logic meets <br />
          <span className="text-white/80">organic intuition</span>.
        </p>
      </div>
      <div className="opacity-0 animate-[fadeIn_2s_ease-out_1.2s_forwards]">
        <button className="group relative flex items-center gap-4 transition-all duration-500">
          <span className="text-[10px] uppercase tracking-[0.8em] text-white/60 group-hover:text-white transition-all duration-500">Explore</span>
          <div className="w-8 h-[1px] bg-white/20 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-cyan-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
          </div>
        </button>
      </div>
    </div>
    <div className="fixed bottom-12 left-0 w-full px-12 flex justify-between items-center opacity-0 animate-[fadeIn_1s_ease-out_1.8s_forwards] pointer-events-none">
      <span className="text-[9px] uppercase tracking-[0.4em] text-white/20">Studio Aether</span>
      <div className="flex items-center gap-4 text-right">
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-mono">001.2025</span>
        <div className="w-1.5 h-1.5 bg-cyan-500/20 rounded-full border border-cyan-500/40" />
      </div>
    </div>
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(1.02) translateY(5px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
    `}</style>
  </div>
);
