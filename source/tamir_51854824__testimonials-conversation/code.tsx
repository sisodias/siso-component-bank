/**
 * CustomerSupportTestimonialSection
 * 
 * A split-layout section featuring:
 * - Left: Strong testimonial/value proposition content
 * - Right: The interactive chat automation demo showing the "proof"
 * - Style: GlobalHero aesthetic (Stone/Emerald, clean, professional)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Quote, Star, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Chat Automation Logic (Internal Component) ---

interface Message {
  id: string;
  text: string;
  sender: 'executive' | 'va';
  timestamp: string;
}

const CONVERSATION_FLOW = [
  {
    sender: 'executive',
    text: "Thank you for arranging the call with Dr. Reynolds. He mentioned he had a great experience during the consultation.",
    delay: 40
  },
  {
    sender: 'va',
    text: "You're very welcome! I'm glad to hear it went well. I've already sent the follow-up summary to his office as requested.",
    delay: 30
  },
  {
    sender: 'executive',
    text: "Perfect. Please schedule a follow-up for next Tuesday at 10 AM.",
    delay: 40
  }
];

function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 400 });
  const [isBtnActive, setIsBtnActive] = useState(false);
  
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRelativePos = (el: HTMLElement | null) => {
    if (!el || !containerRef.current) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const contRect = containerRef.current.getBoundingClientRect();
    return {
      x: rect.left - contRect.left + rect.width / 2,
      y: rect.top - contRect.top + rect.height / 2
    };
  };

  const addMessage = useCallback((text: string, sender: 'executive' | 'va') => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runAutomation = useCallback(async () => {
    setMessages([]);
    setInputValue("");
    setIsTyping(false);
    setCursorPos({ x: 200, y: 400 });
    await wait(1000);

    // Message 1 (Executive)
    const inputPos = getRelativePos(inputRef.current);
    setCursorPos(inputPos);
    await wait(800);

    const text1 = CONVERSATION_FLOW[0].text;
    for (let i = 0; i <= text1.length; i++) {
      setInputValue(text1.slice(0, i));
      await wait(20 + Math.random() * 20); // Faster typing
    }
    await wait(300);

    let btnPos = getRelativePos(sendBtnRef.current);
    setCursorPos(btnPos);
    await wait(400);

    setIsBtnActive(true);
    await wait(150);
    setIsBtnActive(false);

    addMessage(text1, 'executive');
    setInputValue("");
    setCursorPos({ x: 250, y: 250 });
    await wait(800);

    // Message 2 (VA Response)
    setIsTyping(true);
    await wait(1500);
    setIsTyping(false);
    addMessage(CONVERSATION_FLOW[1].text, 'va');
    await wait(1200);

    // Message 3 (Executive Reply)
    setCursorPos(inputPos);
    await wait(600);

    const text3 = CONVERSATION_FLOW[2].text;
    for (let i = 0; i <= text3.length; i++) {
      setInputValue(text3.slice(0, i));
      await wait(20 + Math.random() * 20);
    }
    await wait(300);

    btnPos = getRelativePos(sendBtnRef.current);
    setCursorPos(btnPos);
    await wait(400);

    setIsBtnActive(true);
    await wait(150);
    setIsBtnActive(false);

    addMessage(text3, 'executive');
    setInputValue("");
    setCursorPos({ x: 200, y: 300 });

    await wait(4000);
    runAutomation();
  }, [addMessage]);

  useEffect(() => {
    runAutomation();
  }, []);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div 
      ref={containerRef}
      className="relative w-[340px] md:w-[380px] h-[600px] bg-white shadow-2xl rounded-[32px] flex flex-col overflow-hidden border border-stone-200 mx-auto"
    >
      {/* Fake Cursor */}
      <motion.div
        animate={{ x: cursorPos.x, y: cursorPos.y }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="absolute z-[100] pointer-events-none drop-shadow-md"
        style={{ left: -12, top: -12 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#1c1917" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      </motion.div>

      {/* Chat Header */}
      <div className="p-4 bg-white border-b border-stone-100 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
             <span className="font-bold text-emerald-700 text-sm">VA</span>
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
        </div>
        <div>
          <h2 className="text-stone-900 text-sm font-bold leading-tight">Sarah (Executive Asst.)</h2>
          <div className="text-stone-500 text-[10px] font-medium flex items-center gap-1 mt-0.5">
            Online Now
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatAreaRef}
        className="flex-1 p-4 flex flex-col gap-3 bg-[#F8F8F6] overflow-y-auto relative scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`max-w-[85%] p-3 text-sm leading-relaxed relative shadow-sm ${
                msg.sender === 'executive' 
                  ? 'self-end bg-stone-900 text-white rounded-[16px_16px_4px_16px]' 
                  : 'self-start bg-white text-stone-800 border border-stone-100 rounded-[16px_16px_16px_4px]'
              }`}
            >
              <p>{msg.text}</p>
              <span className={`text-[10px] mt-1 block font-medium opacity-60 text-right ${msg.sender === 'executive' ? 'text-white' : 'text-stone-400'}`}>
                {msg.timestamp}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="self-start bg-white px-3 py-2 border border-stone-100 rounded-[16px_16px_16px_4px] shadow-sm flex gap-1 items-center w-fit"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                className="w-1 h-1 bg-stone-400 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-stone-100 flex gap-2 items-center">
        <input 
          ref={inputRef}
          type="text" 
          value={inputValue}
          readOnly
          placeholder="Reply..."
          className="flex-1 h-10 bg-stone-50 border border-transparent rounded-full px-4 text-sm font-medium text-stone-900 outline-none"
        />
        <button 
          ref={sendBtnRef}
          className={`w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
            isBtnActive ? 'scale-90 bg-stone-700' : ''
          }`}
        >
          <Send size={16} strokeWidth={2.5} className="text-white ml-0.5" />
        </button>
      </div>
    </div>
  );
}

// --- Main Section Component ---

export function Component() {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-[#F8F8F6] overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-sm mb-8">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold tracking-wide text-stone-600 uppercase">Client Success Stories</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.1] mb-6 tracking-tight">
                "My practice runs smoother than ever before."
              </h2>
              
              <div className="relative mb-10">
                <Quote className="absolute -top-4 -left-6 w-12 h-12 text-emerald-100 -z-10 rotate-180" />
                <p className="text-lg lg:text-xl text-stone-600 leading-relaxed font-medium">
                  The level of professionalism from my dedicated assistant is unmatched. 
                  She handles patient follow-ups, scheduling, and correspondence with 
                  complete autonomy. It feels like she's right here in the office.
                </p>
              </div>

              {/* Author Block */}
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-full bg-stone-200 overflow-hidden border-2 border-white shadow-md">
                   <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" 
                    alt="Dr. James Reynolds"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-stone-900 font-bold text-lg">Dr. James Reynolds</div>
                  <div className="text-stone-500 text-sm font-medium">Chief of Surgery, Reynolds Medical Group</div>
                </div>
              </div>

              {/* Stats/Trust */}
              <div className="grid grid-cols-2 gap-6 border-t border-stone-200 pt-8">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-emerald-600 font-bold text-2xl">
                    98% <CheckCircle2 size={18} />
                  </div>
                  <div className="text-stone-500 text-sm font-medium">Task Completion Rate</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-amber-500 font-bold text-2xl">
                    4.9/5 <Star size={18} fill="currentColor" />
                  </div>
                  <div className="text-stone-500 text-sm font-medium">Client Satisfaction Score</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual (Chat Automation) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative elements behind phone */}
              <div className="absolute inset-0 bg-stone-900/5 blur-2xl transform scale-95 translate-y-8 rounded-[40px]" />
              
              {/* The Chat Interface Component */}
              <ChatInterface />
              
              {/* Floating Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-stone-100 max-w-[200px] hidden md:block"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-stone-200 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-600">+420 others</span>
                </div>
                <p className="text-xs text-stone-500 font-medium leading-tight">
                  Join hundreds of professionals reclaiming their time.
                </p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Component;
