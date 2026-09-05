"use client";

import React, { useState } from 'react';
import {
    Code2,
    Palette,
    Box,
    Sparkles,
    Terminal,
    ArrowRight,
    Send,
    Search,
    ChevronRight,
    Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AICodeHeroSectionProps {
    badgeText?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    placeholder?: string;
    onSubmit?: (text: string) => void;
}

const AICodeHeroSection: React.FC<AICodeHeroSectionProps> = ({
    badgeText = "New v2.0 Assembly",
    title = "AI-Powered Code & Architecture Design",
    description = "Transform ideas into production-ready code instantly. AI-powered architecture, pixel-perfect components, and intelligent design systems—all in one platform.",
    buttonText = "Start Building Free",
    placeholder = "ASK: Generate a complex component architecture...",
    onSubmit
}) => {
    const [inputText, setInputText] = useState('');

    const handleSubmit = () => {
        if (inputText.trim() && onSubmit) {
            onSubmit(inputText);
            setInputText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col overflow-hidden text-white w-full pt-32 pb-20 relative bg-zinc-950 font-sans">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="md:px-6 flex flex-col w-full max-w-7xl z-10 mx-auto px-4 relative items-center">
                <div className="w-px hidden md:block overflow-hidden bg-gradient-to-b from-transparent via-zinc-800 to-transparent h-full absolute top-0 left-4">
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-beam-v" />
                </div>

                <div className="w-px hidden md:block overflow-hidden bg-gradient-to-b from-transparent via-zinc-800 to-transparent h-full absolute top-0 right-4">
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-beam-v" style={{ animationDelay: '3s' }} />
                </div>

                <div className="text-center max-w-4xl mx-auto mb-16 relative">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 border border-cyan-500/30 bg-cyan-950/30 mb-10 backdrop-blur-md rounded-full ring-1 ring-cyan-500/20 shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                        </span>
                        <span className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.2em]">{badgeText}</span>
                    </div>

                    <h1 className="md:text-7xl lg:text-8xl leading-[1.05] text-5xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 font-serif">
                        {title}
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex w-full mb-16 relative items-center justify-center max-w-4xl px-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-zinc-800 w-full flex-1 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-beam-h" />
                    </div>

                    <button className="relative z-20 inline-flex items-center gap-3 whitespace-nowrap text-sm uppercase font-semibold text-white bg-zinc-900 border border-white/10 mx-6 py-4 px-10 hover:bg-zinc-800 hover:border-white/20 transition-all duration-300 group shadow-lg hover:shadow-cyan-500/10">
                        <span className="tracking-wide">{buttonText}</span>
                        <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="h-px bg-gradient-to-l from-transparent via-zinc-800 to-zinc-800 w-full flex-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-transparent via-cyan-500 to-transparent animate-beam-h-rev" />
                    </div>
                </div>

                <div className="min-h-[420px] flex w-full max-w-6xl mx-auto relative justify-center">
                    <div className="pointer-events-none z-0 hidden md:block w-full h-full absolute inset-0">
                        <div className="absolute top-[38%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    </div>

                    <div className="z-10 w-full max-w-3xl mt-8 relative px-4">
                        <div className="bg-zinc-950/80 backdrop-blur-sm border border-white/10 p-2 shadow-2xl shadow-black/50 transition-all duration-500 hover:border-cyan-500/20 hover:shadow-cyan-500/5 ring-1 ring-white/5">
                            <div className="bg-zinc-900/50 p-6 min-h-[160px] flex flex-col border border-white/5 transition-colors group-hover:border-white/10">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="border-none outline-none placeholder:text-zinc-600 resize-none text-base font-light text-zinc-200 font-mono bg-transparent w-full flex-1 caret-cyan-500"
                                    placeholder={placeholder}
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center justify-between mt-3 px-2 pb-2">
                                <div className="flex items-center gap-3">
                                    <button className="hover:bg-zinc-800 hover:text-white flex transition-all text-cyan-400 bg-zinc-900/50 w-10 h-10 border border-white/10 items-center justify-center hover:border-cyan-500/30 rounded-md">
                                        <Sparkles className="w-5 h-5" />
                                    </button>

                                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-white/10 text-zinc-400 text-xs hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer font-mono rounded-md">
                                        <Terminal className="w-3.5 h-3.5" />
                                        <span>/command</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleSubmit}
                                        className="hover:bg-cyan-500 hover:text-white flex transition-all text-cyan-400 bg-zinc-900/50 w-10 h-10 border border-white/10 items-center justify-center hover:border-cyan-400 rounded-md group"
                                    >
                                        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-[-5%] left-[5%] md:left-[8%] hidden md:flex flex-col items-center gap-3 animate-float-icon">
                        <div className="flex bg-zinc-900/90 w-16 h-16 border border-white/10 items-center justify-center animate-glow-pulse backdrop-blur-md shadow-lg shadow-black/20 rounded-2xl ring-1 ring-white/5">
                            <Code2 className="w-7 h-7 text-cyan-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-bold font-mono tracking-widest uppercase">Code Gen</span>
                    </div>

                    <div className="absolute top-[-5%] right-[5%] md:right-[8%] hidden md:flex flex-col items-center gap-3 animate-float-icon" style={{ animationDelay: '0.5s' }}>
                        <div className="flex bg-zinc-900/90 w-16 h-16 border border-white/10 items-center justify-center animate-glow-pulse backdrop-blur-md shadow-lg shadow-black/20 rounded-2xl ring-1 ring-white/5" style={{ animationDelay: '0.5s' }}>
                            <Palette className="w-7 h-7 text-cyan-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-bold font-mono tracking-widest uppercase">Design</span>
                    </div>

                    <div className="absolute bottom-[15%] left-[5%] md:left-[8%] hidden md:flex flex-col items-center gap-3 animate-float-icon" style={{ animationDelay: '1s' }}>
                        <div className="flex bg-zinc-900/90 w-16 h-16 border border-white/10 items-center justify-center animate-glow-pulse backdrop-blur-md shadow-lg shadow-black/20 rounded-2xl ring-1 ring-white/5" style={{ animationDelay: '1s' }}>
                            <Box className="w-7 h-7 text-cyan-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-bold font-mono tracking-widest uppercase">Modules</span>
                    </div>

                    <div className="absolute bottom-[15%] right-[5%] md:right-[8%] hidden md:flex flex-col items-center gap-3 animate-float-icon" style={{ animationDelay: '1.5s' }}>
                        <div className="flex bg-zinc-900/90 w-16 h-16 border border-white/10 items-center justify-center animate-glow-pulse backdrop-blur-md shadow-lg shadow-black/20 rounded-2xl ring-1 ring-white/5" style={{ animationDelay: '1.5s' }}>
                            <Cpu className="w-7 h-7 text-cyan-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-bold font-mono tracking-widest uppercase">AI Core</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AICodeHeroSection;
