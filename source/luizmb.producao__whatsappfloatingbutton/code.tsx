"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

export interface WhatsAppFloatingButtonProps {
  /** Destination link (wa.me / api.whatsapp.com message link). */
  href: string;
  /** Business name shown in the teaser bubble. */
  name?: string;
  /** Teaser message that pops up after `delay`. */
  teaser?: string;
  ctaLabel?: string;
  /** Brand color of the button. Defaults to WhatsApp green. */
  accentColor?: string;
  /** Delay before the teaser appears, in ms. */
  delay?: number;
}

/**
 * A site-wide floating WhatsApp button with an auto-appearing, dismissible
 * teaser bubble. Both the button and the bubble open the chat. Fully
 * self-contained — only depends on framer-motion and lucide-react.
 */
export default function WhatsAppFloatingButton({
  href,
  name = "Atendimento",
  teaser = "Olá! 👋 Como podemos te ajudar?",
  ctaLabel = "Falar no WhatsApp",
  accentColor = "#25D366",
  delay = 4000,
}: WhatsAppFloatingButtonProps) {
  const [showTeaser, setShowTeaser] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setShowTeaser(true), delay);
    return () => clearTimeout(t);
  }, [delay, dismissed]);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showTeaser && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative max-w-[260px] rounded-2xl border border-slate-200 bg-white p-4 pr-9 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.25)]"
          >
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Fechar"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <a href={href} target="_blank" rel="noopener noreferrer" className="block">
              <span className="flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <WhatsAppGlyph className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-slate-900">{name}</span>
              </span>
              <p className="mt-2 text-[13px] leading-snug text-slate-600">{teaser}</p>
              <span
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: accentColor }}
              >
                {ctaLabel}
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.8 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setDismissed(true)}
        style={{ backgroundColor: accentColor }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_28px_-6px_rgba(37,211,102,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <span
          className="absolute inset-0 -z-10 animate-ping rounded-full opacity-40"
          style={{ backgroundColor: accentColor }}
        />
        <WhatsAppGlyph className="h-7 w-7" />
      </motion.a>
    </div>
  );
}
