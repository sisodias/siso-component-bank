"use client";

import React, { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

export interface ShowcaseCard {
  id: string;
  imageUrl: string;
  badge?: { text: string; colorClass: string };
  subtitle?: string;
  title: string;
  description: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

interface UltraQualityShowcaseGridProps {
  cards: ShowcaseCard[];
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, rotateX: 15 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 120 } },
};

export function UltraQualityShowcaseGrid({ cards }: UltraQualityShowcaseGridProps) {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-sm font-medium text-gray-500">What you get</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Features built for efficient growth
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Scale faster with our operating system—unlimited experiments, clear insights, and frictionless execution.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {cards.map((card, idx) => {
          // make the first card span 2 rows and 2 columns
          const isBig = idx === 0;
          return (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, rotateX: 0 }}
              className={`group relative overflow-hidden rounded-2xl border bg-black-50 dark:bg-black-800 border-black-200 dark:border-black-700 shadow-lg
                ${isBig ? "md:col-span-2 md:row-span-2" : ""}`}
            >
              {/* Background image with gradient mask */}
              <div className="relative h-0 pb-[56.25%]">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col h-full">
                {card.badge && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${card.badge.colorClass}`}
                  >
                    {card.badge.text}
                  </span>
                )}
                {card.subtitle && (
                  <p className="mt-2 text-xs text-gray-500">{card.subtitle}</p>
                )}
                <h3 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 flex-1">{card.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {card.ctaPrimary && (
                    <a
                      href={card.ctaPrimary.href}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      {card.ctaPrimary.label}
                    </a>
                  )}
                  {card.ctaSecondary && (
                    <a
                      href={card.ctaSecondary.href}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium border hover:bg-gray-100 transition"
                    >
                      {card.ctaSecondary.label}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
