import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Demo content — in production this comes from the site's lib/content.ts.
// Images are Recraft SVG illustrations served from the site's /public/art/.
const servizi = [
  {
    nome: "Trattamenti estetici viso",
    descrizione:
      "Cura del viso con protocolli pensati per ogni esigenza, un attimo di attenzione dedicato solo a te.",
    icon: "/art/icon-viso.svg",
    immagine: "/art/gallery-viso.svg",
    alt: "Illustrazione di un trattamento estetico viso — immagine dimostrativa",
  },
  {
    nome: "Trattamenti estetici corpo",
    descrizione:
      "Cosmetici e attrezzature professionali per il corpo, tra efficacia e vero relax.",
    icon: "/art/icon-corpo.svg",
    immagine: "/art/gallery-corpo.svg",
    alt: "Illustrazione di un trattamento estetico corpo — immagine dimostrativa",
  },
];
const serviziNota =
  "Elenco puntuale dei trattamenti e listino prezzi: [DA CONFERMARE con la titolare].";

// Scheletro adattato da 21st.dev @shadcnblockscom/feature-72: intestazione
// (kicker+H2+link) sopra, griglia di card immagine-in-alto/testo-in-basso
// sotto — foto placeholder sostituite con illustrazioni Recraft del cliente,
// icona di settore accanto al titolo.
export default function ServicesGrid() {
  return (
    <section id="servizi" className="py-[clamp(80px,10vw,120px)] bg-[var(--color-bg-2)]">
      <div className="wrap flex flex-col gap-14">
        <div className="rv lg:max-w-sm">
          <div className="text-[13.5px] font-semibold tracking-[.16em] uppercase text-[color:var(--color-accent-text)] flex items-center gap-3 mb-4">
            <span className="w-8 h-[1.5px] bg-[var(--color-accent)]" />
            Servizi
          </div>
          <h2 className="text-[clamp(30px,4vw,46px)] mb-3">Trattamenti pensati per te.</h2>
          <a
            href="#contatti"
            className="group inline-flex items-center text-[15px] font-medium text-[color:var(--color-primary)]"
          >
            Chiedi info sul listino
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {servizi.map((s, i) => (
            <div
              key={s.nome}
              className="rv flex flex-col overflow-hidden rounded-[var(--radius-brand)] border border-[var(--color-line)] bg-[var(--color-white)] transition-transform duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow)]"
              style={{ ["--d" as string]: `${i * 0.1}s` }}
            >
              <div className="relative aspect-[16/9]">
                <Image src={s.immagine} alt={s.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                <span className="demo-badge absolute bottom-3 left-3 z-10">immagine dimostrativa — da sostituire</span>
              </div>
              <div className="px-7 py-8 md:px-8 md:py-9 flex gap-4 items-start">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-[rgba(156,175,152,.22)] flex items-center justify-center p-2.5">
                  <Image src={s.icon} alt="" width={28} height={28} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[19px] mb-2">{s.nome}</h3>
                  <p className="text-[15px] text-[color:var(--color-ink-soft)]">{s.descrizione}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="rv text-sm text-[color:var(--color-ink-soft)]">{serviziNota}</p>
      </div>
    </section>
  );
}
