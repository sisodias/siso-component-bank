import { cn } from "../_utils/cn";

export function PlasticButton({ text }: { text: string; }) {
  return (
    <button
      className={cn(
        "relative inline-block px-4 py-1.75 rounded-full text-white font-medium text-sm transition-all duration-200",
        "bg-gradient-to-b from-blue-500 to-blue-600",
        "active:scale-[0.98] flex justify-center items-center"
      )}
      style={{
        background: `linear-gradient(to bottom, rgb(59, 130, 246), rgb(37, 99, 235))`,
        boxShadow: `0 2px 8px 0 rgba(37, 99, 235, 0.35), 0 1.5px 0 0 rgba(255,255,255,0.25) inset, 0 -2px 8px 0 rgba(37, 99, 235, 0.5) inset`,
      }}
    >
      <span className="relative z-10">{text}</span>
      <span
        className="absolute left-1/2 top-0 z-20 w-[80%] h-2/5 -translate-x-1/2 rounded-t-full pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 80%, transparent 100%)",
          filter: "blur(1.5px)",
        }}
      />
      <span
        className="absolute inset-0 z-0 rounded-full pointer-events-none"
        style={{
          boxShadow:
            "0 0 0 2px rgba(255,255,255,0.10) inset, 0 1.5px 0 0 rgba(255,255,255,0.18) inset, 0 -2px 8px 0 rgba(37, 99, 235, 0.18) inset",
        }}
      />
    </button>
  );
}