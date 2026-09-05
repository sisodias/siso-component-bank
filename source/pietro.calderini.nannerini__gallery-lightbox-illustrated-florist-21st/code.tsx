"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "./gallery-lightbox-illustrated-florist-21st-utils/button";

// Contenuti demo inline (florist showcase) — nel sito cliente arrivano da
// lib/content.ts, qui inseriti direttamente per rendere il blocco
// autocontenuto e installabile senza dipendenze di progetto.
const gallery = [
  { titolo: "Bouquet su misura", descrizione: "Composizioni fresche legate a mano, per ogni occasione.", asset: "/art/gallery-bouquet.svg" },
  { titolo: "Allestimento cerimonia", descrizione: "Fiori per matrimoni e cerimonie, dal bouquet alla location.", asset: "/art/gallery-cerimonia.svg" },
  { titolo: "Bomboniera artigianale", descrizione: "Bomboniere personalizzate per ogni occasione speciale.", asset: "/art/gallery-bomboniera.svg" },
  { titolo: "Piante da interno", descrizione: "Piante selezionate per la casa e l'ufficio.", asset: "/art/gallery-pianta.svg" },
];

// Scheletro (griglia con hover-overlay + lightbox con navigazione tastiera/
// frecce) adottato da 21st.dev @larsen66/gallery-grid-block-shadcnui,
// reinterpretato per una vetrina di fioraio: griglia illustrazioni con
// zoom-in al passaggio del mouse e lightbox modale con frecce/Esc.
export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  const close = () => setSelected(null);
  const next = () => setSelected((s) => (s === null ? s : (s + 1) % gallery.length));
  const prev = () => setSelected((s) => (s === null ? s : (s - 1 + gallery.length) % gallery.length));

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const active = selected !== null ? gallery[selected] : null;

  return (
    <section id="galleria" className="py-[clamp(80px,10vw,120px)]">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-xl mb-14">
          <div className="text-[13.5px] font-semibold tracking-[.16em] uppercase flex items-center gap-3 mb-4">
            <span className="w-8 h-[1.5px] bg-current" />
            Galleria
          </div>
          <h2 className="text-[clamp(30px,4vw,46px)]">Fiori, cerimonie &amp; bomboniere.</h2>
          <p className="mt-4 text-muted-foreground text-[17px]">
            Clicca su un&apos;illustrazione per ingrandirla.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {gallery.map((item, i) => (
            <button
              key={item.titolo}
              type="button"
              onClick={() => setSelected(i)}
              className="group relative text-left rounded-2xl overflow-hidden bg-white border border-black/10 focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={`Apri illustrazione: ${item.titolo}`}
            >
              <div className={`relative w-full ${i % 2 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                <Image
                  src={item.asset}
                  alt={item.titolo}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/55 transition-colors duration-300">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-medium">{item.titolo}</p>
                <p className="text-muted-foreground text-[13px] mt-0.5">{item.descrizione}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          pointerEvents: active ? "auto" : "none",
        }}
        onClick={close}
        role="dialog"
        aria-modal="true"
        aria-hidden={!active}
        aria-label={active?.titolo}
      >
        <div
          className="relative max-h-[85vh] max-w-2xl w-full transition-transform duration-300"
          style={{ transform: active ? "scale(1)" : "scale(.94)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute -top-12 right-0 text-white hover:bg-white/10 hover:text-white"
            onClick={close}
            aria-label="Chiudi"
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
            onClick={prev}
            aria-label="Illustrazione precedente"
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
            onClick={next}
            aria-label="Illustrazione successiva"
          >
            <ChevronRight className="h-7 w-7" />
          </Button>
          {active && (
            <>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white">
                <Image src={active.asset} alt={active.titolo} fill className="object-contain p-6" />
              </div>
              <p className="mt-4 text-center text-white font-medium">{active.titolo}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
