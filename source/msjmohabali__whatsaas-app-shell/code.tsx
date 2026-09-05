import type { ReactNode } from 'react';
import { BarChart3, Bot, Home, MessageSquare, Phone, Settings, Users, Workflow, Wrench } from 'lucide-react';

type NavItem = {
  label: string;
  active?: boolean;
};

type WhatSaaSAppShellProps = {
  brand?: string;
  navItems?: NavItem[];
  children?: ReactNode;
};

const icons = [Home, MessageSquare, Users, Workflow, BarChart3, Phone, Wrench, Settings];

export default function WhatSaaSAppShell({
  brand = 'WhatSaaS',
  navItems = [
    { label: 'Dashboard', active: true },
    { label: 'Inbox' },
    { label: 'Contacts' },
    { label: 'Automation' },
    { label: 'Analytics' },
    { label: 'Calls' },
    { label: 'Tools' },
    { label: 'Settings' },
  ],
  children,
}: WhatSaaSAppShellProps) {
  return (
    <div className="flex min-h-[720px] overflow-hidden rounded-xl border bg-muted/40 text-foreground">
      <aside className="hidden w-64 shrink-0 border-r bg-card p-4 md:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold">{brand}</p>
            <p className="text-xs text-muted-foreground">SaaS cockpit</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <button key={item.label} className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm ${item.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b bg-background px-5">
          <div>
            <p className="text-sm text-muted-foreground">Workspace</p>
            <h1 className="font-semibold">Operations overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Online</span>
            <div className="h-9 w-9 rounded-full bg-muted" />
          </div>
        </header>
        <div className="p-5">
          {children || (
            <div className="grid gap-4 md:grid-cols-3">
              {['Open chats', 'Active automations', 'Call credits'].map((label, index) => (
                <div key={label} className="rounded-lg border bg-card p-5">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-3xl font-bold">{['342', '28', '1,240'][index]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
