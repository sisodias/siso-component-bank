export type BayeHeroStatusPill = {
  label: string;
  variant: "accent" | "muted";
};

export type BayeHeroProps = {
  eyebrow?: string;
  headline?: string;
  headlineAccent?: string;
  subtitle?: string;
  statusPills?: BayeHeroStatusPill[];
};

const DEFAULT_PILLS: BayeHeroStatusPill[] = [
  { label: "MLB PRE-GAME ONLY", variant: "accent" },
  { label: "NO PICKS", variant: "muted" },
  { label: "SOURCES SHOWN", variant: "muted" },
];

const pillStyle = (variant: BayeHeroStatusPill["variant"], rounded: "pill" | "card") => ({
  backgroundColor: variant === "accent" ? "rgba(255,106,0,0.08)" : "transparent",
  border: `1px solid ${variant === "accent" ? "rgba(255,106,0,0.35)" : "#262626"}`,
  color: variant === "accent" ? "#ff6a00" : "#7c7468",
  borderRadius: rounded === "pill" ? "9999px" : "8px",
  padding: rounded === "pill" ? "6px 12px" : "12px 16px",
  fontSize: rounded === "pill" ? "12px" : "14px",
  fontWeight: 500,
});

/** Matches the preview at https://21st.dev/community/components/gawdilley/baye-hero/default */
export function BayeHero({
  eyebrow = "MLB DATA BRIEF AGENT",
  headline = "Pre-Game Intelligence for",
  headlineAccent = "Baye",
  subtitle = "Real-time MLB analytics and data aggregation from verified sources",
  statusPills = DEFAULT_PILLS,
}: BayeHeroProps) {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        overflow: "hidden",
        backgroundColor: "#111111",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
          backgroundImage: `
            linear-gradient(to right, #262626 1px, transparent 1px),
            linear-gradient(to bottom, #262626 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "72rem", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
          }}
        >
          <div style={{ flex: 1, textAlign: "center", width: "100%" }}>
            <div
              style={{
                display: "inline-block",
                marginBottom: "16px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: "#ff6a00",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
            <h1
              style={{
                margin: "0 0 16px",
                fontSize: "clamp(28px, 5vw, 42px)",
                fontWeight: 800,
                lineHeight: 1.2,
                color: "#f6f1e8",
              }}
            >
              {headline}{" "}
              <span style={{ color: "#ff6a00" }}>{headlineAccent}</span>
            </h1>
            <p
              style={{
                margin: "0 0 24px",
                maxWidth: "36rem",
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#7c7468",
              }}
            >
              {subtitle}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
              {statusPills.map((pill) => (
                <div key={pill.label} style={pillStyle(pill.variant, "pill")}>
                  {pill.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,106,0,0.35), transparent)",
        }}
      />
    </section>
  );
}

export default BayeHero;
