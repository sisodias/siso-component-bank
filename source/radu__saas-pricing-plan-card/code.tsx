"use client";

import { CheckCheck, MoveRight, ToggleLeft, ToggleRight } from "lucide-react";
import React, { useState } from "react";
import clsx from "clsx";

type PlanFeature = {
  name: string;
};

type PriceObject = {
  month: number;
  quarter: number;
};

type PriceIdObject = {
  monthly: string;
  quarterly: string;
};

type Plan = {
  difficulty: string;
  isFeatured: boolean;
  color_variant: string;
  description?: string;
  price: PriceObject;
  priceId: PriceIdObject;
  features: PlanFeature[];
  quarter_save?: string;
};

type TierPlanProps = {
  plan: Plan;
};

const bgMap = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  neutral: "bg-neutral",
  highlight: "bg-highlight"
};


export const TierPlan: React.FC<TierPlanProps> = ({ plan }) => {
  const [billing, setBilling] = useState<"monthly" | "quarterly">("monthly");

  const isFeatured = plan.isFeatured;
  const price = billing === "monthly" ? plan.price.month : plan.price.quarter;
  const billingLabel = billing === "monthly" ? "/ MO" : "/ QTR";
  const billingInfo =
    billing === "monthly"
      ? "Billed monthly"
      : `Billed quarterly ${plan.quarter_save ? `– save ${plan.quarter_save}` : ""}`;

  const toggleIcon = billing === "monthly" ? <ToggleLeft size={20} /> : <ToggleRight size={20} />;

  return (
    <div className="relative rounded-[32px] w-full max-w-xs">
      <div
        className={clsx(
          "relative flex flex-col h-full gap-4 p-4 z-10 rounded-2xl transition duration-300 hover:rotate-3 hover:scale-105",
          isFeatured ? bgMap[plan.color_variant] : "bg-white"
        )}

      >
        <div className="flex flex-col justify-between items-start w-full gap-7">
          <div className="flex flex-col">
            <h2
              className={clsx(
                "text-lg font-sans tracking-[0.5px] font-semibold",
                isFeatured ? "text-white" : "text-base-content"
              )}
            >
              {plan.plan_name}_
            </h2>
          </div>

          <p
            className={clsx(
              "text-5xl font-sans font-black",
              isFeatured ? "text-white" : `text-${plan.color_variant}`
            )}
          >
            €{price}{" "}
            <span className="opacity-25 uppercase text-base font-extrabold font-display">
              {billingLabel}
            </span>
          </p>

          <div className="flex items-center gap-2 -mt-4 mb-4">
            <button
              onClick={() =>
                setBilling((prev) => (prev === "monthly" ? "quarterly" : "monthly"))
              }
              className={clsx(
                "inline-flex items-center gap-1 text-sm font-medium tracking-[0.5px] transition",
                isFeatured ? "text-white" : "text-base-content"
              )}
            >
              {toggleIcon}
              {billingInfo}
            </button>
          </div>
        </div>

        {plan.description && (
          <p
            className={clsx(
              "font-sans tracking-[0.5px] -mt-2 text-base leading-[28px] font-medium",
              isFeatured ? "text-white" : "text-base-content"
            )}
          >
            {plan.description}
          </p>
        )}

        <div className="space-y-2 mt-2 mb-4">
          <button
            className={clsx(
              "font-display font-bold flex flex-row gap-5 px-4 py-3 w-full items-center justify-center rounded-lg whitespace-nowrap border-0 text-md transition-all duration-300 ease-in-out",
              isFeatured
                ? "bg-white text-base-content"
                : `bg-${plan.color_variant} text-white`
            )}
          >
            1st A/B Test is FREE
            <MoveRight size={20} />
          </button>
        </div>

        {plan.features?.length > 0 && (
          <div className="space-y-2 leading-relaxed">
            {plan.features.map((feature, i) => (
              <div
                key={i}
                className={clsx(
                  "flex items-center gap-1 my-2 justify-start",
                  isFeatured ? "text-white" : "text-base-content",
                  i === 0 ? "-ml-1 font-bold" : "opacity-75"
                )}
              >
                {i !== 0 && (
                  <CheckCheck
                    className={isFeatured ? "text-white" : "text-base-content"}
                    size={18}
                  />
                )}
                <p className="text-base font-medium">{feature.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
