import React, { useEffect, useRef, useState } from "react";
import "../../index.css";

/* ---------- Aggressive runtime watermark killer ---------- */
function nukeWatermark() {
  const kill = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const candidates = document.querySelectorAll<HTMLElement>([
      "body > svg",
      "body > div > svg",
      "#root > svg",
      "[data-watermark]",
      '[class*=\"watermark\"]',
      'svg[role=\"presentation\"]',
      'svg[aria-hidden=\"true\"]',
      "body > div[style*='position: fixed'] > svg",
    ].join(","));

    candidates.forEach((el) => {
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const looksOverlay =
        (cs.position === "fixed" || cs.position === "absolute") &&
        rect.width >= vw * 0.6 &&
        rect.height >= vh * 0.6;

      if (looksOverlay) {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("aria-hidden", "true");
      }
    });
  };

  kill();
  const mo = new MutationObserver(kill);
  mo.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("beforeunload", () => mo.disconnect(), { once: true });
}

/* ---------- Component types/data ---------- */
type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  gradient: string; // "var(--colorA) , var(--colorB)"
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "CEO",
    company: "TechVision Inc",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    text:
      "This platform has completely transformed how we approach our business. The results speak for themselves - 300% growth in just 6 months!",
    gradient: "var(--purple) , var(--pink)",
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Founder",
    company: "StartupLab",
    image:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    text:
      "The intuitive design and powerful features make this an absolute game-changer. Our team's productivity has skyrocketed.",
    gradient: "var(--cyan) , var(--blue)",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Creative Director",
    company: "DesignHub",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    text:
      "Finally, a solution that understands what creatives need. The workflow is seamless and the results are stunning.",
    gradient: "var(--amber) , var(--orange)",
  },
];

const Star = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="star">
    <path d="M12 2l2.9 6.6 7.1.6-5.3 4.6 1.6 6.9-6.3-3.7-6.3 3.7 1.6-6.9L2 9.2l7.1-.6L12 2z" />
  </svg>
);

const QuoteIcon = ({ active }: { active: boolean }) => (
  <svg width="44" height="44" viewBox="0 0 24 24" className={`quote ${active ? "quote-active" : ""}`}>
    <path d="M7 7h5v5H9v5H4v-5h3V7zm10 0h5v5h-3v5h-5v-5h3V7z" />
  </svg>
);

/* ---------- Card ---------- */
function TestimonialCard({
  t,
  index,
  active,
  onHover,
}: {
  t: Testimonial;
  index: number;
  active: boolean;
  onHover: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = (y - r.height / 2) / 25;
    const ry = (r.width / 2 - x) / 25;
    setRot({ x: rx, y: ry });
  };

  const onLeave = () => setRot({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      className="card-wrap"
      onMouseEnter={onHover}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        animation:
          index % 2 === 0
            ? `slideInLeft .8s ease-out ${index * 0.15}s both`
            : `slideInRight .8s ease-out ${index * 0.15}s both`,
      }}
    >
      <div
        className={`card-glow ${active ? "glow-active" : ""}`}
        style={{ backgroundImage: `linear-gradient(90deg, ${t.gradient})` }}
      />
      <div className="card">
        <div className="card-mesh" />
        <div
          className={`card-orb ${active ? "orb-active" : ""}`}
          style={{ backgroundImage: `linear-gradient(90deg, ${t.gradient})` }}
        />
        <div className="card-inner">
          <div className="quote-row">
            <QuoteIcon active={active} />
            {active && (
              <svg className="spark" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l1.5 4L18 7.5 13.5 9 12 13l-1.5-4L6 7.5 10.5 6 12 2z"
                  stroke="currentColor"
                />
              </svg>
            )}
          </div>

          <div className={`rating ${active ? "rating-up" : ""}`}>
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} />
            ))}
          </div>

          <p className="text">“{t.text}”</p>

          <div className="author">
            <div className="avatar-wrap">
              <div
                className={`avatar-glow ${active ? "avatar-glow-on" : ""}`}
                style={{ backgroundImage: `linear-gradient(90deg, ${t.gradient})` }}
              />
              <div className="avatar-ring" style={{ backgroundImage: `linear-gradient(90deg, ${t.gradient})` }}>
                <img className="avatar" src={t.image} alt={t.name} />
              </div>
            </div>
            <div className="who">
              <div
                className={`name ${active ? "name-active" : ""}`}
                style={{ backgroundImage: `linear-gradient(90deg, ${t.gradient})` }}
              >
                {t.name}
              </div>
              <div className="role">
                {t.role} at {t.company}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Section ---------- */
export default function Component() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    nukeWatermark(); // ensure overlay is removed
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section">
      <div className="mesh-bg" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <div className="container">
        <div className="header">
          <p className="eyebrow">TESTIMONIALS</p>
          <h2 className="title">Loved by Innovators</h2>
          <p className="subtitle">Join thousands who've transformed their workflow</p>
        </div>

        <div className="grid">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t} index={i} active={active === i} onHover={() => setActive(i)} />
          ))}
        </div>

        <div className="dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === active ? "dot-on" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
