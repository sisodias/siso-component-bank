'use client';

import { ArrowRight } from 'lucide-react';

export default function AlqemistCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="grid overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-12">
        <div className="p-7 md:col-span-5">
          <span className="rounded-sm bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Ready to run</span>
          <h2 className="mt-4 text-3xl font-medium tracking-tight">Give your company a workforce.</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">Start with managed cloud, keep the option to self-host, and bring your own models when needed.</p>
          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            <a href="/auth" className="inline-flex items-center justify-center gap-2 rounded-sm bg-neutral-950 px-4 py-3 text-sm font-medium text-white dark:bg-white dark:text-neutral-950">
              Get started <ArrowRight className="size-4" />
            </a>
            <a href="/enterprise" className="inline-flex items-center justify-center rounded-sm border border-neutral-200 px-4 py-3 text-sm font-medium dark:border-neutral-800">
              Talk to sales
            </a>
          </div>
        </div>
        <div className="relative min-h-[260px] border-t border-neutral-200 dark:border-neutral-800 md:col-span-7 md:border-l md:border-t-0">
          <div className="absolute inset-0 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />
          <div className="absolute inset-10 rounded-full bg-emerald-300/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
