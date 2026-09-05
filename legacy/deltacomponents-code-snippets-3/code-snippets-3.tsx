"use client"

import React, { useEffect, useRef, useState } from "react"
import { Highlight, PrismTheme } from "prism-react-renderer"
import { cn } from "../_utils/cn"

/* =========================
   Inline CopyButton (self-contained)
   ========================= */
interface InlineCopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const CopyButton = ({ value, className, ...props }: InlineCopyButtonProps) => {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // Fallback for very old browsers
      const textarea = document.createElement("textarea")
      textarea.value = value
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      try {
        document.execCommand("copy")
        setCopied(true)
        if (timerRef.current) window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => setCopied(false), 1200)
      } finally {
        document.body.removeChild(textarea)
      }
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      title={copied ? "Copied!" : "Copy"}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "border-transparent/0 hover:border-transparent/0", // let parent pass colors
        className
      )}
      {...props}
    >
      <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
      {/* icons inline to avoid imports */}
      {copied ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  )
}

/* =========================
   Inline theme definitions
   ========================= */
const defaultTheme: PrismTheme = {
  plain: { color: "#FFFFFF", backgroundColor: "#151515" },
  styles: [
    { types: ["comment"], style: { color: "#757575", fontStyle: "italic" } },
    { types: ["keyword", "property", "property-access", "attr-name"], style: { color: "#77b7d7" } },
    { types: ["tag"], style: { color: "#dfab5c" } },
    { types: ["punctuation", "symbol", "dom"], style: { color: "#ffffff" } },
    { types: ["definition", "function"], style: { color: "#86d9ca" } },
    { types: ["string", "char", "attr-value"], style: { color: "#977cdc" } },
    { types: ["static", "number"], style: { color: "#ff6658" } },
  ],
}

const lightTheme: PrismTheme = {
  plain: { color: "#24292e", backgroundColor: "#FFFFFF" },
  styles: [
    { types: ["comment"], style: { color: "#6a737d", fontStyle: "italic" } },
    { types: ["keyword", "property", "property-access", "attr-name"], style: { color: "#d73a49" } },
    { types: ["tag"], style: { color: "#22863a" } },
    { types: ["punctuation", "symbol", "dom"], style: { color: "#24292e" } },
    { types: ["definition", "function"], style: { color: "#6f42c1" } },
    { types: ["string", "char", "attr-value"], style: { color: "#032f62" } },
    { types: ["static", "number"], style: { color: "#005cc5" } },
  ],
}

/* =========================
   CodeSnippet
   ========================= */
interface CodeSnippetProps {
  title?: string
  code: string
  language?: string
  className?: string
  border?: boolean
  theme?: PrismTheme
  showLineNumbers?: boolean
  adaptiveTheme?: { light: PrismTheme; dark: PrismTheme }
  tabs?: { [key: string]: { code: string; language?: string } }
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  title,
  code,
  language = "typescript",
  className,
  border = true,
  theme,
  showLineNumbers = true,
  adaptiveTheme,
  tabs,
  activeTab,
  onTabChange,
}) => {
  const currentTab = tabs && activeTab ? activeTab : null
  const currentCode = currentTab && tabs ? tabs[currentTab].code : code
  const currentLanguage =
    currentTab && tabs ? tabs[currentTab].language || language : language

  const lines = currentCode.trim().split("\n")
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkDarkMode()
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          checkDarkMode()
        }
      })
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const selectedTheme = adaptiveTheme
    ? isDark
      ? adaptiveTheme.dark
      : adaptiveTheme.light
    : theme || (isDark ? defaultTheme : lightTheme)

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden pointer-events-auto",
        border && "border border-border",
        className
      )}
    >
      {title || tabs ? (
        <div
          className="flex items-center justify-between border-b"
          style={{
            backgroundColor: selectedTheme.plain?.backgroundColor || "#151515",
            borderBottomColor:
              selectedTheme.plain?.backgroundColor?.toLowerCase() === "#ffffff"
                ? "#e5e5e5"
                : "#2a2a2a",
          }}
        >
          {title ? (
            <h3
              className="text-sm font-medium pl-4 py-2"
              style={{ color: selectedTheme.plain?.color || "#FFFFFF" }}
            >
              {title}
            </h3>
          ) : null}

          {tabs && !title ? (
            <div className="flex items-center px-3 py-4">
              <div className="h-7 translate-y-[2px] gap-3 bg-transparent p-0 pl-1 flex">
                {Object.entries(tabs).map(([key]) => (
                  <button
                    key={key}
                    onClick={() => onTabChange?.(key)}
                    className={cn(
                      "rounded-none border-b-2 border-transparent bg-transparent p-0 pb-1.5 font-mono text-sm transition-colors",
                      activeTab === key
                        ? selectedTheme.plain?.backgroundColor?.toLowerCase() === "#ffffff"
                          ? "border-b-zinc-900 text-zinc-900"
                          : "border-b-zinc-50 text-zinc-50"
                        : selectedTheme.plain?.backgroundColor?.toLowerCase() === "#ffffff"
                          ? "text-zinc-600 hover:text-zinc-800"
                          : "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <CopyButton
            value={currentCode}
            className={cn(
              "mr-3",
              selectedTheme.plain?.backgroundColor?.toLowerCase() === "#ffffff"
                ? "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
                : "text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50"
            )}
          />
        </div>
      ) : null}

      <div
        className="relative max-h-[calc(530px-44px)] py-4"
        style={{ backgroundColor: selectedTheme.plain?.backgroundColor || "#151515" }}
      >
        {!title && !tabs && (
          <div
            className={cn(
              "absolute",
              lines.length === 1 ? "top-1/2 -translate-y-1/2 right-3" : "top-4 right-3"
            )}
          >
            <CopyButton
              value={currentCode}
              className={
                selectedTheme.plain?.backgroundColor?.toLowerCase() === "#ffffff"
                  ? "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
                  : "text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50"
              }
            />
          </div>
        )}

        <Highlight theme={selectedTheme} code={currentCode.trim()} language={currentLanguage}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} text-[13px] overflow-x-auto overflow-y-auto max-h-[calc(530px-88px)] font-mono font-medium`}
              style={style}
            >
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className="flex items-center py-px px-4"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      selectedTheme.plain?.backgroundColor?.toLowerCase() === "#ffffff"
                        ? "#f5f5f5"
                        : "#202020")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {showLineNumbers && (
                    <span
                      className="mr-4 select-none text-right text-[10px] items-center flex"
                      style={{
                        color:
                          selectedTheme.plain?.backgroundColor === "#FFFFFF" ? "#999999" : "#757575",
                        minWidth: "1.5rem",
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                  <span className={!showLineNumbers ? "ml-0" : ""}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}
