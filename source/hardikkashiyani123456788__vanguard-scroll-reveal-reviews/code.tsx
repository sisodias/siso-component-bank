import * as React from "react";

interface ReviewData {
  quote: string;
  name: string;
  initials: string;
  role: string;
}

const REVIEWS: ReviewData[] = [
  {
    quote: "At some stage therefore we should have to expect the machines to take control.",
    name: "Alan Turing",
    initials: "AT",
    role: "Mathematician",
  },
  {
    quote: "The original question, 'Can machines think?', I believe to be too meaningless to deserve discussion.",
    name: "Alan Turing",
    initials: "AT",
    role: "Computer Scientist",
  },
  {
    quote: "This is only a foretaste of what is to come and only the shadow of what is going to be.",
    name: "Alan Turing",
    initials: "AT",
    role: "Visionary",
  },
];

// ROT13 encoding function
function rot13(str: string): string {
  return str.replace(/[A-Za-z]/g, function (c) {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

// Star SVG Component
function Star() {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      className="star"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

// Encoded Text Component
interface EncodedTextProps {
  text: string;
  charIndexOffset: number;
}

function EncodedText({ text, charIndexOffset }: EncodedTextProps) {
  const words = text.split(/\s+/);
  let globalIndex = charIndexOffset;

  return (
    <>
      {words.map((word, wIndex) => {
        const wordChars = word.split("").map((char, cIndex) => {
          const encoded = rot13(char);
          const span = (
            <span
              key={cIndex}
              className="char"
              data-letter={char}
              style={{ "--i": globalIndex } as React.CSSProperties}
            >
              {encoded}
            </span>
          );
          globalIndex++;
          return span;
        });

        return (
          <React.Fragment key={wIndex}>
            <span className="word">{wordChars}</span>
            {wIndex < words.length - 1 && <span className="char space"> </span>}
          </React.Fragment>
        );
      })}
    </>
  );
}

// Review Card Component
interface ReviewCardProps {
  review: ReviewData;
  cardIndex: number;
  charIndexOffset: number;
}

function ReviewCard({ review, cardIndex, charIndexOffset }: ReviewCardProps) {
  const cardRef = React.useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <article
      ref={cardRef}
      className="review-card group"
      data-card-index={cardIndex}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight Effect Layer */}
      <div className="spotlight-overlay" aria-hidden="true" />
      
      {/* Grain Texture */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Gold sheen overlay on hover */}
      <div className="gold-sheen" aria-hidden="true" />

      {/* Content */}
      <div className="card-content relative z-10 transition-transform duration-300 group-hover:translate-y-[-2px]">
        <div className="stars" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <Star key={i} />
          ))}
        </div>

        <blockquote className="encode">
          <EncodedText text={review.quote} charIndexOffset={charIndexOffset} />
        </blockquote>

        <footer className="review-author">
          <div className="avatar" aria-hidden="true">{review.initials}</div>
          <div className="info">
            <cite className="name not-italic">{review.name}</cite>
            <span className="role">{review.role}</span>
          </div>
        </footer>
      </div>
    </article>
  );
}

// Main Component
export function Component() {
  const totalChars = React.useMemo(() => {
    return REVIEWS.reduce((acc, review) => {
      return acc + review.quote.replace(/\s+/g, "").length;
    }, 0);
  }, []);

  const charOffsets = React.useMemo(() => {
    let offset = 0;
    return REVIEWS.map((review) => {
      const currentOffset = offset;
      offset += review.quote.replace(/\s+/g, "").length;
      return currentOffset;
    });
  }, []);

  React.useEffect(() => {
    document.documentElement.style.setProperty("--count", totalChars.toString());
  }, [totalChars]);

  return (
    <section className="review-section">
      <div className="reveal">
        {REVIEWS.map((review, index) => (
          <ReviewCard
            key={index}
            review={review}
            cardIndex={index + 1}
            charIndexOffset={charOffsets[index]}
          />
        ))}
      </div>
    </section>
  );
}
