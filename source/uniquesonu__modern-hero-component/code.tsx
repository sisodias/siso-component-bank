import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";

export const BackgroundLines = ({
  children,
  className,
  svgOptions,
  theme = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
    intensity?: "low" | "medium" | "high";
    glowEffect?: boolean;
    particleCount?: number;
  };
  theme?: "dark" | "light" | "cyberpunk" | "ocean" | "sunset";
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return "bg-gradient-to-br from-gray-50 via-white to-gray-100";
      case "cyberpunk":
        return "bg-gradient-to-br from-purple-900 via-black to-pink-900";
      case "ocean":
        return "bg-gradient-to-br from-blue-900 via-teal-900 to-cyan-900";
      case "sunset":
        return "bg-gradient-to-br from-orange-900 via-red-900 to-pink-900";
      default:
        return "bg-gradient-to-br from-gray-900 via-black to-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "relative h-[20rem] md:h-screen w-full overflow-hidden",
        getThemeClasses(),
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, rgba(119, 198, 255, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Interactive mouse glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
        animate={{
          opacity: isHovered ? 0.4 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-96 h-96 bg-gradient-radial from-blue-400/20 via-purple-400/10 to-transparent rounded-full blur-xl" />
      </motion.div>

      {/* Floating particles */}
      <FloatingParticles count={svgOptions?.particleCount || 20} theme={theme} />

      {/* Enhanced SVG with glow effects */}
      <SVG svgOptions={svgOptions} theme={theme} />

      {/* Content with backdrop blur */}
      <div className="relative z-10 backdrop-blur-[0.5px]">
        {children}
      </div>

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

const FloatingParticles = ({ count, theme }: { count: number; theme: string }) => {
  const getParticleColor = () => {
    switch (theme) {
      case "cyberpunk":
        return ["#ff00ff", "#00ffff", "#ff0080"];
      case "ocean":
        return ["#00bfff", "#1e90ff", "#87ceeb"];
      case "sunset":
        return ["#ff6b35", "#ff8e53", "#ff6b6b"];
      default:
        return ["#3b82f6", "#8b5cf6", "#06b6d4"];
    }
  };

  const colors = getParticleColor();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const pathVariants = {
  initial: { 
    strokeDashoffset: 800, 
    strokeDasharray: "50 800",
    opacity: 0,
  },
  animate: {
    strokeDashoffset: 0,
    strokeDasharray: "20 800",
    opacity: [0, 0.8, 1, 0.8, 0],
  },
};

const SVG = ({
  svgOptions,
  theme,
}: {
  svgOptions?: {
    duration?: number;
    intensity?: "low" | "medium" | "high";
    glowEffect?: boolean;
  };
  theme: string;
}) => {
  const paths = [
    "M720 450C720 450 742.459 440.315 755.249 425.626C768.039 410.937 778.88 418.741 789.478 401.499C800.076 384.258 817.06 389.269 826.741 380.436C836.423 371.603 851.957 364.826 863.182 356.242C874.408 347.657 877.993 342.678 898.867 333.214C919.741 323.75 923.618 319.88 934.875 310.177C946.133 300.474 960.784 300.837 970.584 287.701C980.384 274.564 993.538 273.334 1004.85 263.087C1016.15 252.84 1026.42 250.801 1038.22 242.1C1050.02 233.399 1065.19 230.418 1074.63 215.721C1084.07 201.024 1085.49 209.128 1112.65 194.884C1139.8 180.64 1132.49 178.205 1146.43 170.636C1160.37 163.066 1168.97 158.613 1181.46 147.982C1193.95 137.35 1191.16 131.382 1217.55 125.645C1243.93 119.907 1234.19 118.899 1254.53 100.846C1274.86 82.7922 1275.12 92.8914 1290.37 76.09C1305.62 59.2886 1313.91 62.1868 1323.19 56.7536C1332.48 51.3204 1347.93 42.8082 1361.95 32.1468C1375.96 21.4855 1374.06 25.168 1397.08 10.1863C1420.09 -4.79534 1421.41 -3.16992 1431.52 -15.0078",
    "M720 450C720 450 741.044 435.759 753.062 410.636C765.079 385.514 770.541 386.148 782.73 370.489C794.918 354.83 799.378 353.188 811.338 332.597C823.298 312.005 825.578 306.419 843.707 295.493C861.837 284.568 856.194 273.248 877.376 256.48C898.558 239.713 887.536 227.843 909.648 214.958C931.759 202.073 925.133 188.092 941.063 177.621C956.994 167.151 952.171 154.663 971.197 135.041C990.222 115.418 990.785 109.375 999.488 96.1291C1008.19 82.8827 1011.4 82.2181 1032.65 61.8861C1053.9 41.5541 1045.74 48.0281 1064.01 19.5798C1082.29 -8.86844 1077.21 -3.89415 1093.7 -19.66C1110.18 -35.4258 1105.91 -46.1146 1127.68 -60.2834C1149.46 -74.4523 1144.37 -72.1024 1154.18 -97.6802C1163.99 -123.258 1165.6 -111.332 1186.21 -135.809C1206.81 -160.285 1203.29 -160.861 1220.31 -177.633C1237.33 -194.406 1236.97 -204.408 1250.42 -214.196",
    "M720 450C720 450 712.336 437.768 690.248 407.156C668.161 376.544 672.543 394.253 665.951 365.784C659.358 337.316 647.903 347.461 636.929 323.197C625.956 298.933 626.831 303.639 609.939 281.01C593.048 258.381 598.7 255.282 582.342 242.504C565.985 229.726 566.053 217.66 559.169 197.116C552.284 176.572 549.348 171.846 529.347 156.529C509.345 141.211 522.053 134.054 505.192 115.653C488.33 97.2527 482.671 82.5627 473.599 70.7833C464.527 59.0039 464.784 50.2169 447 32.0721C429.215 13.9272 436.29 0.858563 423.534 -12.6868C410.777 -26.2322 407.424 -44.0808 394.364 -56.4916C381.303 -68.9024 373.709 -72.6804 365.591 -96.1992C357.473 -119.718 358.364 -111.509 338.222 -136.495C318.08 -161.481 322.797 -149.499 315.32 -181.761C307.843 -214.023 294.563 -202.561 285.795 -223.25C277.026 -243.94 275.199 -244.055 258.602 -263.871",
    "M720 450C720 450 738.983 448.651 790.209 446.852C841.436 445.052 816.31 441.421 861.866 437.296C907.422 433.172 886.273 437.037 930.656 436.651C975.04 436.264 951.399 432.343 1001.57 425.74C1051.73 419.138 1020.72 425.208 1072.85 424.127C1124.97 423.047 1114.39 420.097 1140.02 414.426C1165.65 408.754 1173.1 412.143 1214.55 411.063C1256.01 409.983 1242.78 406.182 1285.56 401.536C1328.35 396.889 1304.66 400.796 1354.41 399.573C1404.16 398.35 1381.34 394.315 1428.34 389.376C1475.35 384.438 1445.96 386.509 1497.93 385.313C1549.9 384.117 1534.63 382.499 1567.23 381.48",
    "M720 450C720 450 696.366 458.841 682.407 472.967C668.448 487.093 673.23 487.471 647.919 492.882C622.608 498.293 636.85 499.899 609.016 512.944C581.182 525.989 596.778 528.494 571.937 533.778C547.095 539.062 551.762 548.656 536.862 556.816C521.962 564.975 515.626 563.279 497.589 575.159C479.552 587.04 484.343 590.435 461.111 598.728C437.879 607.021 442.512 605.226 423.603 618.397C404.694 631.569 402.411 629.541 390.805 641.555C379.2 653.568 369.754 658.175 353.238 663.929C336.722 669.683 330.161 674.689 312.831 684.116C295.5 693.543 288.711 698.815 278.229 704.041C267.747 709.267 258.395 712.506 240.378 726.65C222.361 740.795 230.097 738.379 203.447 745.613C176.797 752.847 193.747 752.523 166.401 767.148C139.056 781.774 151.342 783.641 130.156 791.074C108.97 798.507 116.461 802.688 96.0974 808.817C75.7334 814.946 83.8553 819.505 59.4513 830.576C35.0473 841.648 48.2548 847.874 21.8337 853.886C-4.58739 859.898 10.5966 869.102 -16.396 874.524",
    "M720 450C720 450 695.644 482.465 682.699 506.197C669.755 529.929 671.059 521.996 643.673 556.974C616.286 591.951 625.698 590.8 606.938 615.255C588.178 639.71 592.715 642.351 569.76 665.92C546.805 689.49 557.014 687.498 538.136 722.318C519.258 757.137 520.671 760.818 503.256 774.428C485.841 788.038 491.288 790.063 463.484 831.358C435.681 872.653 437.554 867.001 425.147 885.248C412.74 903.495 411.451 911.175 389.505 934.331C367.559 957.486 375.779 966.276 352.213 990.918C328.647 1015.56 341.908 1008.07 316.804 1047.24C291.699 1086.42 301.938 1060.92 276.644 1100.23C251.349 1139.54 259.792 1138.78 243.151 1153.64",
  ];

  const getThemeColors = () => {
    switch (theme) {
      case "light":
        return ["#374151", "#6b7280", "#9ca3af", "#d1d5db", "#4f46e5", "#7c3aed"];
      case "cyberpunk":
        return ["#ff00ff", "#00ffff", "#ff0080", "#8000ff", "#ff4080", "#40ff80"];
      case "ocean":
        return ["#0ea5e9", "#06b6d4", "#3b82f6", "#1d4ed8", "#0284c7", "#0369a1"];
      case "sunset":
        return ["#f97316", "#ea580c", "#dc2626", "#b91c1c", "#f59e0b", "#d97706"];
      default:
        return ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
    }
  };

  const colors = getThemeColors();
  const intensity = svgOptions?.intensity || "medium";
  const strokeWidth = intensity === "low" ? "1.5" : intensity === "high" ? "3" : "2.3";

  return (
    <div className="absolute inset-0">
      {svgOptions?.glowEffect && (
        <motion.svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {paths.map((path, idx) => (
            <motion.path
              key={`glow-${idx}`}
              d={path}
              stroke={colors[idx % colors.length]}
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#glow)"
              variants={pathVariants}
              initial="initial"
              animate="animate"
              transition={{
                duration: svgOptions?.duration || 12,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
                delay: Math.random() * 8,
                repeatDelay: Math.random() * 8 + 3,
              }}
            />
          ))}
        </motion.svg>
      )}

      <motion.svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 w-full h-full"
      >
        {paths.map((path, idx) => (
          <motion.path
            key={`path-main-${idx}`}
            d={path}
            stroke={colors[idx % colors.length]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            variants={pathVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: svgOptions?.duration || 10,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 10,
              repeatDelay: Math.random() * 10 + 2,
            }}
          />
        ))}

        {/* Additional layer for more density */}
        {intensity === "high" && paths.map((path, idx) => (
          <motion.path
            key={`path-extra-${idx}`}
            d={path}
            stroke={colors[(idx + 3) % colors.length]}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={0.6}
            variants={pathVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: (svgOptions?.duration || 10) * 1.5,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 12,
              repeatDelay: Math.random() * 12 + 3,
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
};

// Demo component to showcase the enhanced background
export default function BackgroundLinesDemo() {
  const [theme, setTheme] = useState<"dark" | "light" | "cyberpunk" | "ocean" | "sunset">("dark");
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium");
  const [glowEffect, setGlowEffect] = useState(true);

  return (
    <div className="min-h-screen">
      <BackgroundLines
        theme={theme}
        svgOptions={{
          duration: 8,
          intensity,
          glowEffect,
          particleCount: 25,
        }}
        className="flex items-center justify-center"
      >
        <div className="text-center space-y-8 z-10 relative">
          <motion.h1
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Enhanced
          </motion.h1>
          <motion.h2
            className="text-4xl md:text-6xl font-light bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Background Lines
          </motion.h2>
          
          <motion.div
            className="flex flex-wrap gap-4 justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex gap-2">
              {(["dark", "light", "cyberpunk", "ocean", "sunset"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    theme === t
                      ? "bg-white/20 text-white border border-white/30"
                      : "bg-white/10 text-white/70 hover:bg-white/15"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((i) => (
                <button
                  key={i}
                  onClick={() => setIntensity(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    intensity === i
                      ? "bg-blue-500/30 text-white border border-blue-400/50"
                      : "bg-white/10 text-white/70 hover:bg-white/15"
                  }`}
                >
                  {i.charAt(0).toUpperCase() + i.slice(1)}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setGlowEffect(!glowEffect)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                glowEffect
                  ? "bg-purple-500/30 text-white border border-purple-400/50"
                  : "bg-white/10 text-white/70 hover:bg-white/15"
              }`}
            >
              {glowEffect ? "Glow On" : "Glow Off"}
            </button>
          </motion.div>
        </div>
      </BackgroundLines>
    </div>
  );
}