"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Github,
  Mail,
  MapPin,
  ExternalLink,
  Code2,
  Cpu,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

// --- Configuration ---
// Spring physics for that "snappy" feel
const springTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

// --- Animations ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger the appearance of blocks
      delayChildren: 0.2,
    },
  },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition,
  },
};

const skillVariants: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

// --- Types ---
interface BlockProps {
  className?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}

// --- Data ---
const SKILLS = [
  "React JS",
  "Next.JS",
  "C++",
  "Python",
  "Java",
  "AWS",
  "MongoDB",
  "SQL",
  "Shopify",
  "Supabase",
];

// --- Sub-Component: The Animated 3D Block ---
const Block: React.FC<BlockProps> = ({
  className = "",
  children,
  noPadding = false,
}) => {
  return (
    <motion.div
      variants={blockVariants}
      whileHover={{
        y: -10,
        x: -5,
        boxShadow: "16px 16px 0px 0px rgba(0,0,0,1)",
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        bg-white border-[3px] border-black relative
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        overflow-hidden flex flex-col
        ${noPadding ? "p-0" : "p-6"}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// --- Main Resume Component ---
export default function KineticResume() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] text-black selection:bg-black selection:text-white overflow-hidden font-sans">
      {/* Background Dot Pattern for Texture */}
      <div
        className="fixed inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- BLOCK 1: Profile Header --- */}
        <Block className="md:col-span-2 md:row-span-2 justify-between min-h-85">
          <div>
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-3">
                {[
                  { icon: Github, href: "https://github.com/daiv09" },
                  { icon: Mail, href: "mailto:daiwiikharihar@gmail.com" },
                ].map((item, idx) => (
                  <motion.a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      backgroundColor: "#000",
                      color: "#FFF",
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 border-2 border-black bg-black text-white hover:bg-transparent hover:text-black transition-colors rounded-none"
                  >
                    <item.icon size={22} strokeWidth={2.5} />
                  </motion.a>
                ))}
              </div>
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
                className="w-4 h-4 rounded-full bg-green-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                title="Available for work"
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-4">
              <motion.span
                className="block"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Daiwiik
              </motion.span>
              <motion.span
                className="block text-black"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Harihar
              </motion.span>
            </h1>

            <div className="inline-block bg-black text-white px-3 py-1 text-sm font-bold uppercase tracking-widest mb-4 transform -rotate-1">
              Full-Stack Developer
            </div>

            <p className="text-base font-medium leading-relaxed max-w-md text-black">
              Third-year Computer Science undergraduate. Selected for the{" "}
              <span className="font-bold border-b-2 border-black">
                Apple & Infosys iOS
              </span>{" "}
              Student Development Program.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm font-black uppercase tracking-wide">
            <MapPin size={18} /> Pune, India
          </div>
        </Block>

        {/* --- BLOCK 2: Education --- */}
        <Block className="md:col-span-2 justify-center bg-zinc-50">
          <div className="flex items-center gap-3 mb-4 ">
            <GraduationCap size={28} />
            <h2 className="text-xl font-bold uppercase tracking-tighter">
              Education
            </h2>
          </div>
          <div className="relative pl-6 border-l-[3px] border-black/20 hover:border-black transition-colors duration-300">
            <h3 className="text-2xl font-black leading-none mb-1">
              B.Tech Computer Science Engineering
            </h3>
            <p className="text-sm font-bold text-black mb-4">
              Dr. Vishwanath Karad MIT World Peace University
            </p>
            <div className="flex justify-between items-end">
              <span className="text-xs font-mono font-bold">
                2023 - Present
              </span>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="text-2xl font-black bg-black text-white px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
              >
                9.14 GPA
              </motion.div>
            </div>
          </div>
        </Block>

        {/* --- BLOCK 3: Experience --- */}
        <Block className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6 ">
            <Code2 size={28} />
            <h2 className="text-xl font-bold uppercase tracking-tighter">
              Experience
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                role: "Website Developer",
                company: "Paiwand Studio",
                time: "Jul '25 - Present",
                desc: "Developing primary website, optimizing checkout flows, and enhancing SEO.",
                remote: true,
              },
              {
                role: "Research Intern",
                company: "COEP Technological University, Pune",
                time: "Jun '25 - Aug '25",
                desc: "Built real-time DL pipelines for exam monitoring using PyTorch & NVIDIA DGX.",
                remote: false,
              },
            ].map((job, i) => (
              <motion.div
                key={i}
                className="group relative pl-4"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.2 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-2 h-2 bg-black rounded-full" />

                <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                  <h3 className="font-bold text-lg group-hover:underline decoration-2 underline-offset-4">
                    {job.role}
                  </h3>
                  <span className="text-[10px] font-black uppercase border border-black px-1.5 py-0.5 bg-zinc-100">
                    {job.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-black uppercase text-black">
                    {job.company}
                  </p>
                  {job.remote && (
                    <span className="text-[10px] bg-gray-200 px-1 rounded">
                      REMOTE
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-800 leading-snug font-medium">
                  {job.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Block>

        {/* --- BLOCK 4: Skills Matrix (Staggered Animation) --- */}
        <Block className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <Cpu size={28} />
            <h2 className="text-xl font-bold uppercase tracking-tighter">
              Skills
            </h2>
          </div>
          <motion.div
            className="flex flex-wrap gap-2 content-start"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {SKILLS.map((skill, i) => (
              <motion.span
                key={i}
                variants={skillVariants}
                whileHover={{ scale: 1.1, y: -2 }}
                className={`
                  px-2 py-1 text-[11px] font-bold border-2 border-black cursor-default
                  ${i % 2 === 0 ? "bg-black text-white" : "bg-white text-black"}
                `}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </Block>

        {/* --- BLOCK 5: Key Projects --- */}
        <Block className="md:col-span-3">
          <div className="flex items-center gap-3 mb-6 ">
            <ExternalLink size={28} />
            <h2 className="text-xl font-bold uppercase tracking-tighter">
              Featured Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Hospitality Hiring Platform",
                desc: "Full-stack recruitment system with real-time workflows.",
                tags: ["React", "PostgreSQL", "Prisma"],
              },
              {
                title: "Voice-Based UI",
                desc: "88.8% accurate real-time speech-to-text system.",
                tags: ["MongoDB", "Socket.IO", "WebSpeech"],
              },
            ].map((project, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "#000",
                  color: "#FFF",
                }}
                className="border-2 border-black p-5 cursor-pointer group transition-colors relative"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={20} />
                </div>

                <h3 className="font-bold text-xl mb-2 tracking-tight group-hover:text-white">
                  {project.title}
                </h3>
                <p className="text-sm opacity-80 mb-6 leading-relaxed font-medium group-hover:text-gray-300">
                  {project.desc}
                </p>
                <div className="flex gap-2 flex-wrap mt-auto">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase font-bold border border-current px-2 py-1 bg-transparent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Block>
      </motion.div>
    </div>
  );
}
