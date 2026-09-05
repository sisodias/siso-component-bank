export const NotFound = () => {
  return (
     <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
      {/* SVG Background */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 560"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative bottom-12"
        >
          <g mask="url(#SvgjsMask1000)" fill="none">
            <rect width="1440" height="560" x="0" y="0" fill="#1e3266" />
            <path d="M1488 560L0 560 L0 468.76Q37.54 386.3, 120 423.84Q189.28 373.12, 240 442.4Q291.19 421.58, 312 472.77Q366.23 455, 384 509.22Q410.11 463.33, 456 489.43Q489.15 402.58, 576 435.73Q623.36 411.09, 648 458.45Q729.6 420.04, 768 501.64Q816.33 429.97, 888 478.3Q896.89 415.19, 960 424.09Q1002.02 394.11, 1032 436.13Q1123.51 407.64, 1152 499.16Q1168.55 443.71, 1224 460.26Q1272.78 437.04, 1296 485.82Q1310.17 428, 1368 442.17Q1434.53 388.7, 1488 455.22z" fill="#356cb1" />
            <path d="M1488 560L0 560 L0 545.74Q39.06 464.8, 120 503.85Q162.45 474.31, 192 516.76Q262.98 467.74, 312 538.71Q325.37 480.08, 384 493.45Q461.74 499.19, 456 576.93Q497.16 546.09, 528 587.24Q552.74 539.98, 600 564.71Q601.25 493.96, 672 495.2Q708.76 459.97, 744 496.73Q803.3 484.03, 816 543.33Q866 521.34, 888 571.34Q913.61 476.95, 1008 502.56Q1087.71 462.27, 1128 541.98Q1194.09 488.07, 1248 554.16Q1293.39 479.56, 1368 524.95Q1450.82 487.77, 1488 570.59z" fill="white" />
          </g>
          <defs>
            <mask id="SvgjsMask1000">
              <rect width="1440" height="560" fill="#ffffff" />
            </mask>
          </defs>
        </svg>
      </div>

      <div className="z-10 text-center -translate-y-20">
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        <p className="text-white/80 text-xl mb-8 max-w-[600px] w-[90%] mx-auto">
          Oops! The page you're looking for seems to be lost in the clouds.
        </p>
        <a 
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-primary hover:bg-white/90 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};
