"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { cn } from "../_utils/cn";
import { 
  Clock, 
  Mail, 
  ArrowUpRight, 
  Globe,
  Briefcase
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

interface ComponentProps {
  name?: string;
  role?: string;
  email?: string;
  avatarSrc?: string;
  statusText?: string;
  statusColor?: string;
  bio?: string;
  skills?: string[];
  className?: string;
}

export default function Component({
  name = "Sarah Chen",
  role = "Product Designer",
  email = "sarah.chen@design.co",
  avatarSrc = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  statusText = "Available",
  statusColor = "bg-emerald-500",
  bio = "Crafting intuitive experiences that delight users",
  skills = ["Figma", "Prototyping", "UX Research"],
  className,
}: ComponentProps) {
  const [copied, setCopied] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const timeText = useMemo(() => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const hour12 = ((h + 11) % 12) + 1;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${hour12}:${m} ${ampm}`;
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("relative w-full max-w-4xl mx-auto flex justify-center items-center h-screen", className)}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-30 blur-3xl" />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
          className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-600 opacity-20 blur-3xl"
        />
      </div>

      <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/95 via-gray-900/98 to-black backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_70px_-15px_rgba(120,119,198,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

        <CardContent className="relative p-8 sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center h-3 w-3">
                <span className={cn("absolute h-3 w-3 rounded-full animate-pulse", statusColor)} />
                <span className={cn("absolute h-3 w-3 rounded-full", statusColor, "animate-ping")} />
              </div>
              <span className="text-sm font-medium text-gray-300">{statusText}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">{timeText}</span>
            </div>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 blur-md opacity-60" />
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/20 shadow-xl">
                <Image
                  src={avatarSrc}
                  alt={`${name} avatar`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            </motion.div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {name}
              </h1>
              <p className="mb-3 text-lg font-medium text-purple-400">{role}</p>
              <p className="text-sm text-gray-400">{bio}</p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2 justify-center sm:justify-start">
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 px-4 py-2 text-sm font-medium text-gray-200 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredButton("hire")}
              onHoverEnd={() => setHoveredButton(null)}
            >
              <Button
                className="relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-purple-700 hover:to-cyan-700"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Let's Work Together
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                <AnimatePresence>
                  {hoveredButton === "hire" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/20"
                    />
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleCopy}
                variant="outline"
                className="h-14 w-full rounded-2xl border-white/20 bg-white/5 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
              >
                <Mail className="mr-2 h-5 w-5" />
                {copied ? "Email Copied!" : "Copy Email"}
              </Button>
            </motion.div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            {[
              { icon: FaGithub, label: "GitHub" },
              { icon: FaLinkedin, label: "LinkedIn" },
              { icon: FaTwitter, label: "Twitter" },
              { icon: Globe, label: "Website" },
            ].map(({ icon: Icon, label }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-white/5 p-3 text-gray-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </motion.button>
            ))}
          </div>

          <motion.div
            className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}