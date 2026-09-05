/**
 * Animated Hero Component
 *
 * A full-screen hero section with a large title, animated blobs,
 * and scrolling curved text.
 */

import React from 'react';
// We assume 'cn' is available, like in the default template
// import { cn } from "@/lib/utils";

// --- Internal SVG Blob Components ---
// These are not exported, they are just used by the main component.

const Blob1 = () => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      className="w-20 h-20" // This will be scaled by Tailwind
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_238_1331)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M146.371 34.5888C147.629 31.5563 148.272 28.3046 148.265 25.0218C148.267 20.0831 146.806 15.2545 144.066 11.1455C141.326 7.03648 137.431 3.83135 132.871 1.9347C128.311 0.038053 123.291 -0.465076 118.445 0.488832C113.6 1.44274 109.145 3.81092 105.644 7.29439L100.004 12.5471L94.4021 7.31163C89.7108 2.62604 83.3503 -0.00403591 76.7198 4.64873e-06C70.0894 0.00404521 63.7321 2.64187 59.0465 7.33318C54.3609 12.0245 51.7308 18.385 51.7348 25.0155C51.7389 31.6459 54.3767 38.0032 59.068 42.6888L97.5477 81.7374C97.8685 82.0631 98.2508 82.3217 98.6725 82.4983C99.0941 82.6748 99.5467 82.7658 100.004 82.7658C100.461 82.7658 100.914 82.6748 101.335 82.4983C101.757 82.3217 102.139 82.0631 102.46 81.7374L140.94 42.6888C143.268 40.3744 145.114 37.6213 146.371 34.5888ZM53.6286 165.411C52.3712 168.444 51.7276 171.695 51.7349 174.978C51.7327 179.917 53.1938 184.746 55.9336 188.855C58.6735 192.964 62.5693 196.169 67.1293 198.065C71.6892 199.962 76.7089 200.465 81.5546 199.511C86.4003 198.557 90.8547 196.189 94.3556 192.706L99.9961 187.453L105.598 192.688C110.289 197.374 116.65 200.004 123.28 200C129.911 199.996 136.268 197.358 140.954 192.667C145.639 187.976 148.269 181.615 148.265 174.985C148.261 168.354 145.623 161.997 140.932 157.311L102.452 118.263C102.132 117.937 101.749 117.678 101.327 117.502C100.906 117.325 100.453 117.234 99.9961 117.234C99.539 117.234 99.0864 117.325 98.6647 117.502C98.2431 117.678 97.8607 117.937 97.54 118.263L59.0603 157.311C56.7321 159.626 54.8859 162.379 53.6286 165.411ZM174.978 148.266C171.695 148.273 168.444 147.629 165.411 146.372C162.379 145.115 159.626 143.268 157.311 140.94L118.263 102.461C117.937 102.14 117.678 101.757 117.502 101.336C117.325 100.914 117.234 100.462 117.234 100.004C117.234 99.5473 117.325 99.0947 117.502 98.6731C117.678 98.2514 117.937 97.869 118.263 97.5483L157.311 59.0686C161.997 54.3773 168.354 51.7394 174.985 51.7354C181.615 51.7314 187.976 54.3614 192.667 59.047C197.358 63.7326 199.996 70.0899 200 76.7204C200.004 83.3509 197.374 89.7114 192.688 94.4027L187.453 100.004L192.706 105.645C196.189 109.146 198.557 113.6 199.511 118.446C200.465 123.292 199.962 128.311 198.065 132.871C196.169 137.431 192.964 141.327 188.855 144.067C184.746 146.807 179.917 148.268 174.978 148.266ZM34.5888 53.628C31.5563 52.3706 28.3046 51.727 25.0218 51.7343C20.0831 51.7321 15.2544 53.1932 11.1455 55.933C7.03647 58.6729 3.83134 62.5687 1.9347 67.1287C0.0380524 71.6887 -0.465076 76.7083 0.488831 81.554C1.44274 86.3997 3.81091 90.8542 7.29439 94.355L12.5471 99.9956L7.31163 105.597C2.62603 110.289 -0.00403599 116.649 4.64892e-06 123.28C0.00404529 129.91 2.64186 136.267 7.33317 140.953C12.0245 145.639 18.385 148.269 25.0155 148.265C31.6459 148.261 38.0032 145.623 42.6888 140.931L81.7373 102.452C82.063 102.131 82.3217 101.749 82.4982 101.327C82.6748 100.905 82.7657 100.453 82.7657 99.9955C82.7657 99.5384 82.6748 99.0858 82.4982 98.6642C82.3217 98.2425 82.063 97.8602 81.7373 97.5394L42.6888 59.0597C40.3744 56.7315 37.6213 54.8853 34.5888 53.628Z"
          fill="url(#paint0_linear_238_1331)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_238_1331"
          x1="177"
          y1="-9.23648e-06"
          x2="39.5"
          y2="152.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B0B9FF" /> <stop offset="1" stopColor="#E7E9FF" />
        </linearGradient>
        <clipPath id="clip0_238_1331">
          <rect width="200" height="200" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Blob5 = () => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      className="w-20 h-20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_103_21)">
        <path
          d="M71.5579 16.3347C84.3365 -5.4449 115.825 -5.44489 128.603 16.3347L129.067 17.1257C134.963 27.1733 145.709 33.378 157.358 33.4596L158.276 33.466C183.527 33.6428 199.271 60.9123 186.798 82.8687L186.345 83.6661C180.591 93.7953 180.591 106.205 186.345 116.334L186.798 117.131C199.271 139.088 183.527 166.357 158.276 166.534L157.358 166.54C145.709 166.622 134.963 172.827 129.067 182.874L128.603 183.665C115.825 205.445 84.3365 205.445 71.5579 183.665L71.0938 182.874C65.1986 172.827 54.4517 166.622 42.8027 166.54L41.8856 166.534C16.6346 166.357 0.890585 139.088 13.3629 117.131L13.8159 116.334C19.5698 106.205 19.5698 93.7953 13.8159 83.6661L13.3629 82.8687C0.890585 60.9123 16.6346 33.6428 41.8856 33.466L42.8027 33.4596C54.4518 33.378 65.1986 27.1733 71.0938 17.1257L71.5579 16.3347Z"
          fill="url(#paint0_linear_103_21)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_103_21"
          x1="100.081"
          y1="0"
          x2="100.081"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B8DBFC" /> <stop offset="1" stopColor="#F8FBFE" />
        </linearGradient>
        <clipPath id="clip0_103_21">
          <rect width="200" height="200" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Blob7 = () => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      className="w-20 h-20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_104_215)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M100 100C100 100 112.5 66.5265 112.5 42.8571C112.5 19.1878 106.904 0 100 0C93.0964 0 87.5 19.1878 87.5 42.8571C87.5 66.5265 100 100 100 100ZM100 100C100 100 114.831 132.508 131.567 149.245C148.304 165.982 165.829 175.592 170.711 170.711C175.592 165.829 165.982 148.304 149.245 131.567C132.508 114.831 100 100 100 100ZM100 100C100 100 133.474 87.5 157.143 87.5C180.812 87.5 200 93.0964 200 100C200 106.904 180.812 112.5 157.143 112.5C133.474 112.5 100 100 100 100ZM100 100C100 100 67.4918 114.831 50.755 131.567C34.0183 148.304 24.4077 165.829 29.2893 170.711C34.1709 175.592 51.696 165.982 68.4327 149.245C85.1695 132.508 100 100 100 100ZM100 100L100 100C100.028 100.074 112.5 133.5 112.5 157.143C112.5 180.812 106.904 200 100 200C93.0964 200 87.5 180.812 87.5 157.143C87.5 133.474 100 100 100 100ZM100 100C100 100 66.5265 87.5 42.8571 87.5C19.1878 87.5 0 93.0964 0 100C0 106.904 19.1878 112.5 42.8571 112.5C66.5265 112.5 100 100 100 100ZM100 99.9999C100 99.9999 132.508 85.1694 149.245 68.4327C165.982 51.6959 175.592 34.1708 170.711 29.2893C165.829 24.4077 148.304 34.0183 131.567 50.755C114.831 67.4918 100 99.9999 100 99.9999ZM68.4327 50.755C85.1695 67.4918 100 100 100 100C100 100 67.4918 85.1695 50.7551 68.4327C34.0183 51.696 24.4078 34.1709 29.2893 29.2893C34.1709 24.4078 51.696 34.0183 68.4327 50.755Z"
          fill="url(#paint0_linear_104_215)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_104_215"
          x1="157.5"
          y1="32"
          x2="44"
          y2="147.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0509862" stopColor="#FFB6E1" />
          <stop offset="1" stopColor="#FBE3EA" />
        </linearGradient>
        <clipPath id="clip0_104_215">
          <rect width="200" height="200" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

