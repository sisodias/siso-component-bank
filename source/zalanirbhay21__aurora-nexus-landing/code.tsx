import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, Zap, ArrowUpRight, Moon, Sun, Globe, Cpu, Shield } from "lucide-react";

export const Component = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { scrollY } = useScroll();
  
  // Navbar shrinking effect on scroll
  const navWidth = useTransform(scrollY, [0, 100], ["95%", "70%"]);
  const navPadding = useTransform(scrollY, [0, 100], ["1.5rem", "0.75rem"]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const navLinks = ["Nexus", "Vault", "System"];

  return (
    <>
      {/* 1. INITIAL LOADING OVERLAY */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ delay: 1.2, duration: 1, ease: [0.87, 0, 0.13, 1] }}
        className="fixed inset-0 z-[100] bg-foreground flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <Zap className="w-12 h-12 text-background fill-current animate-pulse" />
          <div className="h-[2px] w-24 bg-background/20 overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="h-full w-full bg-background" 
            />
          </div>
        </motion.div>
      </motion.div>

      {/* 2. ADAPTIVE NAVBAR */}
      <motion.nav 
        style={{ width: navWidth, padding: navPadding }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex justify-center"
      >
        <div className="w-full backdrop-blur-2xl border border-white/10 bg-background/40 shadow-[0_0_40px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-between px-6 py-2 transition-colors">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Zap size={16} />
            </div>
            <span className="font-bold tracking-widest text-xs uppercase opacity-80 group-hover:opacity-100">Sync.</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <motion.a
                key={link}
                whileHover={{ y: -2 }}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <button onClick={toggleTheme} className="text-foreground/60 hover:text-foreground transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="bg-foreground text-background text-[10px] font-bold px-6 py-2 rounded-full uppercase tracking-tighter hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all"
            >
              Initialize
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </>
  );
};