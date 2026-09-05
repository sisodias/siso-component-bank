'use client';

import { Check, Copy, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function AlqemistHero({ installHost = 'alqemist.io' }: { installHost?: string }) {
  const [copied, setCopied] = useState(false);
  const command = `curl -fsSL https://${installHost}/install | bash`;

  async function copyCommand() {
    await navigator.clipboard?.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
          <Sparkles className="size-3.5" />
          Autonomous company operating system
        </div>
        <h1 className="max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
          The command center for your company.
          <span className="block text-neutral-500">An AI workforce that ships.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
          Alqemist gives every team a secure AI workforce: agents, projects, integrations, skills,
          schedules, secrets, and deploys in one clean operating surface.
        </p>
        <div className="mt-12 flex max-w-xl items-center gap-3 rounded-sm border border-neutral-200 bg-neutral-50 p-3 px-5 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="font-mono text-sm">$</span>
          <span className="min-w-0 flex-1 truncate font-mono text-sm">{command}</span>
          <button type="button" onClick={copyCommand} className="grid size-8 shrink-0 place-items-center rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/auth" className="rounded-sm bg-neutral-950 px-5 py-3 text-sm font-medium text-white dark:bg-white dark:text-neutral-950">
            Start building
          </a>
          <a href="/enterprise" className="rounded-sm border border-neutral-200 px-5 py-3 text-sm font-medium dark:border-neutral-800">
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  );
}
