import { cn } from "@/lib/utils";
import {
    RotateCcw,
    ArrowUp,
    Paperclip,
    Mic2,
    LayoutTemplate
} from "lucide-react";
import { useState } from "react";

export const Component = () => {
    const [prompt, setPrompt] = useState("");
    const maxChars = 2000;

    return (
        <div className="w-full bg-white p-8 font-sans text-zinc-900">
            <div className="max-w-4xl mx-auto space-y-4">
                {/* Regenerate Button */}
                <div className="flex justify-start">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors border border-zinc-200/50 shadow-sm">
                        <RotateCcw className="w-4 h-4" />
                        Regenerate
                    </button>
                </div>

                {/* Main Input Area */}
                <div className="relative flex flex-col w-full bg-[#efefef] rounded-3xl p-5 shadow-sm border border-zinc-200/50">
                    <div className="flex items-start gap-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value.slice(0, maxChars))}
                            placeholder="Enter a prompt here"
                            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 text-lg placeholder:text-zinc-400 min-h-[140px] leading-relaxed"
                        />
                        <button
                            className={cn(
                                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                prompt.trim() ? "bg-zinc-800 text-white" : "bg-zinc-200 text-zinc-400"
                            )}
                        >
                            <ArrowUp className="w-6 h-6" strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4">
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 bg-zinc-200/80 hover:bg-zinc-300/80 rounded-xl transition-colors">
                                <Paperclip className="w-4 h-4" />
                                Attach
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 bg-zinc-200/80 hover:bg-zinc-300/80 rounded-xl transition-colors">
                                <Mic2 className="w-4 h-4" />
                                Voice Commands
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-600 bg-zinc-200/80 hover:bg-zinc-300/80 rounded-xl transition-colors">
                                <LayoutTemplate className="w-4 h-4" />
                                Templates
                            </button>
                        </div>
                        <div className="text-sm font-medium text-zinc-400 tracking-tight">
                            {prompt.length}/{maxChars}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
