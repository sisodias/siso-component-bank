"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
}

interface ComponentProps {
  items?: NavItem[];
}

export default function Component({ items }: ComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = mounted && theme === "dark";

  const navItems: NavItem[] =
    items ??
    [
      { name: "Home", url: "/" },
      { name: "Product", url: "#features" },
      { name: "Tools", url: "/tools" },
      { name: "Pricing", url: "#pricing" },
      { name: "Sign in", url: "/auth/signin" },
    ];

  const handleLinkClick = () => setIsOpen(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        animate={{
          backgroundColor: isOpen ? "#157DEB" : isDark ? "#FFFFFF" : "#000000",
          width: isOpen ? 250 : "auto",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "rounded-lg shadow-sm border overflow-hidden",
          "border-white/20 dark:border-black/20"
        )}
      >
        {/* Toggle */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-end gap-2 w-full px-4 py-3"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-white"
              >
                <X size={20} />
                <span className="text-lg lowercase font-normal">close</span>
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-white dark:text-black"
              >
                <Menu size={20} />
                <span className="text-lg lowercase font-normal">menu</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <ul className="flex flex-col">
                {navItems.map((item, index) => {
                  const isAnchor = item.url.startsWith("#");

                  return (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-5 py-4 text-right text-white"
                    >
                      {isAnchor ? (
                        <a
                          href={item.url}
                          onClick={handleLinkClick}
                          className="group block"
                        >
                          <motion.span
                            whileHover={{ x: -8 }}
                            className="text-2xl font-medium"
                          >
                            {item.name}
                          </motion.span>
                        </a>
                      ) : (
                        <Link
                          href={item.url}
                          onClick={handleLinkClick}
                          className="group block"
                        >
                          <motion.span
                            whileHover={{ x: -8 }}
                            className="text-2xl font-medium"
                          >
                            {item.name}
                          </motion.span>
                        </Link>
                      )}
                    </motion.li>
                  );
                })}

                {/* Theme toggle */}
                <motion.li
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="px-5 py-4 text-right text-white"
                >
                  <button
                    onClick={toggleTheme}
                    className="w-full group"
                  >
                    <motion.div
                      whileHover={{ x: -8 }}
                      className="flex items-center justify-end gap-3"
                    >
                      <span className="text-2xl font-medium">Theme</span>
                      {theme === "dark" ? (
                        <Sun size={20} />
                      ) : (
                        <Moon size={20} />
                      )}
                    </motion.div>
                  </button>
                </motion.li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
