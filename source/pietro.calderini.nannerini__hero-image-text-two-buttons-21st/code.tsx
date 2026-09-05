import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CursorGlow from "./hero-image-text-two-buttons-21st-utils/CursorGlow";
import MagneticButton from "./hero-image-text-two-buttons-21st-utils/MagneticButton";

// Demo content — in production this comes from the site's lib/content.ts.
const business = { telefonoHref: "tel:+390761483190" };
const hero = {
  eyebrow: "Estetica a Vetralla",
  titleLines: ["Attimi —", "l'estetica di", "Beatrice Pagnotta"],
  subtitle:
    "Circa 25 anni di esperienza e passione, per trattamenti efficaci e rilassanti, a Vetralla sulla Via Cassia. [«~25 anni» DA CONFERMARE]",
  ctaCall: "Chiama 0761 483190",
  ctaWhatsapp: "WhatsApp — numero da confermare",
};

// Scheletro (badge eyebrow + h1 + p + riga CTA + colonna immagine, grid lg
// 2 colonne) adattato da 21st.dev @tommyjepsen/hero-with-image-text-and-two-
// buttons. Badge/Button = shadcn/ui. Il CTA primario è MagneticButton
// (firma FARO): layer di motion sopra la struttura, non sostituzione.
export default function Hero() {
  return (
    <section id="top" className="hero relative min-h-[100svh] flex items-center overflow-hidden pt-32 pb-20">
      {/* sfondo decorativo — gradienti, NON foto */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 82% 12%, rgba(156,175,152,.32), transparent 46%), radial-gradient(circle at 8% 88%, rgba(201,138,107,.28), transparent 50%), linear-gradient(180deg, #FAF6EF 0%, #F2EBDC 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[.45]"
          style={{
            backgroundImage: "radial-gradient(rgba(46,42,38,.07) 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>
      <CursorGlow />

      <div className="wrap relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
        <div>
          <Badge
            variant="outline"
            className="rv in gap-2 text-[13px] font-semibold tracking-[.14em] uppercase text-(--color-ink-soft) border-(--color-line) bg-(--color-white)/60 backdrop-blur-sm px-4 py-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-soft) animate-pulse" />
            {hero.eyebrow}
          </Badge>

          <h1 className="mt-7 text-[clamp(40px,6.4vw,72px)] text-[color:var(--color-primary)]">
            <span className="kinetic-line">
              <span className="kinetic-word" style={{ animationDelay: ".1s" }}>
                {hero.titleLines[0]}
              </span>
            </span>
            <span className="kinetic-line">
              <span className="kinetic-word" style={{ animationDelay: ".22s" }}>
                {hero.titleLines[1]}
              </span>
            </span>
            <span className="kinetic-line">
              <span className="kinetic-word italic text-[color:var(--color-accent-text)]" style={{ animationDelay: ".34s" }}>
                {hero.titleLines[2]}
              </span>
            </span>
          </h1>

          <p className="rv in mt-6 text-[clamp(17px,2vw,20px)] text-[color:var(--color-ink-soft)] max-w-lg" style={{ ["--d" as string]: ".5s" }}>
            {hero.subtitle}
          </p>

          <div className="rv in mt-9 flex flex-wrap items-center gap-4" style={{ ["--d" as string]: ".62s" }}>
            <MagneticButton href={business.telefonoHref} className="btn">
              <Phone size={17} />
              {hero.ctaCall}
              <span className="arr" aria-hidden="true">→</span>
            </MagneticButton>
            <Button
              variant="outline"
              disabled
              aria-disabled="true"
              title="Numero WhatsApp da confermare"
              className="h-auto rounded-full gap-2.5 px-7 py-3.5 text-[16px] font-semibold border-(--color-line) text-(--color-primary) bg-transparent hover:bg-transparent opacity-55 disabled:opacity-55"
            >
              <MessageCircle size={17} />
              {hero.ctaWhatsapp}
            </Button>
          </div>
        </div>

        <div className="rv in" style={{ ["--d" as string]: ".3s" }}>
          <div className="relative aspect-[4/5] max-w-[420px] mx-auto lg:mx-0 rounded-[32px] overflow-hidden border border-[var(--color-line)] bg-[var(--color-white)]/55 backdrop-blur-sm p-4">
            <Image
              src="/art/hero-attimi.svg"
              alt="Illustrazione di un attimo di cura estetica — immagine dimostrativa"
              fill
              priority
              className="object-contain relative z-10 p-4"
            />
            <span className="demo-badge absolute bottom-6 left-6 z-20">immagine dimostrativa — da sostituire con foto reali</span>
          </div>
        </div>
      </div>
    </section>
  );
}
