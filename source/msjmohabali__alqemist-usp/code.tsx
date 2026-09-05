'use client';

import { Code2, UserRound } from 'lucide-react';

export default function AlqemistUsp() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-neutral-500">One product, two superpowers</p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Easy for operators. Serious for developers.</h2>
      </div>
      <div className="grid overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800 lg:grid-cols-2">
        {[
          [UserRound, 'For the team', 'Ask for outcomes in plain language, watch agents work, and approve what matters.'],
          [Code2, 'For builders', 'Use repos, config, skills, secrets, webhooks, and deployment primitives without hiding the system.'],
        ].map(([Icon, title, body]) => (
          <div key={String(title)} className="border-neutral-200 p-7 odd:border-b dark:border-neutral-800 lg:odd:border-b-0 lg:odd:border-r">
            <Icon className="mb-6 size-6" />
            <h3 className="text-2xl font-medium">{String(title)}</h3>
            <p className="mt-3 max-w-md leading-relaxed text-neutral-600 dark:text-neutral-300">{String(body)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
