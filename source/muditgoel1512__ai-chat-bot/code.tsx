import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Smile, Paperclip, MoreVertical } from "lucide-react";
const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ============================================
// INTERFACES
// ============================================

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isSent: boolean;
}

interface ChatHeaderProps {
  userName: string;
  userAvatar: string;
  isOnline: boolean;
}

interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isSent: boolean;
  index: number;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

// ============================================
// CHAT HEADER COMPONENT
// ============================================

const ChatHeader = ({ userName, userAvatar, isOnline }: ChatHeaderProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-strong rounded-t-2xl p-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={userAvatar}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
          />
          {isOnline && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full ring-2 ring-background"
            />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{userName}</h3>
          <p className="text-xs text-muted-foreground">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full hover:bg-muted/50 transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-muted-foreground" />
      </motion.button>
    </motion.div>
  );
};

// ============================================
// MESSAGE BUBBLE COMPONENT
// ============================================

const MessageBubble = ({ content, timestamp, isSent, index }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className={`flex flex-col ${isSent ? "items-end" : "items-start"} mb-4`}
    >
      <motion.div
        whileHover={{
          y: -4,
          scale: 1.02,
          transition: { type: "spring", stiffness: 400, damping: 20 },
        }}
        className={`px-4 py-3 rounded-2xl max-w-[75%] sm:max-w-[60%] cursor-pointer ${
          isSent
            ? "bg-chat-bubble-sent text-primary-foreground rounded-br-sm"
            : "bg-chat-bubble-received text-foreground rounded-bl-sm"
        }`}
        style={{
          boxShadow: isSent ? "var(--shadow-glow)" : "var(--shadow-sm)",
        }}
      >
        <p className="text-sm leading-relaxed break-words">{content}</p>
      </motion.div>
      <span className="text-xs text-muted-foreground mt-1 px-1">
        {formatTime(timestamp)}
      </span>
    </motion.div>
  );
};

// ============================================
// TYPING INDICATOR COMPONENT
// ============================================

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-sm bg-chat-bubble-received w-fit max-w-[80px]"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
      </div>
    </motion.div>
  );
};

// ============================================
// CHAT INPUT COMPONENT
// ============================================

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const isDisabled = !message.trim();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-strong rounded-b-2xl p-4"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
          <Paperclip className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
          <Smile className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        <div className="flex-1 input-focus-ring rounded-xl">
          <motion.input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full bg-chat-input-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all focus:shadow-lg"
            style={{
              boxShadow: "var(--shadow-sm)",
            }}
          />
        </div>

        <motion.button
          type="submit"
          disabled={isDisabled}
          whileHover={!isDisabled ? { scale: 1.05 } : {}}
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
          className={`p-3 rounded-xl transition-all ${
            isDisabled
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:shadow-lg"
          }`}
          style={!isDisabled ? { boxShadow: "var(--shadow-glow)" } : {}}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </form>
    </motion.div>
  );
};

// ============================================
// SAMPLE DATA
// ============================================

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hey! How are you doing today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isSent: false,
  },
  {
    id: "2",
    content: "I'm doing great! Just finished working on this awesome chat UI component.",
    timestamp: new Date(Date.now() - 1000 * 60 * 14),
    isSent: true,
  },
  {
    id: "3",
    content: "That sounds exciting! Can you tell me more about it?",
    timestamp: new Date(Date.now() - 1000 * 60 * 13),
    isSent: false,
  },
  {
    id: "4",
    content: "Sure! It's a modern chat interface with glassmorphism, smooth animations, and a beautiful gradient theme. Built with React, Framer Motion, and TailwindCSS.",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    isSent: true,
  },
  {
    id: "5",
    content: "Wow, that's impressive! I'd love to see it in action. 🚀",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    isSent: false,
  },
];

// ============================================
// MAIN CHAT CONTAINER COMPONENT
// ============================================

export const Component = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      isSent: true,
    };
    setMessages([...messages, newMessage]);

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "That's a great message! This is an automated response to showcase the chat UI. 💬",
        timestamp: new Date(),
        isSent: false,
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[700px] flex flex-col rounded-2xl overflow-hidden">
      <ChatHeader
        userName="Sarah Chen"
        userAvatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
        isOnline={true}
      />

      <div
        className="flex-1 overflow-y-auto p-6 custom-scrollbar relative"
        style={{
          background: "var(--gradient-glow)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Fade overlay at top */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background/80 to-transparent pointer-events-none z-10" />
        
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            timestamp={message.timestamp}
            isSent={message.isSent}
            index={index}
          />
        ))}

        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />

        {/* Fade overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};
