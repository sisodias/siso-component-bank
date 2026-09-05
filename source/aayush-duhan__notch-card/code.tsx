const MASK_SVG = `data:image/svg+xml,${encodeURIComponent('<svg width="407" height="411" viewBox="0 0 407 411" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 8C0 3.58173 3.58172 0 8 0H398.89C403.308 0 406.89 3.58172 406.89 8V364.983C406.89 369.401 403.308 372.983 398.89 372.983H263.329C256.329 372.983 249.709 376.171 245.345 381.644L228.846 402.338C224.482 407.812 217.863 411 210.862 411H8C3.58173 411 0 407.418 0 403V8Z" fill="#D9D9D9"/></svg>')}`;

const BORDER_PATH =
  "M8 .5h390.89a7.5 7.5 0 0 1 7.5 7.5v356.983a7.5 7.5 0 0 1-7.5 7.5H263.329a23.502 23.502 0 0 0-18.375 8.849l-16.499 20.695a22.502 22.502 0 0 1-17.593 8.473H8A7.5 7.5 0 0 1 .5 403V8A7.5 7.5 0 0 1 8 .5Z";

const OVERLAY_PATH =
  "M8 1h390.89a7 7 0 0 1 7 7v356.983a7 7 0 0 1-7 7H263.329a23.999 23.999 0 0 0-18.766 9.038l-16.499 20.694A21.999 21.999 0 0 1 210.862 410H8a7 7 0 0 1-7-7V8a7 7 0 0 1 7-7Z";

function BorderFrame({
  path,
  stroke,
  strokeWidth = 2,
  vectorEffect,
}: {
  path: string;
  stroke: string;
  strokeWidth?: number;
  vectorEffect?: string;
}) {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 407 411"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={path}
        stroke={stroke}
        strokeWidth={strokeWidth}
        vectorEffect={vectorEffect}
      />
    </svg>
  );
}

export interface HelmetCardProps {
  baseImage: string;
  hoverImage: string;
  label: string;
  year: string | number;
  accentColor?: string;
  borderColor?: string;
  bgColor?: string;
  maskUrl?: string;
  duration?: string;
  easing?: string;
  className?: string;
}

export function HelmetCard({
  baseImage,
  hoverImage,
  label,
  year,
  accentColor = "#d2ff00",
  borderColor = "#535450",
  bgColor = "#282c20",
  maskUrl = MASK_SVG,
  duration = "0.75s",
  easing = "cubic-bezier(0.65, 0.05, 0, 1)",
  className = "",
}: HelmetCardProps) {
  const animVar = `${duration} ${easing}`;

  return (
    <div
      className={`helmet-card-w group relative w-full max-w-[407px] cursor-pointer ${className}`}
      style={
        {
          "--hc-animation": animVar,
          "--hc-accent": accentColor,
        } as React.CSSProperties
      }
    >
      <div
        className="relative flex w-full [aspect-ratio:406.89/411]"
        style={{
          backgroundColor: bgColor,
          maskImage: `url("${maskUrl}")`,
          WebkitMaskImage: `url("${maskUrl}")`,
          maskSize: "cover",
          WebkitMaskSize: "cover",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      >
        <div className="pointer-events-none relative z-10 flex w-full h-full">
          <div className="hc-frame-overlay absolute inset-0 flex w-full [aspect-ratio:406.89/411] opacity-0 z-10">
            <BorderFrame path={OVERLAY_PATH} stroke={accentColor} />
          </div>
          <div className="flex w-full [aspect-ratio:406.89/411]" style={{ color: borderColor }}>
            <BorderFrame
              path={BORDER_PATH}
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
            />
          </div>
        </div>

        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <img
              src={baseImage}
              alt={`${label} ${year}`}
              className="hc-img-base relative w-full h-full object-cover"
            />
          </div>
          <img
            src={hoverImage}
            alt={`${label} ${year} hover`}
            loading="lazy"
            fetchPriority="low"
            className="hc-img-reveal absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-0 right-0 z-[5] flex items-center justify-end h-8">
        <span className="whitespace-nowrap text-[0.9rem] font-semibold leading-tight text-white">
          {label}
        </span>
        <div className="ml-3 flex items-center justify-end">
          <span
            className="whitespace-nowrap text-[0.9rem] font-bold leading-tight"
            style={{ color: accentColor }}
          >
            {year}
          </span>
        </div>
      </div>
    </div>
  );
}
