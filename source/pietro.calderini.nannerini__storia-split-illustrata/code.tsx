const storia = {
  kicker: "La nostra storia",
  title: "Attimi di cura, da oltre vent'anni a Vetralla.",
  paragrafi: [
    "Da oltre vent'anni Beatrice Pagnotta si prende cura della bellezza delle sue clienti a Vetralla, sulla Via Cassia. “Attimi” nasce dall'amore e dalla passione per questo lavoro: trattamenti efficaci e momenti di vero relax. (anni esatti [DA CONFERMARE])",
    "Ogni trattamento è pensato per unire efficacia e benessere: un attimo, ogni volta, tutto per sé.",
  ],
};

export default function Story() {
  return (
    <section id="storia" className="py-[clamp(80px,10vw,120px)]">
      <div className="wrap grid md:grid-cols-2 gap-12 items-center">
        <div className="rv order-2 md:order-1">
          <div className="text-[13.5px] font-semibold tracking-[.16em] uppercase text-[color:var(--color-accent-text)] flex items-center gap-3 mb-4">
            <span className="w-8 h-[1.5px] bg-[var(--color-accent)]" />
            {storia.kicker}
          </div>
          <h2 className="text-[clamp(30px,4vw,46px)]">{storia.title}</h2>
          <div className="mt-6 space-y-4 text-[color:var(--color-ink-soft)] text-[17px] leading-relaxed max-w-xl">
            {storia.paragrafi.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="rv order-1 md:order-2" style={{ ["--d" as string]: ".12s" }}>
          <div
            className="relative aspect-[4/5] rounded-[28px] overflow-hidden flex items-end p-6"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(156,175,152,.5), transparent 55%), radial-gradient(circle at 80% 80%, rgba(201,138,107,.45), transparent 50%), linear-gradient(160deg, #2E2A26, #1e1b18)",
            }}
          >
            <svg
              className="absolute inset-0 w-full h-full opacity-25"
              viewBox="0 0 200 250"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="100" cy="90" r="46" stroke="#FAF6EF" strokeWidth="1.5" fill="none" />
              <path d="M60 160 Q100 130 140 160 Q100 200 60 160Z" fill="#C98A6B" opacity=".55" />
              <circle cx="70" cy="70" r="10" fill="#9CAF98" opacity=".6" />
              <circle cx="140" cy="60" r="7" fill="#FAF6EF" opacity=".5" />
            </svg>
            <span className="relative z-10 inline-block bg-[var(--color-bg)]/90 text-[color:var(--color-primary)] text-xs font-semibold rounded-full px-3.5 py-1.5">
              foto dimostrativa — da sostituire
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
