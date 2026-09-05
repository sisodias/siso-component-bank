"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bot, Send, User } from "lucide-react";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

export default function AIChatComponent({
  onSend,
}: {
  onSend?: (message: string) => Promise<string>;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "ai", text: "👋 Hi! Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate or call API
    let reply = "Thinking...";
    if (onSend) {
      reply = await onSend(userMessage.text);
    } else {
      await new Promise((res) => setTimeout(res, 1000));
      reply = `🤖 You said: "${userMessage.text}"`;
    }

    const aiMessage: Message = {
      id: userMessage.id + 1,
      sender: "ai",
      text: reply,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <Card className="w-full max-w-lg h-[600px] flex flex-col border shadow-lg">
      <CardHeader className="font-semibold text-lg border-b">
        AI Assistant 💬
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 rounded-md p-3 mb-2 bg-muted/30">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="p-2 bg-muted rounded-full">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-sm text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-accent text-accent-foreground rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="p-2 bg-primary rounded-full text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="h-4 w-4" /> AI is typing<span className="animate-pulse">...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} className="px-3">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
