'use client'

import React from 'react'
import { Github, Twitter, Linkedin, ArrowRight, Hexagon } from 'lucide-react'

export function NeoMinimalFooter() {
  return (
    <footer className="max-w-7xl mx-auto bg-card/10 border-t rounded-t-lg border-card/10 flex flex-wrap pt-16 pb-8 relative overflow-hidden">
      
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          {/* Brand Column (Span 4) */}
          <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Hexagon className="text-cyan-500 fill-cyan-500/10 animate-pulse" size={24} />
                <h2 className="text-2xl font-bold tracking-tighter text-foreground">
                    SEEKER
                </h2>
            </div>
            <p className="text-sm text-muted-foreground  leading-relaxed max-w-sm">
                Next-generation interface primitives for the modern web. 
                Built for speed, designed for awe.
            </p>
            
            {/* Minimal Input */}
            <div className="flex items-center gap-2 mt-2 group">
                <div className="relative flex-1 max-w-xs">
                    <input 
                        type="email" 
                        placeholder="Enter your signal..." 
                        className="w-full bg-white/5 border border-border/40 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>
                <button className="p-2.5 bg-cyan-500 rounded-lg text-foreground hover:bg-cyan-400 transition-colors">
                    <ArrowRight size={18} />
                </button>
            </div>
          </div>

          {/* Links Columns (Span 2 each) */}


          {[
              { title: "Product", links: ["Components", "Templates", "Pricing","Features"] },
            { title: "Company", links: ["About", "Careers", "Legal","Blog"] },
            { title: "Connect", links: ["Twitter", "GitHub", "Discord","Whatsapp"] }
          ].map((section, idx) => (
             <div key={idx} className="col-span-6 md:col-span-2 flex flex-col gap-4">
                <h4 className="text-xs font-mono font-semibold text-foreground/70 uppercase tracking-widest">
                    {section.title}
                </h4>
                <ul className="flex flex-col gap-3">
                    {section.links.map((link) => (
                        <li key={link}>
                            <a href="#" className="text-sm font-mono text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group w-fit">
                                <span className="w-2 h-2 rounded-full bg-muted/90
                                group-hover:bg-cyan-400 
                                transition-all group-hover:w-4 duration-200" />
                                {link}
                            </a>
                        </li>
                    ))}
                </ul>
             </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
            <p className="text-xs text-gray-600 font-mono">
                // PUBLISHED_BY_21ST.DEV
            </p>

            <div className="flex items-center gap-6">
                 {/* Socials - Integrated Horizontal */}
                 <div className="flex gap-4 border-r border-white/10 pr-6 mr-2">
                    {[Github, Twitter, Linkedin].map((Icon, i) => (
                        <a key={i} href="#" className="text-gray-600 hover:text-white transition-colors">
                            <Icon size={18} />
                        </a>
                    ))}
                 </div>
                 
                 {/* Status */}
                 <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] uppercase font-medium text-green-500/80 tracking-wider">All Systems Normal</span>
                 </div>
            </div>
        </div>
      </div>
    </footer>
  )
}
