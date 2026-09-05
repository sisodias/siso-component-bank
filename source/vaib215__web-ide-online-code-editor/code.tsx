"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import {
  Folder,
  File as FileIcon,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Play,
  Monitor,
  Smartphone,
  Tablet,
  Terminal as TerminalIcon,
  Settings,
  Copy,
  Check,
  Download,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// File Tree Types
type FileNode = {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
}

// Initial file structure
const initialFiles: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "1-1",
        name: "index.html",
        type: "file",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web IDE</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <h1>Hello from Web IDE</h1>
    <p>Edit files to see changes</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "1-2",
        name: "styles.css",
        type: "file",
        content: `body {
  margin: 0;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

h1 {
  color: #667eea;
  margin-top: 0;
}`,
      },
      {
        id: "1-3",
        name: "script.js",
        type: "file",
        content: `console.log('Web IDE loaded successfully!');

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  console.log('App element:', app);
});`,
      },
    ],
  },
  {
    id: "2",
    name: "package.json",
    type: "file",
    content: `{
  "name": "web-ide-project",
  "version": "1.0.0",
  "description": "A web-based IDE project"
}`,
  },
]

// File Tree Component
function FileTreeItem({
  node,
  level = 0,
  expanded,
  selected,
  onToggle,
  onSelect,
}: {
  node: FileNode
  level?: number
  expanded: Record<string, boolean>
  selected: string | null
  onToggle: (id: string) => void
  onSelect: (node: FileNode) => void
}) {
  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-muted/50 transition-colors",
          selected === node.id && "bg-muted"
        )}
        style={{ paddingLeft: level * 12 + 8 }}
        onClick={() => {
          if (node.type === "folder") {
            onToggle(node.id)
          } else {
            onSelect(node)
          }
        }}
      >
        {node.type === "folder" ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggle(node.id)
              }}
              className="inline-flex items-center justify-center w-4 h-4"
            >
              {expanded[node.id] ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
            <Folder size={16} className="text-muted-foreground" />
          </>
        ) : (
          <>
            <span className="w-4" />
            <FileIcon size={14} className="text-muted-foreground" />
          </>
        )}
        <span className="text-sm truncate flex-1">{node.name}</span>
      </div>
      {node.children &&
        node.children.length > 0 &&
        expanded[node.id] &&
        node.children.map((child) => (
          <FileTreeItem
            key={child.id}
            node={child}
            level={level + 1}
            expanded={expanded}
            selected={selected}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))}
    </div>
  )
}

// Code Editor Component
function CodeEditor({
  content,
  onChange,
  language = "javascript",
}: {
  content: string
  onChange: (value: string) => void
  language?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs text-muted-foreground">{language}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </Button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-4 font-mono text-sm bg-background text-foreground resize-none focus:outline-none"
        spellCheck={false}
      />
    </div>
  )
}

// Terminal Component
function Terminal() {
  const [output, setOutput] = useState<string[]>([
    "Web IDE Terminal v1.0.0",
    "Type 'help' for available commands",
    "",
  ])
  const [input, setInput] = useState("")
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim()
    setOutput((prev) => [...prev, `$ ${trimmed}`])

    if (!trimmed) return

    if (trimmed === "help") {
      setOutput((prev) => [
        ...prev,
        "Available commands:",
        "  help    - Show this help message",
        "  clear   - Clear terminal",
        "  echo    - Echo text",
        "",
      ])
    } else if (trimmed === "clear") {
      setOutput([])
    } else if (trimmed.startsWith("echo ")) {
      setOutput((prev) => [...prev, trimmed.substring(5), ""])
    } else {
      setOutput((prev) => [...prev, `Command not found: ${trimmed}`, ""])
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <TerminalIcon size={14} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Terminal</span>
      </div>
      <div
        ref={outputRef}
        className="flex-1 p-3 font-mono text-xs overflow-auto"
      >
        {output.map((line, i) => (
          <div key={i} className="text-foreground">
            {line}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
        <span className="text-xs text-muted-foreground">$</span>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommand(input)
              setInput("")
            }
          }}
          className="flex-1 h-7 text-xs font-mono border-0 shadow-none focus-visible:ring-0 px-0"
          placeholder="Type a command..."
        />
      </div>
    </div>
  )
}

