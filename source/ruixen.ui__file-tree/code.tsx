"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import {
  Folder,
  File as FileIcon,
  ChevronDown,
  ChevronRight,
  Trash2,
  FilePlus,
  Edit2,
} from "lucide-react";

// Simple file/folder node type
type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};

// Sample tree data used in demo
const initialTree: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      { id: "1-1", name: "components", type: "folder", children: [{ id: "1-1-1", name: "Button.tsx", type: "file" }] },
      { id: "1-2", name: "app.tsx", type: "file" },
      { id: "1-3", name: "styles.css", type: "file" },
    ],
  },
  {
    id: "2",
    name: "public",
    type: "folder",
    children: [{ id: "2-1", name: "favicon.ico", type: "file" }],
  },
  { id: "3", name: "package.json", type: "file" },
];

// utility: find node by id and return reference (helper for simple in-memory edits)
function findNodeById(nodes: FileNode[], id: string): FileNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNodeById(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

// utility: shallow clone tree and perform mutation with callback
function mutateTree(nodes: FileNode[], cb: (nodes: FileNode[]) => void) {
  const cloned = JSON.parse(JSON.stringify(nodes)) as FileNode[];
  cb(cloned);
  return cloned;
}

export default function FileTree() {
  const [tree, setTree] = useState<FileNode[]>(initialTree);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const toggle = (id: string) => {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  };

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleDelete = (id: string) => {
    const next = mutateTree(tree, (nodes) => {
      function remove(nodesArr: FileNode[]) {
        for (let i = nodesArr.length - 1; i >= 0; i--) {
          if (nodesArr[i].id === id) {
            nodesArr.splice(i, 1);
            return true;
          }
          if (nodesArr[i].children) remove(nodesArr[i].children!);
        }
        return false;
      }
      remove(nodes);
    });
    setTree(next);
    if (selected === id) setSelected(null);
  };

  const handleCreate = (parentId?: string, type: "file" | "folder" = "file") => {
    if (!newName.trim()) return;
    const node: FileNode = { id: `${Date.now()}`, name: newName.trim(), type };
    const next = mutateTree(tree, (nodes) => {
      if (!parentId) {
        nodes.push(node);
        return;
      }
      const parent = findNodeById(nodes, parentId);
      if (parent && parent.type === "folder") {
        parent.children = parent.children || [];
        parent.children.push(node);
      }
    });
    setTree(next);
    setNewName("");
    if (parentId) setExpanded((s) => ({ ...s, [parentId]: true }));
  };

  const handleRename = (id: string, name: string) => {
    const next = mutateTree(tree, (nodes) => {
      const node = findNodeById(nodes, id);
      if (node) node.name = name;
    });
    setTree(next);
  };

  // Recursive renderer for the tree
  const renderNodes = (nodes: FileNode[], level = 0) => {
    return nodes.map((n) => (
      <div key={n.id} className="group">
        <div
          role="treeitem"
          aria-expanded={n.type === "folder" ? !!expanded[n.id] : undefined}
          className={cn(
            "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-muted",
            selected === n.id ? "bg-muted/50" : ""
          )}
          style={{ paddingLeft: level * 12 + 8 }}
          onClick={() => {
            handleSelect(n.id);
            if (n.type === "folder") toggle(n.id);
          }}
        >
          {n.type === "folder" ? (
            <span className="flex items-center gap-2">
              <button
                aria-label={expanded[n.id] ? "collapse" : "expand"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(n.id);
                }}
                className="inline-flex items-center justify-center w-6 h-6"
              >
                {expanded[n.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <Folder size={18} />
            </span>
          ) : (
            <FileIcon size={16} />
          )}

          <div className="flex-1 text-sm truncate">{n.name}</div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Edit2 size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rename</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {n.children && n.children.length > 0 && expanded[n.id] && (
          <div role="group">{renderNodes(n.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <Card className="w-full max-w-2xl">
    <CardHeader>
      <CardTitle>File Tree — shadcn UI + lucide-react</CardTitle>
    </CardHeader>
    <CardContent>
      {/* ✅ Wrap TooltipProvider here */}
      <TooltipProvider>
        <div className="flex gap-2 items-center mb-3">
          {/* New file/folder input */}
          <Input
            placeholder="New file or folder name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => handleCreate(undefined, "file")}>Add File</Button>
          <Button onClick={() => handleCreate(undefined, "folder")}>Add Folder</Button>
        </div>

        <Separator className="my-2" />

        <div role="tree" className="space-y-1">
          {renderNodes(tree)}
        </div>

        <Separator className="my-3" />

        {/* footer actions */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Selected: <span className="font-medium">{selected ?? "—"}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                // quick demo action: create sample file in selected folder
                if (!selected) return;
                const node = findNodeById(tree, selected);
                if (node && node.type === "folder") {
                  handleCreate(selected, "file");
                }
              }}
            >
              <FilePlus size={14} /> Add file in selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                // quick demo: collapse all
                setExpanded({});
              }}
            >
              <ChevronRight size={14} /> Collapse all
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </CardContent>
  </Card>
  );
}
