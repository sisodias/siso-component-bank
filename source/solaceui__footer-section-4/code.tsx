"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "motion/react";
import { SocialCloud } from "@/components/ui/footer-section-4-utils/social-cloud";

const FOOTER_TITLE = "Build Tastefully Crafted UIs";

const SolaceUILogo = ({ className }: { className?: string }) => {
  return (
    <svg className={className} width="64" height="38" viewBox="0 0 64 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 20.1032L39.8387 20.1032C44.7808 20.1032 48.7871 24.1095 48.7871 29.0516C48.7871 33.9937 44.7808 38 39.8387 38L1.56459e-06 38L0 20.1032Z" fill="currentColor" />
      <path d="M63.4968 17.8968L23.6581 17.8968C18.716 17.8968 14.7097 13.8904 14.7097 8.94839C14.7097 4.00633 18.716 0 23.6581 0L63.4968 0V17.8968Z" fill="currentColor" />
    </svg>
  )
}

export default function Footer4() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Solution", href: "#" },
        { label: "Customers", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Help", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help", href: "#" },
        { label: "Tutorials", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Status", href: "#" },
        { label: "Docs", href: "#" },
        { label: "Templates", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Team", href: "#" },
        { label: "Press", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Privacy", href: "#" },
      ],
    },

    {
      title: "Socials",
      links: [
        { label: "X", href: "#" },
        { label: "LinkedIn", href: "#" },
        { label: "Facebook", href: "#" },
        { label: "Threads", href: "#" },
        { label: "Instagram", href: "#" },
        { label: "Youtube", href: "#" },
      ],
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-12 px-4 [--color-primary:#003AF9]">
      <motion.div
        className="container mx-auto max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row gap-4 h-full">
          {/* Blue Card (Left in image, described as Right by user potentially) */}
          <motion.div
            className="relative w-full md:w-1/3 min-h-[300px] md:min-h-[600px] overflow-hidden rounded-2xl bg-(--color-primary) flex flex-col justify-between p-8 md:p-10"
            variants={itemVariants}
          >
            {/* SVG Noise Overlay */}
            <svg
              className="absolute inset-0 w-full h-full opacity-90 pointer-events-none mix-blend-multiply z-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <filter id="noiseFilter2">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.65"
                  numOctaves="4"
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#noiseFilter2)" />
            </svg>

            {/* Top Logo */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-white">
                <SolaceUILogo className="h-7 w-auto" />
                <span className="text-xl font-bold tracking-tight">
                  SolaceUI
                </span>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-6">
              <h3 className="text-lg font-bold text-white capitalize">
                {FOOTER_TITLE}
              </h3>
              <SocialCloud className="text-white/80 gap-4" />
              <p className="text-xs text-white/60">
                &copy; {new Date().getFullYear()} SolaceUI, All rights reserved
              </p>
            </div>
          </motion.div>

          {/* White Card (Right in image) */}
          <motion.div
            className="w-full md:w-2/3 rounded-2xl bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 p-8 md:p-12 flex flex-col justify-between min-h-[500px] md:min-h-[600px]"
            variants={itemVariants}
          >
            {/* Top Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
              {footerLinks.map((section, idx) => (
                <div key={idx} className="flex flex-col space-y-6">
                  <h4 className="text-lg font-bold text-black dark:text-white">
                    {section.title}
                  </h4>
                  <ul className="flex flex-col space-y-3 text-neutral-600 dark:text-neutral-400 font-medium">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link
                          href={link.href}
                          className="hover:text-black dark:hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom Newsletter */}
            <div className="space-y-4 mt-12 md:mt-0">
              <h4 className="text-lg font-bold text-black dark:text-white">
                Newsletter
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md w-full">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="flex-1 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white bg-transparent text-black dark:text-white border border-neutral-300 dark:border-neutral-700"
                />
                <button className="rounded-md bg-black text-white dark:bg-white dark:text-black px-8 py-3 text-sm font-medium hover:opacity-90 transition-opacity">
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
