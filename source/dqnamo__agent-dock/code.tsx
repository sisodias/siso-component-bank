"use client";

import {
  ChatIcon,
  MicrophoneIcon,
  PaperPlaneTiltIcon,
  XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";

type AgentDockMode = "idle" | "composing" | "working";

type AgentDockProps = {
  agentName: string;
  avatarSrc: string;
  className?: string;
  idleStatus?: string;
  workingStatus?: string;
  onMessageSubmit?: (message: string) => void | Promise<void>;
};

const dockTransition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
} as const;

export function AgentDock({
  agentName,
  avatarSrc,
  className,
  idleStatus = "Ready",
  workingStatus = "Working...",
  onMessageSubmit,
}: AgentDockProps) {
  const [mode, setMode] = useState<AgentDockMode>("idle");
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldReduceMotion = useReducedMotion();

  function openComposer() {
    setMode("composing");
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  }

  async function submitMessage() {
    const nextMessage = message.trim();
    if (!nextMessage) {
      openComposer();
      return;
    }
    setMessage("");
    setMode("working");
    await onMessageSubmit?.(nextMessage);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "composing") {
      void submitMessage();
      return;
    }
    openComposer();
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }
    event.preventDefault();
    void submitMessage();
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="flex w-full flex-col-reverse overflow-hidden rounded-2xl bg-neutral-950 p-2 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <img
            alt=""
            aria-hidden="true"
            className="size-9 shrink-0 rounded-xl"
            height={36}
            src={avatarSrc}
            width={36}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-none">
              {agentName}
            </p>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 truncate text-xs text-neutral-400"
                exit={{ opacity: 0, y: -6 }}
                initial={{ opacity: 0, y: 6 }}
                key={mode}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                {mode === "working" ? workingStatus : idleStatus}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <DockButton
              icon={<MicrophoneIcon weight="bold" />}
              label="Voice"
              shortcut="V"
            />
            <DockButton
              icon={
                mode === "composing" ? (
                  <PaperPlaneTiltIcon weight="fill" />
                ) : (
                  <ChatIcon weight="bold" />
                )
              }
              label={mode === "composing" ? "Send" : "Chat"}
              shortcut="C"
              type="submit"
            />
          </div>
        </div>
        <motion.div
          animate={{
            height: mode === "composing" ? 120 : 0,
            opacity: mode === "composing" ? 1 : 0,
          }}
          aria-hidden={mode !== "composing"}
          className="overflow-hidden"
          initial={false}
          transition={shouldReduceMotion ? { duration: 0 } : dockTransition}
        >
          <div className="relative mb-2">
            <button
              aria-label="Close composer"
              className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-md text-neutral-400 hover:bg-white/10 hover:text-white"
              onClick={() => setMode("idle")}
              type="button"
            >
              <XIcon className="size-3.5" weight="bold" />
            </button>
            <textarea
              aria-label="Message agent"
              className="h-28 w-full resize-none bg-transparent px-2 py-2 pr-9 text-sm leading-6 outline-none placeholder:text-neutral-500"
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Type something here..."
              ref={textareaRef}
              value={message}
            />
          </div>
        </motion.div>
      </div>
    </form>
  );
}

function DockButton({
  icon,
  label,
  shortcut,
  type = "button",
}: {
  icon: ReactNode;
  label: string;
  shortcut: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      className="flex h-9 items-center gap-1.5 rounded-lg px-1.5 text-sm font-medium hover:bg-white/10"
      type={type}
    >
      <span className="size-4">{icon}</span>
      <span>{label}</span>
      <kbd className="flex size-6 items-center justify-center rounded-md bg-white/10 font-mono text-xs">
        {shortcut}
      </kbd>
    </button>
  );
}

export default AgentDock;
