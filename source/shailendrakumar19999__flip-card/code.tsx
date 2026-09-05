"use client";
import clsx from "clsx";
import { ClipboardList, HelpCircle, Lightbulb, RotateCcw } from "lucide-react";
import { useState, FC } from "react";

interface FlashCardProps {
  question: string;
  hint: string;
  answer: string;
}

const FlashCard: FC<FlashCardProps> = ({ question, hint, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "relative h-[220px] w-[480px] cursor-pointer rounded-3xl border-0 bg-transparent transition-all duration-700 ease-out",
        "hover:scale-[1.02] active:scale-[0.98]",
        "transform-gpu perspective-1000",
        {
          "[&_.card-content]:rotate-y-180": isFlipped,
        }
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow effect */}
      <div
        className={clsx(
          "absolute inset-0 rounded-3xl transition-all duration-500",
          "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500",
          "opacity-0 blur-xl",
          {
            "opacity-20": isHovered,
            "opacity-30": isFlipped,
          }
        )}
      />
      {/* Flip badge */}
      <div
        className={clsx(
          "absolute top-3 right-3 z-20 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-300",
          "bg-gradient-to-r from-blue-600 to-purple-600",
          "backdrop-blur-sm border border-white/20",
          {
            "scale-110": isHovered,
          }
        )}
      >
        Click to Flip
      </div>
      {/* Reset button */}
      {isFlipped && (
        <button
          onClick={handleReset}
          className={clsx(
            "absolute top-3 left-3 z-20 rounded-full p-1.5 text-white shadow-lg transition-all duration-300",
            "bg-gradient-to-r from-gray-600 to-gray-700",
            "backdrop-blur-sm border border-white/20",
            "hover:scale-110 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800"
          )}
        >
          <RotateCcw size={14} />
        </button>
      )}
      <div
        className="card-content h-full w-full transition-transform duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front Side */}
        <div
          className={clsx(
            "absolute h-full w-full rounded-3xl p-6 text-gray-800 transition-all duration-500",
            "bg-gradient-to-br from-white via-blue-50 to-indigo-100",
            "border border-white/50 shadow-2xl",
            "backdrop-blur-sm",
            "[backface-visibility:hidden]",
            "hover:shadow-3xl"
          )}
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-xl" />
          <div className="relative z-10">
            <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <HelpCircle size={24} className="text-blue-600" />
              Question
            </h3>
            <p className="text-lg leading-relaxed font-medium text-gray-700 mb-6">
              {question}
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200/50">
              <Lightbulb size={20} className="text-orange-500" />
              <p className="text-sm text-gray-600 font-medium">{hint}</p>
            </div>
          </div>
        </div>
        {/* Back Side */}
        <div
          className={clsx(
            "absolute h-full w-full rounded-3xl p-6 text-gray-800 transition-all duration-500",
            "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100",
            "border border-white/50 shadow-2xl",
            "backdrop-blur-sm",
            "[backface-visibility:hidden]",
            "rotate-y-180",
            "hover:shadow-3xl"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tr from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl" />
          <div className="relative z-10">
            <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              <ClipboardList size={24} className="text-emerald-600" />
              Answer
            </h3>
            <div className="rounded-xl border-2 border-emerald-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-lg">
              <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                {answer}
              </pre>
            </div>
          </div>
        </div>
      </div>
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div
          className={clsx(
            "absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full transition-all duration-1000",
            {
              "animate-pulse opacity-60": isHovered,
              "opacity-0": !isHovered,
            }
          )}
        />
        <div
          className={clsx(
            "absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full transition-all duration-1000 delay-200",
            {
              "animate-pulse opacity-60": isHovered,
              "opacity-0": !isHovered,
            }
          )}
        />
        <div
          className={clsx(
            "absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-400 rounded-full transition-all duration-1000 delay-400",
            {
              "animate-pulse opacity-60": isHovered,
              "opacity-0": !isHovered,
            }
          )}
        />
      </div>
    </div>
  );
};

const flashCardsData: FlashCardProps[] = [
  {
    question:
      "What is the difference between let, const, and var in JavaScript?",
    hint: "Think about scope and reassignment",
    answer: `var: Function-scoped, can be re-declared.\nlet: Block-scoped, can be reassigned.\nconst: Block-scoped, cannot be reassigned.`,
  },
  {
    question: "What is a closure in JavaScript?",
    hint: "Think about inner functions and variable access",
    answer: `A closure is a function that has access to its own scope, the outer function's scope, and the global scope.`,
  },
  {
    question: "Explain the concept of promises in JavaScript.",
    hint: "Think about asynchronous operations",
    answer: `A Promise is an object representing the eventual completion or failure of an asynchronous operation.`,
  },
  
  
];

export const Component = () => (
  <div className="flex flex-col w-full items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 pb-5">
    <h1 className="text-2xl font-bold">Flash Cards Test</h1>
    <div className="grid grid-cols-1 mt-20 gap-8">
      {flashCardsData.map((card) => (
        <FlashCard key={card.question} {...card} />
      ))}
    </div>
  </div>
);

