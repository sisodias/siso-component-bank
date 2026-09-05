import { ArrowRight, Globe2, ShieldCheck, Star, Workflow, Zap } from 'lucide-react';

type WhatSaaSLandingSectionsProps = {
  stats?: Array<{ label: string; value: string }>;
  useCases?: Array<{ title: string; description: string }>;
  testimonials?: Array<{ quote: string; name: string; role: string }>;
};

const defaultStats = [
  { value: '42%', label: 'more replies' },
  { value: '11k+', label: 'monthly conversations' },
  { value: '99.9%', label: 'automation uptime' },
  { value: '18', label: 'integrations' },
];

const defaultUseCases = [
  { title: 'Sales qualification', description: 'Route new leads through questions, forms and CRM stages.' },
  { title: 'Support automation', description: 'Resolve common questions and transfer complex cases to agents.' },
  { title: 'Voice follow-up', description: 'Start calls from the inbox and monitor recordings and credits.' },
];

const defaultTestimonials = [
  { quote: 'We replaced three disconnected tools with one WhatsApp command center.', name: 'Maya Chen', role: 'Head of Growth' },
  { quote: 'The flow builder made our handoff process visible and measurable.', name: 'Jon Bell', role: 'Support Lead' },
];

export default function WhatSaaSLandingSections({
  stats = defaultStats,
  useCases = defaultUseCases,
  testimonials = defaultTestimonials,
}: WhatSaaSLandingSectionsProps) {
  return (
    <div className="bg-background text-foreground">
      <section className="border-y bg-muted/30 px-6 py-8">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-card p-5">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex max-w-2xl items-center gap-2 text-sm font-semibold text-primary">
            <Workflow className="h-4 w-4" />
            Use cases
          </div>
          <h2 className="mt-3 text-3xl font-bold">Reusable sections for a full SaaS landing page</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {useCases.map((item, index) => (
            <div key={item.title} className="rounded-lg border bg-card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {index % 3 === 0 ? <Zap className="h-5 w-5" /> : index % 3 === 1 ? <Globe2 className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">Trusted by teams running customer conversations</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-lg leading-8">"{item.quote}"</p>
                <p className="mt-5 font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
