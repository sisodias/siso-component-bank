"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Plus, X, Search, User, Check, Sparkles } from "lucide-react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// --- Animation Config ---
const SMOOTH_SPRING = {
  type: "spring",
  stiffness: 400,
  damping: 35,
  mass: 1,
};

const FADE_IN = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

// --- Types ---
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  status?: "online" | "offline" | "busy";
}

interface TeamBuilderProps {
  members: TeamMember[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  maxMembers?: number;
  className?: string;
}

// --- Components ---

const Avatar = ({
  member,
  onRemove,
  size = "lg",
}: {
  member: TeamMember;
  onRemove?: () => void;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={SMOOTH_SPRING}
      className="group relative"
    >
      <div
        className={cn(
          "relative rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-xl group-hover:border-indigo-100 dark:group-hover:border-indigo-900",
          sizeClasses[size]
        )}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold tracking-wider">
            {getInitials(member.name)}
          </div>
        )}

        {/* Elegant Remove Overlay */}
        {onRemove && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer backdrop-blur-[1px]"
          >
            <X className="w-6 h-6 text-white drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Name Tooltip (Only for large selected avatars) */}
      {size === "lg" && (
        <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        >
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                {member.name.split(" ")[0]}
            </span>
        </motion.div>
      )}
    </motion.div>
  );
};

// --- Main Component ---

export default function TeamBuilder({
  members,
  selectedIds,
  onChange,
  maxMembers = 5,
  className,
}: TeamBuilderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus input when opening
  React.useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const selectedMembers = members.filter((m) => selectedIds.includes(m.id));
  const availableMembers = members
    .filter((m) => !selectedIds.includes(m.id))
    .filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );

  const toggleMember = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((uid) => uid !== id));
    } else {
      if (selectedIds.length >= maxMembers) return;
      onChange([...selectedIds, id]);
      setSearch("");
      // Keep dropdown open if multiple selections allowed and not full? 
      // For smoother UX, let's close it to show the animation of adding
      setIsOpen(false);
    }
  };

  const isFull = selectedIds.length >= maxMembers;
  const progress = (selectedIds.length / maxMembers) * 100;
  
  // Larger ring dimensions
  const radius = 28;
  const circumference = 2 * Math.PI * radius; 

  return (
    <div
      ref={wrapperRef}
      className={cn("w-full max-w-2xl mx-auto font-sans", className)}
    >
      <div className="flex flex-col gap-6">
        {/* Header Label */}
        <div className="flex items-end justify-between px-2">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Core Team <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Beta</span>
            </h3>
            <p className="text-sm text-slate-500 mt-1">
                Select up to {maxMembers} key members for this project.
            </p>
          </div>
          <div className="flex items-center gap-2">
             <span className={cn(
                 "text-sm font-bold transition-colors duration-300",
                 isFull ? "text-rose-500" : "text-indigo-600 dark:text-indigo-400"
             )}>
                {selectedIds.length}
             </span>
             <span className="text-sm text-slate-400">/ {maxMembers}</span>
          </div>
        </div>

        {/* Selection Area - Larger & Smoother */}
        <div 
            className={cn(
                "relative flex items-center gap-4 flex-wrap min-h-[120px] p-6 rounded-3xl border-2 border-dashed transition-all duration-300",
                "bg-slate-50/50 dark:bg-slate-900/20",
                isOpen ? "border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            )}
        >
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {selectedMembers.map((member) => (
                <div key={member.id} className="relative z-10">
                    <Avatar member={member} onRemove={() => toggleMember(member.id)} size="lg" />
                </div>
              ))}
            </AnimatePresence>

            {/* Big Smooth Add Button */}
            <motion.button
              layout
              onClick={() => !isFull && setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SMOOTH_SPRING}
              disabled={isFull}
              className={cn(
                "relative group flex items-center justify-center w-[72px] h-[72px] rounded-full outline-none ml-2",
                isFull ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              )}
            >
              {/* Progress Ring SVG */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-sm">
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-white dark:text-slate-800"
                />
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className={cn(
                      "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isFull ? "text-rose-500" : "text-indigo-500"
                  )}
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (progress / 100) * circumference}
                  strokeLinecap="round"
                />
              </svg>

              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-10",
                  isOpen 
                    ? "bg-indigo-600 text-white rotate-45 scale-110" 
                    : isFull 
                        ? "bg-rose-50 dark:bg-rose-900/20 text-rose-300"
                        : "bg-white dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50"
                )}
              >
                <Plus className="w-6 h-6" strokeWidth={3} />
              </div>
            </motion.button>
          </LayoutGroup>
        </div>

        {/* Floating Dropdown - Wider & Glassmorphic */}
        <div className="relative">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                {...FADE_IN}
                className="absolute top-4 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col"
              >
                {/* Large Search Header */}
                <div className="flex items-center gap-4 p-5 border-b border-slate-100 dark:border-slate-800">
                  <Search className="w-5 h-5 text-indigo-500" strokeWidth={3} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Find a team member..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400 font-medium"
                  />
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                     <span className="text-[10px] font-bold text-slate-500">ESC</span>
                  </div>
                </div>

                {/* List Area */}
                <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 p-2">
                  {availableMembers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1">
                        {availableMembers.map((member, i) => (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03, ...SMOOTH_SPRING }}
                            key={member.id}
                            onClick={() => toggleMember(member.id)}
                            className="group w-full flex items-center gap-4 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 text-left border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/50"
                        >
                            <div className="relative">
                                <Avatar member={member} size="md" />
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm">
                                    <div className="bg-emerald-500 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900" />
                                </div>
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-semibold text-slate-700 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                                        {member.name}
                                    </span>
                                    {member.role && (
                                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-200/50 group-hover:text-indigo-700 transition-colors">
                                            {member.role}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm text-slate-500 truncate group-hover:text-slate-600">
                                    {member.email}
                                </span>
                            </div>

                            <div className="pr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <Plus className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.button>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-sm font-medium">No members found</p>
                      <p className="text-xs opacity-70 mt-1">Try searching for a different name</p>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Footer */}
                <div className="bg-slate-50/80 dark:bg-slate-800/50 p-3 border-t border-slate-100 dark:border-slate-800 backdrop-blur-sm flex justify-between items-center px-5">
                    <p className="text-xs font-medium text-slate-500">
                        {availableMembers.length} members available
                    </p>
                    <div className="flex gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
