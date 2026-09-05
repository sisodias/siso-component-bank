"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TerminalScreenProps {
  width?: number | string;
  height?: number | string;
  commands?: string[];
  className?: string;
  typingSpeed?: number; // ms per character
}

export default function TerminalScreen({
  width = "600px",
  height = "400px",
  commands = [
    "echo Hello, World!",
    "ls -la",
    "git status",
    "npm run dev"
  ],
  className,
  typingSpeed = 50,
}: TerminalScreenProps) {
  const [displayedLines, setDisplayedLines] = React.useState<string[]>([]);
  const [currentLine, setCurrentLine] = React.useState("");
  const lineRef = React.useRef(0);
  const charRef = React.useRef(0);

  React.useEffect(() => {
    const typeNextChar = () => {
      if (lineRef.current >= commands.length) return;

      const line = commands[lineRef.current];
      if (charRef.current < line.length) {
        setCurrentLine((prev) => prev + line[charRef.current]);
        charRef.current += 1;
      } else {
        setDisplayedLines((prev) => [...prev, line]);
        setCurrentLine("");
        charRef.current = 0;
        lineRef.current += 1;
      }
    };

    const interval = setInterval(typeNextChar, typingSpeed);
    return () => clearInterval(interval);
  }, [commands, typingSpeed]);

  return (
    <div
      className={cn(
        "bg-black text-green-400 font-mono p-4 rounded-lg shadow-lg overflow-auto",
        className
      )}
      style={{ width, height }}
    >
      {displayedLines.map((line, idx) => (
        <div key={idx}>
          <span className="text-green-400">$</span> {line}
        </div>
      ))}
      {currentLine && (
        <div>
          <span className="text-green-400">$</span> {currentLine}
          <span className="animate-blink">|</span>
        </div>
      )}
      <style jsx>{`
        .animate-blink {
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
}
