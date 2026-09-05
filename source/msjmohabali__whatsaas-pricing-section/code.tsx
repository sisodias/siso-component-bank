import { CheckCircle2 } from 'lucide-react';

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

type WhatSaaSPricingSectionProps = {
  title?: string;
  description?: string;
  plans?: PricingPlan[];
};

const defaultPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$49',
    description: 'For small teams starting with WhatsApp automation.',
    features: ['Shared inbox', 'Basic flows', '1 phone number', 'Email support'],
  },
  {
    name: 'Growth',
    price: '$149',
    description: 'For teams that need CRM, campaigns and AI handoff.',
    highlighted: true,
    features: ['Advanced flows', 'CRM pipeline', 'AI replies', 'Campaigns', 'Voice credits'],
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'For multi-team SaaS operations and high-volume calling.',
    features: ['SIP trunk', 'OpenAI Realtime', 'Custom roles', 'REST API', 'Priority support'],
  },
];

export default function WhatSaaSPricingSection({
  title = 'Plans for every WhatsApp growth team',
  description = 'Reusable pricing section with SaaS-ready plan cards, highlighted plan support and concise feature lists.',
  plans = defaultPlans,
}: WhatSaaSPricingSectionProps) {
  return (
    <section className="bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-normal">{title}</h2>
          <p className="mt-3 text-muted-foreground">{description}</p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-lg border bg-card p-6 ${plan.highlighted ? 'border-primary shadow-lg ring-1 ring-primary/15' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                {plan.highlighted ? <span className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">Popular</span> : null}
              </div>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price.startsWith('$') ? <span className="pb-1 text-sm text-muted-foreground">/mo</span> : null}
              </div>
              <button className={`mt-6 h-10 w-full rounded-md text-sm font-semibold ${plan.highlighted ? 'bg-primary text-primary-foreground' : 'border bg-background'}`}>
                Choose {plan.name}
              </button>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
