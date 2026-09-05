import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Demo content — in production this comes from the site's lib/content.ts.
const percheSceglierci = {
  kicker: "Prova sociale",
  title: "Nessuna recensione inventata. Solo fatti.",
  intro:
    "Non risultano ancora recensioni Google pubbliche verificate da mostrare qui [DA CONFERMARE: recensioni Google] — preferiamo raccontarti perché le clienti tornano da Beatrice.",
  punti: [
    {
      titolo: "Circa 25 anni di esperienza",
      testo: "Passione ed esperienza nel settore estetico a Vetralla. [DA CONFERMARE: anni esatti]",
    },
    {
      titolo: "Trattamenti viso e corpo professionali",
      testo: "Protocolli efficaci pensati per la cura della persona.",
    },
    {
      titolo: "Cosmetici e attrezzature professionali",
      testo: "Prodotti e strumentazione dedicati a un risultato di qualità.",
    },
    {
      titolo: "Sulla Via Cassia, comoda da raggiungere",
      testo: "Il centro si trova a Vetralla, in Via Cassia La Botte 67.",
    },
  ],
};

// Scheletro adattato da 21st.dev @tommyjepsen/feature-with-advantages:
// Badge kicker + H2 + intro + griglia flat di righe icona/testo (niente
// card separate — è così nel blocco originale). Badge = shadcn/ui.
export default function WhyUs() {
  return (
    <section id="perche" className="py-[clamp(80px,10vw,120px)]">
      <div className="wrap flex flex-col items-start gap-4">
        <Badge
          variant="outline"
          className="rv text-[12.5px] font-semibold tracking-[.14em] uppercase text-(--color-accent-text) border-(--color-line) bg-(--color-bg-2)"
        >
          {percheSceglierci.kicker}
        </Badge>
        <div className="rv max-w-2xl">
          <h2 className="text-[clamp(30px,4vw,46px)]">{percheSceglierci.title}</h2>
          <p className="mt-4 text-[color:var(--color-ink-soft)] text-[17px]">{percheSceglierci.intro}</p>
        </div>

        <div className="w-full grid sm:grid-cols-2 gap-x-10 gap-y-8 pt-10">
          {percheSceglierci.punti.map((p, i) => (
            <div
              key={p.titolo}
              className="rv flex flex-row gap-4 items-start"
              style={{ ["--d" as string]: `${i * 0.08}s` }}
            >
              <span className="shrink-0 mt-1 w-6 h-6 rounded-full bg-(--color-accent)/25 flex items-center justify-center">
                <Check className="text-[color:var(--color-accent-text)]" size={14} />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-[17px] font-medium text-[color:var(--color-primary)]">{p.titolo}</p>
                <p className="text-[15px] text-[color:var(--color-ink-soft)]">{p.testo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
