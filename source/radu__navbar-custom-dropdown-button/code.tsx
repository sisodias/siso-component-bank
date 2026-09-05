"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layout, Construction, FlaskConical, Component, Cctv } from "lucide-react";
import Link from "next/link";

// Types
export interface ServiceItem {
  title: string;
  description: string;
  badge: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  link: string;
  isActive?: boolean;
}

export interface NavButtonDropdownProps {
  label?: string;
  services?: ServiceItem[];
  className?: string;
}

// Default services (no require, use imports above)
const defaultServices: ServiceItem[] = [
  {
    title: "PLG Onboarding Teardown",
    description: "Top 3 UX + PLG blockers solved.",
    badge: "FREE",
    icon: Construction,
    link: "#",
    isActive: true,
  },
  {
    title: "First-Time User Analysis",
    description: "Async User Interview for UX",
    badge: "FREE",
    icon: Cctv,
    link: "#",
    isActive: true,
  },
  {
    title: "Free Growth Redesign",
    description: "Unblock your Growth Bottleneck",
    badge: "FREE",
    icon: Component,
    link: "#",
    isActive: true,
  },
  {
    title: "16 Growth A/B Tests",
    description: "Win Your Money Back.",
    badge: "€2.5K",
    icon: FlaskConical,
    link: "#",
    isActive: true,
  },
  {
    title: "Behavior Subscription",
    description: "Ongoing Behavioral Design",
    badge: "6K/mo",
    icon: Layout,
    link: "#",
    isActive: true,
  },
  {
    title: "Product UX Overhaul",
    description: "PLG + Growth Design Amplifier.",
    badge: "€10K",
    icon: Component,
    link: "#",
    isActive: false,
  },
];

// Component
export const NavButtonDropdown: React.FC<NavButtonDropdownProps> = ({
  label = "Services",
  services = defaultServices,
  className = "",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative bg-white inline-block rounded-full text-left group ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger Button */}
      <button className="group-hover:text-black rounded-full outline-accent whitespace-nowrap flex items-center text-md font-medium transition-color duration-300 text-base-content group-hover:text-black active:text-black font-display flex-row justify-center items-center gap-1 px-3 py-1.5">
        {label}
        <ChevronDown
          size={20}
          strokeWidth={2.5}
          className="text-base-content transition-color duration-300 group-hover:text-black"
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 w-80 rounded-2xl shadow-[-6px_6px_32px_8px_rgba(192,192,192,0.2)] bg-white ring-1 ring-gray-200 p-2 z-50"
          >
            {services.map((item, i) => (
              <Link
                key={i}
                href={item.link}
                className={`${
                  item.isActive ? "" : "pointer-events-none cursor-not-allowed"
                } flex items-start justify-between gap-3 p-3 rounded-xl hover:bg-neutral/5 transition`}
              >
                <div className="flex items-start justify-start gap-3">
                  <item.icon className="w-6 h-6 text-base-content mt-0.5" />
                  <div>
                    <p className="font-medium text-base-content text-sm">
                      {item.title}
                    </p>
                    <p className="text-neutral text-xs">{item.description}</p>
                  </div>
                </div>
                <div className="flex text-base-content justify-center items-center rounded-full px-3 py-1 font-bold text-xs font-sans bg-accent/10">
                  {item.badge}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}