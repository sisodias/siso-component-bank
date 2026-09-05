import { useState } from "react";
import { cn } from "../_utils/cn";
import { Check, Clipboard } from "lucide-react";

export const Component = () => {
  const [active, setActive] = useState("npm");
  const [copied, setCopied] = useState(false);

  const tabs = [
    {
      key: "npm",
      label: "Using thing 1",
      content: `{
  "mcpServers": {
    "yourThing": {
      "command": "npm",
      "args": ["install", "your-package"],
      "env": {
        "API_KEY": "YOUR_API_KEY",
        "API_URL": "https://api.yourthing.ai/"
      }
    }
  }
}`,
    },
    {
      key: "pnpm",
      label: "Using thing 2",
      content: `{
  "mcpServers": {
    "yourThing": {
      "command": "pnpm",
      "args": ["add", "your-package"],
      "env": {
        "API_KEY": "YOUR_API_KEY",
        "API_URL": "https://api.yourthing.ai/"
      }
    }
  }
}`,
    },
    {
      key: "bun",
      label: "Using thing 3",
      content: `{
  "mcpServers": {
    "yourThing": {
      "command": "bun",
      "args": ["add", "your-package"],
      "env": {
        "API_KEY": "YOUR_API_KEY",
        "API_URL": "https://api.yourthing.ai/"
      }
    }
  }
}`,
    },
  ];

  const activeTab = tabs.find((t) => t.key === active)!;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeTab.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = activeTab.content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  /** Simple regex highlighting */
  const highlightJSON = (json: string) => {
    return json.split(/(\".*?\"|\d+|true|false|null|[\{\}\[\],:])/g).map((part, i) => {
      if (/^\".*\"$/.test(part)) {
        // keys vs string values
        return part.endsWith(":") ? (
          <span key={i} className="text-sky-600 dark:text-sky-400">
            {part}
          </span>
        ) : (
          <span key={i} className="text-amber-600 dark:text-amber-300">{part}</span>
        );
      }
      if (/^\d+$/.test(part)) {
        return <span key={i} className="text-purple-600 dark:text-purple-400">{part}</span>;
      }
      if (part === "true" || part === "false") {
        return <span key={i} className="text-pink-600 dark:text-pink-400">{part}</span>;
      }
      if (part === "null") {
        return <span key={i} className="text-gray-500 italic">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="w-full max-w-3xl rounded-xl overflow-hidden bg-white/40 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg">
      <div className="px-4 py-3 text-lg font-semibold text-gray-800 dark:text-white">
        Configure Your Thing
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black/10 dark:border-white/10 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "flex-shrink-0 px-4 py-2 whitespace-nowrap",
              active === tab.key
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* JSON Code Block */}
      <div className="relative font-mono px-4 py-6 text-sm rounded-lg m-4 bg-white/70 dark:bg-white/10 backdrop-blur-md ring-1 ring-black/10 dark:ring-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <pre className="whitespace-pre leading-relaxed overflow-x-auto text-gray-800 dark:text-gray-100">
          {highlightJSON(activeTab.content)}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 rounded-md p-2 bg-black/5 dark:bg-white/10 backdrop-blur-sm"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <Clipboard className="w-4 h-4 text-gray-700 dark:text-white" />
          )}
        </button>
      </div>
    </div>
  );
};