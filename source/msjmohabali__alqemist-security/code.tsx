'use client';

import { Eye, KeyRound, Layers2, Server, Shield } from 'lucide-react';
import { useState } from 'react';

const items = [
  ['isolation', Layers2, 'Sandbox isolation', 'Each agent runs inside a scoped environment with clear boundaries.'],
  ['keys', KeyRound, 'Secrets vault', 'Credentials are injected only where needed and stay out of prompts.'],
  ['audit', Eye, 'Audit trail', 'Every tool call and approval can be reviewed after the fact.'],
  ['policy', Shield, 'Access policy', 'Use roles, approvals, and connector permissions for safer autonomy.'],
  ['selfhost', Server, 'Self-host ready', 'Run the stack on your own infrastructure when control matters most.'],
];

export default function AlqemistSecurity() {
  const [active, setActive] = useState(items[0][0] as string);
  const selected = items.find(([id]) => id === active) ?? items[0];
  const Icon = selected[1] as typeof Shield;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="mb-14 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-neutral-500">Enterprise control</p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Security that matches autonomous work.</h2>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">Give agents enough power to ship without giving up isolation, credentials, or auditability.</p>
      </div>
      <div className="grid min-h-[390px] overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800 lg:grid-cols-12">
        <div className="hidden place-items-center border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-5 lg:grid">
          <Icon className="size-28" />
        </div>
        <div className="lg:col-span-7">
          {items.map(([id, ItemIcon, title, body]) => (
            <button key={String(id)} type="button" onClick={() => setActive(String(id))} className="block w-full border-b border-neutral-200 p-6 text-left last:border-b-0 dark:border-neutral-800">
              <div className="flex items-center gap-3 text-lg font-medium">
                <ItemIcon className="size-4" />
                {String(title)}
              </div>
              {active === id && <p className="mt-3 max-w-xl text-neutral-600 dark:text-neutral-300">{String(body)}</p>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
