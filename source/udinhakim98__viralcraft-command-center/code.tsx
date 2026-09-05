"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type ValidationGate = {
  label: string;
  current: number;
  target: number;
};

type Decision = {
  id: string;
  label: string;
  value: string | boolean | number | null;
  answered_at?: string;
  answered_by?: string;
};

type Blocker = {
  id: string | number;
  owner: string;
  action: string;
  effort?: string;
  unblocks?: string;
  status: "active" | "done" | "blocked" | string;
};

type LaunchAsset = {
  asset: string;
  path?: string;
  status: string;
  next?: string;
};

type Money = {
  tripwire_rm: number;
  client_rm: number;
  dwy_rm: number;
  total_revenue_rm: number;
  ad_spend_rm: number;
  mrr_rm: number;
  goal_mrr_rm: number;
};

type CommandCenterData = {
  business: string;
  brand: string;
  current_stage: string;
  model: string;
  next_action: string;
  positioning: {
    one_liner: string;
    public_angle?: string;
  };
  validation_gates: Record<string, ValidationGate>;
  money: Money;
  decisions: Decision[];
  blockers: Blocker[];
  launch_assets: LaunchAsset[];
  saved_at?: string;
};

type Props = {
  data?: Partial<CommandCenterData>;
  title?: string;
  onPrimaryAction?: () => void;
};

const sampleData: CommandCenterData = {
  business: "VIRALCRAFT by g4l1l30.art",
  brand: "g4l1l30.art",
  current_stage: "Stage 3 Validation Lab — launch execution",
  model: "Free lead magnet → RM97 VIRALCRAFT course → RM1,497 Done-With-You",
  next_action:
    "Install Billplz Shopify app, then set products ACTIVE to go live. Build command center read-only shell first.",
  positioning: {
    one_liner:
      "Help Malaysian sellers, creators, and agencies make AI video ads that convert — script to launch, BM and English.",
    public_angle:
      "Practical AI video ads workflow for Malaysia: script, generate, polish, launch on Meta Ads.",
  },
  validation_gates: {
    scorecard_leads: { label: "Scorecard leads", current: 0, target: 50 },
    tripwire_sales: { label: "Tripwire sales", current: 0, target: 20 },
    conversations: { label: "Mom Test conversations", current: 0, target: 15 },
    client_upsells: { label: "Client upsells", current: 0, target: 3 },
  },
  money: {
    tripwire_rm: 0,
    client_rm: 0,
    dwy_rm: 0,
    total_revenue_rm: 0,
    ad_spend_rm: 0,
    mrr_rm: 0,
    goal_mrr_rm: 5000,
  },
  decisions: [
    { id: "price", label: "Tripwire price", value: "RM97", answered_by: "founder" },
    { id: "payment", label: "Payment provider", value: "Billplz", answered_by: "founder" },
    { id: "language", label: "Launch language", value: "Bilingual", answered_by: "founder" },
  ],
  blockers: [
    {
      id: 5,
      owner: "founder",
      action: "List 15 people to validate the offer.",
      effort: "research",
      unblocks: "Mom Test conversations and first buyers",
      status: "active",
    },
    {
      id: 6,
      owner: "founder",
      action: "Record 3 demo builds: hero section, full page, client-grade page.",
      effort: "week 1",
      unblocks: "Proof, reels, lessons, and sales page assets",
      status: "active",
    },
  ],
  launch_assets: [
    { asset: "Scorecard", status: "built-needs-deploy", next: "Deploy on Vercel." },
    { asset: "Landing page", status: "ready-to-build", next: "Build black/orange bilingual page." },
    { asset: "Checkout", status: "provider-selected", next: "Wire Billplz RM97 checkout." },
    { asset: "21st Command Center UI", status: "published-component", next: "Install into app shell." },
  ],
  saved_at: "2026-06-16T20:08+08:00",
};

