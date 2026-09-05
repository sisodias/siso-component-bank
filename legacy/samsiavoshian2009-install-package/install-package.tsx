import { useState } from "react";
import { cn } from "../_utils/cn";
import { Check, Clipboard } from "lucide-react";

/**
 * Glassmorphism Install Snippet Component
 * - Supports npm, pnpm, bun
 * - Handles clipboard copy with safe fallback
 * - Light & Dark mode styling
 */
export const Component = () => {
  const [active, setActive] = useState("npm");
  const [copied, setCopied] = useState(false);

  const tabs = [
    {
      key: "npm",
      label: "Using npm",
      command: "npm install your-package",
      comment: "# Install with npm",
    },
    {
      key: "pnpm",
      label: "Using pnpm",
      command: "pnpm add your-package",
      comment: "# Install with pnpm",
    },
    {
      key: "bun",
      label: "Using bun",
      command: "bun add your-package",
      comment: "# Install with bun",
    },
  ];

  const activeTab = tabs.find((t) => t.key === active)!;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${activeTab.command}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.warn("Clipboard copy blocked, falling back", err);
      // Fallback: Create a temporary textarea
      const textArea = document.createElement("textarea");
      textArea.value = `${activeTab.command}`;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl rounded-xl overflow-hidden",
        "bg-white/40 dark:bg-white/10 backdrop-blur-xl",
        "border border-black/10 dark:border-white/10 shadow-lg"
      )}
    >
      {/* Title */}
      <div className="px-4 py-3 text-lg font-semibold text-gray-800 dark:text-white">
        Install the Package
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black/10 dark:border-white/10 overflow-x-auto text-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "flex-shrink-0 px-4 py-2 whitespace-nowrap transition-colors",
              active === tab.key
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Glassy code block */}
      <div
        className={cn(
          "relative font-mono px-4 py-6 text-sm rounded-lg m-4",
          "bg-white/70 dark:bg-white/10 backdrop-blur-md",
          "ring-1 ring-black/10 dark:ring-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "transition-colors"
        )}
      >
        <pre className="whitespace-pre-wrap leading-relaxed">
          <code className="text-green-700 dark:text-green-400">
            {activeTab.comment}
          </code>
          {"\n"}
          <code className="text-orange-700 dark:text-orange-300">
            {activeTab.command}
          </code>
        </pre>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={cn(
            "absolute top-3 right-3 rounded-md p-2",
            "bg-black/5 hover:bg-black/10 text-gray-800",
            "dark:bg-white/10 dark:hover:bg-white/20 dark:text-white",
            "backdrop-blur-sm shadow-sm transition-colors"
          )}
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-700 dark:text-green-400" />
          ) : (
            <Clipboard className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};