import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Brain, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    title: "AI Project Manager",
    subtitle: "Task Assignment Engine",
    tasks: [
      "Build onboarding flow MVP",
      "Deploy authentication system",
      "Design GTM experiment",
    ],
    team: "4-Person Team",
    score: "Cohesion Score: 92",
  },
  {
    title: "Sprint Intelligence",
    subtitle: "Real-time execution tracking",
    tasks: [
      "Analyze sprint velocity",
      "Detect collaboration bottlenecks",
      "Generate performance report",
    ],
    team: "5-Person Team",
    score: "Cohesion Score: 88",
  },
  {
    title: "AI Evaluation Layer",
    subtitle: "Proof-of-work scoring system",
    tasks: [
      "Score communication quality",
      "Evaluate reliability signals",
      "Rank execution consistency",
    ],
    team: "3-Person Team",
    score: "Cohesion Score: 94",
  },
];

export const Component = () => {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((i) => (i === 0 ? SLIDES.length - 1 : i - 1));

  const next = () =>
    setIndex((i) => (i === SLIDES.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i === SLIDES.length - 1 ? 0 : i + 1));
    }, 4500);

    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="relative w-[520px] bg-primary  rounded-3xl border border-white/10 dark:bg-primary/8 backdrop-blur-2xl p-5 overflow-hidden">

      {/* HEADER */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#cc785c]">
          <Brain className="h-5 w-5 text-white" />
        </div>

        <div>
          <p className="font-medium text-white">{slide.title}</p>
          <p className="text-sm text-white/50">{slide.subtitle}</p>
        </div>
      </div>

      {/* SLIDES (animated swap) */}
      <div className="relative min-h-[160px]">
        <div className="space-y-3 transition-all duration-500">

          {slide.tasks.map((task, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/5 p-3 animate-in fade-in slide-in-from-bottom-2"
            >
              <p className="text-sm text-white">{task}</p>
            </div>
          ))}

        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[21, 22, 23, 24].map((id) => (
              <img
                key={id}
                src={`https://i.pravatar.cc/100?img=${id}`}
                className="h-9 w-9 rounded-full border-2 border-[#181715]"
                alt="member"
              />
            ))}
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              {slide.team}
            </p>
            <p className="text-xs text-white/50">
              {slide.score}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>

          <button
            onClick={next}
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-6 bg-[#cc785c]" : "w-2 bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
};