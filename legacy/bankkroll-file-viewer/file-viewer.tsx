"use client";

// UNCOMMENT THIS LINE ONCE INSTALLED TO RENDER ALL THE CODE WITH SHIKI
// import { createHighlighter } from "shiki";

import { Badge } from "./badge";
import { Button } from "./button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";
import { ScrollArea } from "./scroll-area";
import { cn } from "../_utils/cn";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  Check,
  Copy,
  ExternalLink,
  FileCode,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

export interface ApiComponent {
  name: string;
  version: string;
  files: Array<{
    path: string;
    content?: string;
  }>;
}

interface TreeViewElement {
  id: string;
  name: string;
  isSelectable?: boolean;
  children?: TreeViewElement[];
}
interface TreeContextProps {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  indicator: boolean;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  direction: "rtl" | "ltr";
}
const TreeContext = createContext<TreeContextProps | null>(null);
const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) throw new Error("useTree must be used within a TreeProvider");
  return context;
};

// --- Shiki Code Viewer ---
function ShikiViewer({
  code,
  lang = "tsx",
  showLineNumbers = true,
  className,
}: {
  code: string;
  lang?: string;
  showLineNumbers?: boolean;
  className?: string;
}) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    let mounted = true;
    async function highlight() {
      try {
        setIsLoading(true);
        const shikiTheme =
          resolvedTheme === "dark" ? "github-dark" : "github-light";
        const highlighter = await createHighlighter({
          langs: [
            "tsx",
            "typescript",
            "javascript",
            "jsx",
            "json",
            "css",
            "scss",
            "html",
            "markdown",
          ],
          themes: [shikiTheme],
        });
        const highlightedHtml = highlighter.codeToHtml(code, {
          lang: lang === "tsx" ? "typescript" : lang,
          theme: shikiTheme,
        });
        if (mounted) {
          setHtml(highlightedHtml);
          setIsLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setHtml(`<pre><code>${code}</code></pre>`);
          setIsLoading(false);
        }
      }
    }
    highlight();
    return () => {
      mounted = false;
    };
  }, [code, lang, resolvedTheme]);
  const addLineNumbers = (html: string) => {
    if (!showLineNumbers) return html;
    const lines = code.split("\n");
    const lineNumbers = lines.map((_, i) => `<span>${i + 1}</span>`).join("");
    return html.replace(
      /<pre[^>]*>([\s\S]*)<\/pre>/,
      `<pre class="line-numbers"><span class="line-numbers-rows">${lineNumbers}</span>$1</pre>`
    );
  };
  return (
    <>
      <style>{`
        .shiki-viewer { border-radius: 0.5rem; overflow: hidden; border: 1px solid hsl(var(--border)); }
        .shiki-viewer pre { margin: 0; padding: 1rem; overflow-x: auto; background: transparent; font-size: 0.875rem; line-height: 1.5; white-space: pre; }
        .shiki-viewer code { background: transparent; padding: 0; border-radius: 0; font-family: inherit; font-size: inherit; line-height: inherit; white-space: pre; }
        .shiki-viewer .line-numbers { display: flex; }
        .shiki-viewer .line-numbers .line-numbers-rows { display: flex; flex-direction: column; padding-right: 0.2rem; margin-right: 0.2rem; border-right: 1px solid hsl(var(--border)); text-align: right; color: hsl(var(--muted-foreground)); font-size: 0.8755rem; user-select: none; }
        .shiki-viewer .line-numbers .line-numbers-rows > span { display: block; min-width: 2rem; }
      `}</style>
      <div className={cn("shiki-viewer", className)}>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-pulse text-muted-foreground">
              Loading code...
            </div>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: addLineNumbers(html) }} />
        )}
      </div>
    </>
  );
}

// --- File Header ---
function FileHeader({
  file,
  component,
  onCopy,
  copied,
}: {
  file: { path: string; content?: string };
  component: ApiComponent;
  onCopy: () => void;
  copied: boolean;
}) {
  const getFileType = (filePath: string) => {
    if (filePath.endsWith(".tsx")) return "TSX";
    if (filePath.endsWith(".ts")) return "TS";
    if (filePath.endsWith(".js")) return "JS";
    if (filePath.endsWith(".jsx")) return "JSX";
    if (filePath.endsWith(".md")) return "MD";
    if (filePath.endsWith(".css")) return "CSS";
    if (filePath.endsWith(".json")) return "JSON";
    return "TXT";
  };
  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b">
      <div className="flex items-center gap-2 min-w-0">
        <Badge variant="outline" className="text-xs">
          {getFileType(file.path)}
        </Badge>
        <span className="text-xs text-muted-foreground truncate">
          {file.path}
        </span>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="cursor-pointer h-8 w-8 p-0"
          title="Copy file content"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-8 w-8 p-0"
          title="View on GitHub"
        >
          <a
            href="https://21st.dev/bankkroll/file-viewer/default"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}