function mergeData(input?: Partial<CommandCenterData>): CommandCenterData {
  return {
    ...sampleData,
    ...input,
    positioning: { ...sampleData.positioning, ...input?.positioning },
    validation_gates: input?.validation_gates ?? sampleData.validation_gates,
    money: { ...sampleData.money, ...input?.money },
    decisions: input?.decisions ?? sampleData.decisions,
    blockers: input?.blockers ?? sampleData.blockers,
    launch_assets: input?.launch_assets ?? sampleData.launch_assets,
  };
}

function formatRM(value: number) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function percent(current: number, target: number) {
  if (!target) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const panel =
  "rounded-[28px] border border-orange-400/15 bg-[#120d09]/78 shadow-[0_24px_90px_rgba(0,0,0,.42)] backdrop-blur-xl";

export default function ViralcraftCommandCenter({ data, title, onPrimaryAction }: Props) {
  const d = mergeData(data);
  const prefersReducedMotion = useReducedMotion();
  const gates = Object.values(d.validation_gates);
  const activeBlockers = d.blockers.filter((item) => item.status !== "done");
  const totalProgress = Math.round(
    gates.reduce((sum, gate) => sum + percent(gate.current, gate.target), 0) / Math.max(1, gates.length)
  );
  const motionProps = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0b0b0a] px-4 py-6 text-[#f7f2ea] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(217,98,43,.24),transparent_34%),radial-gradient(circle_at_88%_24%,rgba(176,85,47,.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,.035),transparent_42%)]" />
      <div className="pointer-events-none absolute left-6 top-0 h-full w-px bg-gradient-to-b from-transparent via-orange-400/35 to-transparent" />

      <motion.div
        {...motionProps}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.1fr_.9fr]"
      >
        <header className={cn(panel, "col-span-full p-5 sm:p-6")}> 
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-orange-200/70">
                <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1">Vault command</span>
                <span>{d.brand}</span>
                <span className="text-orange-400/50">/</span>
                <span>{d.current_stage}</span>
              </div>
              <h1 className="max-w-5xl text-balance text-4xl font-semibold tracking-[-0.05em] text-[#fff8ec] sm:text-6xl lg:text-7xl">
                {title ?? "Founder command center"}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#d8c7b7] sm:text-lg">{d.positioning.one_liner}</p>
            </div>
            <button
              type="button"
              onClick={onPrimaryAction}
              className="group min-h-11 rounded-full border border-orange-300/30 bg-[#d9622b] px-5 py-3 text-sm font-semibold text-[#140d08] shadow-[0_0_32px_rgba(217,98,43,.28)] transition hover:bg-[#f0783a] focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2 focus:ring-offset-[#0b0b0a]"
            >
              Sync vault JSON <span className="transition group-hover:translate-x-1">→</span>
            </button>
          </div>
        </header>

        <main className="grid gap-5">
          <motion.div {...motionProps} transition={{ delay: 0.08 }} className={cn(panel, "p-5 sm:p-6")}> 
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-orange-200/60">Next action</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#fff8ec]">Move from dashboard to money</h2>
              </div>
              <div className="grid size-20 place-items-center rounded-full border border-orange-300/20 bg-orange-400/10 text-xl font-semibold text-orange-100">
                {totalProgress}%
              </div>
            </div>
            <p className="mt-4 rounded-2xl border border-orange-300/10 bg-black/25 p-4 text-sm leading-6 text-[#e6d4c0]">{d.next_action}</p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {gates.map((gate, index) => {
              const p = percent(gate.current, gate.target);
              return (
                <motion.article
                  key={gate.label}
                  {...motionProps}
                  transition={{ delay: 0.12 + index * 0.05 }}
                  className="rounded-[24px] border border-orange-300/12 bg-[#17100b]/78 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#f7f2ea]">{gate.label}</p>
                      <p className="mt-1 text-xs text-[#a99582]">Target {gate.target}</p>
                    </div>
                    <strong className="text-2xl tracking-tight text-orange-100">{gate.current}</strong>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#2a1a10]">
                    <motion.div
                      initial={prefersReducedMotion ? false : { width: 0 }}
                      animate={{ width: `${p}%` }}
                      transition={{ duration: 0.7, delay: 0.2 + index * 0.06 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#b0552f] to-[#f28a4b]"
                    />
                  </div>
                </motion.article>
              );
            })}
          </div>

          <section className={cn(panel, "p-5 sm:p-6")}> 
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Founder decisions</h2>
              <span className="rounded-full bg-orange-400/10 px-3 py-1 text-xs text-orange-100">{d.decisions.length} locked</span>
            </div>
            <div className="grid gap-3">
              {d.decisions.slice(0, 6).map((decision) => (
                <div key={decision.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[.035] px-4 py-3">
                  <span className="text-sm text-[#d8c7b7]">{decision.label}</span>
                  <span className="text-right text-sm font-semibold text-[#fff8ec]">{String(decision.value)}</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="grid gap-5">
          <section className={cn(panel, "p-5 sm:p-6")}> 
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-orange-200/60">Revenue cockpit</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <MoneyCell label="Real revenue" value={formatRM(d.money.total_revenue_rm)} loud />
              <MoneyCell label="MRR goal" value={`${formatRM(d.money.mrr_rm)} / ${formatRM(d.money.goal_mrr_rm)}`} />
              <MoneyCell label="Ad spend" value={formatRM(d.money.ad_spend_rm)} />
              <MoneyCell label="DWY / client" value={formatRM(d.money.client_rm + d.money.dwy_rm)} />
            </div>
          </section>

          <section className={cn(panel, "p-5 sm:p-6")}> 
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Action queue</h2>
              <span className="text-xs text-orange-200/60">{activeBlockers.length} active</span>
            </div>
            <div className="space-y-3">
              {activeBlockers.slice(0, 4).map((blocker, index) => (
                <motion.div
                  key={blocker.id}
                  {...motionProps}
                  transition={{ delay: 0.18 + index * 0.05 }}
                  className="rounded-2xl border border-orange-300/12 bg-[#0f0a07] p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-orange-400/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-orange-100">{blocker.owner}</span>
                    <span className="text-xs text-[#a99582]">{blocker.effort}</span>
                  </div>
                  <p className="text-sm font-medium leading-6 text-[#fff8ec]">{blocker.action}</p>
                  {blocker.unblocks ? <p className="mt-2 text-xs leading-5 text-[#a99582]">Unlocks: {blocker.unblocks}</p> : null}
                </motion.div>
              ))}
            </div>
          </section>

          <section className={cn(panel, "p-5 sm:p-6")}> 
            <h2 className="text-xl font-semibold tracking-tight">Launch assets</h2>
            <div className="mt-5 space-y-3">
              {d.launch_assets.map((asset, index) => (
                <div key={asset.asset} className="grid grid-cols-[auto_1fr] gap-3">
                  <div className="relative mt-1 flex justify-center">
                    <span className="relative z-10 size-3 rounded-full border border-orange-200/50 bg-[#d9622b] shadow-[0_0_22px_rgba(217,98,43,.5)]" />
                    {index < d.launch_assets.length - 1 ? <span className="absolute top-3 h-[calc(100%+12px)] w-px bg-orange-400/20" /> : null}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#fff8ec]">{asset.asset}</p>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-[#d8c7b7]">{asset.status}</span>
                    </div>
                    {asset.next ? <p className="mt-1 text-xs leading-5 text-[#a99582]">{asset.next}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </motion.div>
    </section>
  );
}

function MoneyCell({ label, value, loud = false }: { label: string; value: string; loud?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[.035] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#a99582]">{label}</p>
      <p className={cn("mt-2 font-semibold tracking-tight", loud ? "text-3xl text-orange-100" : "text-lg text-[#fff8ec]")}>{value}</p>
    </div>
  );
}
