import { cn } from "../_utils/cn";
import { SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
import { LuSlash } from "react-icons/lu";

export const Component = () => {
  return (
    <section
      className={cn(
        "group relative w-full max-w-[880px] mx-auto overflow-hidden",
        "rounded-[36px] border backdrop-blur-xl",
        // Dark mode
        "dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(9,12,14,0.92),rgba(6,8,10,0.94))]",
        "dark:shadow-[inset_0_2px_0_rgba(255,255,255,0.07),0_50px_130px_-40px_rgba(0,0,0,0.85)]",
        // Light mode
        "border-neutral-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(245,246,247,0.9))]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_40px_100px_-40px_rgba(0,0,0,0.1)]"
      )}
    >
      {/* Background ambiance glows */}
      <div
        className={cn(
          "pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl",
          "dark:bg-[radial-gradient(closest-side,rgba(0,255,170,0.18),transparent_70%)]",
          "bg-[radial-gradient(closest-side,rgba(16,185,129,0.12),transparent_70%)]"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -bottom-24 -right-28 h-96 w-96 rounded-full blur-3xl",
          "dark:bg-[radial-gradient(closest-side,rgba(124,58,237,0.2),transparent_70%)]",
          "bg-[radial-gradient(closest-side,rgba(139,92,246,0.12),transparent_70%)]"
        )}
      />

      {/* Floating orbs animation - only visible on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <FloatingOrb className="top-1/4 left-1/4 animate-float-1" />
        <FloatingOrb className="top-1/3 right-1/3 animate-float-2" />
        <FloatingOrb className="bottom-1/4 left-1/3 animate-float-3" />
        <FloatingOrb className="bottom-1/3 right-1/4 animate-float-4" />
      </div>

      <div className="relative p-12 md:p-16">
        <h2
          className={cn(
            "text-[32px] sm:text-5xl font-extrabold tracking-tight",
            // Dark text gradient
            "dark:bg-gradient-to-b dark:from-white dark:to-white/70 dark:bg-clip-text dark:text-transparent",
            // Light text gradient
            "bg-gradient-to-b from-black to-neutral-600 bg-clip-text text-transparent"
          )}
        >
          Fits right into your stack
        </h2>
        <p
          className={cn(
            "mt-5 max-w-2xl text-lg leading-relaxed",
            "dark:text-slate-300/80 text-neutral-600"
          )}
        >
          Seamlessly connect with your existing stack + your favorite tools
        </p>

        {/* Diamond icon layout */}
        <div
          className={cn(
            "mx-auto mt-14 grid grid-cols-3 gap-8 md:gap-12 place-items-center",
            "max-w-[560px]"
          )}
        >
          {/* Center Top (React) */}
          <div />
          <IconTile>
            <SiReact className="h-10 w-10 text-emerald-400 dark:text-emerald-300" />
          </IconTile>
          <div />

          {/* Middle Left (Tailwind) */}
          <IconTile>
            <SiTailwindcss className="h-10 w-10 text-emerald-400 dark:text-emerald-300" />
          </IconTile>

          {/* Empty cell (spacing) */}
          <div />

          {/* Middle Right (Shadcn slash mimic) */}
          <IconTile>
            <div className="relative flex items-center">
              <LuSlash className="h-9 w-9 text-emerald-400 dark:text-emerald-300" />
              <LuSlash className="h-9 w-9 -ml-3 text-emerald-400/80 dark:text-emerald-300/80" />
            </div>
          </IconTile>

          {/* Bottom Center (TS) */}
          <div />
          <IconTile>
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-200 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/20">
              <span className="text-sm font-black tracking-tight text-emerald-600 dark:text-emerald-200">
                TS
              </span>
            </div>
          </IconTile>
          <div />
        </div>
      </div>
    </section>
  );
};

function FloatingOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute h-2 w-2 rounded-full",
        "bg-gradient-to-r from-emerald-400 to-cyan-400 dark:from-emerald-500 dark:to-cyan-500",
        "blur-[2px] opacity-60",
        "transition-all duration-700 ease-in-out",
        className
      )}
      style={{
        animation: 'float 6s ease-in-out infinite',
        animationDelay: `${Math.random() * 2}s`
      }}
    >
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-30px) translateX(-10px);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}

function IconTile({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative h-28 w-28 md:h-32 md:w-32",
        "rounded-[24px] overflow-hidden",
        "backdrop-blur-md border transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl",
        // Dark mode styles
        "dark:bg-[linear-gradient(180deg,rgba(18,24,27,0.92),rgba(10,14,16,0.95))]",
        "dark:border-white/10 dark:shadow-[inset_0_2px_2px_rgba(255,255,255,0.08),inset_0_-2px_1px_rgba(0,0,0,0.55),0_26px_70px_-22px_rgba(0,0,0,0.9)]",
        // Light mode styles
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(245,246,247,0.95))]",
        "border-neutral-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_20px_50px_-20px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}