// --- Internal Curved Text Component ---

const CurvedText = () => {
  const textContent =
    'Cinquin Maeva · Maquilleuse professionnelle · Passionnée à votre service · Diplômée Makeup For Ever Nice · ';
  const repeatedText = textContent.repeat(6);

  return (
    <>
      {/* First SVG - left to right animation */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 2000 1179"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full scale-200 md:scale-110 opacity-80"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <path
            id="curve"
            d="M17.5 1160C327.879 876.5 736.951 1052.59 1002.05 845C1156.61 723.963 1162.6 569.963 1327.04 462.5C1504.42 346.576 1722.53 485.799 1851.05 318C1909.45 241.759 1965.55 98.3516 1974.5 3"
          />
        </defs>
        <text
          fill="white"
          fontSize="56"
          className="font-corinthia" // Use class for font
          fontWeight="700"
        >
          <textPath href="#curve" startOffset="-16.66%">
            {repeatedText}
            <animate
              attributeName="startOffset"
              from="-16.66%"
              to="0%"
              dur="15s"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>

      {/* Second SVG - right to left animation */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 2000 1179"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full translate-y-4 translate-x-4 scale-200 md:translate-y-10 md:translate-x-10 md:scale-110 opacity-80"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <path
            id="curve2"
            d="M17.5 1160C327.879 876.5 736.951 1052.59 1002.05 845C1156.61 723.963 1162.6 569.963 1327.04 462.5C1504.42 346.576 1722.53 485.799 1851.05 318C1909.45 241.759 1965.55 98.3516 1974.5 3"
          />
        </defs>
        <text
          fill="white"
          fontSize="56"
          className="font-corinthia" // Use class for font
          fontWeight="700"
          opacity="0.8"
        >
          <textPath href="#curve2" startOffset="0%">
            {repeatedText}
            <animate
              attributeName="startOffset"
              from="0%"
              to="-16.66%"
              dur="15s"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </>
  );
};

// --- Main Exported Component ---

interface ComponentProps {
  title: string;
  backgroundImage?: string;
  fontSize?: number;
  lineHeight?: number;
}

export const Component = ({
  title,
  fontSize = 700,
  backgroundImage = 'https://placehold.co/1920x1080/333333/FFFFFF?text=Hero+Image', // Default placeholder
  lineHeight = 0.5,
}: ComponentProps) => {
  return (
    // We use h-full w-full to fill the parent, not h-screen w-screen
    // This makes the component reusable in any container.
    <div className="h-full w-full relative overflow-hidden">
      {/*
       * Replaced Next/Image with a standard <img> tag.
       * We use Tailwind classes to replicate the 'fill' and 'style' props.
       */}
      <img
        src={backgroundImage}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-75"
        loading="lazy"
      />

      <h1
        className="font-bold absolute top-20 -left-20 z-10 font-corinthia text-foreground hero-title"
        style={
          {
            '--font-size-base': `${fontSize}px`,
            lineHeight: `${lineHeight}`,
          } as React.CSSProperties
        }
      >
        {title}
      </h1>

      {/* Blobs on the left side */}
      <div className="absolute left-1/2 bottom-0 m-20 z-0 animate-float-slow opacity-70">
        <Blob1 />
      </div>
      <div className="absolute hidden md:block left-14 bottom-28 z-0 animate-float-medium delay-1500 opacity-80">
        <Blob5 />
      </div>

      {/* Blob on the right side */}
      <div className="absolute hidden md:block right-8 top-1/2 m-8 -translate-y-1/2 z-0 animate-float-slow delay-2500 opacity-70">
        <Blob7 />
      </div>

      {/* Curved Text */}
      <div className="absolute rotate-45 scale-200 md:scale-100 md:rotate-0 inset-0 z-20 pointer-events-none">
        <CurvedText />
      </div>
    </div>
  );
};
