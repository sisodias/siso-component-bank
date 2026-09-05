"use client";

import React, { useState } from "react";
import { Send, Terminal,PlusIcon } from "lucide-react";
import { cn } from "../_utils/cn";

export function CreateCornors({ children }: { children: React.ReactNode }) {
  const positions = [
    "top-0 -left-3",
    "top-0 -right-3",
    "bottom-0 -left-3",
    "bottom-0 -right-3",
  ];

  return (
    <div className="absolute z-10 inset-0 pointer-events-none">
      {positions.map((pos, index) => (
        <section key={index} className={`absolute ${pos}`}>
          {children}
        </section>
      ))}
    </div>
  );
}

export const SecureMessageGateway = () => {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim() || pending) return;

    setPending(true);
    setTimeout(() => {
      setPending(false);
      setMessage("");
    }, 2000);
  }

  return (
    <div className="flex items-center justify-center min-h-[300px] w-full p-4 bg-background">
      <div className="relative w-full max-w-2xl bg-transparent border border-border border-dashed shadow-sm p-6 sm:p-10 transition-all rounded-none">

        <CreateCornors>
        <PlusIcon className="font-[200] text-green-300"/>
        </CreateCornors>
      {/* DiaginalFadeGridLeft */}
      <div className="min-h-full z-0 w-full bg-transparent absolute top-0 left-0 pointer-events-none">
      {/* Diagonal Fade Grid Background - Top Left */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, var(--muted) 1px, transparent 1px),
        linear-gradient(to bottom, var(--muted) 1px, transparent 1px)
      `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
        }}
      />
      {/* Your Content/Components */}
      
    </div>
      <div className="backdrop-blur-xs p-2 rounded-xs">
        {/* Small Header */}
        <div className="mb-6 z-10">
          <h2 className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-primary mb-1 flex border-b border-b-green-400 pb-2 items-center gap-2">
            <div className="size-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400">Contact</span>
          </h2>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
             <span className="text-green-400">Contact </span>
            with 21st
          </h1>
        </div>

        {/* INPUT & BUTTON FLEX */}
        <form onSubmit={handleSubmit} className="flex sm:flex-row items-stretch gap-2">
          
          <div className="relative flex-1 group">
            {/* Corner styling on focus (Matches Primary color) */}
            <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-primary opacity-0 group-focus-within:opacity-100 transition-all z-10" />
            <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-primary opacity-0 group-focus-within:opacity-100 transition-all z-10" />

            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
              <Terminal size={14} />
            </div>

            <input
              type="text"
              autoComplete="off"
              placeholder="ENTER DIRECTIVE >>"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={pending}
              className={cn(
                "w-full bg-muted/30 border border-input rounded-none h-10",
                "font-mono text-[0.75rem] p-3 pl-10 outline-none transition-all",
                "placeholder:text-muted-foreground/50 text-foreground",
                "focus:bg-green-700/5 focus:ring-1 focus:ring-primary/20 focus:border-green-500 border-dashed",
                pending && "opacity-50 cursor-not-allowed"
              )}
            />
          </div>

          <button
            type="submit"
            disabled={pending || !message.trim()}
            className={cn(
              "px-8 h-full border bg-card font-bold uppercase text-[0.6rem] tracking-[0.2em] min-h-10 border-dashed transition-all flex items-center justify-center gap-2 rounded-none",
              !pending && message.trim() && "hover:border-green-700 hover:text-primary hover:bg-green-300/5 active:scale-95",
              (pending || !message.trim()) && "opacity-40 cursor-not-allowed"
            )}
          >
            <Send size={12} className={cn(pending && "animate-bounce")} />
            <span>{pending ? "SENDING..." : "SEND"}</span>
          </button>
        </form>
      </div>
        {/* Status Line */}
        <div className="mt-6 flex items-center justify-between">
           <span className="text-[0.55rem] font-mono uppercase tracking-widest text-muted-foreground">
              Status: {pending ? <span className="text-muted-foreground">Establishing Handshake...</span> : <span className="text-green-500 border p-0.5 border-green-500 ">Ready</span>}
           </span>
           <span className="text-[0.55rem] font-mono text-muted-foreground/40">
              SECURE_ID: 0x44FE1
           </span>
        </div>

      </div>
    </div>
  );
};

export default SecureMessageGateway;
