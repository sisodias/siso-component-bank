"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "نظرة عامة", href: "/" },
    { name: "لوحة الشفافية", href: "/dashboard" },
    { name: "تقارير الميدان", href: "/news" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-4 left-4 right-4 z-50 mx-auto max-w-7xl">
      <div className="glass-card rounded-2xl shadow-lg shadow-cyan-950/5 transition-all duration-300 px-4 sm:px-6 lg:px-8 border border-white/60 bg-white/75 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary font-extrabold text-2xl tracking-tight focus-ring rounded-lg px-2 py-1 transition-transform active:scale-95"
            >
              <Activity className="h-6 w-6 stroke-[2.5] text-accent animate-pulse" />
              <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">أمل غزة</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1 relative">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-colors duration-200 cursor-pointer focus-ring z-10 ${
                    isActive(link.href) ? "text-white" : "text-brand-muted hover:text-primary"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/10 -z-0"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Donation CTA */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/dashboard#donate"
                className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25 cursor-pointer focus-ring"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Heart className="h-4 w-4 fill-white" />
                </motion.div>
                <span>ادعم غزة</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-brand-muted hover:text-primary hover:bg-white/60 cursor-pointer focus-ring"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -15, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-cyan-150/40 px-4 py-4 bg-white/95 rounded-b-2xl shadow-xl backdrop-blur-lg overflow-hidden mt-1 mx-2"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 cursor-pointer focus-ring ${
                    isActive(link.href)
                      ? "bg-primary text-white"
                      : "text-brand-muted hover:text-primary hover:bg-white/50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/dashboard#donate"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-accent text-white px-4 py-3 rounded-xl text-base font-bold hover:bg-accent-hover transition-all duration-200 shadow-md cursor-pointer mt-2 focus-ring"
              >
                <Heart className="h-5 w-5 fill-white" />
                <span>ادعم غزة</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
