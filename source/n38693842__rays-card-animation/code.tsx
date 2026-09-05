import React from 'react';
import { motion } from 'framer-motion';

interface MeteorsProps {
  number?: number;
}

const Meteors: React.FC<MeteorsProps> = ({ number = 20 }) => {
  const meteors = new Array(number).fill(true);

  return (
    <>
      {meteors.map((_, idx) => (
        <span
          key={idx}
          className="absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[0deg] animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: Math.floor(Math.random() * 100) + '%',
            left: Math.floor(Math.random() * 100) + '%',
            animationDelay: Math.random() * 0.6 + 0.2 + 's',
            animationDuration: Math.floor(Math.random() * 8 + 2) + 's',
          }}
        >
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[1px] w-[50px] -translate-y-[50%] -translate-x-[50%] bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  );
};

export function Component() {
  return (
    <div className="min-h-screen w-full dark:bg-black bg-white flex items-center justify-center p-4">
      <style>{`
        @keyframes meteor {
          0% {
            transform: rotate(215deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(215deg) translateX(-500px);
            opacity: 0;
          }
        }

        .animate-meteor {
          animation: meteor linear infinite;
        }
      `}</style>

      <div className="flex w-full flex-col items-center justify-center py-24">
        <div className="relative w-full max-w-xs">
          {/* Glowing background blur */}
          <div className="absolute inset-0 size-full scale-[0.80] rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />
          
          {/* Main card */}
          <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 px-4 py-8 shadow-xl">
            {/* Arrow icon */}
            <div className="mb-4 flex size-5 items-center justify-center rounded-full border border-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-2 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="relative z-50 mb-4 text-xl font-bold text-white">
              Meteors because they're cool
            </h1>

            {/* Description */}
            <p className="relative z-50 mb-4 text-base font-normal text-slate-500">
              I don't know what to write so I'll just paste something cool here. One more
              sentence because lorem ipsum is just unacceptable. Won't ChatGPT the shit out of
              this.
            </p>

            {/* Button */}
            <button className="rounded-sm border border-gray-500 px-4 py-1 text-gray-300 hover:bg-gray-800 transition-colors hover:cursor-pointer">
              Explore
            </button>

            {/* Meteors effect */}
            <Meteors number={20} />
          </div>
        </div>
      </div>
    </div>
  );
}