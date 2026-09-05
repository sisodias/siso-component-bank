"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BrainCircuit,
  Search,
  Paperclip,
  Mic,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { LucideIcon } from "lucide-react";

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  color: string;
}

export interface ModelOption {
  id: string;
  name: string;
}

interface AIChatSheetProps {
  username?: string;
  models: ModelOption[];
  quickActions: QuickAction[];
}

export function AIChatSheet({
  username = "User",
  models,
  quickActions,
}: AIChatSheetProps) {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelOption>(models[0]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <BrainCircuit className="size-4 animate-pulse mr-2" /> AI Chat Sheet
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col sm:m-4 sm:h-[calc(100vh-2rem)] sm:rounded-lg border-0 sm:border overflow-hidden"
      >
      
        <div className="flex items-center px-6 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs rounded-lg">
                {selectedModel.name}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="mt-2">
              {models.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                >
                  {model.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-8 space-y-6">
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full border">
                <BrainCircuit className="opacity-80 size-8" />
              </div>
            </motion.div>

            <motion.div
              className="text-center space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-base font-normal text-muted-foreground">
                Hi {username},
              </h2>
              <p className="text-2xl font-semibold text-foreground leading-tight">
                How can I help?
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Ask me anything or pick a task to get started quickly!
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.2 },
                },
              }}
            >
              {quickActions.map((action, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  <Button
                    variant="outline"
                    className="h-auto px-3 flex items-center justify-start gap-2 hover:bg-accent/50 bg-card transition-colors rounded-lg text-xs cursor-pointer"
                  >
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                    <span className="font-semibold">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="flex-1" />
          <motion.div
            className="bg-background"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="px-4 py-3">
              <div className="relative flex items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 border-0 bg-transparent px-0 py-0.5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-auto"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
