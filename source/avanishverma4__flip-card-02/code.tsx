import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import {
  Code2,
  PenTool,
  BarChart3,
  Users,
  Zap,
  Terminal,
  Moon,
  Sun,
  Mail,
  ChevronRight,
  X,
  User,
  Briefcase,
} from "lucide-react";

/**
 * Single-file App.tsx
 *
 * Requirements:
 * - Tailwind CSS is expected in your build pipeline (the classes used rely on Tailwind).
 * - framer-motion installed
 * - lucide-react installed
 *
 * Key improvements made:
 * - Theme toggle persists to localStorage and respects system preference.
 * - Improved flip animation using rotateY and explicit backface-visibility / transform-style.
 * - Modal focus management (close button receives initial focus).
 * - Reduced-motion support is respected.
 * - Accessibility: keyboard handlers, aria attributes, role, focus-visible rings.
 * - Prevents flip when interacting with interactive elements.
 */

/* --- Types --- */
export interface Member {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface Team {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  members: Member[];
  category: string;
  color: string; // tailwind background classes
}

/* --- Utilities --- */
const prefersDark = () =>
  typeof window !== "undefined" &&
  (localStorage.getItem("theme") === "dark" ||
    (localStorage.getItem("theme") === null && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches));

/* --- ThemeToggle Component --- */
const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => (typeof window !== "undefined" ? prefersDark() : false));

  useEffect(() => {
    // initialize from saved / system preference
    const root = window.document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    // ensure state matches stored preference on mount
    const stored = localStorage.getItem("theme");
    if (stored === "dark") setIsDark(true);
    else if (stored === "light") setIsDark(false);
    else setIsDark(prefersDark());
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    const root = window.document.documentElement;
    if (newDark) root.classList.add("dark");
    else root.classList.remove("dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-black dark:focus-visible:ring-white"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

/* --- MemberModal Component --- */
interface MemberModalProps {
  member: Member | null;
  onClose: () => void;
}

const MemberModal: React.FC<MemberModalProps> = ({ member, onClose }) => {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // When modal opens, focus close button
  useEffect(() => {
    if (member && closeRef.current) {
      closeRef.current.focus();
    }
  }, [member]);

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 dark:bg-white/10 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="false"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ type: "spring", duration: 0.32 }}
            className="relative w-full max-w-md bg-white dark:bg-black border-2 border-black dark:border-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-black dark:focus-visible:ring-white"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full border-2 border-black dark:border-white flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <User size={48} strokeWidth={1} />
              </div>

              <div>
                <h3 id="modal-title" className="text-3xl font-black uppercase tracking-tight mb-2">
                  {member.name}
                </h3>
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider text-sm">
                  <Briefcase size={16} />
                  {member.role}
                </div>
              </div>

              <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

              {member.email ? (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-3 px-6 py-3 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 font-bold uppercase tracking-wide text-sm"
                >
                  <Mail size={18} />
                  Get in Touch
                </a>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">No email provided</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* --- TeamCard Component --- */
interface TeamCardProps {
  team: Team;
  onMemberClick: (member: Member) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onMemberClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsFlipped((p) => !p);
    } else if (e.key === "Escape") {
      setIsFlipped(false);
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Styles needed for 3d flip/backface
  const faceCommonStyle: React.CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transformStyle: "preserve-3d",
  };

  const containerStyle: React.CSSProperties = {
    perspective: 1200,
  };

  return (
    <motion.div
      className="group w-full h-[420px] cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onFocus={() => setIsFlipped(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFlipped(false);
        }
      }}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`View details for Team ${team.name}`}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={containerStyle}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{
          transform: shouldReduceMotion ? "none" : `rotateY(${isFlipped ? 180 : 0}deg)`,
        }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Face */}
        <motion.div
          className={`absolute inset-0 ${team.color} border-2 border-black dark:border-white p-8 flex flex-col items-center justify-between text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-300`}
          style={{
            ...faceCommonStyle,
            transform: "rotateY(0deg)",
            zIndex: isFlipped ? 0 : 1,
          }}
          onClick={() => {
            // toggle on click for keyboard-friendly environments
            setIsFlipped((p) => !p);
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="p-4 rounded-full border-2 border-black dark:border-white text-black dark:text-white group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
              {team.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-wider mb-2 relative inline-block">
                {team.name}
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-black dark:bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </h3>
              <p className="text-sm font-light italic text-gray-600 dark:text-gray-400">{team.tagline}</p>
            </div>
          </div>

          <div className="w-full flex justify-center items-center gap-2 text-sm font-semibold uppercase tracking-widest border-t border-black dark:border-white pt-4 mt-4">
            Meet the Team <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </motion.div>

        {/* Back Face */}
        <motion.div
          className="absolute inset-0 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-300 overflow-hidden flex flex-col"
          style={{
            ...faceCommonStyle,
            transform: "rotateY(180deg)",
            zIndex: isFlipped ? 2 : 0,
          }}
          // prevent pointer events when not flipped (helps keyboard/mouse clarity)
          aria-hidden={!isFlipped}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold uppercase">{team.name}</h3>
            <button
              className="p-1 border border-white dark:border-black rounded-full hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white dark:focus-visible:ring-black"
              title="Close"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-sm mb-6 text-gray-300 dark:text-gray-700 leading-relaxed border-b border-gray-700 dark:border-gray-300 pb-4">
            {team.description}
          </p>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar" onClick={stopPropagation}>
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between group/member p-2 -mx-2 hover:bg-gray-800 dark:hover:bg-gray-100 rounded cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onMemberClick(member);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onMemberClick(member);
                  }
                }}
              >
                <div>
                  <p className="font-bold text-sm">{member.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide">{member.role}</p>
                </div>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 opacity-0 group-hover/member:opacity-100 focus:opacity-100 transition-opacity text-white dark:text-black hover:scale-110 focus:scale-110"
                    onClick={stopPropagation}
                    aria-label={`Email ${member.name}`}
                    title={`Email ${member.name}`}
                  >
                    <Mail size={16} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* --- Mock Data --- */
const TEAMS: Team[] = [
  {
    id: "eng",
    name: "Engineering",
    tagline: "Building the backbone.",
    description:
      "The architects of our digital reality. We maintain the core infrastructure and push the boundaries of performance and scalability.",
    icon: <Code2 size={32} strokeWidth={1.5} />,
    category: "Tech",
    color: "bg-sky-100 dark:bg-sky-950",
    members: [
      { id: "e1", name: "Sarah Jenkins", role: "CTO", email: "sarah@example.com" },
      { id: "e2", name: "David Chen", role: "Lead Architect", email: "david@example.com" },
      { id: "e3", name: "Mina Al-Fayed", role: "DevOps Engineer" },
      { id: "e4", name: "James Wilson", role: "Frontend Spec.", email: "james@example.com" },
    ],
  },
  {
    id: "des",
    name: "Product Design",
    tagline: "Crafting experiences.",
    description: "We blend aesthetics with functionality. Our goal is to make every interaction intuitive, accessible, and delightful.",
    icon: <PenTool size={32} strokeWidth={1.5} />,
    category: "Design",
    color: "bg-fuchsia-100 dark:bg-fuchsia-950",
    members: [
      { id: "d1", name: "Elena Rodriguez", role: "Head of Design", email: "elena@example.com" },
      { id: "d2", name: "Marco Polo", role: "UX Researcher" },
      { id: "d3", name: "Suki Kim", role: "UI Designer", email: "suki@example.com" },
      { id: "d4", name: "Tom Baker", role: "Motion Designer" },
    ],
  },
  {
    id: "mkt",
    name: "Growth & Marketing",
    tagline: "Spreading the word.",
    description:
      "Data-driven storytelling. We connect our innovations with the people who need them most through strategic campaigns.",
    icon: <BarChart3 size={32} strokeWidth={1.5} />,
    category: "Business",
    color: "bg-emerald-100 dark:bg-emerald-950",
    members: [
      { id: "m1", name: "Jessica Pearson", role: "CMO", email: "jess@example.com" },
      { id: "m2", name: "Mike Ross", role: "Content Strategist" },
      { id: "m3", name: "Rachel Zane", role: "Social Lead", email: "rachel@example.com" },
    ],
  },
  {
    id: "ops",
    name: "Operations",
    tagline: "Keeping the lights on.",
    description: "Efficiency is our middle name. We streamline processes to ensure the entire organization moves like a well-oiled machine.",
    icon: <Zap size={32} strokeWidth={1.5} />,
    category: "Business",
    color: "bg-amber-100 dark:bg-amber-950",
    members: [
      { id: "o1", name: "Donna Paulsen", role: "VP of Ops", email: "donna@example.com" },
      { id: "o2", name: "Louis Litt", role: "Financial Analyst" },
      { id: "o3", name: "Katrina Bennett", role: "HR Manager", email: "katrina@example.com" },
    ],
  },
  {
    id: "rnd",
    name: "R&D Lab",
    tagline: "Inventing tomorrow.",
    description: "Experimental projects and moonshots. We fail fast to learn faster, exploring the technologies of the next decade.",
    icon: <Terminal size={32} strokeWidth={1.5} />,
    category: "Tech",
    color: "bg-violet-100 dark:bg-violet-950",
    members: [
      { id: "r1", name: "Dr. Emmett Brown", role: "Chief Scientist" },
      { id: "r2", name: "Marty McFly", role: "Test Pilot" },
      { id: "r3", name: "Jennifer Parker", role: "Data Scientist" },
      { id: "r4", name: "Biff Tannen", role: "Hardware Eng.", email: "biff@example.com" },
    ],
  },
  {
    id: "cx",
    name: "Customer Success",
    tagline: "Here to help.",
    description: "We are the voice of the user. Championing their needs and ensuring they get maximum value from our products.",
    icon: <Users size={32} strokeWidth={1.5} />,
    category: "Business",
    color: "bg-rose-100 dark:bg-rose-950",
    members: [
      { id: "c1", name: "Pam Beesly", role: "Head of CX", email: "pam@example.com" },
      { id: "c2", name: "Jim Halpert", role: "Support Lead" },
      { id: "c3", name: "Dwight Schrute", role: "Technical Support", email: "dwight@example.com" },
    ],
  },
];

/* --- App --- */
const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // derive categories
  const categories = useMemo(() => ["All", ...Array.from(new Set(TEAMS.map((t) => t.category)))], []);

  const filteredTeams = selectedCategory === "All" ? TEAMS : TEAMS.filter((t) => t.category === selectedCategory);

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.96,
      y: shouldReduceMotion ? 0 : 16,
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.06,
        type: "spring",
        duration: 0.5,
        bounce: 0.25,
      },
    }),
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: {
        duration: 0.18,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full min-h-screen font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-black dark:border-white bg-white/90 dark:bg-black/90 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-full" />
            <h1 className="text-2xl font-black tracking-tighter uppercase">
              Mono<span className="text-gray-500 dark:text-gray-400">Corp</span>
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none"
          >
            WE ARE <br />
            THE MAKERS.
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-xl text-gray-600 dark:text-gray-400 font-light">
            A collective of engineers, designers, and dreamers building the future of digital interaction. Get to know the specialized units driving our mission.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12" role="group" aria-label="Team filters">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isSelected}
                className={`rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300 focus:outline-none focus-visible:ring-4 ring-offset-2 ring-black dark:ring-white ${
                  isSelected
                    ? "px-[22px] py-[6px] border-4 bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg"
                    : "px-6 py-2 border-2 bg-transparent text-black border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTeams.map((team, index) => (
              <motion.div key={team.id} custom={index} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
                <TeamCard team={team} onMemberClick={setSelectedMember} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black dark:border-white py-12 px-6 bg-gray-50 dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} MonoCorp Inc.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
};

export default App;
