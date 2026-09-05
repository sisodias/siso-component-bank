import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sun,
  Moon,
  KeyRound,
  Bot,
  User,
  Loader2,
  Trash2,
  X,
  Copy,
  Check,
  Settings,
  MessageSquare,
  Zap,
} from "lucide-react";

type Role = "user" | "assistant" | "system";

type Message = {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
};

type ModelOption = {
  id: string;
  label: string;
  description?: string;
};

const STORAGE_KEYS = {
  apiKey: "openrouter_api_key",
  history: "chat_history",
  model: "chat_model",
  theme: "chat_theme",
};

const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful, knowledgeable AI assistant. Provide clear, accurate, and thoughtful responses. Use formatting like **bold** for emphasis and organize longer responses with proper structure.";

const MODELS: ModelOption[] = [
  {
    id: "x-ai/grok-4-fast:free",
    label: "Grok 4 Fast",
    description: "Fast and free"
  },
  {
    id: "openai/gpt-oss-120b:free",
    label: "GPT OSS 120B",
    description: "Open source GPT"
  },
  {
    id: "z-ai/glm-4.5-air:free",
    label: "GLM 4.5 Air",
    description: "Lightweight model"
  },
  {
    id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    label: "Dolphin Mistral 24B Venice",
    description: "Venice edition"
  },
];

const DEFAULT_MODEL = MODELS[0].id;

// Utilities
const sanitize = (s: string) => s.replace(/\u0000/g, "");
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Format message content with basic markdown support
const formatMessage = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm">$1</code>');
};

