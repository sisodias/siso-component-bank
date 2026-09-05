import { Check } from "lucide-react";
import { Badge } from "./perche-sceglierci-feature-advantages-florist-21st-utils/badge";

// Contenuti demo inline (florist showcase) — nel sito cliente arrivano da
// lib/content.ts, qui inseriti direttamente per rendere il blocco
// autocontenuto e installabile senza dipendenze di progetto.
const percheSceglierci = {
  kicker: "Perché sceglierci",
  title: "Passione artigianale, fiori sempre freschi.",
  intro: "Ecco perché i nostri clienti tornano ogni volta che c'è un'occasione da festeggiare.",
  punti: [
    { titolo: "Fiori freschi ogni giorno", testo: "Selezionati e composti a mano, mai lasciati in magazzino." },
    { titolo: "Consegna in giornata", testo: "Bouquet e composizioni consegnati con cura, in tempi rapidi." },
    { titolo: "Bomboniere su misura", testo: "Personalizzate per ogni cerimonia, dal battesimo al matrimonio." },
    { titolo: "Esperienza artigianale", testo: "Anni di mestiere al servizio di ogni composizione." },
  ],
};

// Scheletro (Badge kicker + h2 + p + griglia flat icona/testo, senza card
// separate) adottato da 21st.dev @tommyjepsen/feature-with-advantages,
// reinterpretato per una vetrina di fioraio: elenco di punti di forza con
// icona Check e badge kicker, senza inventare recensioni o numeri.
export default function WhyUs() {
  return (
    <section id="perche" className="py-[clamp(80px,10vw,120px)]">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl mb-14">
          <Badge
            variant="outline"
            className="mb-4 gap-2 text-[13.5px] font-semibold tracking-[.16em] uppercase px-3.5 py-1.5"
          >
            {percheSceglierci.kicker}
          </Badge>
          <h2 className="text-[clamp(30px,4vw,46px)]">{percheSceglierci.title}</h2>
          <p className="mt-4 text-muted-foreground text-[17px]">{percheSceglierci.intro}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {percheSceglierci.punti.map((p) => (
            <div key={p.titolo} className="flex flex-row gap-5 items-start">
              <Check className="w-5 h-5 mt-1 shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="text-[17px] font-medium">{p.titolo}</p>
                <p className="text-[15px] text-muted-foreground">{p.testo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