// Preview Component
function Preview({ files }: { files: FileNode[] }) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  )
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const findFile = (
    nodes: FileNode[],
    name: string
  ): FileNode | undefined => {
    for (const node of nodes) {
      if (node.name === name && node.type === "file") return node
      if (node.children) {
        const found = findFile(node.children, name)
        if (found) return found
      }
    }
  }

  useEffect(() => {
    const htmlFile = findFile(files, "index.html")
    const cssFile = findFile(files, "styles.css")
    const jsFile = findFile(files, "script.js")

    if (iframeRef.current && htmlFile) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        let html = htmlFile.content || ""

        if (cssFile && cssFile.content) {
          html = html.replace(
            '<link rel="stylesheet" href="styles.css">',
            `<style>${cssFile.content}</style>`
          )
        }

        if (jsFile && jsFile.content) {
          html = html.replace(
            '<script src="script.js"></script>',
            `<script>${jsFile.content}</script>`
          )
        }

        doc.open()
        doc.write(html)
        doc.close()
      }
    }
  }, [files])

  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs text-muted-foreground">Preview</span>
        <div className="flex items-center gap-1">
          <Button
            variant={device === "desktop" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDevice("desktop")}
            className="h-7 w-7 p-0"
          >
            <Monitor size={14} />
          </Button>
          <Button
            variant={device === "tablet" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDevice("tablet")}
            className="h-7 w-7 p-0"
          >
            <Tablet size={14} />
          </Button>
          <Button
            variant={device === "mobile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setDevice("mobile")}
            className="h-7 w-7 p-0"
          >
            <Smartphone size={14} />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-muted/20 flex items-start justify-center p-4">
        <div
          className="bg-background border border-border transition-all duration-300"
          style={{
            width: deviceWidths[device],
            height: "100%",
            minHeight: "400px",
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            sandbox="allow-scripts"
            title="preview"
          />
        </div>
      </div>
    </div>
  )
}

// Main IDE Component
export default function WebIDE() {
  const [files, setFiles] = useState<FileNode[]>(initialFiles)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "1": true })
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [openTabs, setOpenTabs] = useState<FileNode[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const toggleFolder = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSelectFile = (node: FileNode) => {
    setSelectedFile(node.id)
    if (!openTabs.find((tab) => tab.id === node.id)) {
      setOpenTabs((prev) => [...prev, node])
    }
    setActiveTab(node.id)
  }

  const handleCloseTab = (id: string) => {
    setOpenTabs((prev) => prev.filter((tab) => tab.id !== id))
    if (activeTab === id) {
      const index = openTabs.findIndex((tab) => tab.id === id)
      if (index > 0) {
        setActiveTab(openTabs[index - 1].id)
      } else if (openTabs.length > 1) {
        setActiveTab(openTabs[1].id)
      } else {
        setActiveTab(null)
      }
    }
  }

  const updateFileContent = (id: string, content: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === id) {
          return { ...node, content }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }
    setFiles(updateNode(files))
    setOpenTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, content } : tab))
    )
  }

  const activeFile = openTabs.find((tab) => tab.id === activeTab)

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full flex flex-col bg-muted/30">
              <div className="px-3 py-2 border-b border-border">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase">
                  Project Files
                </h2>
              </div>
              <div className="flex-1 overflow-auto">
                {files.map((node) => (
                  <FileTreeItem
                    key={node.id}
                    node={node}
                    expanded={expanded}
                    selected={selectedFile}
                    onToggle={toggleFolder}
                    onSelect={handleSelectFile}
                  />
                ))}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Editor Area */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} minSize={30}>
                <div className="h-full flex flex-col">
                  {/* Tabs */}
                  {openTabs.length > 0 && (
                    <div className="flex items-center gap-px bg-muted/30 border-b border-border overflow-x-auto">
                      {openTabs.map((tab) => (
                        <div
                          key={tab.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-xs cursor-pointer border-r border-border hover:bg-muted/50 transition-colors",
                            activeTab === tab.id && "bg-background"
                          )}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          <FileIcon size={12} className="text-muted-foreground" />
                          <span>{tab.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCloseTab(tab.id)
                            }}
                            className="hover:bg-muted p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Editor */}
                  <div className="flex-1 overflow-hidden">
                    {activeFile ? (
                      <CodeEditor
                        content={activeFile.content || ""}
                        onChange={(content) =>
                          updateFileContent(activeFile.id, content)
                        }
                        language={
                          activeFile.name.endsWith(".js")
                            ? "javascript"
                            : activeFile.name.endsWith(".css")
                            ? "css"
                            : activeFile.name.endsWith(".html")
                            ? "html"
                            : "text"
                        }
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        Select a file to edit
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Terminal */}
              <ResizablePanel defaultSize={30} minSize={20}>
                <Terminal />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <Preview files={files} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