// --- File Tree ---
function TreeIndicator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { direction } = useTree();
  return (
    <div
      className={cn(
        "absolute left-1.5 h-full w-px rounded-md bg-muted py-3 transition-colors hover:bg-slate-300 rtl:right-1.5",
        className
      )}
      {...props}
    />
  );
}
function Folder({
  element,
  value,
  isSelectable = true,
  isSelect,
  children,
  className,
}: {
  element: string;
  value: string;
  isSelectable?: boolean;
  isSelect?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const {
    direction,
    handleExpand,
    expandedItems,
    indicator,
    openIcon,
    closeIcon,
  } = useTree();
  return (
    <AccordionPrimitive.Item
      value={value}
      className="relative h-full overflow-hidden"
    >
      <AccordionPrimitive.Trigger
        className={cn(
          "flex items-center gap-1 rounded-md text-sm px-2 py-1 hover:bg-accent hover:text-accent-foreground cursor-pointer",
          isSelect && isSelectable && "bg-muted",
          !isSelectable && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={!isSelectable}
        onClick={() => handleExpand(value)}
      >
        {expandedItems?.includes(value)
          ? openIcon ?? <FolderOpenIcon className="h-4 w-4" />
          : closeIcon ?? <FolderIcon className="h-4 w-4" />}
        <span className="truncate">{element}</span>
      </AccordionPrimitive.Trigger>
      <AccordionPrimitive.Content className="relative h-full overflow-hidden text-sm">
        {indicator && <TreeIndicator />}
        <AccordionPrimitive.Root
          type="multiple"
          className={cn(
            "ml-5 flex flex-col gap-1 py-1",
            direction === "rtl" && "mr-5"
          )}
          value={expandedItems}
        >
          {children}
        </AccordionPrimitive.Root>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
function File({
  value,
  isSelectable = true,
  isSelect,
  fileIcon,
  children,
  className,
  onClick,
}: {
  value: string;
  isSelectable?: boolean;
  isSelect?: boolean;
  fileIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { selectedId, selectItem } = useTree();
  const isSelected = isSelect ?? selectedId === value;
  return (
    <button
      disabled={!isSelectable}
      className={cn(
        "flex w-fit items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors cursor-pointer",
        isSelected && isSelectable && "bg-muted",
        !isSelectable
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={() => {
        selectItem(value);
        onClick?.();
      }}
    >
      {fileIcon ?? <FileIcon className="h-4 w-4" />}
      <span className="truncate">{children}</span>
    </button>
  );
}
function Tree({
  elements,
  initialSelectedId,
  initialExpandedItems,
  children,
  className,
  indicator = true,
  openIcon,
  closeIcon,
  dir = "ltr",
}: {
  elements?: TreeViewElement[];
  initialSelectedId?: string;
  initialExpandedItems?: string[];
  children: React.ReactNode;
  className?: string;
  indicator?: boolean;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  dir?: "rtl" | "ltr";
}) {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId
  );
  const [expandedItems, setExpandedItems] = useState<string[] | undefined>(
    initialExpandedItems
  );
  const getAllExpandableItems = useCallback(
    (elements?: TreeViewElement[]): string[] => {
      const expandableItems: string[] = [];
      const traverse = (items: TreeViewElement[]) => {
        items.forEach((item) => {
          if (item.children?.length) {
            expandableItems.push(item.id);
            traverse(item.children);
          }
        });
      };
      if (elements) traverse(elements);
      return expandableItems;
    },
    []
  );
  const selectItem = useCallback((id: string) => setSelectedId(id), []);
  const handleExpand = useCallback((id: string) => {
    setExpandedItems((prev) => {
      if (prev?.includes(id)) return prev.filter((item) => item !== id);
      return [...(prev ?? []), id];
    });
  }, []);
  useEffect(() => {
    if (elements) setExpandedItems(getAllExpandableItems(elements));
  }, [elements, getAllExpandableItems]);
  return (
    <TreeContext.Provider
      value={{
        selectedId,
        expandedItems,
        handleExpand,
        selectItem,
        setExpandedItems,
        indicator,
        openIcon,
        closeIcon,
        direction: dir,
      }}
    >
      <div className={cn("size-full", className)}>
        <div className="relative h-full px-2">
          <AccordionPrimitive.Root
            type="multiple"
            value={expandedItems}
            className="flex flex-col gap-1"
          >
            {children}
          </AccordionPrimitive.Root>
        </div>
      </div>
    </TreeContext.Provider>
  );
}
function TreeItem({
  item,
  selectedFile,
  onFileSelect,
}: {
  item: TreeViewElement;
  selectedFile?: string;
  onFileSelect: (file: string) => void;
}) {
  if (item.children?.length) {
    return (
      <Folder
        key={item.id}
        element={item.name}
        value={item.id}
        className="truncate"
      >
        {item.children.map((child) => (
          <TreeItem
            key={child.id}
            item={child}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
          />
        ))}
      </Folder>
    );
  }
  return (
    <File
      key={item.id}
      value={item.id}
      onClick={() => onFileSelect(item.id)}
      isSelectable={true}
      isSelect={selectedFile === item.id}
      className="truncate whitespace-nowrap"
    >
      {item.name}
    </File>
  );
}
function FileTree({
  tree,
  selectedFile,
  onFileSelect,
  component,
}: {
  tree: TreeViewElement[];
  selectedFile?: string;
  onFileSelect: (file: string) => void;
  component: ApiComponent;
}) {
  const allExpandableItems = useMemo(() => {
    const expandableItems: string[] = [];
    const traverse = (elements: TreeViewElement[]) => {
      elements.forEach((element) => {
        if (element.children?.length) {
          expandableItems.push(element.id);
          traverse(element.children);
        }
      });
    };
    traverse(tree);
    return expandableItems;
  }, [tree]);
  return (
    <div className="w-full h-full border-r">
      <div className="p-3 border-b flex items-center gap-2">
        <FileCode className="h-4 w-4" />
        <span className="text-sm font-medium">{component.name} {component.version}</span>
      </div>
      <ScrollArea className="h-96 lg:h-[calc(100vh-300px)]">
        <div className="p-2">
          <Tree
            elements={tree}
            initialExpandedItems={allExpandableItems}
            initialSelectedId={selectedFile}
            indicator
          >
            {tree.map((item) => (
              <TreeItem
                key={item.id}
                item={item}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
              />
            ))}
          </Tree>
        </div>
      </ScrollArea>
    </div>
  );
}

// --- Main Component ---
export default function ComponentFileViewer({
  component,
}: {
  component: ApiComponent;
}) {
  const [selectedFile, setSelectedFile] = useState<string | undefined>(
    undefined
  );
  const [copied, setCopied] = useState(false);
  const files = component.files.filter((f) => f.content);
  // Build tree structure
  const tree = useMemo(() => {
    const root: Record<string, any> = {};
    for (const file of files) {
      const parts = file.path.split("/");
      let current = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] =
            i === parts.length - 1
              ? { ...file, id: file.path, name: part, isSelectable: true }
              : {
                  id: parts.slice(0, i + 1).join("/"),
                  name: part,
                  children: {},
                  isSelectable: false,
                };
        }
        current = current[part].children || current[part];
      }
    }
    const toArray = (obj: Record<string, any>): TreeViewElement[] =>
      Object.values(obj).map((item: any) =>
        item.children ? { ...item, children: toArray(item.children) } : item
      );
    return toArray(root);
  }, [files]);
  const selected = files.find((f) => f.path === selectedFile) || files[0];
  useEffect(() => {
    if (!selectedFile && files.length > 0) {
      setSelectedFile(files[0].path);
    }
  }, [files, selectedFile]);
  const handleCopy = () => {
    if (selected?.content) {
      navigator.clipboard.writeText(selected.content);
      setCopied(true);
      toast.success("File content copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[600px] rounded-lg border overflow-hidden"
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        <FileTree
          tree={tree}
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
          component={component}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75} minSize={40}>
        {selected && (
          <div className="h-full flex flex-col">
            <FileHeader
              file={selected}
              component={component}
              onCopy={handleCopy}
              copied={copied}
            />
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="w-full h-[calc(100vh-20rem)]">
                <ShikiViewer
                  code={selected.content || ""}
                  lang={selected.path.split(".").pop() || "txt"}
                  className="min-h-full"
                />
              </ScrollArea>
            </div>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}