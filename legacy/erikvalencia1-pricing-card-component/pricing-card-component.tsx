// component-variation1.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "../_utils/cn";
import { buttonVariants } from "./button";
import { Check, Star } from "lucide-react";
import NumberFlow from "@number-flow/react";

type Plan = {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
};

interface Props {
  plans: Plan[];
  heading?: string;
  subheading?: string;
}

export const Component = ({ 
  plans, 
  heading = "Pricing Made Simple", 
  subheading = "Pick a plan that matches your needs." 
}: Props) => {
  return (
    <section className="container py-20">
      <div className="mb-12 text-center space-y-3">
        <h2 className="text-4xl font-bold">{heading}</h2>
        <p className="text-muted-foreground">{subheading}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? -2 : 2 }}
            className={cn(
              "relative flex w-[300px] flex-col rounded-2xl border p-6 shadow-md bg-card transition",
              plan.isPopular && "border-primary shadow-lg scale-105"
            )}
          >
            {plan.isPopular && (
              <span className="absolute right-3 top-3 flex items-center rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                <Star className="mr-1 h-3 w-3 fill-current" /> Popular
              </span>
            )}
            <h3 className="font-semibold text-lg">{plan.name}</h3>
            <div className="mt-4 flex items-end gap-1">
              <NumberFlow
                value={Number(plan.price)}
                formatter={(v) => `$${v}`}
                className="text-4xl font-bold"
              />
              <span className="text-sm text-muted-foreground">
                / {plan.period}
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-left">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={cn(
                buttonVariants({ variant: "default" }),
                "mt-6 w-full"
              )}
            >
              {plan.buttonText}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
