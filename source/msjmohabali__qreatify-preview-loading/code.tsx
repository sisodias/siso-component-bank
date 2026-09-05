import { FlameIcon } from "lucide-react";

import { cn } from "./qreatify-preview-loading-utils/utils";

export type QreatifyPreviewLoadingProps = {
  title?: string;
  label?: string;
  className?: string;
};

export default function QreatifyPreviewLoading({
  title = "Preparing your preview",
  label = "Starting your app preview",
  className,
}: QreatifyPreviewLoadingProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 text-white",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-slate-950 to-emerald-950" />
      <div className="absolute -bottom-16 left-0 right-0 h-44 -rotate-6 opacity-60">
        <div className="mx-auto flex max-w-3xl justify-center gap-3">
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="h-40 w-3 rounded-full bg-blue-500/55"
              style={{
                transform: `translateY(${Math.abs(index - 8) * 8}px)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6 text-center">
        <div className="mx-auto mb-8 grid size-16 place-items-center rounded-2xl border border-white/12 bg-white/10 shadow-2xl">
          <FlameIcon className="size-8 text-white/45" />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-sm text-white/62 sm:text-base">{label}</p>

        <div className="mx-auto mt-7 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/12 bg-slate-950/80 text-left shadow-2xl backdrop-blur-xl">
          <div className="flex h-10 items-center gap-2 border-b border-white/10 px-4">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-yellow-300/80" />
            <span className="size-2.5 rounded-full bg-emerald-300/80" />
            <div className="ml-2 h-5 flex-1 rounded-full bg-white/8" />
          </div>
          <div className="grid gap-4 p-5">
            <div className="h-24 animate-pulse rounded-xl bg-white/10" />
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-white/8"
                  style={{ animationDelay: `${item * 120}ms` }}
                />
              ))}
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-2 animate-pulse rounded-full bg-white/12"
                  style={{
                    width: `${item === 0 ? 86 : item === 1 ? 64 : 72}%`,
                    animationDelay: `${item * 150}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
