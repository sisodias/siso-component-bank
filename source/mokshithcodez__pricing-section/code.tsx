import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Component = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="relative w-full bg-black py-24 font-sans text-white sm:py-32 selection:bg-white selection:text-black">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="mb-4 max-w-2xl text-balance text-4xl font-medium tracking-tighter text-white sm:text-5xl md:text-6xl">
            Predictable pricing. <br className="hidden sm:block" />
            <span className="text-neutral-600">Infinite scale.</span>
          </h2>
          <p className="max-w-xl text-balance text-base text-neutral-400 sm:text-lg">
            Start for free, then pay only for what you use. No hidden fees, no complex tier structures. Just raw compute.
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 flex items-center gap-3">
            <span className={cn("text-sm font-medium", !isAnnual ? "text-white" : "text-neutral-500")}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-white/[0.12] transition-colors hover:bg-white/[0.2]"
              aria-label="Toggle billing cycle"
            >
              <div
                className={cn(
                  "absolute h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-in-out",
                  isAnnual ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className={cn("flex items-center gap-2 text-sm font-medium", isAnnual ? "text-white" : "text-neutral-500")}>
              Annually
              <span className="rounded-full bg-white/[0.08] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
          
          {/* Developer Tier */}
          <div className="flex flex-col rounded-xl border border-white/[0.08] bg-[#050505] p-8 transition-colors hover:border-white/[0.15]">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white">Developer</h3>
              <p className="mt-2 text-sm text-neutral-400">Perfect for side projects and evaluating the platform.</p>
            </div>
            
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-medium tracking-tighter">$0</span>
              <span className="text-sm font-medium text-neutral-500">/ forever</span>
            </div>
            
            <button className="mb-8 flex h-10 w-full items-center justify-center rounded-md border border-white/[0.12] bg-transparent text-sm font-medium transition-all hover:bg-white/[0.05] active:scale-[0.98]">
              Start for free
            </button>
            
            <div className="mb-6 h-px w-full bg-white/[0.08]" />
            
            <ul className="flex flex-col gap-4 text-sm text-neutral-300">
              {["100,000 edge requests/mo", "3 global edge regions", "Shared infrastructure", "Community support", "1 week log retention"].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="relative flex flex-col rounded-xl border border-white/[0.25] bg-black p-8 shadow-2xl">
            {/* Top Highlight Accent */}
            <div className="absolute inset-x-0 top-0 h-[1px] w-full bg-white" />
            
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">Production</h3>
                <p className="mt-2 text-sm text-neutral-400">For scalable applications and growing teams.</p>
              </div>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
                Most Popular
              </span>
            </div>
            
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-medium tracking-tighter">
                ${isAnnual ? "29" : "39"}
              </span>
              <span className="text-sm font-medium text-neutral-500">
                / user / mo
              </span>
            </div>
            
            <button className="mb-8 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-black transition-all hover:bg-neutral-200 active:scale-[0.98]">
              Upgrade to Pro
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <div className="mb-6 h-px w-full bg-white/[0.08]" />
            
            <ul className="flex flex-col gap-4 text-sm text-neutral-300">
              {["10,000,000 edge requests/mo", "150+ global edge regions", "Dedicated execution environment", "Email & priority chat support", "30 day log retention", "Advanced access controls"].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise Tier */}
          <div className="flex flex-col rounded-xl border border-white/[0.08] bg-[#050505] p-8 transition-colors hover:border-white/[0.15]">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white">Enterprise</h3>
              <p className="mt-2 text-sm text-neutral-400">Custom infrastructure for mission-critical workloads.</p>
            </div>
            
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-medium tracking-tighter">Custom</span>
            </div>
            
            <button className="mb-8 flex h-10 w-full items-center justify-center rounded-md border border-white/[0.12] bg-transparent text-sm font-medium transition-all hover:bg-white/[0.05] active:scale-[0.98]">
              Contact Sales
            </button>
            
            <div className="mb-6 h-px w-full bg-white/[0.08]" />
            
            <ul className="flex flex-col gap-4 text-sm text-neutral-300">
              {["Unlimited edge requests", "Custom region selection", "Single-tenant infrastructure", "24/7 dedicated support SLA", "Infinite log retention", "SOC2 Type II compliance"].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
        
        {/* Overage / Usage Note */}
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-neutral-500">
          <span className="flex h-2 w-2 rounded-full bg-neutral-700" />
          Need more? Extra requests are billed at $0.40 per 1M across all paid plans.
        </div>

      </div>
    </section>
  );
};