import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ModernNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navVariants = {
    transparent: {
      backgroundColor: "rgba(255, 255, 255, 0)",
      backdropFilter: "blur(0px)",
      boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
      borderRadius: "0px",
      marginTop: "16px",
      marginInline: "0px",
    },
    solid: {
      backgroundColor: "rgba(var(--background-rgb), 0.1)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      borderRadius: "50px",
      marginTop: "16px",
      marginInline: "16px",
    },
  };

  const items = [
    { label: "Home", href: "#" },
    { label: "Component", href: "#component" },
  ];

  return (
    <motion.nav
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent text-foreground"
      )}
      initial="transparent"
      animate={isScrolled ? "solid" : "transparent"}
      variants={navVariants}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex-shrink-0 font-bold text-lg sm:text-xl text-foreground">
            Brand
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-6 lg:space-x-8">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-2 py-2 text-sm lg:text-base font-medium text-foreground hover:text-muted-foreground transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Login Button */}
          <button
            className="hidden md:block px-3 lg:px-5 py-2 text-sm lg:text-base font-medium rounded-full text-foreground bg-foreground/10 hover:bg-foreground/20 backdrop-blur transition-all duration-300"
          >
            Login
          </button>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-foreground"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Items */}
      <motion.div
        className="md:hidden overflow-hidden text-foreground"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="px-4 pt-3 pb-4 space-y-2 bg-background/80 backdrop-blur-md border-t border-border/20">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-2 py-2 text-base font-medium text-foreground hover:text-muted-foreground transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4 text-foreground">
      <ModernNavbar />

      {/* Hero Section */}
      <section className="h-screen w-full px-4 sm:px-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
          Modern Design
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-md sm:max-w-xl">
          Scroll down to see the navbar transform from transparent to blurred glass.
        </p>
      </section>

      {/* Counter Section */}
      <section
        id="component"
        className="min-h-screen w-full px-4 sm:px-6 flex flex-col items-center justify-center bg-background text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Component Example</h1>
        <h2 className="text-xl sm:text-2xl font-semibold">{count}</h2>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setCount((prev) => prev - 1)}
            className="px-4 py-2 sm:px-5 sm:py-2 bg-foreground/10 hover:bg-foreground/20 rounded"
          >
            -
          </button>
          <button
            onClick={() => setCount((prev) => prev + 1)}
            className="px-4 py-2 sm:px-5 sm:py-2 bg-foreground/10 hover:bg-foreground/20 rounded"
          >
            +
          </button>
        </div>
      </section>
    </div>
  );
};
