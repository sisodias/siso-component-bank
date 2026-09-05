import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div
  className= "group relative w-80 overflow-hidden rounded-2xl dark:bg-neutral-900 p-6 font-sans shadow-2xl"
    >
    <div
    className="absolute -top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-lime-500/10 blur-3xl transition-all duration-700 group-hover:bg-lime-500/15"
    > </div>

    < div className="relative flex flex-col gap-5" >
      <div
      className="flex items-start justify-between border-b border-neutral-800 pb-5"
    >
    <div className="flex items-center gap-3" >
      <div
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400/10"
    >
    <svg
            xmlns="http://www.w3.org/2000/svg"
  className="h-5 w-5 text-lime-400"
  viewBox = "0 0 24 24"
  strokeWidth="1.5"
  stroke = "currentColor"
  fill = "none"
  strokeLinecap="round"
  strokeLinejoin="round"
    >
    <path stroke="none" d = "M0 0h24v24H0z" fill = "none" > </path>
      < path
  d = "M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
    > </path>
    < path
  d = "M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
    > </path>
    < path
  d = "M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
    > </path>
    < path d = "M4 20l14 0" > </path>
      < /svg>
      < /div>
      < div >
      <p className="font-semibold dark:text-neutral-200" > Finance Plan < /p>
        < p className="text-xs dark:text-neutral-500" > Updated just now < /p>
          < /div>
          < /div>
          < /div>

          < div className="flex divide-x divide-neutral-800" >
            <div className="flex-1 pr-6" >
              <p className="text-xs font-medium text-neutral-500" > Revenue < /p>
                < p className="text-xl font-semibold dark:text-neutral-100" > $51, 274 < /p>
                  < p className="mt-1 text-xs font-medium text-lime-400" > +8.5 % </p>
                    < /div>
                    < div className="flex-1 pl-6" >
                      <p className="text-xs font-medium text-neutral-500" > Costs < /p>
                        < p className="text-xl font-semibold dark:text-neutral-100" > $12, 818 < /p>
                          < p className="mt-1 text-xs font-medium text-red-400" > +2.1 % </p>
                            < /div>
                            < /div>

                            < div className="relative h-24 w-full" >
                              <svg
        className="h-full w-full"
  viewBox = "0 0 300 100"
  preserveAspectRatio = "none"
    >
    <defs>
    <linearGradient id="aurora-gradient-v2" x1 = "0" y1 = "0" x2 = "0" y2 = "1" >
      <stop offset="0%" stopColor="#a3e635" stopOpacity="0.2" > </stop>
        < stop offset = "100%" stopColor="#a3e635" stopOpacity="0" > </stop>
          < /linearGradient>
          < /defs>
          < path
  d = "M0,65 C50,20 80,80 150,70 S250,50 300,85"
  fill = "none"
  stroke = "#a3e635"
  strokeWidth="2"
    > </path>
    < path
  d = "M0,100 L0,65 C50,20 80,80 150,70 S250,50 300,85 L300,100 Z"
  fill = "url(#aurora-gradient-v2)"
    > </path>
    < /svg>
    < div className="absolute right-[-1px] top-[81px]" >
      <div
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400 shadow-lg shadow-lime-400/50"
    > </div>
    < div
  className="animate-pulse-strong absolute h-full w-full rounded-full bg-lime-400/25"
    > </div>
    < /div>
    < /div>

    < div className="border-t border-neutral-800 pt-5" >
      <button
        className="w-full rounded-lg border border-lime-400/50 bg-transparent px-4 py-2 text-sm font-medium text-lime-400 transition-colors duration-300 hover:bg-lime-400 hover:text-neutral-950"
    >
    View Full Report
      < /button>
      < /div>
      < /div>
      < /div>

  );
};
