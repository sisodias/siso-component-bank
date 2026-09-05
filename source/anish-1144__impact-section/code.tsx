"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";

const impactCards = [
  {
    id: 0,
    metric: "3x",
    title: "Increase in conversions",
    description:
      "Optimized landing pages and streamlined user flows helped this client triple their conversion rate within 90 days.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#CCFF00]",
    text: "text-[#111111]",
    isFeature: true,
  },
  {
    id: 1,
    metric: "45%",
    title: "Reduction in churn",
    description:
      "Proactive engagement tools and smarter onboarding flows retained nearly half the users who would have otherwise left.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#B8E8FF]",
    text: "text-[#111111]",
  },
  {
    id: 2,
    metric: "93%",
    title: "Faster response times",
    description:
      "Automated workflows and intelligent routing cut average response times dramatically across all support channels.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#222222]",
    text: "text-[#ffffff]",
  },
  {
    id: 3,
    metric: "100%",
    title: "Automated reporting",
    description:
      "End-to-end reporting automation eliminated manual data pulls and gave leadership real-time visibility.",
    image:
      "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#FF5CBA]",
    text: "text-[#111111]",
  },
];

export default function ImpactSection() {
  const [openCard, setOpenCard] = useState(0);

  return (
    <section className="w-full bg-[#f3f3f3] py-12 sm:py-16 md:py-20">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-start justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-[620px]">
            <p className="text-[11px] tracking-[2px] uppercase font-semibold text-[#111111] mb-4">
              Case Studies
            </p>
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] leading-[1.05] font-semibold text-[#111111]">
              Results that speak for themselves
            </h2>
            <p className="mt-4 text-[14px] sm:text-[15px] text-[#5f6670] leading-[1.7] max-w-[560px]">
              From conversion to retention, our clients see measurable impact across every metric that matters.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              className="w-9 h-9 rounded-full border border-[#dddddd] bg-white text-[#222] flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full border border-[#dddddd] bg-white text-[#222] flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-0">
          {impactCards.map((card, idx) => {
            const isOpen = openCard === idx;
            const closedHeights = [280, 330, 390, 430];
            const targetHeight = isOpen ? 460 : closedHeights[idx];

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setOpenCard(idx)}
                onFocus={() => setOpenCard(idx)}
                onClick={() => setOpenCard(idx)}
                tabIndex={0}
                animate={{ flex: isOpen ? 4.8 : 1.5 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className={`${card.bg} ${card.text} relative overflow-hidden border border-[#ececec] h-[360px] md:h-auto cursor-pointer`}
              >
                <motion.div
                  animate={{ height: targetHeight }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  className="h-full"
                >
                  {isOpen ? (
                    <div className="h-full p-6 sm:p-8 md:p-10 flex flex-col">
                      {card.isFeature ? (
                        <div className="max-w-[280px]">
                          <h3 className="text-[28px] sm:text-[32px] md:text-[36px] leading-[1.05] font-semibold mb-4">
                            Acme Corp
                            <br />
                            case study
                          </h3>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 text-[11px] tracking-[1.4px] uppercase font-semibold"
                          >
                            Read case study <ArrowRight size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="max-w-[300px]">
                          <p className="text-[10px] tracking-[1.3px] uppercase font-semibold opacity-80">
                            Case study
                          </p>
                          <h3 className="mt-2 text-[22px] sm:text-[26px] md:text-[30px] leading-[1.08] font-semibold">
                            {card.title}
                          </h3>
                          <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.6] opacity-90">
                            {card.description}
                          </p>
                          <button
                            type="button"
                            className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[1.4px] uppercase font-semibold"
                          >
                            Read case study <ArrowRight size={14} />
                          </button>
                        </div>
                      )}

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1.05fr_1fr] gap-4 flex-1 items-start">
                        <div className="self-start sm:self-end">
                          <p className="text-[56px] sm:text-[62px] md:text-[72px] font-semibold leading-none">
                            {card.metric}
                          </p>
                          <p className="mt-2 text-[11px] tracking-[1.2px] uppercase font-semibold">
                            {card.title}
                          </p>
                        </div>

                        <div
                          className={`relative w-full rounded-sm overflow-hidden border border-black/10 ${
                            card.isFeature
                              ? "h-[220px] sm:h-[250px] md:h-[270px]"
                              : "h-[160px] sm:h-[180px] md:h-[200px]"
                          }`}
                        >
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full p-5 sm:p-6 md:p-7 flex flex-col justify-between">
                      <div />
                      <div>
                        <p className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold leading-none">
                          {card.metric}
                        </p>
                        <p className="mt-2 text-[11px] tracking-[1.2px] uppercase font-semibold max-w-[120px]">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 bg-[#111111] text-white rounded-full px-5 sm:px-8 py-4 flex items-center justify-center text-center">
          <p className="text-[13px] sm:text-[14px] leading-[1.4]">
            See your potential. Estimate your growth with our free ROI calculator.
          </p>
        </div>
      </div>
    </section>
  );
}
