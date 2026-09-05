"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const isUnsupportedBrowser = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  const isSafari =
    ua.includes("safari") &&
    !ua.includes("chrome") &&
    !ua.includes("chromium") &&
    !ua.includes("android") &&
    !ua.includes("firefox");
  const isChromeOniOS = ua.includes("crios");
  return isSafari || isChromeOniOS;
};

const buttonVariants = {
  initial: { x: 0, width: 100 },
  step1: { x: 0, width: 100 },
  step2: { x: -30, width: 180 },
};

const iconVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 16, opacity: 1 },
};

const getResultItemVariants = (index: number, isUnsupported: boolean) => ({
  initial: {
    y: 0,
    scale: 0.3,
    filter: isUnsupported ? "none" : "blur(10px)",
  },
  animate: {
    y: (index + 1) * 50,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    y: isUnsupported ? 0 : -4,
    scale: 0.8,
    color: "#000000",
  },
});

const getResultItemTransition = (index: number) => ({
  duration: 0.75,
  delay: index * 0.12,
  type: "spring" as const,
  bounce: 0.35,
  exit: { duration: index * 0.1 },
  filter: { ease: "easeInOut" },
});

function GooeyFilter() {
  return (
    <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="goo-effect">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -15"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

function SearchIcon({ isUnsupported }: { isUnsupported: boolean }) {
  return (
    <motion.svg
      initial={{
        opacity: 0,
        scale: 0.8,
        x: -4,
        filter: isUnsupported ? "none" : "blur(5px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        x: -4,
        filter: isUnsupported ? "none" : "blur(5px)",
      }}
      transition={{
        delay: 0.1,
        duration: 1,
        type: "spring",
        bounce: 0.15,
      }}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
        fill="#dddddd"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </motion.svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      className="gooey-loading-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      aria-label="Loading"
      role="status"
      style={{ width: 20, height: 20 }}
    >
      <rect width="256" height="256" fill="none" />
      <line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="#dddddd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
      <line x1="195.88" y1="60.12" x2="173.25" y2="82.75" fill="none" stroke="#dddddd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
      <line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="#dddddd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
      <line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="#dddddd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
      <line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="#dddddd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
      <line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="#dddddd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
      <line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="#dddddd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
      <line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="#dddddd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    </svg>
  );
}

function InfoIcon({ index }: { index: number }) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.12 + 0.3 }}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20.2832 19.9316"
      aria-hidden="true"
      fill="none"
      style={{ position: "relative", top: 2, width: 18, height: 18 }}
    >
      <path
        d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </motion.svg>
  );
}

export interface GooeySearchProps {
  items?: string[];
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelect?: (item: string) => void;
  className?: string;
}

export function GooeySearch({
  items = [],
  placeholder = "Type to search...",
  onSearch,
  onSelect,
  className,
}: GooeySearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setState((prev) => ({ ...prev, step: 1 }));
  };

  const [state, setState] = useState({
    step: 1 as 1 | 2,
    searchData: [] as string[],
    searchText: "",
    isLoading: false,
  });

  const debouncedSearchText = useDebounce(state.searchText, 500);
  const isUnsupported = useMemo(() => isUnsupportedBrowser(), []);

  const handleButtonClick = () => {
    setState((prev) => ({ ...prev, step: 2 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, searchText: e.target.value }));
  };

  useEffect(() => {
    if (state.step === 2) {
      inputRef.current?.focus();
    } else {
      setState((prev) => ({
        ...prev,
        searchText: "",
        searchData: [],
        isLoading: false,
      }));
    }
  }, [state.step]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        state.step === 2 &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [state.step]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.step === 2) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.step]);

  useEffect(() => {
    let isCancelled = false;

    if (debouncedSearchText) {
      setState((prev) => ({ ...prev, isLoading: true }));

      const fetchData = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const filteredData = items.filter((item) =>
            item.toLowerCase().includes(debouncedSearchText.trim().toLowerCase())
          );
          if (!isCancelled) {
            setState((prev) => ({
              ...prev,
              searchData: filteredData,
              isLoading: false,
            }));
            onSearch?.(debouncedSearchText);
          }
        } catch {
          if (!isCancelled) {
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        }
      };

      fetchData();
    } else {
      setState((prev) => ({
        ...prev,
        searchData: [],
        isLoading: false,
      }));
    }

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearchText, items, onSearch]);

  return (
    <div ref={containerRef} className={cn("gooey-wrapper", isUnsupported && "no-goo", className)}>
      <GooeyFilter />

      <div className="gooey-button-content">
        <motion.div
          className="gooey-button-content-inner"
          initial="initial"
          animate={state.step === 1 ? "step1" : "step2"}
          transition={{ duration: 0.75, type: "spring", bounce: 0.15 }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key="search-text-wrapper"
              className="gooey-search-results"
              role="listbox"
              aria-label="Search results"
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                delay: isUnsupported ? 0.5 : 1.25,
                duration: 0.5,
              }}
            >
              <AnimatePresence mode="popLayout">
                {state.searchData.map((item, index) => (
                  <motion.div
                    key={item}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    variants={getResultItemVariants(index, isUnsupported)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={getResultItemTransition(index)}
                    className="gooey-search-result"
                    role="option"
                    onClick={() => onSelect?.(item)}
                  >
                    <div className="gooey-search-result-title">
                      <InfoIcon index={index} />
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.12 + 0.3 }}
                      >
                        {item}
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <motion.div
            variants={buttonVariants}
            onClick={handleButtonClick}
            whileHover={{ scale: state.step === 2 ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="gooey-search-btn"
            role="button"
          >
            {state.step === 1 ? (
              <span className="gooey-search-text">Search</span>
            ) : (
              <input
                ref={inputRef}
                type="text"
                className="gooey-search-input"
                placeholder={placeholder}
                aria-label="Search input"
                onChange={handleSearch}
              />
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {state.step === 2 && (
              <motion.div
                key="icon"
                className="gooey-separate-element"
                onClick={handleClose}
                style={{ cursor: "pointer" }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={iconVariants}
                transition={{
                  delay: 0.1,
                  duration: 0.85,
                  type: "spring",
                  bounce: 0.15,
                }}
              >
                {!state.isLoading ? (
                  <SearchIcon isUnsupported={isUnsupported} />
                ) : (
                  <LoadingIcon />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
