"use client";

import { cn } from "@/lib/utils";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

/* ─── Types ─── */

interface OutputSegment {
  text: string;
  color?: string;
  bold?: boolean;
  dim?: boolean;
}

interface TerminalStep {
  command: string;
  output: (string | OutputSegment[])[];
  delay?: number;
  typingSpeed?: number;
}

interface AnimatedTerminalProps {
  steps: TerminalStep[];
  className?: string;
  title?: string;
  theme?: "dark" | "darker" | "midnight";
  prompt?: string;
  typingSpeed?: number;
  commandDelay?: number;
  outputDelay?: number;
  lineDelay?: number;
  loop?: boolean;
  loopDelay?: number;
  showTrafficLights?: boolean;
  showLineNumbers?: boolean;
  cursorChar?: string;
  startDelay?: number;
}

/* ─── Themes ─── */

const themes = {
  dark: {
    bg: "bg-[#1a1b26]",
    chrome: "bg-[#1a1b26] border-[#2a2b3a]",
    text: "text-[#a9b1d6]",
    prompt: "text-[#7aa2f7]",
    cursor: "bg-[#7aa2f7]",
    selection: "bg-[#283457]",
    scrollbar: "bg-[#2a2b3a]",
    lineNum: "text-[#3b3d52]",
    border: "border-[#2a2b3a]",
  },
  darker: {
    bg: "bg-[#0d1117]",
    chrome: "bg-[#161b22] border-[#30363d]",
    text: "text-[#c9d1d9]",
    prompt: "text-[#58a6ff]",
    cursor: "bg-[#58a6ff]",
    selection: "bg-[#1f3a5f]",
    scrollbar: "bg-[#21262d]",
    lineNum: "text-[#484f58]",
    border: "border-[#30363d]",
  },
  midnight: {
    bg: "bg-[#0a0a0f]",
    chrome: "bg-[#0f0f18] border-[#1a1a2e]",
    text: "text-[#b0b8d1]",
    prompt: "text-[#818cf8]",
    cursor: "bg-[#818cf8]",
    selection: "bg-[#1e1e3f]",
    scrollbar: "bg-[#141428]",
    lineNum: "text-[#2a2a4a]",
    border: "border-[#1a1a2e]",
  },
};

/* ─── Color Map for ANSI-like shorthand ─── */

const colorMap: Record<string, string> = {
  red: "#f7768e",
  green: "#9ece6a",
  blue: "#7aa2f7",
  yellow: "#e0af68",
  cyan: "#7dcfff",
  magenta: "#bb9af7",
  white: "#c0caf5",
  dim: "#565f89",
  orange: "#ff9e64",
  pink: "#f7768e",
  teal: "#2ac3de",
};

/* ─── Render a single output line ─── */

function OutputLine({
  line,
  themeColors,
}: {
  line: string | OutputSegment[];
  themeColors: (typeof themes)["dark"];
}) {
  if (typeof line === "string") {
    return <span className={themeColors.text}>{line}</span>;
  }

  return (
    <>
      {line.map((seg, i) => (
        <span
          key={i}
          style={{ color: seg.color ? colorMap[seg.color] || seg.color : undefined }}
          className={cn(
            !seg.color && themeColors.text,
            seg.bold && "font-bold",
            seg.dim && "opacity-50"
          )}
        >
          {seg.text}
        </span>
      ))}
    </>
  );
}

/* ─── Blinking Cursor ─── */

function Cursor({
  char,
  themeColors,
  visible,
}: {
  char: string;
  themeColors: (typeof themes)["dark"];
  visible: boolean;
}) {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <span
      className={cn(
        "inline-block w-[8px] h-[18px] align-middle -mb-[2px] ml-px transition-opacity duration-75",
        themeColors.cursor,
        blink ? "opacity-100" : "opacity-0"
      )}
    >
      {char === "█" ? "" : char}
    </span>
  );
}

/* ─── Traffic Light Dots ─── */

function TrafficLights() {
  return (
    <div className="flex items-center gap-2">
      <div className="size-3 rounded-full bg-[#ff5f57] shadow-[0_0_4px_#ff5f5740]" />
      <div className="size-3 rounded-full bg-[#febc2e] shadow-[0_0_4px_#febc2e40]" />
      <div className="size-3 rounded-full bg-[#28c840] shadow-[0_0_4px_#28c84040]" />
    </div>
  );
}

/* ─── Rendered Line Type ─── */

interface RenderedLine {
  type: "command" | "output" | "empty";
  prompt?: string;
  text: string;
  segments?: (string | OutputSegment[])[];
  fullCommand?: string;
}

/* ─── Main Component ─── */

