"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { MapPin, PhoneOff } from "lucide-react";

// Hero "mosaico vivaio" — scheletro 21st.dev @tommyjepsen/hero-with-group-of-images-text-and-two-buttons,
// ritokenizzato FARO (CSS vars, .btn di sistema al posto di shadcn Button/Badge).
// 2 colonne: testo (eyebrow, H1 cinetico, firma SVG "linee di serra" stroke-dashoffset,
// sottotitolo, CTA) + mosaico immagini 2x2 (quadrato / colonna alta / quadrato) per
// illustrazioni Recraft o foto reali. Variante CTA telefono DISABILITATA (aria-disabled
// + tooltip) per anteprima con numero non verificato. Richiede in globals.css le classi
// FARO: .kinetic-line/.kinetic-word, .serra-draw, .semina, .rv, .btn (+ .is-disabled), .tbd.
// Demo content inline — sostituire con i contenuti del cliente.

const demo = {
  eyebrow: "Vivaio e piante — Comune",
  titleLines: ["Nome attività", "fiori e piante", "nel tuo comune"],
  subtitle: "[DA CONFERMARE: descrizione attività]",
  ctaCall: "Chiama 0000 000000",
  telefonoNota: "Numero da directory — non verificato: chiamata disattivata nell'anteprima. [DA CONFERMARE]",
  notaIllustrazioni: "Illustrazioni dimostrative — da sostituire con foto reali",
  tiles: [
    { src: "/art/hero-serra.svg", alt: "Interno di serra — dimostrativa", tall: false },
    { src: "/art/segnaposto-vivaio.svg", alt: "Filari di semina — dimostrativa", tall: true },
    { src: "/art/icona-piante.svg", alt: "Pianta in vaso — dimostrativa", tall: false },
  ],
};

function MagneticAnchor({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.18}px, ${(e.clientY - (r.top + r.height / 2)) * 0.18}px)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0, 0)";
      }}
      style={{ transition: "transform .35s var(--ease)" }}
    >
      {children}
    </a>
  );
}

export default function HeroMosaicoVivaio() {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-center overflow-hidden pt-32 pb-20 semina">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 85% 8%, rgba(63,91,46,.16), transparent 44%), radial-gradient(circle at 4% 92%, rgba(201,124,61,.14), transparent 46%)",
          }}
        />
      </div>

      <div className="wrap relative z-10 grid grid-cols-1 gap-12 items-center md:grid-cols-2">
        <div className="flex flex-col">
          <span className="rv in inline-flex w-fit items-center gap-2 text-[13px] font-semibold tracking-[.14em] uppercase text-(--color-ink-soft) border border-(--color-line) rounded-full px-4 py-2 bg-(--color-white)/60 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent) animate-pulse" />
            {demo.eyebrow}
          </span>

          <h1 className="mt-7 text-[clamp(40px,7vw,74px)] text-(--color-primary)">
            {demo.titleLines.map((line, i) => (
              <span key={line} className="kinetic-line">
                <span
                  className={`kinetic-word${i === demo.titleLines.length - 1 ? " text-(--color-accent-text)" : ""}`}
                  style={{ animationDelay: `${0.1 + i * 0.12}s` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {/* firma di mestiere: profilo di serra + solchi che si disegnano al load */}
          <svg className="serra-draw mt-6 w-[min(300px,70%)]" viewBox="0 0 320 78" fill="none" aria-hidden="true">
            <path d="M36 58 V30 L78 10 L120 30 V58" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M78 10 V58 M52 58 V38 M104 58 V38" stroke="var(--color-primary)" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
            <path d="M4 64 H316" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M140 52 H310 M150 42 H300" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" opacity=".8" />
          </svg>

          <p className="rv in mt-6 text-[clamp(17px,2vw,19px)] max-w-lg" style={{ ["--d" as string]: ".5s" }}>
            <span className="tbd">{demo.subtitle}</span>
          </p>

          <div className="rv in mt-9 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: ".62s" }}>
            <button
              type="button"
              aria-disabled="true"
              aria-describedby="nota-telefono-hero"
              title={`[DA CONFERMARE] ${demo.telefonoNota}`}
              className="btn is-disabled"
            >
              <PhoneOff size={17} aria-hidden="true" />
              {demo.ctaCall}
            </button>
            <MagneticAnchor href="#contatti" className="btn ghost">
              <MapPin size={17} />
              Dove siamo
              <span className="arr">→</span>
            </MagneticAnchor>
          </div>
          <p id="nota-telefono-hero" className="mt-3 text-[12.5px] text-(--color-ink-soft) max-w-md">
            {demo.telefonoNota}
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {demo.tiles.map((t, i) => (
              <div
                key={t.src}
                className={`rv in relative rounded-(--radius-brand) overflow-hidden border border-(--color-line) bg-(--color-soft)${t.tall ? " row-span-2" : " aspect-square"}`}
                style={{ ["--d" as string]: `${0.25 + i * 0.15}s` }}
              >
                <Image src={t.src} alt={t.alt} fill sizes="(max-width: 768px) 45vw, 25vw" className="object-cover" priority={i < 2} />
              </div>
            ))}
          </div>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-max max-w-full inline-block bg-(--color-white)/95 border border-(--color-line) text-(--color-ink-soft) text-[11.5px] font-medium rounded-full px-3.5 py-1.5 shadow-sm">
            {demo.notaIllustrazioni}
          </span>
        </div>
      </div>
    </section>
  );
}
