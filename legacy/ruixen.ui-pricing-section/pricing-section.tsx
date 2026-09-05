"use client";

import { useState } from "react";
import { Button } from "./button";
import { CheckIcon, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import cn from "clsx";

const plans = [
  {
    title: "Free",
    monthlyPrice: 0,
    annuallyPrice: 0,
    desc: "Perfect to start with personal usage",
    features: [
      "20 volts per month",
      "Roll over volts",
      "Personal use license",
      "Public generations",
      "Plugins for Figma, Framer, Webflow",
    ],
    buttonText: "Get Started",
  },
  {
    title: "Basic",
    monthlyPrice: 8,
    annuallyPrice: Math.round(8 * 12 * 0.8),
    desc: "For growing teams",
    features: [
      "Roll over volts",
      "Royalty free commercial license",
      "Public generations",
      "Plugins for Figma, Framer, Webflow",
    ],
    buttonText: "Get Started",
  },
  {
    title: "Standard",
    monthlyPrice: 16,
    annuallyPrice: Math.round(16 * 12 * 0.8),
    desc: "For professional creators",
    features: [
      "Roll over volts",
      "Royalty free commercial license",
      "Public generations",
      "Plugins for Figma, Framer, Webflow",
    ],
    buttonText: "Get Started",
  },
  {
    title: "Pro",
    monthlyPrice: 32,
    annuallyPrice: Math.round(32 * 12 * 0.8),
    desc: "Advanced tools for teams",
    features: [
      "Roll over volts",
      "Royalty free commercial license",
      "Private generations",
      "Plugins for Figma, Framer, Webflow",
    ],
    buttonText: "Get Started",
  },
  {
    title: "Mastermind",
    monthlyPrice: 64,
    annuallyPrice: Math.round(64 * 12 * 0.8),
    desc: "All-in-one for enterprises",
    features: [
      "Roll over volts",
      "Royalty free commercial license",
      "Private generations",
      "Plugins for Figma, Framer, Webflow",
    ],
    buttonText: "Get Started",
  },
];


const PlanCard = ({
  plan,
  billing,
  users,
}: {
  plan: typeof plans[0];
  billing: "monthly" | "annual";
  users: number;
}) => {
  const price = billing === "annual" ? plan.annuallyPrice : plan.monthlyPrice;

  return (
    <div
      className={cn(
        "flex flex-col relative rounded-2xl border-2 border-blue-500 ring-2 ring-blue-500/20 lg:rounded-3xl transition-all bg-background/50 border border-gray-200 dark:border-gray-700 overflow-hidden",
        plan.title === "Mastermind" && "border-blue-500",
        plan.title === "Standard" && "border-2 border-orange-500 ring-2 ring-orange-500/20 dark:border-orange-500 dark:ring-orange-500/20"
      )}
    >
      {plan.title === "Mastermind" && (
        <div className="absolute top-1/2 inset-x-0 mx-auto h-12 -rotate-45 w-full bg-blue-600 rounded-2xl lg:rounded-3xl blur-[8rem] -z-10"></div>
      )}

      <div className="p-2 flex flex-col items-start w-full relative">
        <h2 className="font-normal text-sm text-foreground pt-2">{plan.title}</h2>
        <h3 className="mt-3 text-xl md:text-3xl font-bold">
          ${price * users}
          <span className="text-sm font-normal text-muted-foreground">
            /{billing}
          </span>
        </h3>
        <p className="text-xs md:text-base text-muted-foreground mt-2">
          {plan.desc}
        </p>
      </div>

      <div className="flex flex-col items-start w-full px-2 py-2">
        <Button size="lg" className="w-full">
          {plan.buttonText}
        </Button>
        <div className="h-8 overflow-hidden w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.span
              key={billing}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-sm text-center text-muted-foreground mt-3 mx-auto block"
            >
              {billing === "monthly"
                ? "Billed monthly"
                : "Billed in one annual payment"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col items-start w-full p-2 gap-y-2">
        <span className="text-xs text-left mb-2">Includes:</span>
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
          <CheckIcon className="w-3 h-3 flex-shrink-0 text-blue-500 mt-1" />
          <span className="text-left text-sm">{feature}</span>
        </div>        
        ))}
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [users, setUsers] = useState(1);

  return (
    <section className="py-16 bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-full">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                billing === "annual" ? "bg-black text-white" : "dark:text-gray-200 text-gray-700"
              }`}
              onClick={() => setBilling("annual")}
            >
              Annually (Save 20%)
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                billing === "monthly" ? "bg-black text-white" : "text-gray-700"
              }`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
          </div>

          <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm font-normal">
            <span>Users:</span>
            <button
              className="px-2 text-lg"
              onClick={() => setUsers(Math.max(1, users - 1))}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center">{users}</span>
            <button className="px-2 text-lg" onClick={() => setUsers(users + 1)}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-5">
          {plans.map((plan) => (
            <PlanCard key={plan.title} plan={plan} billing={billing} users={users} />
          ))}
        </div>
      </div>
    </section>
  );
}
