"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import {VerticalCutReveal} from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Starter",
    description:
      "Great for small businesses and startups looking to get started with AI",
    price: 12,
    yearlyPrice: 99,
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    features: [
      { text: "Up to 10 boards per workspace", icon: <Briefcase size={20} /> },
      { text: "Up to 10GB storage", icon: <Database size={20} /> },
      { text: "Limited analytics", icon: <Server size={20} /> },
    ],
    includes: [
      "Free includes:",
      "Unlimted Cards",
      "Custom background & stickers",
      "2-factor authentication",
    ],
  },
  {
    name: "Business",
    description:
      "Best value for growing businesses that need more advanced features",
    price: 48,
    yearlyPrice: 399,
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    features: [
      { text: "Unlimted boards", icon: <Briefcase size={20} /> },
      { text: "Storage (250MB/file)", icon: <Database size={20} /> },
      { text: "100 workspace command runs", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "Advanced checklists",
      "Custom fields",
      "Servedless functions",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Advanced plan with enhanced security and unlimited access for large teams",
    price: 96,
    yearlyPrice: 899,
    popular: true,
    buttonText: "Get started",
    buttonVariant: "default" as const,
    features: [
      { text: "Unlimited board", icon: <Briefcase size={20} /> },
      { text: "Unlimited storage ", icon: <Database size={20} /> },
      { text: "Unlimited workspaces", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Business, plus:",
      "Multi-board management",
      "Multi-board guest",
      "Attachment permissions",
    ],
  },
];

const PricingSwitch = ({
  onSwitch,
  className,
}: {
  onSwitch: (value: string) => void;
  className?: string;
}) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-50 border border-gray-200 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit sm:h-12 cursor-pointer h-10  rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0"
              ? "text-black"
              : "text-muted-foreground hover:text-black",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-neutral-300 border-neutral-300 bg-gradient-to-t from-neutral-100 via-neutral-200 to-neutral-300"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit cursor-pointer sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1"
              ? "text-black"
              : "text-muted-foreground hover:text-black",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10  w-full  rounded-full border-4 shadow-sm shadow-neutral-300 border-neutral-300 bg-gradient-to-t from-neutral-100 via-neutral-200 to-neutral-300"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-black">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection4() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="px-4 pt-20 min-h-screen  max-w-7xl  mx-auto relative"
      ref={pricingRef}
    >
      <article className="flex sm:flex-row flex-col sm:pb-0 pb-4 sm:items-center items-start justify-between">
        <div className="text-left mb-6">
          <h2 className="text-4xl font-medium leading-[130%] text-gray-900 mb-4">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-start"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0, // First element
              }}
            >
              Plans & Pricing
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-gray-600 w-[80%]"
          >
            Trusted by millions, We help teams all around the world, Explore
            which option is right for you.
          </TimelineContent>
        </div>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} className="shrink-0" />
        </TimelineContent>
      </article>

      <TimelineContent
        as="div"
        animationNum={2}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="grid md:grid-cols-3 gap-4 mx-auto  bg-gradient-to-b from-neutral-100 to-neutral-200 sm:p-3 rounded-lg"
      >
        {plans.map((plan, index) => (
          <TimelineContent
            as="div"
            key={plan.name}
            animationNum={index + 3}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative flex-col flex justify-between  ${
                plan.popular
                  ? "scale-110 ring-2 ring-neutral-900 bg-gradient-to-t from-black to-neutral-900 text-white"
                  : "border-none shadow-none bg-transparent pt-4 text-gray-900"
              }`}
            >
              <CardContent className="pt-0">
                <div className="space-y-2 pb-3">
                  {plan.popular && (
                    <div className="pt-4">
                      <span className="bg-neutral-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline">
                    <span className="text-4xl font-semibold ">
                      $
                      <NumberFlow
                        format={{
                          currency: "USD",
                        }}
                        value={isYearly ? plan.yearlyPrice : plan.price}
                        className="text-4xl font-semibold"
                      />
                    </span>
                    <span
                      className={
                        plan.popular
                          ? "text-neutral-200 ml-1"
                          : "text-gray-600 ml-1"
                      }
                    >
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-3xl font-semibold mb-2">{plan.name}</h3>
                </div>
                <p
                  className={
                    plan.popular
                      ? "text-sm text-neutral-200 mb-4"
                      : "text-sm text-gray-600 mb-4"
                  }
                >
                  {plan.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <h4 className="font-medium text-base  mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2 font-semibold">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span
                          className={
                            plan.popular
                              ? "text-white h-6 w-6 bg-neutral-600 border border-neutral-500 rounded-full grid place-content-center mt-0.5 mr-3"
                              : "text-black h-6 w-6 bg-white border border-black rounded-full grid place-content-center mt-0.5 mr-3"
                          }
                        >
                          <CheckCheck className="h-4 w-4  " />
                        </span>
                        <span
                          className={
                            plan.popular
                              ? "text-sm text-neutral-100"
                              : "text-sm text-gray-600"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <button
                  className={`w-full mb-6 p-4 text-xl rounded-xl ${
                    plan.popular
                      ? "bg-gradient-to-t from-neutral-100 to-neutral-300 font-semibold shadow-lg shadow-neutral-500 border border-neutral-400 text-black"
                      : plan.buttonVariant === "outline"
                        ? "bg-gradient-to-t from-neutral-900 to-neutral-600  shadow-lg shadow-neutral-900 border border-neutral-700 text-white"
                        : ""
                  }`}
                >
                  {plan.buttonText}
                </button>
              </CardFooter>
            </Card>
          </TimelineContent>
        ))}
      </TimelineContent>
    </div>
  );
}
