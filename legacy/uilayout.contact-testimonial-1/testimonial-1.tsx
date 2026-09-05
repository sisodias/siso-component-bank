"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

export default function Testimonial1() {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  interface StatItem {
    percentage: string;
    logo: string;
    label: string;
    isIncrease: boolean;
  }

  const stats: StatItem[] = [
    {
      percentage: "80%",
      label: "manual payment tasks",
      isIncrease: false,
      logo: "/customer/netflix.png",
    },
    {
      percentage: "30%",
      label: "international fees",
      isIncrease: false,
      logo: "/customer/vercel.png",
    },
    {
      percentage: "25%",
      label: "payment reconciliation",
      isIncrease: false,
      logo: "/customer/amazon.png",
    },
    {
      percentage: "$100K",
      label: "saved per year",
      isIncrease: true,
      logo: "/customer/alibaba.png",
    },
  ];
  return (
    <div className="bg-gray-50 min-h-screen w-full grid place-content-center py-16 px-4 md:px-8 lg:px-16 relative">
      <div className="max-w-6xl mx-auto">
        {/* Community Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#f1efec] text-black px-4 py-1 rounded-full text-xs uppercase tracking-wider font-medium">
            Our Community
          </div>
        </div>

        {/* Main Heading with Images */}
        <div className="text-center max-w-screen-xl mx-auto relative text-neutral-900">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold  leading-tight">
            We make it easy for <br className="sm:hidden" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block mx-2 align-middle relative">
                    <div className="relative overflow-hidden sm:w-16 w-12 h-12 origin-center transition-all duration-300 md:hover:w-36 hover:-24 rounded-full border-2 border-white">
                      <img
                        src={`https://pro-section.ui-layouts.com/people/aam1.png`}
                        alt="Person smiling"
                        className="object-cover w-full h-full"
                        style={{ objectPosition: "center" }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-xs bg-white text-black p-4 rounded-lg shadow-lg border-none"
                >
                  <p className="mb-2 text-sm">
                    "It's great to have a good sense of where my money is going
                    and be able to adjust as necessary. I love the
                    transparency."
                  </p>
                  <p className="font-medium text-sm">John Doe</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            companies and
          </h1>

          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold  leading-tight">
            and their
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block mx-2 align-middle">
                    <div className="relative overflow-hidden sm:w-16 w-14 h-14 origin-center transition-all duration-300 lg:hover:w-36 md:hover:w-24 hover:-20 rounded-full border-2 border-white">
                      <img
                        src={`https://pro-section.ui-layouts.com/people/aam3.jpg`}
                        alt="Employee"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-xs bg-white text-black p-4 rounded-lg shadow-lg border-none"
                >
                  <p className="mb-2 text-sm">
                    "It's great to have a good sense of where my money is going
                    and be able to adjust as necessary. I love the
                    transparency."
                  </p>
                  <p className="font-medium text-sm">John Doe</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            employees to contribute and
          </h1>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-[#333333] leading-tight">
            manage compensation
          </h1>
        </div>
        <div className="sm:flex grid grid-cols-2 gap-8 bg-neutral-100 mt-8 w-full mx-auto px-8 py-6 border rounded-md border-neutral-200">
          {stats.map((stat, index) => (
            <div
              key={stat?.label}
              className="flex-1 flex gap-4 pl-10 relative  "
            >
              {index !== 0 && (
                <div className="w-0.5 h-9 border border-dashed border-neutral-200 absolute left-0" />
              )}
              <div className=" w-full h-full group">
                <img
                  src={`https://pro-section.ui-layouts.com/${stat?.logo}`}
                  alt="doordash"
                  className="w-[85%] h-10  object-contain grayscale mx-auto translate-y-0 group-hover:-translate-y-12 opacity-100 group-hover:opacity-0 transition-all duration-300 ease-out"
                />
                <div className="absolute left-0 top-8 opacity-0 flex flex-col items-center justify-center w-full group-hover:-top-3.5 group-hover:opacity-100 transition-all duration-300 ease-out">
                  <div className="flex items-center justify-center gap-2 relative">
                    {stat.isIncrease ? (
                      <ArrowUp className="md:w-6 md:h-6 w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="md:w-6 md:h-6 w-4 h-4 text-gray-800" />
                    )}
                    <span className="md:text-4xl text-2xl font-semibold text-gray-800">
                      {stat.percentage}
                    </span>
                  </div>
                  <p className="text-gray-800 md:text-sm text-xs text-center capitalize">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
