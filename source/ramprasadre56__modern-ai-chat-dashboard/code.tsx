import { cn } from "@/lib/utils";
import {
    Plus,
    MessageSquare,
    HelpCircle,
    Activity,
    Settings,
    Paperclip,
    Mic,
    ArrowUp,
    ChevronDown,
    MoreHorizontal,
    Check,
    Sparkles,
    Zap,
    Bot,
    User,
    CreditCard,
    LayoutGrid,
    SlidersHorizontal,
    Download,
    LogOut,
    ExternalLink
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RecentChat = ({ title, active }: { title: string; active?: boolean }) => (
    <div className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200",
        active ? "bg-accent/10 text-foreground" : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
    )}>
        <span className="truncate text-sm font-medium">{title}</span>
    </div>
);

const MessageBubble = ({ role, content, avatar, isStreaming }: { role: "user" | "ai"; content: string; avatar?: string; isStreaming?: boolean }) => {
    const isAi = role === "ai";
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn("flex gap-4 mb-8 w-full", isAi ? "flex-row-reverse" : "flex-row")}
        >
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-accent/20 border border-border/50 flex items-center justify-center">
                {avatar ? (
                    <img src={avatar} alt={role} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                        {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                )}
            </div>
            <div className={cn("flex flex-col gap-1 max-w-[80%]", isAi ? "items-end" : "items-start")}>
                <span className="text-xs font-bold text-foreground/70 flex items-center gap-2">
                    {isAi ? "Acme AI" : "You"}
                </span>
                <div className={cn(
                    "text-sm leading-relaxed whitespace-pre-wrap rounded-2xl transition-all duration-300",
                    isAi ? "bg-[#1a1a1a] p-4 border border-border/60 shadow-lg text-left" : "bg-transparent py-1 text-left"
                )}>
                    {content}
                    {isStreaming && (
                        <span className="inline-block w-1.5 h-4 bg-foreground/50 ml-1 animate-pulse" />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const TypingIndicator = () => (
    <div className="flex flex-row-reverse gap-4 mb-8 w-full">
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-accent/20 border border-border/50 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col gap-1 items-end">
            <span className="text-xs font-bold text-foreground/70">Acme AI</span>
            <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-border/60 shadow-lg flex gap-1 items-center">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-foreground/40 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-foreground/40 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-foreground/40 rounded-full" />
            </div>
        </div>
    </div>
);

export const Component = () => {
    const [messages, setMessages] = useState([
        {
            role: "user" as const,
            content: "I'm writing an out-of-office message and need your help. Here's what I want to say: I'm out from 2024-5-24 to 2024-5-29, contact my colleague for questions, and I will check email when I'm back.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop"
        },
        {
            role: "ai" as const,
            content: "Here's an out-of-office message based on what you provided:\n\nSubject: Out of Office - [Your Name]\n\nThank you for your email. I am currently out of the office from Friday, May 24th, 2024 to Wednesday, May 29th, 2024. For urgent inquiries during this time, please contact my colleague, [Colleague Name], at [Colleague Email Address]. I will check my emails upon my return and respond to them as soon as possible.\n\nThank you for your understanding.",
            avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Acme"
        }
    ]);

    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState("ACME v4");
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const modelRef = useRef<HTMLDivElement>(null);
    const accountRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
                setIsModelOpen(false);
            }
            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
                setIsAccountOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const simulateAiResponse = async (userPrompt: string) => {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTyping(false);

        const aiAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=Acme";
        let fullResponse = "";

        if (userPrompt.toLowerCase().includes("hello") || userPrompt.toLowerCase().includes("hi")) {
            fullResponse = `Hello! I'm ${selectedModel}. How can I help you be creative today?`;
        } else if (userPrompt.toLowerCase().includes("thank")) {
            fullResponse = "You're very welcome! If you have any other questions or need further assistance with your creative projects, feel free to ask.";
        } else {
            fullResponse = `That's an interesting topic. As ${selectedModel}, I can help you analyze that or brainstorm some ideas. What specific aspects would you like to explore further?`;
        }

        // Add initial AI message
        setMessages(prev => [...prev, { role: "ai", content: "", avatar: aiAvatar, isStreaming: true }]);

        const words = fullResponse.split(" ");
        let currentContent = "";

        for (let i = 0; i < words.length; i++) {
            currentContent += (i === 0 ? "" : " ") + words[i];
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = currentContent;
                return newMessages;
            });
            await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
        }

        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].isStreaming = false;
            return newMessages;
        });
    };

    const handleSend = () => {
        if (!inputText.trim() || isTyping) return;

        const userMsg = {
            role: "user" as const,
            content: inputText,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop"
        };

        setMessages(prev => [...prev, userMsg]);
        const prompt = inputText;
        setInputText("");
        simulateAiResponse(prompt);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const models = [
        { id: "acme-v4", name: "ACME v4", desc: "Newest and most advanced model", icon: Sparkles, color: "text-blue-400" },
        { id: "acme-v3.5", name: "ACME v3.5", desc: "Advanced model for complex tasks", icon: Zap, color: "text-yellow-400" },
        { id: "acme-v3", name: "ACME v3", desc: "Great for everyday tasks", icon: MessageSquare, color: "text-green-400" },
        { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", desc: "Google's most capable AI model", icon: Bot, color: "text-purple-400" },
        { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", desc: "Fast and versatile for efficiency", icon: Zap, color: "text-cyan-400" },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#050505] p-4 lg:p-8">
            <div className="flex h-full w-full max-w-[1280px] max-h-[900px] bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-primary/30 overflow-hidden rounded-[2.5rem] border border-border/40 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative">

                {/* Sidebar */}
                <aside className="w-[280px] flex flex-col border-r border-border/40 bg-[#0f0f0f] flex-shrink-0 z-20">
                    <div className="p-6 flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
                            <div className="w-5 h-5 bg-background rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-foreground rounded-sm rotate-45" />
                            </div>
                        </div>
                        <span className="font-bold text-lg tracking-tight">ACME AI</span>
                    </div>

                    <div className="px-4 mb-6 relative" ref={accountRef}>
                        <div
                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                            className={cn(
                                "p-3 rounded-xl border transition-all cursor-pointer group",
                                isAccountOpen ? "bg-accent/10 border-border" : "bg-accent/5 border-border/40 hover:bg-accent/10"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop"
                                    alt="User"
                                    className="w-8 h-8 rounded-full border border-border/40"
                                />
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-semibold truncate">Taylor Smith</span>
                                    <span className="text-[10px] text-muted-foreground truncate font-medium">taylor@mail.com</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <ChevronDown className={cn("w-3 h-3 text-muted-foreground group-hover:text-foreground transition-all", isAccountOpen && "rotate-180")} />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {isAccountOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute left-4 right-4 top-full mt-2 bg-[#1a1a1a] border border-border/60 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5"
                                >
                                    <div className="px-3 py-2 border-b border-border/40 flex items-center gap-3 mb-1">
                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop" alt="User" className="w-8 h-8 rounded-full" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold truncate text-foreground">Taylor Smith</span>
                                            <span className="text-[10px] text-muted-foreground truncate">taylor@mail.com</span>
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors group">
                                            <CreditCard className="w-4 h-4" />
                                            <span>My Plan</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors">
                                            <LayoutGrid className="w-4 h-4" />
                                            <span>My GPTs</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors">
                                            <SlidersHorizontal className="w-4 h-4" />
                                            <span>Customize AcmeAI</span>
                                        </button>
                                        <div className="h-px bg-border/40 my-1 mx-2" />
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors">
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors">
                                            <Download className="w-4 h-4" />
                                            <span>Download Desktop App</span>
                                        </button>
                                        <div className="h-px bg-border/40 my-1 mx-2" />
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors">
                                            <HelpCircle className="w-4 h-4" />
                                            <span>Help & Feedback</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors">
                                            <LogOut className="w-4 h-4" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="px-4 mb-8">
                        <button
                            onClick={() => setMessages([])}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/90 transition-all active:scale-95 shadow-lg shadow-white/5"
                        >
                            <MessageSquare className="w-4 h-4" />
                            New Chat
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
                        <div className="px-3 mb-2">
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Recent</span>
                        </div>
                        <RecentChat title="Financial Planning" />
                        <RecentChat title="Email template" />
                        <RecentChat title="React 19 examples" />
                        <RecentChat title="Custom support message" />
                        <RecentChat title="Resignation Letter" />
                        <RecentChat title="Design test review" />
                        <RecentChat title="Design systems modules" />
                        <RecentChat title="How a taximeter works" />
                        <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium group transition-colors">
                            Show more
                            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        </div>
                    </div>

                    <div className="p-4 space-y-2 border-t border-border/40 mt-auto">
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/5 cursor-pointer text-muted-foreground hover:text-foreground transition-all">
                            <HelpCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Help</span>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/5 cursor-pointer text-muted-foreground hover:text-foreground transition-all">
                            <Activity className="w-4 h-4" />
                            <span className="text-sm font-medium">Activity</span>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/5 cursor-pointer text-muted-foreground hover:text-foreground transition-all">
                            <Settings className="w-4 h-4" />
                            <span className="text-sm font-medium">Settings</span>
                        </div>
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col bg-[#0a0a0a] min-w-0 h-full relative">
                    {/* Header */}
                    <header className="h-14 border-b border-border/40 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 flex-shrink-0">
                        <div className="flex flex-col">
                            <h2 className="text-sm font-bold truncate max-w-[200px]">
                                {messages.length > 0 ? messages[0].content.slice(0, 30) + "..." : "New Chat"}
                            </h2>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Today</span>
                        </div>

                        <div className="relative" ref={modelRef}>
                            <div
                                onClick={() => setIsModelOpen(!isModelOpen)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer transition-all",
                                    isModelOpen ? "bg-accent/10 border-primary/50 text-foreground" : "bg-accent/5 border-border/40 text-muted-foreground hover:bg-accent/10"
                                )}
                            >
                                <span className="text-xs font-bold uppercase tracking-widest">{selectedModel}</span>
                                <ChevronDown className={cn("w-3 h-3 transition-transform", isModelOpen && "rotate-180")} />
                            </div>

                            <AnimatePresence>
                                {isModelOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                        className="absolute right-0 top-full mt-2 w-[280px] bg-[#1a1a1a] border border-border/60 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5"
                                    >
                                        <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Model</div>
                                        <div className="space-y-0.5">
                                            {models.map((model) => (
                                                <button
                                                    key={model.id}
                                                    onClick={() => {
                                                        setSelectedModel(model.name);
                                                        setIsModelOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                                                        selectedModel === model.name ? "bg-accent/10 ring-1 ring-blue-500/50" : "hover:bg-accent/5"
                                                    )}
                                                >
                                                    <model.icon className={cn("w-5 h-5 mt-0.5", model.color)} />
                                                    <div className="flex flex-col items-start flex-1 min-w-0 text-left">
                                                        <span className={cn("text-sm font-bold", selectedModel === model.name ? "text-foreground" : "text-muted-foreground")}>{model.name}</span>
                                                        <span className="text-[10px] text-muted-foreground/70 font-medium leading-tight">{model.desc}</span>
                                                    </div>
                                                    {selectedModel === model.name && (
                                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background">
                                                            <Check className="w-3 h-3" strokeWidth={4} />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto px-6 py-10 space-y-2 custom-scrollbar scroll-smooth">
                        <div className="max-w-3xl mx-auto w-full">
                            <AnimatePresence mode="popLayout">
                                {messages.map((msg, i) => (
                                    <MessageBubble key={i} {...msg} />
                                ))}
                            </AnimatePresence>
                            {isTyping && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-8 w-full flex-shrink-0">
                        <div className="max-w-3xl mx-auto w-full relative">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                <div className="relative bg-[#161616] rounded-[2rem] border border-border/60 p-1.5 shadow-2xl shadow-black/80 transition-all duration-300 focus-within:border-primary/40 focus-within:ring-8 focus-within:ring-primary/5">
                                    <div className="flex items-center gap-2 p-2 focus-within:bg-[#1c1c1c] rounded-[1.7rem] transition-colors">
                                        <button className="p-2.5 hover:bg-accent/10 rounded-2xl text-muted-foreground transition-colors active:scale-95">
                                            <Paperclip className="w-5 h-5" />
                                        </button>
                                        <textarea
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={`Send a message to ${selectedModel}...`}
                                            rows={1}
                                            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3.5 text-sm placeholder:text-muted-foreground/40 text-foreground font-medium custom-scrollbar"
                                        />
                                        <button className="p-2.5 hover:bg-accent/10 rounded-2xl text-muted-foreground transition-colors active:scale-95">
                                            <Mic className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleSend}
                                            disabled={!inputText.trim() || isTyping}
                                            className={cn(
                                                "p-2.5 rounded-full transition-all active:scale-95 shadow-lg ml-1",
                                                inputText.trim() && !isTyping ? "bg-white text-black shadow-white/10" : "bg-white/5 text-white/20 cursor-not-allowed"
                                            )}
                                        >
                                            <ArrowUp className="w-5 h-5" strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <span className="text-[10px] text-muted-foreground/50 font-medium font-sans tracking-wide">
                                    {selectedModel} can make mistakes. <span className="underline cursor-pointer hover:text-muted-foreground/80 transition-colors">Check important info.</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
};
