import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Plus, 
  Mic, 
  Sparkles, 
  Wrench 
} from "lucide-react";

// We need some custom CSS for the smooth moving gradient background.
// We inject it here so you don't have to touch tailwind.config.js
const customStyles = `
  @keyframes bg-spin {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-bg-spin {
    background-size: 200% 200%;
    animation: bg-spin 4s linear infinite;
  }
`;

export const Component = () => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;
    console.log("Sending:", input);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Icon Button Component Helper for consistent cool animations ---
  const IconButton = ({ icon: Icon, label, onClick, colorClass }: any) => (
    <button
      onClick={onClick}
      className={cn(
        "group flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-in-out",
        "hover:scale-110 hover:-rotate-6 hover:bg-gray-100 dark:hover:bg-zinc-800",
        colorClass // Inject the specific color theme for this icon
      )}
      aria-label={label}
    >
      <Icon size={20} className="transition-transform duration-300 group-active:scale-90" />
    </button>
  );


  return (
    <>
      <style>{customStyles}</style>
      {/* Outer container */}
      <div className="flex w-full min-h-[400px] items-center justify-center bg-gray-100 p-6 dark:bg-zinc-950">
        
        {/* Rainbow Glow Wrapper */}
        <div className="relative w-full max-w-2xl group">
          <div
            className={cn(
              "absolute -inset-[3px] rounded-[32px] animate-bg-spin blur-md transition-all duration-500",
              isFocused 
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 opacity-70 blur-lg" // Active State (Warm/Intense)
                : "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30 group-hover:opacity-50" // Idle State (Cool/Subtle)
            )}
          ></div>

          {/* Main Input Container */}
          <div
            className={cn(
              "relative flex w-full flex-col rounded-[28px] border transition-colors duration-200",
              // Light Mode
              "bg-white/80 border-white/50 backdrop-blur-xl",
              // Dark Mode
              "dark:bg-zinc-900/90 dark:border-zinc-800/50"
            )}
          >
            <div className="flex items-end gap-2 p-3">
              
              {/* Left Action: Plus */}
              <IconButton 
                icon={Plus} 
                label="Add attachment" 
                colorClass="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              />

              {/* Text Area */}
              <div className="relative flex-1 py-2 px-1">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder="Ask anything..."
                  className={cn(
                    "flex max-h-[200px] w-full resize-none bg-transparent text-base focus:outline-none overflow-y-auto font-medium",
                    "text-gray-800 placeholder:text-gray-500", 
                    "dark:text-zinc-100 dark:placeholder:text-zinc-400" 
                  )}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  style={{ minHeight: "24px" }} 
                />
              </div>

              {/* Right Actions */}
              <div className="flex shrink-0 items-center gap-1">
                
                {input.trim().length === 0 && (
                   <>
                    <IconButton 
                      icon={Sparkles} 
                      label="Reasoning" 
                      colorClass="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    />
                    <IconButton 
                      icon={Wrench} 
                      label="Tools" 
                      colorClass="text-teal-500 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                    />
                   </>
                )}

                {input.trim().length === 0 ? (
                  <IconButton 
                      icon={Mic} 
                      label="Use microphone" 
                      colorClass="text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                  />
                ) : (
                  // Send Button (Keeps its distinct filled look)
                  <button
                    onClick={handleSend}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
                      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/30",
                      "dark:from-blue-500 dark:to-indigo-500"
                    )}
                    aria-label="Send message"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};