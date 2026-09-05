import Image from "next/image";
import { servizi } from "./servizi-feature-73-featured-florist-21st-utils/content";

// Icone di settore su misura (Recraft, vector_illustration, palette Regno Fiorito)
// invece delle icone Lucide generiche: stesso stile/peso dell'illustrazione hero e della gallery.
const ICONS: Record<string, string> = {
  flower: "/art/icon-fiori.svg",
  gift: "/art/icon-bomboniere.svg",
  sparkles: "/art/icon-regalo.svg",
  truck: "/art/icon-consegna.svg",
};

// Scheletro (kicker+H2+link sopra, griglia "1 servizio in evidenza a piena
// larghezza + N card normali" sotto) adottato da 21st.dev
// @shadcnblockscom/feature-73 (round-2 re-sourcing 2026-07-03, vedi
// blocchi.json — deps audit: solo lucide-react, nessuna dipendenza extra).
// Il servizio "Bomboniere e cerimonie" (business.featured=true nel brief)
// diventa la card grande con l'illustrazione Recraft della gallery: è il
// pitch del tier Business, come indicato nel prompt demo. Le altre card
// restano nel trattamento icona-in-pannello del round-1 (tratto di
// mestiere invariato), non foto placeholder generiche.
export default function ServicesGrid() {
  const featured = servizi.find((s) => s.featured) ?? servizi[0];
  const resto = servizi.filter((s) => s !== featured);

  return (
    <section id="servizi" className="py-[clamp(80px,10vw,120px)] bg-[var(--color-bg-2)] relative overflow-hidden">
      <div className="wrap relative z-10">
        <div className="rv max-w-xl mb-14">
          <div className="text-[13.5px] font-semibold tracking-[.16em] uppercase text-[color:var(--color-accent-text)] flex items-center gap-3 mb-4">
            <span className="w-8 h-[1.5px] bg-[var(--color-accent)]" />
            La bottega, su misura
          </div>
          <h2 className="text-[clamp(30px,4vw,46px)]">Per ogni occasione, il fiore giusto.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* card in evidenza — a piena larghezza, come nello scheletro feature-73 */}
          <div className="rv md:col-span-2 flex flex-col overflow-clip rounded-[var(--radius-brand)] border border-[var(--color-line)] bg-[var(--color-white)] md:grid md:grid-cols-2">
            {featured.immagine && (
              <div className="relative aspect-square">
                <Image
                  src={featured.immagine}
                  alt={`Illustrazione ${featured.nome.toLowerCase()} — immagine dimostrativa, da sostituire con foto reali`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col justify-center px-7 py-8 md:px-10 md:py-10">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(127,164,92,.16)] flex items-center justify-center mb-4 p-2.5">
                <Image src={ICONS[featured.icon]} alt="" width={30} height={30} className="w-full h-full object-contain" aria-hidden="true" />
              </div>
              <h3 className="text-[22px] mb-2">{featured.nome}</h3>
              <p className="text-[15px] text-[color:var(--color-ink-soft)]">{featured.descrizione}</p>
            </div>
          </div>

          {resto.map((s, i) => (
            <div
              key={s.nome}
              className="rv bg-[var(--color-white)] border border-[var(--color-line)] rounded-[var(--radius-brand)] p-7 transition-transform duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow)]"
              style={{ ["--d" as string]: `${i * 0.08}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[rgba(127,164,92,.16)] flex items-center justify-center mb-5 p-2.5">
                <Image src={ICONS[s.icon]} alt="" width={36} height={36} className="w-full h-full object-contain" aria-hidden="true" />
              </div>
              <h3 className="text-[19px] mb-2">{s.nome}</h3>
              <p className="text-[15px] text-[color:var(--color-ink-soft)]">{s.descrizione}</p>
            </div>
          ))}
        </div>

        <p className="rv mt-6 text-sm text-[color:var(--color-ink-soft)]">
          Prezzi e listino cerimonie: [DA CONFERMARE con il cliente].
        </p>
      </div>
    </section>
  );
}
