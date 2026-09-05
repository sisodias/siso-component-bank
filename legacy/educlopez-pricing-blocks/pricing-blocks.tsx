"use client"

import { motion } from "motion/react"

export default function PricingSimple() {
  return (
    <section className="relative flex flex-col items-center py-12">
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-background text-foreground flex w-80 flex-col items-center rounded-lg border px-8 py-6 text-center shadow-sm transition-transform hover:scale-105"
        >
          <div className="mb-2 text-4xl font-extrabold text-primary">$19/mo</div>
          <div className="text-muted-foreground mb-4 text-sm">
            Perfect for individuals
          </div>
          <ul className="text-muted-foreground mb-6 space-y-1 text-left text-xs">
            <li>✔️ Unlimited Projects</li>
            <li>✔️ Email Support</li>
            <li>✔️ All Features</li>
          </ul>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded px-4 py-2 font-semibold transition">
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  )
}
