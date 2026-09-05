"use client";
import { TimelineContent } from "@/components/ui/timeline-animation";
import {VerticalCutReveal} from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { CheckCheck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useId, useRef, useState } from "react";

const PricingSwitch = ({
  button1,
  button2,
  onSwitch,
  className,
  layoutId,
}: {
  button1: string;
  button2: string;
  onSwitch: (value: string) => void;
  className?: string;
  layoutId?: string;
}) => {
  const [selected, setSelected] = useState("0");
  const uniqueId = useId();
  const switchLayoutId = layoutId || `switch-${uniqueId}`;

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div
      className={cn(
        "relative z-10 w-full flex rounded-full bg-neutral-50 border border-gray-200 p-1",
        className,
      )}
    >
      <button
        onClick={() => handleSwitch("0")}
        className={cn(
          "relative z-10 w-full sm:h-14 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
          selected === "0"
            ? "text-white"
            : "text-muted-foreground hover:text-black",
        )}
      >
        {selected === "0" && (
          <motion.span
            layoutId={switchLayoutId}
            className="absolute top-0 left-0 sm:h-14 h-10 w-full rounded-full border-4 shadow-sm shadow-black border-black bg-gradient-to-t from-neutral-900 via-neutral-800 to-neutral-900"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative">{button1}</span>
      </button>

      <button
        onClick={() => handleSwitch("1")}
        className={cn(
          "relative z-10 w-full sm:h-14 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
          selected === "1"
            ? "text-white"
            : "text-muted-foreground hover:text-black",
        )}
      >
        {selected === "1" && (
          <motion.span
            layoutId={switchLayoutId}
            className="absolute top-0 left-0 sm:h-14 h-10 w-full rounded-full border-4 shadow-sm shadow-black border-black bg-gradient-to-t from-neutral-900 via-neutral-800 to-neutral-900"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative flex justify-center items-center gap-2">
          {button2}
        </span>
      </button>
    </div>
  );
};

export default function PricingSection2() {
  const [isUpdates, setIsUpdates] = useState(false);
  const [isCorporate, setIsCorporate] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.3,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };
  const timelineVaraints = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const toggleUpdates = (value: string) =>
    setIsUpdates(Number.parseInt(value) === 1);
  const toggleCorporate = (value: string) =>
    setIsCorporate(Number.parseInt(value) === 1);

  const calculatePrice = () => {
    if (!isUpdates && !isCorporate) return 98; // 3 months + personal
    if (isUpdates && !isCorporate) return 400; // forever + personal
    if (!isUpdates && isCorporate) return 159; // 3 months + corporate
    if (isUpdates && isCorporate) return 650; // forever + corporate
    return 98;
  };

  const calculateOriginalPrice = () => {
    const currentPrice = calculatePrice();
    return Math.round(currentPrice * 1.45);
  };

  const currentPrice = calculatePrice();
  const originalPrice = calculateOriginalPrice();

  const features = [
    "Figma Design system file",
    "2000+ components and variants",
    "Predefined style system",
    "Free licensed icons",
    "Step-by-step tutorial",
    "Use on unlimited projects",
    "Friendly support",
  ];

  return (
    <div className="px-4 pt-10 w-full min-h-screen mx-auto relative" ref={pricingRef}>
      <div className="bg-white py-16 px-4 ">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, #fff 40%, #2529f8 100%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center">
          <TimelineContent
            as="div"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="flex items-center justify-center mb-4"
          >
            <Zap className="h-5 w-5 text-blue-500 fill-blue-500 mr-2" />
            <span className="text-blue-600 font-medium">Time to connect</span>
          </TimelineContent>

          <h1 className="md:text-5xl sm:text-4xl text-3xl font-semibold text-gray-900 mb-4 leading-[120%]">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-center"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0.4,
              }}
            >
              Let's get started
            </VerticalCutReveal>
          </h1>

          <TimelineContent
            as="p"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-xl text-gray-600"
          >
            Get Module, connect, save time and money. Profit!
          </TimelineContent>
        </div>
      </div>

      {/* Product Features */}
      <div className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:gap-12 gap-4 items-center">
            <div>
              <TimelineContent
                as="h3"
                animationNum={2}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="text-3xl font-medium text-gray-900 mb-2"
              >
                What's inside
              </TimelineContent>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <TimelineContent
                    key={index}
                    as="div"
                    animationNum={3 + index}
                    timelineRef={pricingRef}
                    customVariants={timelineVaraints}
                    className="flex items-center"
                  >
                    <div className="w-6 h-6 bg-blue-500 shadow-md shadow-blue-500 rounded-full flex items-center justify-center mr-3">
                      <CheckCheck className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </TimelineContent>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <TimelineContent
                as="div"
                animationNum={3}
                timelineRef={pricingRef}
                customVariants={revealVariants}
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  Access to updates
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  One-time payment, updates come to the email
                </p>
                <PricingSwitch
                  button1="3 Months"
                  button2="Forever"
                  onSwitch={toggleUpdates}
                  className="grid grid-cols-2 w-full"
                />
              </TimelineContent>

              <TimelineContent
                as="div"
                animationNum={4}
                timelineRef={pricingRef}
                customVariants={revealVariants}
              >
                <h4 className="font-semibold text-gray-900 mb-1">
                  Lifetime license
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Select Corporate if you're part of the team
                </p>
                <PricingSwitch
                  button1="Personal"
                  button2="Corporate"
                  onSwitch={toggleCorporate}
                  className="grid grid-cols-2 w-full"
                />
              </TimelineContent>

              <TimelineContent
                as="div"
                animationNum={5}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="text-center grid grid-cols-2 items-center gap-2 px-2"
              >
                <div className="flex items-center mb-4">
                  <span className="text-5xl font-semibold text-gray-900">
                    $
                    <NumberFlow
                      value={currentPrice}
                      className="text-5xl font-semibold"
                    />
                  </span>
                  <span className="text-xl text-gray-600 line-through ml-2 relative before:content-[''] before:absolute before:left-0 before:top-3.5 before:w-full before:h-0.5 before:bg-gray-800 before:z-10">
                    $
                    <NumberFlow
                      value={originalPrice}
                      className="text-xl font-semibold line-through"
                    />
                  </span>
                </div>
                <TimelineContent
                  as="button"
                  animationNum={6}
                  timelineRef={pricingRef}
                  customVariants={revealVariants}
                  className="text-white text-xl font-semibold h-10 sm:h-16 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-600 via-blue-500 to-blue-600"
                >
                  Purchase
                </TimelineContent>
              </TimelineContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
