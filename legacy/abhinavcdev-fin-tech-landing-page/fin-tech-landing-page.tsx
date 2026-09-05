import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowUpRight, LogIn, UserPlus } from "lucide-react";

/** Moneyflow Fintech Landing Page (no browser chrome) */

const Stat = ({ label, value }) => (
  <div className="space-y-1">
    <div className="text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
    <div className="text-sm text-slate-500">{label}</div>
  </div>
);

const SoftButton = ({ children, className = "", ...props }) => (
  <button
    className={
      "rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 " +
      "bg-emerald-900 text-white hover:bg-emerald-800 focus:ring-emerald-700 " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

function MiniBars() {
  return (
    <div className="mt-6 flex h-36 items-end gap-4 rounded-xl bg-gradient-to-b from-emerald-50 to-white p-4">
      {[18, 48, 72, 96].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0.6 }}
          animate={{ height: h }}
          transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
          className="w-10 rounded-xl bg-gradient-to-t from-emerald-200 to-emerald-400 shadow-inner"
        />
      ))}
    </div>
  );
}

function Planet() {
  return (
    <motion.svg
      initial={{ rotate: -8 }}
      animate={{ rotate: 0 }}
      transition={{ duration: 2, type: "spring" }}
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="56" fill="url(#grad)" opacity="0.95" />
      <circle cx="94" cy="98" r="10" fill="white" opacity="0.45" />
      <circle cx="132" cy="126" r="8" fill="white" opacity="0.35" />
      <motion.ellipse
        cx="110" cy="110" rx="100" ry="34" stroke="white" strokeOpacity="0.6" fill="none"
        animate={{ strokeDashoffset: [200, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} strokeDasharray="200 200"
      />
      <motion.circle cx="210" cy="110" r="4" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.2, repeat: Infinity }} />
    </motion.svg>
  );
}

export default function MoneyflowLandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#F3F5F7]">
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        :root { --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif; }
        .font-jakarta { font-family: var(--font-sans); }
      `}</style>

      {/* Top nav (no fake browser bar) */}
      <nav className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-4 py-6 md:px-0">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-700 text-white shadow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12c5 0 4-8 10-8 0 3 6 3 6 8s-6 5-6 8c-6 0-5-8-10-8Z" fill="currentColor" />
            </svg>
          </div>
          <span className="font-jakarta text-xl font-semibold tracking-tight text-slate-900">moneyflow</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          {['Solutions','Product','Company','Insight'].map((item)=> (
            <a key={item} href="#" className="text-sm text-slate-600 hover:text-slate-900">{item}</a>
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <button className="rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-white">Login</button>
          <SoftButton>Sign Up</SoftButton>
        </div>
      </nav>

      {/* Hero area */}
      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 px-4 pb-14 md:grid-cols-2 md:px-0">
        {/* Left: headline */}
        <div className="flex flex-col justify-center space-y-8 pr-2">
          <div>
            <h1 className="text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-slate-900">
              Secure your money
              <br />
              with precision.
            </h1>
            <p className="mt-4 max-w-md text-slate-600">
              Join over a million people who choose <span className="font-medium text-slate-900">moneyflow</span> for fast and secure future banking.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SoftButton>
              Open Account <ArrowUpRight className="ml-1 inline h-4 w-4" />
            </SoftButton>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-2 md:max-w-sm">
            <Stat label="Total Currencies" value="140+" />
            <Stat label="Revenue Generated" value="$1.2B" />
          </div>

          <div className="mt-6 flex items-center gap-8 opacity-70">
            <span className="text-xs text-slate-500">TRUSTED BY THE BEST</span>
            <div className="flex items-center gap-6 text-slate-400">
              <span className="font-semibold">loom</span>
              <span className="font-semibold">HubSpot</span>
              <span className="font-semibold">ramp</span>
            </div>
          </div>
        </div>

        {/* Right: animated card grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Secure card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative col-span-1 overflow-hidden rounded-xl bg-gradient-to-b from-emerald-900 to-emerald-800 p-6 text-emerald-50 shadow-lg"
          >
            <div className="absolute inset-0">
              <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="rg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22d3aa" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="400" height="400" fill="url(#rg)" />
                {[...Array(12)].map((_, i) => (
                  <circle key={i} cx="200" cy="200" r={20 + i * 14} fill="none" stroke="currentColor" strokeOpacity="0.12" />
                ))}
              </svg>
            </div>

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-700/60 p-2 ring-1 ring-white/10">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs uppercase tracking-wider text-emerald-200">Extra Secure</span>
              </div>
              <div className="mt-6 text-xl leading-snug text-emerald-50/95">
                Fraud and security
                <br /> keep your money safe
              </div>
              <motion.div
                className="absolute right-6 top-6 h-12 w-12 rounded-full bg-emerald-600/40"
                animate={{ boxShadow: ["0 0 0 0 rgba(16,185,129,0.35)", "0 0 0 16px rgba(16,185,129,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Currencies card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative col-span-1 overflow-hidden rounded-xl bg-gradient-to-b from-teal-400 to-emerald-500 p-6 text-white shadow-lg"
          >
            <div className="pointer-events-none absolute -right-8 -top-10 opacity-70">
              <Planet />
            </div>
            <div className="relative mt-24 text-sm text-white/90">Currencies</div>
            <div className="text-xl font-medium leading-snug">
              Hundreds of
              <br /> countries in one card
            </div>
          </motion.div>

          {/* Growth card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1 rounded-xl bg-white p-6 text-slate-800 shadow-lg ring-1 ring-slate-200"
          >
            <div className="text-sm text-slate-500">Growth Revenue</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">$50,240 <span className="text-sm font-medium text-slate-400 align-middle">USD</span></div>
            <div className="mt-1 text-xs text-emerald-600">↑ 0.024%</div>
            <MiniBars />
          </motion.div>

          <div className="hidden md:block" />
        </div>
      </div>

      <footer className="mx-auto w-full max-w-[1180px] px-4 pb-10 text-center text-xs text-slate-400 md:px-0">
        © {new Date().getFullYear()} moneyflow, Inc. All rights reserved.
      </footer>
    </div>
  );
}
