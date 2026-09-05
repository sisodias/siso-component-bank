const business = {
  nomeCompleto: "Pagnotta Beatrice — Estetica",
  comune: "Vetralla",
  provincia: "VT",
  indirizzo: "Via Cassia La Botte, 67",
  piva: "[DA CONFERMARE]",
  facebookUrl: "https://www.facebook.com/attimi.estetica",
};

// lucide-react non include più le icone brand (Facebook): SVG inline minimo.
function FacebookIcon({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 8.5h2V5.2c-.35-.05-1.53-.15-2.9-.15-2.87 0-4.84 1.8-4.84 5.12v2.63H6.4v3.7h2.86V21h3.7v-8.5h2.75l.44-3.7h-3.19V10.6c0-1.07.29-1.8 1.84-1.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="pb-10 pt-6">
      <div className="wrap flex flex-col md:flex-row gap-5 justify-between items-center text-sm text-[color:var(--color-ink-soft)] border-t border-[var(--color-line)] pt-8">
        <div className="flex items-center gap-2.5 font-[var(--font-heading)] text-[17px] text-[color:var(--color-primary)]">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#2E2A26" />
            <path
              d="M16 9c-4 0-7.2 3.4-7.2 7.6 0 3.6 2.4 6.6 5.7 7.4-.2-.9-.3-1.9-.3-2.9 0-4.9 3.5-8.9 8-9.7C20.5 9.9 18.3 9 16 9Z"
              fill="#FAF6EF"
            />
          </svg>
          Attimi
        </div>

        <div className="flex items-center gap-5">
          <a
            href={business.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-[color:var(--color-primary)] transition-colors"
          >
            <FacebookIcon />
          </a>
          <a href="/privacy/" className="hover:text-[color:var(--color-primary)] transition-colors">
            Privacy
          </a>
        </div>

        <p className="text-center md:text-right text-[13px]">
          © 2026 {business.nomeCompleto} · P.IVA {business.piva}
          <br className="hidden sm:block" /> {business.indirizzo}, {business.comune} ({business.provincia})
        </p>
      </div>
      <p className="wrap text-[11.5px] text-[color:var(--color-ink-soft)] mt-4">
        Sito di anteprima realizzato da FARO AI. Foto e contenuti dimostrativi — dati verificati:
        indirizzo, telefono (fonte pubblica). P.IVA, WhatsApp, email e orari non confermati.
      </p>
    </footer>
  );
}
