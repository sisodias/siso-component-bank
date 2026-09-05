import { motion } from "framer-motion";
import { useState } from "react";

interface NavBarItem {
  label: string;
  link: string;
}

export function EclipseNavBar({
  items,
  setDark,
}: {
  items: NavBarItem[];
  setDark: () => void;
}) {
  const [isDark, setIsDark] = useState(false);
  const [active, setActive] = useState(items[0]?.link || ""); // first item default

  return (
    <nav className="w-full flex justify-center">
      <div className="relative flex flex-wrap items-center gap-4 py-2 px-4 rounded-4xl bg-background text-foreground border border-foreground select-none shadow-sm">
        {items.map((item) => (
          <button
            key={item.link}
            onClick={() => setActive(item.link)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-3xl ${
              active === item.link ? "text-background" : "text-foreground"
            }`}
          >
            {active === item.link && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-3xl bg-foreground shadow-md"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}

        {/* Theme toggle button */}
        <button
          role="button"
          aria-pressed={isDark}
          className="flex justify-center items-center overflow-hidden relative w-12 h-12 rounded-full cursor-pointer"
          onClick={() => {
            setIsDark(!isDark);
            setDark();
          }}
        >
          {/* Subtle background darkening when dark */}
          <motion.div
            className="absolute inset-0 bg-black/40 rounded-full"
            animate={{ opacity: isDark ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Sun */}
          <motion.div
            className="bg-amber-500 w-6 h-6 rounded-full shadow-[0_0_0px_rgba(255,255,255,0.6)]"
            animate={{
              boxShadow: isDark
                ? "0 0 12px rgba(255,255,255,0.9)" // glow ON
                : "0 0 0px rgba(0,0,0,0)", // glow OFF
            }}
            transition={{ ease: "easeInOut", duration: 0.4, delay: 0.2 }}
          />

          {/* Moon (slide in) */}
          <motion.div
            initial={{ top: -40, right: -30, opacity: 0 }}
            animate={{
              top: isDark ? 12 : -40,
              right: isDark ? 12 : -30,
              opacity: isDark ? 1 : 0,
            }}
            className="absolute z-10 bg-black w-6 h-6 rounded-full"
            transition={{ ease: "easeInOut", duration: 0.4 }}
          />

          {/* Star */}
          <motion.div
            initial={{ top: 4, right: 7, opacity: 0, scale: 0 }}
            animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0 }}
            className="absolute z-20"
            transition={{
              delay: isDark ? 0.4 : 0.1,
              duration: isDark ? 0.4 : 0.2,
            }}
          >
            <img
              src="https://i.postimg.cc/L67hQ0S6/image-removebg-preview.png"
              alt="star"
              className="w-4 h-4"
            />
          </motion.div>
        </button>
      </div>
    </nav>
  );
}
