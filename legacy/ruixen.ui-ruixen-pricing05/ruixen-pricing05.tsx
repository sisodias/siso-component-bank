"use client";

import { motion } from "framer-motion";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

const pricingTiers = [
  {
    title: "Starter",
    monthlyPrice: 0,
    buttonText: "Start free",
    popular: false,
    inverse: false,
    features: [
      "Up to 5 team members",
      "Unlimited content projects",
      "2GB storage",
      "Basic integrations",
      "Community support",
    ],
  },
  {
    title: "Pro",
    monthlyPrice: 9,
    buttonText: "Upgrade now",
    popular: true,
    inverse: true,
    features: [
      "Up to 50 team members",
      "Unlimited AI-generated content",
      "50GB storage",
      "All integrations",
      "Priority support",
      "Content export",
      "Keyword analytics",
    ],
  },
  {
    title: "Business",
    monthlyPrice: 19,
    buttonText: "Contact sales",
    popular: false,
    inverse: false,
    features: [
      "Unlimited team members",
      "200GB storage",
      "Dedicated AI workflows",
      "Custom branding",
      "Dedicated support manager",
      "API access",
      "Enterprise-grade security",
    ],
  },
];

export default function Pricing_05() {
  return (
    <section className="py-24 bg-white dark:bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple pricing for every team
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Whether you're starting small or scaling fast, Ruixen UI grows with your content needs.
          </p>
        </div>

        <div className="flex flex-col gap-6 items-center mt-12 lg:flex-row lg:items-end lg:justify-center">
          {pricingTiers.map(({ title, monthlyPrice, buttonText, popular, features, inverse }) => (
            <Card
              key={title}
              className={`max-w-xs w-full border ${inverse ? "bg-black text-white" : ""}`}
            >
              <CardHeader className="flex justify-between items-start">
                <CardTitle className={`text-lg font-bold ${inverse ? "text-white/70" : "text-muted-foreground"}`}>
                  {title}
                </CardTitle>
                {popular && (
                  <motion.div
                    animate={{ backgroundPositionX: "-100%" }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                      repeatType: "loop",
                    }}
                    className="text-sm px-3 py-1 rounded-xl border border-white/20 bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text font-medium"
                  >
                    Popular
                  </motion.div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold tracking-tighter leading-none">${monthlyPrice}</span>
                  <span className={`tracking-tight font-semibold ${inverse ? "text-white/60" : "text-muted-foreground"}`}>
                    /month
                  </span>
                </div>
                <Button
                  variant={inverse ? "secondary" : "default"}
                  className="w-full mt-6"
                >
                  {buttonText}
                </Button>
                <ul className="flex flex-col gap-4 mt-6 text-sm">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      {/* You can add a check icon here if needed */}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
