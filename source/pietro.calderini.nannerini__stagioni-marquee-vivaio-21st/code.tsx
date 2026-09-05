import Image from "next/image";

// Striscia stagionalità "calendario del vivaio" — scheletro 21st.dev @tom_ui/marquee,
// ritokenizzato FARO e semplificato: keyframes/mask nelle classi globali (.stagioni,
// vedi CSS in fondo al file), niente dipendenza cn, pause-on-hover via :hover CSS.
// Elemento vivo di metà pagina + tratto di mestiere (il ritmo stagionale del vivaio).
// Icone Recraft nei chip; versione sr-only statica per screen reader;
// prefers-reduced-motion → lista statica. Demo content inline.
//
// CSS richiesto in globals.css:
// .stagioni { background: var(--color-primary); color: var(--color-bg); overflow: hidden;
//   mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%); }
// .stagioni .track { display: flex; width: max-content; align-items: center;
//   animation: stagioni-scroll 38s linear infinite; }
// .stagioni:hover .track { animation-play-state: paused; }
// @keyframes stagioni-scroll { to { transform: translateX(-50%); } }
// .stagione-item { display: inline-flex; align-items: center; gap: 12px; white-space: nowrap; padding: 0 26px; }
// .stagione-item .chip { width: 40px; height: 40px; border-radius: 12px; background: var(--color-bg);
//   display: inline-flex; align-items: center; justify-content: center; overflow: hidden; flex: none; }
// .stagione-item .nome { font-family: var(--font-heading); font-weight: 600; font-size: 17px; }
// .stagione-item .cosa { font-size: 14.5px; opacity: .92; }
// @media (prefers-reduced-motion: reduce) { .stagioni .track { animation: none; flex-wrap: wrap; width: 100%; justify-content: center; } }

const stagioni = [
  { nome: "Primavera", cosa: "semine e trapianti", icona: "/art/icona-germoglio.svg" },
  { nome: "Estate", cosa: "fioriture in pieno campo", icona: "/art/icona-fiore.svg" },
  { nome: "Autunno", cosa: "messa a dimora", icona: "/art/icona-foglia.svg" },
  { nome: "Inverno", cosa: "lavori in serra", icona: "/art/icona-serra.svg" },
];

const nota = "Calendario dimostrativo di un vivaio tipo — [DA CONFERMARE: colture e lavorazioni reali dell'attività]";

export default function StagioniMarqueeVivaio() {
  const track = [...stagioni, ...stagioni, ...stagioni];
  return (
    <section aria-label="Il calendario del vivaio (dimostrativo)">
      <div className="stagioni semina-scura py-5">
        <div className="track" aria-hidden="true">
          {track.map((s, i) => (
            <span key={i} className="stagione-item">
              <span className="chip">
                <Image src={s.icona} alt="" width={40} height={40} className="w-full h-full object-cover" />
              </span>
              <span className="nome">{s.nome}</span>
              <span className="cosa">— {s.cosa}</span>
            </span>
          ))}
        </div>
        <ul className="sr-only">
          {stagioni.map((s) => (
            <li key={s.nome}>
              {s.nome}: {s.cosa}
            </li>
          ))}
        </ul>
      </div>
      <p className="wrap text-[12px] text-(--color-ink-soft) pt-2.5 pb-0 text-center">
        <span className="tbd">{nota}</span>
      </p>
    </section>
  );
}
