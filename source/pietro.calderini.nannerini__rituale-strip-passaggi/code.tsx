const ritual = {
  kicker: "Il tuo attimo",
  title: "Come si vive un trattamento da Attimi.",
  passi: [
    {
      numero: "01",
      titolo: "Accoglienza",
      testo: "Un saluto, due chiacchiere, il tempo di lasciare fuori la giornata.",
    },
    {
      numero: "02",
      titolo: "Trattamento",
      testo: "La cura scelta per te, con calma, senza fretta né standardizzazione.",
    },
    {
      numero: "03",
      titolo: "Il tuo attimo",
      testo: "Qualche minuto in più per respirare, prima di tornare al mondo.",
    },
  ],
};

/**
 * "Il tuo attimo" — tratto di mestiere (faro-style: micro-copy di settore).
 * Striscia narrativa statica a 3 passaggi (non uno stepper interattivo).
 */
export default function RitualStrip() {
  return (
    <section className="py-[clamp(70px,9vw,110px)]">
      <div className="wrap">
        <div className="rv max-w-xl mb-12">
          <div className="text-[13.5px] font-semibold tracking-[.16em] uppercase text-[color:var(--color-accent-text)] flex items-center gap-3 mb-4">
            <span className="w-8 h-[1.5px] bg-[var(--color-accent)]" />
            {ritual.kicker}
          </div>
          <h2 className="text-[clamp(30px,4vw,46px)]">{ritual.title}</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {ritual.passi.map((p, i) => (
            <div
              key={p.numero}
              className="rv"
              style={{ ["--d" as string]: `${i * 0.1}s` }}
            >
              <span
                className="block text-[15px] font-[var(--font-heading)] italic text-[color:var(--color-soft)] mb-3"
                aria-hidden="true"
              >
                {p.numero}
              </span>
              <h3 className="text-[19px] mb-2">{p.titolo}</h3>
              <p className="text-[15px] text-[color:var(--color-ink-soft)]">{p.testo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