export default function ChatInterface() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.theme);
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const toggleTheme = useCallback(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem(STORAGE_KEYS.theme, newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  }, [isDark]);

  // Initialize theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // API and model state
  const [apiKey, setApiKey] = useState<string>(() => 
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.apiKey) || "" : ""
  );
  const [showKeyModal, setShowKeyModal] = useState<boolean>(() => !apiKey);
  const [model, setModel] = useState<string>(() => 
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.model) || DEFAULT_MODEL : DEFAULT_MODEL
  );

  // Chat state
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.history);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        return parsed.length > 0 ? parsed : getInitialMessages();
      }
    } catch (error) {
      console.error("Failed to parse saved messages:", error);
    }
    return getInitialMessages();
  });

  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Refs
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function getInitialMessages(): Message[] {
    return [
      { 
        id: uid(), 
        role: "system", 
        content: DEFAULT_SYSTEM_PROMPT,
        timestamp: Date.now()
      },
      { 
        id: uid(), 
        role: "assistant", 
        content: apiKey 
          ? "Hello! I'm your AI assistant. How can I help you today?" 
          : "Welcome! Please add your OpenRouter API key to start chatting.",
        timestamp: Date.now()
      },
    ];
  }

  // Persistence effects
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.model, model);
    }
  }, [model]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const scrollToBottom = () => {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: "smooth"
        });
      };
      
      // Use a small delay to ensure content is rendered
      setTimeout(scrollToBottom, 50);
    }
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
    }
  }, [input]);

  // Send message function
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    
    if (!apiKey.trim()) {
      setShowKeyModal(true);
      return;
    }

    setErrorMsg(null);
    const userMessage: Message = { 
      id: uid(), 
      role: "user", 
      content: input.trim(),
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Focus input after sending
    setTimeout(() => inputRef.current?.focus(), 50);

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    try {
      const messagesForAPI = [
        { role: "system", content: DEFAULT_SYSTEM_PROMPT },
        ...messages.filter(m => m.role !== "system").map(({ role, content }) => ({ role, content })),
        { role: "user", content: userMessage.content },
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
          "X-Title": "Enhanced Chat Assistant",
        },
        body: JSON.stringify({
          model,
          stream: true,
          messages: messagesForAPI,
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok || !response.body) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.text();
          const parsed = JSON.parse(errorData);
          errorMessage = parsed.error?.message || errorMessage;
        } catch (e) {
          // Use default error message
        }
        throw new Error(errorMessage);
      }

      // Create assistant message placeholder
      const assistantId = uid();
      setMessages(prev => [...prev, { 
        id: assistantId, 
        role: "assistant", 
        content: "",
        timestamp: Date.now()
      }]);

      // Stream processing
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;
          
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content ?? "";
            
            if (typeof delta === "string" && delta.length > 0) {
              assistantContent += delta;
              const sanitizedContent = sanitize(assistantContent);
              
              setMessages(prev =>
                prev.map(m => 
                  m.id === assistantId 
                    ? { ...m, content: sanitizedContent }
                    : m
                )
              );
            }
          } catch (parseError) {
            // Ignore JSON parse errors for partial chunks
          }
        }
      }

    } catch (error: any) {
      if (error.name === "AbortError") {
        setErrorMsg("Request was cancelled");
      } else {
        setErrorMsg(error?.message || "Failed to send message. Please check your API key and try again.");
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [apiKey, input, isLoading, messages, model]);

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const clearChat = useCallback(() => {
    if (isLoading) stopGeneration();
    setMessages(getInitialMessages());
    setErrorMsg(null);
    inputRef.current?.focus();
  }, [isLoading, stopGeneration, apiKey]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const selectedModel = MODELS.find(m => m.id === model) || MODELS[0];
  const visibleMessages = messages.filter(m => m.role !== "system");

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-white dark:bg-zinc-900 transition-colors duration-200`}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-xl shadow-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                </motion.div>
                <div>
                  <h1 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    AI Chat Assistant
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {selectedModel.label} • {visibleMessages.length - 1} messages
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  title="Model Settings"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </button>
                
                <button
                  onClick={() => setShowKeyModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  title="API Key"
                >
                  <KeyRound className="w-4 h-4" />
                  <span className="hidden sm:inline">API</span>
                </button>
                
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-10 h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  title="Toggle Theme"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={clearChat}
                  className="flex items-center justify-center w-10 h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto px-4 py-6"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              <AnimatePresence initial={false}>
                {visibleMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <ChatMessage
                      message={message}
                      onCopy={() => copyMessage(message.id, message.content)}
                      copied={copiedId === message.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center py-8"
                >
                  <div className="flex items-center gap-3 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      AI is thinking...
                    </span>
                  </div>
                </motion.div>
              )}

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                        Error
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        {errorMsg}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto p-4">
            <div className="relative flex items-end gap-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 focus-within:border-blue-300 dark:focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition-all duration-200">
              <div className="flex-1 min-h-[44px]">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={apiKey ? "Type your message... (Enter to send, Shift+Enter for new line)" : "Add your API key to start chatting..."}
                  disabled={!apiKey || isLoading}
                  className="w-full min-h-[44px] max-h-[150px] p-3 bg-transparent border-none outline-none resize-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 disabled:opacity-50"
                  rows={1}
                />
              </div>
              
              <div className="flex items-center gap-2 p-2">
                {isLoading ? (
                  <button
                    onClick={stopGeneration}
                    className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shadow-lg"
                    title="Stop Generation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || !apiKey}
                    className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-300 disabled:dark:bg-zinc-700 text-white rounded-xl transition-colors shadow-lg disabled:cursor-not-allowed"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 px-2">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Model: {selectedModel.label}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => apiKey && setShowKeyModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      OpenRouter API Key
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      Enter your API key to start chatting with AI models
                    </p>
                  </div>
                  <button
                    onClick={() => apiKey && setShowKeyModal(false)}
                    className="flex items-center justify-center w-8 h-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Get your free API key at{" "}
                      <a
                        href="https://openrouter.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline"
                      >
                        openrouter.ai
                      </a>
                      . Your key is stored securely in your browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      setApiKey("");
                      localStorage.removeItem(STORAGE_KEYS.apiKey);
                    }}
                    className="px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowKeyModal(false)}
                    disabled={!apiKey.trim()}
                    className="flex-1 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-300 disabled:dark:bg-zinc-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    Save & Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      Model Settings
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      Choose your preferred AI model
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex items-center justify-center w-8 h-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {MODELS.map((modelOption) => (
                    <button
                      key={modelOption.id}
                      onClick={() => setModel(modelOption.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        model === modelOption.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">
                            {modelOption.label}
                          </div>
                          {modelOption.description && (
                            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                              {modelOption.description}
                            </div>
                          )}
                        </div>
                        {model === modelOption.id && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-6 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChatMessage({ 
  message, 
  onCopy, 
  copied 
}: { 
  message: Message; 
  onCopy: () => void; 
  copied: boolean; 
}) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
        </div>
      )}

      <div className={`flex-1 max-w-3xl ${isUser ? "flex justify-end" : ""}`}>
        <div
          className={`relative group px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? "bg-blue-500 text-white ml-12"
              : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
          }`}
        >
          <div 
            className="prose prose-sm max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: message.content ? formatMessage(message.content) : 
                     `<div class="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                        <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
                          <path d="m12 6 0 6 4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="opacity-75"/>
                        </svg>
                        Thinking...
                      </div>`
            }}
          />

          <button
            onClick={onCopy}
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg ${
              isUser 
                ? "hover:bg-blue-600" 
                : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
            }`}
            title="Copy message"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {!isUser && (
          <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Zap className="w-3 h-3" />
            <span>AI Assistant</span>
            <span>•</span>
            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-zinc-600 dark:bg-zinc-700 text-white rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
}