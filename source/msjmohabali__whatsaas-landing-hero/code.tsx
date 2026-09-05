import { ArrowRight, Bot, CheckCircle2, MessageSquare, Phone, Sparkles, Users, Zap } from 'lucide-react';

type HeroMetric = {
  label: string;
  value: string;
};

type WhatSaaSLandingHeroProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryAction?: string;
  secondaryAction?: string;
  metrics?: HeroMetric[];
};

const defaultMetrics = [
  { label: 'Automations live', value: '128' },
  { label: 'Response time', value: '8s' },
  { label: 'Revenue pipeline', value: '$48k' },
];

export default function WhatSaaSLandingHero({
  eyebrow = 'WhatsApp sales and support platform',
  title = 'Run WhatsApp, AI voice and CRM from one SaaS cockpit',
  description = 'A polished hero section for WhatsApp-first SaaS products with an embedded product preview, AI activity, CRM context and voice-ready signals.',
  primaryAction = 'Start building',
  secondaryAction = 'View demo',
  metrics = defaultMetrics,
}: WhatSaaSLandingHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-20 text-foreground lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            {eyebrow}
          </div>
          <h1 className="text-4xl font-bold tracking-normal sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm">
              {primaryAction}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="inline-flex h-11 items-center rounded-md border bg-background px-5 text-sm font-semibold">
              {secondaryAction}
            </button>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border bg-card p-4">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="rounded-md bg-muted px-4 py-1 text-xs text-muted-foreground">app.whatsaas.com/inbox</div>
          </div>
          <div className="grid min-h-[420px] md:grid-cols-[5rem_17rem_1fr]">
            <div className="hidden border-r bg-muted/20 p-4 md:block">
              {[MessageSquare, Users, Zap, Phone].map((Icon, index) => (
                <div key={index} className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
            <div className="border-r p-4">
              <p className="mb-4 font-semibold">Priority inbox</p>
              {['Alice Freeman', 'Tech Solutions', 'Sarah Smith'].map((name, index) => (
                <div key={name} className={`mb-3 rounded-lg border p-3 ${index === 0 ? 'bg-primary/10' : 'bg-background'}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{name}</p>
                      <p className="truncate text-xs text-muted-foreground">Ready for follow-up</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold">Alice Freeman</p>
                  <p className="text-xs text-emerald-600">online now</p>
                </div>
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                <div className="max-w-[82%] rounded-xl rounded-tl-sm bg-muted px-4 py-3 text-sm">Can you send pricing and book a call?</div>
                <div className="ml-auto max-w-[82%] rounded-xl rounded-tr-sm border border-primary/20 bg-primary/10 px-4 py-3 text-sm">
                  <div className="mb-2 flex items-center gap-1 text-xs font-semibold text-primary">
                    <Bot className="h-3 w-3" />
                    AI reply
                  </div>
                  Sure. I can send the plan comparison and reserve a 30-minute slot.
                </div>
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">CRM context</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Hot lead', 'Demo booked', 'Voice enabled'].map((item) => (
                      <span key={item} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