export function Component({
  steps,
  className,
  title = "terminal",
  theme = "dark",
  prompt = "~$",
  typingSpeed = 50,
  commandDelay = 800,
  outputDelay = 100,
  lineDelay = 40,
  loop = true,
  loopDelay = 3000,
  showTrafficLights = true,
  showLineNumbers = false,
  cursorChar = "█",
  startDelay = 500,
}: AnimatedTerminalProps) {
  const themeColors = themes[theme];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<RenderedLine[]>([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTypingCommand, setIsTypingCommand] = useState(false);
  const runningRef = useRef(true);

  const sleep = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        // Allow cleanup — not perfect but works for demo
        return () => clearTimeout(id);
      }),
    []
  );

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, currentTyping]);

  // Main animation sequence
  useEffect(() => {
    runningRef.current = true;

    async function run() {
      await new Promise((r) => setTimeout(r, startDelay));

      while (runningRef.current) {
        for (let si = 0; si < steps.length; si++) {
          if (!runningRef.current) return;

          const step = steps[si];
          const speed = step.typingSpeed ?? typingSpeed;
          const delay = step.delay ?? commandDelay;

          // Pause before typing
          if (si > 0) {
            await new Promise((r) => setTimeout(r, delay));
          }

          // Type command character by character
          setIsTypingCommand(true);
          setCursorVisible(true);

          for (let ci = 0; ci <= step.command.length; ci++) {
            if (!runningRef.current) return;
            setCurrentTyping(step.command.slice(0, ci));

            // Variable typing speed for realism
            const jitter = speed * (0.5 + Math.random());
            await new Promise((r) => setTimeout(r, jitter));
          }

          // Brief pause after typing, cursor blinks
          await new Promise((r) => setTimeout(r, 300));

          // "Press enter" — commit command line
          setIsTypingCommand(false);
          setCurrentTyping("");
          setLines((prev) => [
            ...prev,
            {
              type: "command",
              prompt,
              text: step.command,
              fullCommand: step.command,
            },
          ]);

          // Hide cursor during output
          setCursorVisible(false);

          // Output lines appear one by one
          await new Promise((r) => setTimeout(r, outputDelay));

          for (let li = 0; li < step.output.length; li++) {
            if (!runningRef.current) return;

            const outputLine = step.output[li];

            setLines((prev) => [
              ...prev,
              {
                type: typeof outputLine === "string" && outputLine === "" ? "empty" : "output",
                text:
                  typeof outputLine === "string" ? outputLine : "",
                segments: typeof outputLine !== "string" ? [outputLine] : undefined,
              },
            ]);

            await new Promise((r) => setTimeout(r, lineDelay));
          }

          // Show cursor again after output
          setCursorVisible(true);
        }

        if (!loop) break;

        // Wait then reset
        await new Promise((r) => setTimeout(r, loopDelay));
        setLines([]);
        setCurrentTyping("");
      }
    }

    run();

    return () => {
      runningRef.current = false;
    };
  }, [
    steps,
    prompt,
    typingSpeed,
    commandDelay,
    outputDelay,
    lineDelay,
    loop,
    loopDelay,
    startDelay,
    sleep,
  ]);

  const lineNumber = useMemo(() => {
    return lines.length + (isTypingCommand ? 1 : 0);
  }, [lines.length, isTypingCommand]);

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden shadow-2xl shadow-black/30",
        themeColors.border,
        className
      )}
    >
      {/* Chrome bar */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b",
          themeColors.chrome,
          themeColors.border
        )}
      >
        {showTrafficLights ? <TrafficLights /> : <div />}
        <span className="text-xs font-medium text-[#565f89] select-none">
          {title}
        </span>
        <div className="w-[52px]" />
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className={cn(
          "overflow-y-auto font-mono text-[13px] leading-6 p-4 min-h-[200px] max-h-[500px]",
          themeColors.bg
        )}
      >
        {/* Rendered lines */}
        {lines.map((line, i) => (
          <div key={i} className="flex">
            {showLineNumbers && (
              <span
                className={cn(
                  "select-none w-8 shrink-0 text-right pr-3 text-xs leading-6",
                  themeColors.lineNum
                )}
              >
                {i + 1}
              </span>
            )}
            <div className="flex-1 whitespace-pre-wrap break-all">
              {line.type === "command" && (
                <>
                  <span className={cn("font-semibold mr-2", themeColors.prompt)}>
                    {line.prompt}
                  </span>
                  <span className={themeColors.text}>{line.text}</span>
                </>
              )}
              {line.type === "output" && !line.segments && (
                <span className={themeColors.text}>{line.text}</span>
              )}
              {line.type === "output" && line.segments && (
                <>
                  {line.segments.map((seg, si) => (
                    <OutputLine
                      key={si}
                      line={seg}
                      themeColors={themeColors}
                    />
                  ))}
                </>
              )}
              {line.type === "empty" && <br />}
            </div>
          </div>
        ))}

        {/* Current typing line */}
        {(isTypingCommand || cursorVisible) && (
          <div className="flex">
            {showLineNumbers && (
              <span
                className={cn(
                  "select-none w-8 shrink-0 text-right pr-3 text-xs leading-6",
                  themeColors.lineNum
                )}
              >
                {lineNumber + 1}
              </span>
            )}
            <div className="flex-1">
              <span className={cn("font-semibold mr-2", themeColors.prompt)}>
                {prompt}
              </span>
              <span className={themeColors.text}>{currentTyping}</span>
              <Cursor
                char={cursorChar}
                themeColors={themeColors}
                visible={cursorVisible}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}