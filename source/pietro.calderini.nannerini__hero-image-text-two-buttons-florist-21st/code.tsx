import Image from "next/image";
import { Phone } from "lucide-react";
import { Badge } from "./hero-image-text-two-buttons-florist-21st-utils/badge";
import FallingPetals from "./hero-image-text-two-buttons-florist-21st-utils/FallingPetals";
import MagneticButton from "./hero-image-text-two-buttons-florist-21st-utils/MagneticButton";

// Contenuti demo inline (florist showcase) — nel sito cliente arrivano da
// lib/content.ts, qui inseriti direttamente per rendere il blocco
// autocontenuto e installabile senza dipendenze di progetto.
const business = {
  whatsappHref: "https://wa.me/390000000000",
  telefonoHref: "tel:+390000000000",
};

const hero = {
  eyebrow: "La bottega floreale del tuo paese",
  titleLines: ["Fiori freschi,", "piante e", "bomboniere su misura"],
  subtitle:
    "Composizioni fresche per ogni occasione, con consegna a domicilio in giornata.",
  ctaWhatsapp: "Scrivici su WhatsApp",
  ctaCall: "Chiama ora",
};

// Scheletro (badge eyebrow + h1 + p + riga CTA + colonna immagine, grid lg
// 2 colonne) adottato da 21st.dev @tommyjepsen/hero-with-image-text-and-two-
// buttons, reinterpretato per un'attività di fioraio: illustrazione firma al
// posto della foto stock, badge eyebrow shadcn/ui, CTA doppio (WhatsApp +
// telefono) con motion "magnetico" al passaggio del mouse.
export default function Hero() {
  return (
    <section id="top" className="hero relative min-h-[100svh] flex items-center overflow-hidden pt-32 pb-20">
      {/* sfondo botanico decorativo — gradienti, NON foto */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 82% 12%, rgba(127,164,92,.35), transparent 46%), radial-gradient(circle at 8% 88%, rgba(242,181,160,.32), transparent 50%), linear-gradient(180deg, #F7F4EC 0%, #F1ECDD 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[.5]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(47,93,58,.08) 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>
      <FallingPetals />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <Badge
            variant="outline"
            className="gap-2 text-[13px] font-semibold tracking-[.14em] uppercase px-4 py-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            {hero.eyebrow}
          </Badge>

          <h1 className="mt-7 text-[clamp(42px,7vw,78px)] leading-[1.05]">
            <span className="block">{hero.titleLines[0]}</span>
            <span className="block">{hero.titleLines[1]}</span>
            <span className="block italic">{hero.titleLines[2]}</span>
          </h1>

          <p className="mt-6 text-[clamp(17px,2vw,20px)] text-muted-foreground max-w-lg">
            {hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              href={business.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 text-white px-6 py-3 font-medium"
            >
              {hero.ctaWhatsapp}
              <span aria-hidden="true">→</span>
            </MagneticButton>
            <MagneticButton
              href={business.telefonoHref}
              className="inline-flex items-center gap-2 rounded-full border border-current px-6 py-3 font-medium"
            >
              <Phone size={17} />
              {hero.ctaCall}
            </MagneticButton>
          </div>
        </div>

        {/* illustrazione firma — la bottega, non uno stampo generico */}
        <div className="relative">
          <div className="relative aspect-[4/3] rounded-[clamp(24px,4vw,40px)] overflow-hidden shadow-xl bg-white">
            <Image
              src="/art/hero-bottega.svg"
              alt="Illustrazione della bottega del fioraio: ceste di fiori freschi, piante e un bouquet da cerimonia pronto"
              fill
              priority
              className="object-cover"
            />
          </div>
          <span className="absolute -bottom-4 left-5 inline-block bg-emerald-800 text-white text-[11px] font-semibold tracking-wide uppercase rounded-full px-3.5 py-1.5 shadow-lg">
            illustrazione — non foto reale
          </span>
        </div>
      </div>
    </section>
  );
}
