import React, { useRef } from "react";

export const Floating3DCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate rotation angles
    const rotateX = ((y - height / 2) / height) * 15;
    const rotateY = ((x - width / 2) / width) * -15;

    // Apply 3D transform with a slight scale on hover
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    // Reset transform on mouse leave
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 text-gray-800 transition-colors duration-300 dark:bg-black dark:text-gray-100">
      <div
        className="flex w-full justify-center px-4 sm:px-6 md:px-8"
        style={{ perspective: "1000px" }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-md border border-black/10 bg-white p-6 shadow-lg transition-transform duration-300 ease-out hover:shadow-xl dark:border-white/20 dark:bg-[#111111] dark:hover:shadow-2xl dark:hover:shadow-emerald-500/20"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Content with translateZ for depth effect */}
          <h2
            className="text-xl font-bold text-neutral-700 sm:text-2xl dark:text-white"
            style={{ transform: "translateZ(50px)" }}
          >
            Make things float in air 🪄
          </h2>

          <p
            className="mt-2 text-sm text-neutral-500 sm:text-base dark:text-neutral-300"
            style={{ transform: "translateZ(60px)" }}
          >
            Hover over this card to unleash the power of CSS perspective.
          </p>

          <div
            className="mt-6 w-full px-2"
            style={{ transform: "translateZ(100px)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
              alt="thumbnail"
              className="h-48 w-full rounded-sm object-cover transition-shadow duration-300 sm:h-60 group-hover:shadow-xl"
            />
          </div>

          <div className="mt-8 flex sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <a
              href="https://rahulv.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-4 py-2 text-xs font-medium text-neutral-700 transition-colors duration-300 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400 sm:text-sm"
              style={{ transform: "translateZ(20px)" }}
            >
              Visit →
            </a>
            <button
              className="rounded-sm bg-black px-6 py-3 text-xs font-bold text-white transition-colors duration-300 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 sm:text-sm"
              style={{ transform: "translateZ(20px)" }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};