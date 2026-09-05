export default function TireWheel({
  className = "",
  spin = true,
}: {
  className?: string;
  spin?: boolean;
}) {
  const spokes = Array.from({ length: 5 }, (_, i) => i * 72);

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <g className={spin ? "anim-spin-wheel" : undefined}>
        {/* Goma */}
        <circle cx="200" cy="200" r="190" fill="#1e2024" />
        {/* Huella: tacos del dibujo de la cubierta */}
        <circle
          cx="200"
          cy="200"
          r="178"
          fill="none"
          stroke="#0d0e10"
          strokeWidth="22"
          strokeDasharray="16 11"
        />
        {/* Flanco con lettering de medida, como en la goma real */}
        <circle cx="200" cy="200" r="150" fill="#16181a" />
        <defs>
          <path
            id="sidewall"
            d="M 200,200 m -132,0 a 132,132 0 1,1 264,0 a 132,132 0 1,1 -264,0"
          />
        </defs>
        <text
          fill="#3a3e44"
          fontSize="19"
          fontWeight="600"
          letterSpacing="6"
          fontFamily="var(--font-mono)"
        >
          <textPath href="#sidewall">
            205/55 R16 · 91V · TUBELESS · RADIAL · 205/55 R16 · 91V
          </textPath>
        </text>
        {/* Llanta */}
        <circle cx="200" cy="200" r="104" fill="#2a2d31" />
        <circle
          cx="200"
          cy="200"
          r="104"
          fill="none"
          stroke="#43474d"
          strokeWidth="3"
        />
        {/* Rayos */}
        {spokes.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 200 200)`}>
            <path
              d="M 188 200 L 194 110 L 206 110 L 212 200 Z"
              fill="#3a3e44"
            />
            <circle cx="200" cy="122" r="5" fill="#16181a" />
          </g>
        ))}
        {/* Centro */}
        <circle cx="200" cy="200" r="34" fill="#43474d" />
        <circle cx="200" cy="200" r="26" fill="#16181a" />
        <circle cx="200" cy="200" r="9" fill="#ffd400" />
      </g>
    </svg>
  );
}
