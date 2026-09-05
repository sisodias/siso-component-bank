import React from "react";

interface BentoItem {
  id: string;
  colSpan?: 5 | 7 | 4 | 12;
  idx: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags?: string[];
  bigStat?: { value: string; label: string };
  listItems?: string[];
  cta?: { label: string; href: string };
}

interface SaiconBentoGridProps {
  items: BentoItem[];
  accentColor?: string;
}

const defaultIcon = (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

export default function SaiconBentoGrid({
  items,
  accentColor = "#0090ff",
}: SaiconBentoGridProps) {
  const colSpanClass: Record<number, string> = {
    5: "col-span-5",
    7: "col-span-7",
    4: "col-span-4",
    12: "col-span-12",
  };

  return (
    <div
      style={{ "--ac": accentColor } as React.CSSProperties}
      className="grid grid-cols-12 gap-3 w-full"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`${colSpanClass[item.colSpan ?? 4] ?? "col-span-4"} relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_20px_60px_rgba(0,0,0,.5)] hover:-translate-y-0.5 group`}
        >
          {/* accent glow */}
          <div
            className="pointer-events-none absolute bottom-0 right-0 w-44 h-44 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at bottom right, ${accentColor}14, transparent 70%)` }}
          />

          <div className="font-mono text-[10px] tracking-[2px] text-white/30 mb-5 uppercase">
            {item.idx}
          </div>

          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border"
            style={{
              background: `${accentColor}18`,
              borderColor: `${accentColor}30`,
              color: accentColor,
            }}
          >
            {item.icon ?? defaultIcon}
          </div>

          {item.bigStat && (
            <div className="mb-5">
              <div
                className="font-bold leading-none tracking-tight text-6xl mb-2"
                style={{ color: accentColor, fontSize: "clamp(48px,5vw,72px)" }}
              >
                {item.bigStat.value}
              </div>
              <div className="font-mono text-[10px] tracking-[2px] text-white/30 uppercase">
                {item.bigStat.label}
              </div>
            </div>
          )}

          <div className="text-xl font-bold text-white/90 mb-3 leading-tight" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {item.title}
          </div>

          <div className="text-sm text-white/50 leading-relaxed max-w-sm">
            {item.description}
          </div>

          {item.listItems && (
            <ul className="mt-4 flex flex-col gap-2.5">
              {item.listItems.map((li, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                  <span className="mt-2.5 w-4 h-px flex-shrink-0 opacity-60" style={{ background: accentColor }} />
                  {li}
                </li>
              ))}
            </ul>
          )}

          {item.tags && (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] tracking-[1.5px] px-2.5 py-1 rounded-md border uppercase"
                  style={{ color: accentColor, background: `${accentColor}12`, borderColor: `${accentColor}20` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {item.cta && (
            <a
              href={item.cta.href}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg"
              style={{ background: accentColor }}
            >
              {item.cta.label}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
