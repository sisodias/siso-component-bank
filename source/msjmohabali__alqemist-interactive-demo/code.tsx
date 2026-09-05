'use client';

import { Bot, CalendarClock, KeyRound, Plug, Shield, Sparkles } from 'lucide-react';
import { useState } from 'react';

const tabs = [
  { id: 'projects', label: 'Projects', icon: Sparkles },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'scheduling', label: 'Scheduling', icon: CalendarClock },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function AlqemistInteractiveDemo() {
  const [active, setActive] = useState(tabs[0].id);
  const activeTab = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-1 shadow-2xl shadow-neutral-950/10 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active === tab.id ? 'bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white' : 'text-neutral-500'
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="mt-1 min-h-[430px] rounded-lg bg-white p-6 dark:bg-neutral-950">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{activeTab.label}</h3>
              <p className="text-sm text-neutral-500">A live-feeling product surface for the Alqemist homepage.</p>
            </div>
            <span className="rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              Running
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {['Connect tools', 'Run agent', 'Review output', 'Ship change', 'Audit access', 'Schedule follow-up'].map((item, index) => (
              <div key={item} className="rounded-sm border border-neutral-200 p-4 dark:border-neutral-800">
                <div className="mb-3 grid size-9 place-items-center rounded-sm bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                  {index === 4 ? <KeyRound className="size-4" /> : <activeTab.icon className="size-4" />}
                </div>
                <div className="font-medium">{item}</div>
                <p className="mt-1 text-sm text-neutral-500">Secure, observable, and reusable across the workspace.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
