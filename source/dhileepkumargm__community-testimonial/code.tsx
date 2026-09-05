import React from "react";

/**
 * TestimonialCard
 * Props: quote, authorName, authorTitle, avatarUrl
 */
export const TestimonialCard = ({ quote, authorName, authorTitle, avatarUrl }) => {
  return (
    <div className="testimonial-card flex flex-col items-start gap-4 p-6 bg-white rounded-lg shadow-lg w-96 flex-shrink-0">
      <p className="text-gray-700 text-lg">"{quote}"</p>
      <div className="flex items-center gap-4 mt-4">
        <img
          src={avatarUrl}
          alt={authorName}
          className="w-12 h-12 rounded-full bg-gray-200 object-cover"
        />
        <div>
          <h4 className="text-lg font-bold">{authorName}</h4>
          <p className="text-gray-600">{authorTitle}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * HorizontalScroller
 * Props: children, speed (e.g., "40s"), direction ("left" | "right")
 */
export const HorizontalScroller = ({ children, speed = "40s", direction = "left" }) => {
  const animationClass =
    direction === "right" ? "animate-scroll-horizontal-reverse" : "animate-scroll-horizontal";

  return (
    <div className="w-full overflow-hidden group relative mask-fade">
      <div className={`flex ${animationClass}`} style={{ ["--scroll-duration"]: speed }}>
        <div className="flex items-stretch justify-center gap-8 px-4">{children}</div>
        <div className="flex items-stretch justify-center gap-8 px-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * TestimonialsSection
 * Props: data { title, subtitle, rows[] }
 */
export default function TestimonialsSection({ data }) {
  return (
    <section className="testimonials-section relative flex flex-col items-center gap-12 p-10 w-full max-w-7xl">
      <div className="flex flex-col items-center gap-6 text-center z-10 max-w-2xl">
        <h2
          className="text-5xl font-extrabold text-black leading-tight"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease-out 0.2s forwards" }}
        >
          {data.title}
        </h2>
        <p
          className="text-lg text-gray-700"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease-out 0.4s forwards" }}
        >
          {data.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-8 z-10 w-full max-w-6xl">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.testimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                quote={t.quote}
                authorName={t.authorName}
                authorTitle={t.authorTitle}
                avatarUrl={t.avatarUrl}
              />
            ))}
          </HorizontalScroller>
        ))}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 85% 67% at 50% 100%, rgba(189,204,255,0.45) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />
    </section>
  );
}
