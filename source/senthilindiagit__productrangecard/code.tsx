import React, { useEffect } from "react";

/**
 * A preview tile that "pops out" from behind the card on hover.
 * Provide either an `imageSrc` (real photo) or a CSS `background` value.
 */
export interface PreviewTile {
  label: string;
  imageSrc?: string;
  background?: string;
}

export interface ProductRangeCardProps {
  /** Small index marker shown top-left, e.g. 1 or "01". */
  index?: number | string;
  title: string;
  description: string;
  /** SVG path `d` for a 24×24 stroked icon (simplest). */
  iconPath?: string;
  /** Or pass a fully custom icon node (overrides iconPath). */
  icon?: React.ReactNode;
  href?: string;
  linkLabel?: string;
  /** Two tiles look best — they fan left/right behind the card on hover. */
  previews?: [PreviewTile, PreviewTile] | PreviewTile[];
  /** Accent colour (default Eurogrip red). */
  accent?: string;
  /** Brand colour used for index/icon/link (default Eurogrip blue). */
  brand?: string;
  className?: string;
}

const STYLE_ID = "egp-product-range-card-styles";

/** Inject the component's scoped CSS once per document. */
function useCardStyles(accent: string, brand: string) {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

const CSS = `
.egp-card{position:relative;min-height:300px;cursor:pointer;display:block;z-index:1;
  --egp-accent:#ed1c24;--egp-brand:#0054a6;--egp-ease:cubic-bezier(.16,.84,.34,1);
  font-family:"Noto Sans",system-ui,Arial,sans-serif;text-decoration:none}
.egp-card:hover{z-index:6}
.egp-face{position:relative;z-index:2;height:100%;min-height:300px;border-radius:8px;overflow:hidden;
  background:linear-gradient(160deg,#fff,#eef0f4);border:1px solid rgba(17,21,27,.12);
  display:flex;flex-direction:column;justify-content:flex-end;padding:26px;
  transition:transform .5s var(--egp-ease),box-shadow .5s var(--egp-ease),border-color .4s var(--egp-ease)}
.egp-card:hover .egp-face{transform:translateY(-10px) scale(1.015);
  box-shadow:0 34px 64px -26px rgba(0,40,90,.5);border-color:rgba(17,21,27,.5)}
.egp-bg{position:absolute;inset:0;z-index:0;opacity:.9;transition:transform .7s var(--egp-ease);
  background:linear-gradient(150deg,#fff 30%,#e9eef5)}
.egp-card:hover .egp-bg{transform:scale(1.06)}
.egp-idx{position:absolute;top:20px;left:24px;z-index:2;font-weight:900;font-style:italic;
  font-size:1rem;color:var(--egp-brand);letter-spacing:.05em;font-family:"Saira","Noto Sans",sans-serif}
.egp-icon{position:absolute;top:14px;right:18px;z-index:2;width:62px;height:62px;opacity:.5;
  color:var(--egp-brand);transition:opacity .4s,transform .6s var(--egp-ease)}
.egp-card:hover .egp-icon{opacity:.85;transform:rotate(28deg)}
.egp-title{position:relative;z-index:2;margin:0;font-weight:800;font-style:italic;text-transform:uppercase;
  font-size:1.5rem;color:#11151b;line-height:1.02;font-family:"Saira","Noto Sans",sans-serif}
.egp-desc{position:relative;z-index:2;font-size:.92rem;color:#52606f;margin:8px 0 0;max-width:34ch}
.egp-link{position:relative;z-index:2;margin-top:16px;font-weight:800;font-style:italic;text-transform:uppercase;
  letter-spacing:.05em;font-size:.82rem;color:var(--egp-brand);display:inline-flex;gap:.5em;align-items:center;
  font-family:"Saira","Noto Sans",sans-serif}
.egp-bar{position:absolute;left:0;bottom:0;z-index:3;height:4px;width:0;background:var(--egp-accent);
  transition:width .5s var(--egp-ease)}
.egp-card:hover .egp-bar{width:100%}
.egp-pop{position:absolute;left:0;right:0;bottom:96px;height:170px;z-index:1;display:flex;
  justify-content:center;pointer-events:none}
.egp-tile{position:absolute;bottom:0;width:58%;aspect-ratio:4/3;border-radius:12px;overflow:hidden;
  display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:7px;padding-bottom:16px;
  background-size:cover;background-position:center;border:1px solid rgba(255,255,255,.18);
  box-shadow:0 26px 46px -16px rgba(0,20,50,.62);opacity:0;
  transform:translateY(0) rotate(0) scale(.66);transition:transform .55s var(--egp-ease),opacity .4s var(--egp-ease)}
.egp-tile svg{width:34px;height:34px;color:#fff}
.egp-cap{font-weight:800;font-style:italic;text-transform:uppercase;font-size:.74rem;letter-spacing:.06em;
  color:#fff;font-family:"Saira","Noto Sans",sans-serif}
.egp-card:hover .egp-tile{opacity:1}
.egp-card:hover .egp-tile-l{transform:translate(-42%,176px) rotate(-10deg) scale(1)}
.egp-card:hover .egp-tile-r{transform:translate(42%,196px) rotate(10deg) scale(1)}
@media (prefers-reduced-motion:reduce){
  .egp-card *{transition:none!important}
  .egp-card:hover .egp-tile{opacity:0}
}
`;

function TileIcon({ path }: { path?: string }) {
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/**
 * ProductRangeCard — a light product/category card that lifts on hover while two
 * preview tiles fan out from behind it (inspired by "expertise"-style reveal sections).
 * Drop in real photos via `previews[].imageSrc`, or use CSS backgrounds for placeholders.
 */
export default function ProductRangeCard({
  index,
  title,
  description,
  iconPath,
  icon,
  href = "#",
  linkLabel = "View range",
  previews = [],
  accent = "#ed1c24",
  brand = "#0054a6",
  className = "",
}: ProductRangeCardProps) {
  useCardStyles(accent, brand);

  const idx =
    typeof index === "number" ? String(index).padStart(2, "0") : index;
  const tileTread = "repeating-linear-gradient(48deg,#1b2532 0 7px,#0e141d 7px 15px)";
  const tileBrand = `linear-gradient(145deg,${brand},#0a2746)`;
  const tiles: PreviewTile[] = previews.length
    ? previews.slice(0, 2)
    : [
        { label: "Pattern", background: tileTread },
        { label: "Profile", background: tileBrand },
      ];

  return (
    <a
      href={href}
      className={`egp-card ${className}`}
      style={{ ["--egp-accent" as any]: accent, ["--egp-brand" as any]: brand }}
    >
      <div className="egp-pop" aria-hidden="true">
        {tiles.map((t, i) => (
          <div
            key={i}
            className={`egp-tile ${i === 0 ? "egp-tile-l" : "egp-tile-r"}`}
            style={
              t.imageSrc
                ? { backgroundImage: `url(${t.imageSrc})` }
                : { background: t.background ?? (i === 0 ? tileTread : tileBrand) }
            }
          >
            <TileIcon path={iconPath} />
            <span className="egp-cap">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="egp-face">
        <div className="egp-bg" />
        {idx != null && <span className="egp-idx">{idx}</span>}
        {icon ? (
          <span className="egp-icon">{icon}</span>
        ) : (
          <span className="egp-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                 strokeLinecap="round" strokeLinejoin="round" width="62" height="62" aria-hidden="true">
              {iconPath && <path d={iconPath} />}
            </svg>
          </span>
        )}
        <h3 className="egp-title">{title}</h3>
        <p className="egp-desc">{description}</p>
        <span className="egp-link">
          {linkLabel} <span aria-hidden="true">→</span>
        </span>
        <span className="egp-bar" />
      </div>
    </a>
  );
}
