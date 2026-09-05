import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import MagneticButton from "./contatti-cta-mappa-embed-utils/MagneticButton";

// Demo content — in production this comes from the site's lib/content.ts.
const business = {
  comune: "Vetralla",
  provincia: "VT",
  indirizzo: "Via Cassia La Botte, 67",
  cap: "01019",
  telefono: "0761 483190",
  telefonoHref: "tel:+390761483190",
  whatsapp: "[DA CONFERMARE]",
  mapsQuery: "Via Cassia La Botte 67, 01019 Vetralla VT",
};
const orari = [{ giorni: "Orari di apertura", ore: "[DA CONFERMARE]" }];
const orariNota =
  "Nessuna fonte pubblica riporta gli orari di apertura — dato da confermare con la titolare.";

// Pannello CTA (Chiama attiva / WhatsApp disabilitata) + card indirizzo-orari
// + mappa Google embed. Nessun form contatto: pensato per la modalità
// anteprima dei siti vetrina FARO.
export default function ContactMap() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(business.mapsQuery)}&output=embed`;

  return (
    <section id="contatti" className="py-[clamp(80px,10vw,120px)] bg-[var(--color-bg-2)]">
      <div className="wrap">
        <div
          className="rv rounded-[clamp(24px,4vw,44px)] p-[clamp(32px,6vw,64px)] text-center relative overflow-hidden"
          style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
        >
          <div
            className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(201,138,107,.28), transparent 62%)" }}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="text-[13.5px] font-semibold tracking-[.16em] uppercase text-[color:var(--color-soft-text)] mb-4">
              Parliamone
            </div>
            <h2 className="text-[clamp(32px,5vw,52px)] text-[color:var(--color-bg)]">
              Un attimo per te?
              <br />
              <em className="not-italic text-[color:var(--color-soft)]">Chiamaci.</em>
            </h2>
            <div className="mt-9 flex flex-wrap gap-4 justify-center">
              <MagneticButton href={business.telefonoHref} className="btn ghost-light">
                <Phone size={18} />
                Chiama {business.telefono}
              </MagneticButton>
              <span
                className="btn ghost-light disabled"
                role="button"
                aria-disabled="true"
                title="Numero WhatsApp da confermare"
              >
                <MessageCircle size={18} />
                WhatsApp — da confermare
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="rv bg-[var(--color-white)] border border-[var(--color-line)] rounded-[var(--radius-brand)] p-7 space-y-5">
            <div className="flex gap-3">
              <MapPin size={20} className="shrink-0 text-[color:var(--color-primary)] mt-0.5" />
              <div>
                <p className="font-medium text-[color:var(--color-primary)]">Indirizzo</p>
                <p className="text-[color:var(--color-ink-soft)] text-[15px]">
                  {business.indirizzo}, {business.cap} {business.comune} ({business.provincia})
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock size={20} className="shrink-0 text-[color:var(--color-primary)] mt-0.5" />
              <div>
                <p className="font-medium text-[color:var(--color-primary)]">Orari</p>
                <ul className="text-[color:var(--color-ink-soft)] text-[15px] space-y-1 mt-1">
                  {orari.map((o) => (
                    <li key={o.giorni}>
                      <span className="font-medium text-[color:var(--color-ink)]">{o.giorni}:</span> {o.ore}
                    </li>
                  ))}
                </ul>
                <p className="text-[12.5px] text-[color:var(--color-ink-soft)] mt-2 opacity-80">{orariNota}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone size={20} className="shrink-0 text-[color:var(--color-primary)] mt-0.5" />
              <div>
                <p className="font-medium text-[color:var(--color-primary)]">Contatti</p>
                <p className="text-[color:var(--color-ink-soft)] text-[15px]">
                  Tel {business.telefono} · WhatsApp {business.whatsapp}
                </p>
              </div>
            </div>
          </div>

          <div className="rv overflow-hidden rounded-[var(--radius-brand)] border border-[var(--color-line)] min-h-[280px]" style={{ ["--d" as string]: ".1s" }}>
            <iframe
              title="Mappa"
              src={mapSrc}
              className="w-full h-full min-h-[280px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
