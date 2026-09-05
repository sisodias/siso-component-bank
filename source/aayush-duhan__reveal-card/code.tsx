import { type HTMLAttributes } from "react";

const MASK_SVG = `data:image/svg+xml,%3Csvg width='407' height='411' viewBox='0 0 407 411' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 8C0 3.58173 3.58172 0 8 0H398.89C403.308 0 406.89 3.58172 406.89 8V364.983C406.89 369.401 403.308 372.983 398.89 372.983H263.329C256.329 372.983 249.709 376.171 245.345 381.644L228.846 402.338C224.482 407.812 217.863 411 210.862 411H8C3.58173 411 0 407.418 0 403V8Z' fill='%23D9D9D9'/%3E%3C/svg%3E`;

const BORDER_PATH = [
  "M8 .5h390.89a7.5 7.5 0 0 1 7.5 7.5v356.983a7.5 7.5 0 0 1-7.5",
  "7.5H263.329a23.502 23.502 0 0 0-18.375 8.849l-16.499",
  "20.695a22.502 22.502 0 0 1-17.593 8.473H8A7.5 7.5 0 0 1 .5",
  "403V8A7.5 7.5 0 0 1 8 .5Z",
].join(" ");

const BORDER_OVERLAY_PATH = [
  "M8 1h390.89a7 7 0 0 1 7 7v356.983a7 7 0 0 1-7",
  "7H263.329a23.999 23.999 0 0 0-18.766 9.038l-16.499",
  "20.694A21.999 21.999 0 0 1 210.862 410H8a7 7 0 0 1-7-7V8a7",
  "7 0 0 1 7-7Z",
].join(" ");

interface HelmetCardProps extends HTMLAttributes<HTMLDivElement> {
  baseImage: string;
  hoverImage: string;
  label: string;
  year: string | number;
  accentColor?: string;
  borderColor?: string;
  bgColor?: string;
}

export function HelmetCard({
  baseImage,
  hoverImage,
  label,
  year,
  accentColor = "#ffffff",
  borderColor = "#404040",
  bgColor = "#1a1a1a",
  className = "",
  ...props
}: HelmetCardProps) {
  return (
    <div
      className={`group relative w-full max-w-[407px] cursor-pointer ${className}`}
      {...props}
    >
      <div
        className="helmet-mask relative flex w-full"
        style={{
          aspectRatio: "406.89 / 411",
          backgroundColor: bgColor,
          maskImage: `url("${MASK_SVG}")`,
          WebkitMaskImage: `url("${MASK_SVG}")`,
          maskSize: "cover",
          WebkitMaskSize: "cover",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      >
        <div className="pointer-events-none relative z-10 flex h-full w-full">
          <div
            className="helmet-border-overlay absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{ aspectRatio: "406.89 / 411" }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 407 411"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={BORDER_OVERLAY_PATH}
                stroke={accentColor}
                strokeWidth="2"
              />
            </svg>
          </div>
          <div
            className="flex w-full"
            style={{ aspectRatio: "406.89 / 411", color: borderColor }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 407 411"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={BORDER_PATH}
                stroke="currentColor"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="relative h-full w-full">
            <img
              src={baseImage}
              alt={`${label} ${year}`}
              className="helmet-base relative h-full w-full object-cover"
            />
          </div>
          <img
            src={hoverImage}
            alt={`${label} ${year} hover`}
            className="helmet-reveal absolute inset-0 h-full w-full scale-105 object-cover group-hover:scale-100"
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 right-0 z-[5] flex h-6 items-center justify-end sm:h-8">
        <span className="whitespace-nowrap text-[0.7rem] font-semibold leading-tight text-white sm:text-[0.9rem]">
          {label}
        </span>
        <div className="ml-2 flex items-center justify-end sm:ml-3">
          <span
            className="whitespace-nowrap text-[0.7rem] font-bold leading-tight sm:text-[0.9rem]"
            style={{ color: accentColor }}
          >
            {year}
          </span>
        </div>
      </div>
    </div>
  );
}
