// app/components/Pricing.tsx
import * as React from "react";
import Link from "next/link";
import { CircleCheck } from "lucide-react";

// shadcn/ui bits
import { Button } from "./button";
import { Badge } from "./badge";

// ---- minimal craft-ds inline (single-file helper) ----------------
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type SectionProps = { children: React.ReactNode; className?: string; id?: string };
type ContainerProps = { children: React.ReactNode; className?: string; id?: string };

const Section = ({ children, className, id }: SectionProps) => (
  <section className={cn("py-8 md:py-12", className)} id={id}>
    {children}
  </section>
);

const Container = ({ children, className, id }: ContainerProps) => (
  <div className={cn("mx-auto max-w-5xl p-6 sm:p-8", className)} id={id}>
    {children}
  </div>
);
// ------------------------------------------------------------------

type PlanTier = "Basic" | "Standard" | "Pro";

interface PricingCardProps {
  title: PlanTier;
  price: string;
  description?: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

// Dummy pricing data
const pricingData: PricingCardProps[] = [
  {
    title: "Basic",
    price: "$29/month",
    description: "Perfect for small businesses and individuals.",
    features: ["3 Pages", "Basic SEO", "Email Support", "Responsive Design"],
    cta: "Choose Basic",
    href: "https://stripe.com/",
  },
  {
    title: "Standard",
    price: "$59/month",
    description: "Best for growing businesses with more needs.",
    features: ["10 Pages", "Advanced SEO", "CMS Integration", "24/7 Chat Support"],
    cta: "Choose Standard",
    href: "https://stripe.com/",
    featured: true,
  },
  {
    title: "Pro",
    price: "$99/month",
    description: "Ideal for larger businesses that need scalability.",
    features: ["Unlimited Pages", "E-commerce Integration", "Priority Support", "Custom API Integration"],
    cta: "Choose Pro",
    href: "https://stripe.com/",
  },
];

export default function Pricing() {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-4 text-center">
        <h2 className="!my-0">Pricing</h2>
        <p className="text-lg opacity-70 md:text-2xl">Select the plan that best suits your needs.</p>

        <div className="not-prose mt-4 grid grid-cols-1 gap-6 min-[900px]:grid-cols-3">
          {pricingData.map((plan) => (
            <PricingCard key={plan.title} plan={plan} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function PricingCard({ plan }: { plan: PricingCardProps }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border p-6 text-left",
        plan.featured && "border-primary shadow-sm ring-1 ring-primary/10"
      )}
      aria-label={`${plan.title} plan`}
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2">
          <Badge variant={plan.featured ? "default" : "secondary"}>{plan.title}</Badge>
          {plan.featured && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Most popular</span>
          )}
        </div>
        <h4 className="mb-2 mt-4 text-2xl text-primary">{plan.price}</h4>
        {plan.description && <p className="text-sm opacity-70">{plan.description}</p>}
      </div>

      <div className="my-4 border-t" />

      <ul className="space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center text-sm opacity-80">
            <CircleCheck className="mr-2 h-4 w-4" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <Link href={plan.href} target="_blank" rel="noreferrer noopener">
          <Button size="sm" className="w-full" variant={plan.featured ? "default" : "secondary"}>
            {plan.cta}
          </Button>
        </Link>
      </div>
    </div>
  );
}
