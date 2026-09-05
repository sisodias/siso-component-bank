import { useRef, useCallback } from "react";
import { motion, useSpring } from "motion/react";

const PANEL_COUNT = 22;
const WAVE_SPRING = { stiffness: 160, damping: 22, mass: 0.6 };
const SCENE_SPRING = { stiffness: 80, damping: 22, mass: 1 };
const Z_SPREAD = 42;
const SIGMA = 2.8;

const PANEL_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
  "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&q=80",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&q=80",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80",
  "https://images.unsplash.com/photo-1510784722466-f2aa240c3c4a?w=400&q=80",
  "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=400&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80",
  "https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=400&q=80",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80",
  "https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=400&q=80",
  "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?w=400&q=80",
  "https://images.unsplash.com/photo-1445962125599-30f582ac21f4?w=400&q=80",
  "https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=400&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&q=80",
];

const GRADIENT_OVERLAYS = [
  "linear-gradient(135deg, rgba(99,55,255,0.55) 0%, rgba(236,72,153,0.45) 100%)",
  "linear-gradient(135deg, rgba(6,182,212,0.55) 0%, rgba(59,130,246,0.45) 100%)",
  "linear-gradient(135deg, rgba(245,158,11,0.55) 0%, rgba(239,68,68,0.45) 100%)",
  "linear-gradient(135deg, rgba(16,185,129,0.45) 0%, rgba(6,182,212,0.55) 100%)",
  "linear-gradient(135deg, rgba(236,72,153,0.55) 0%, rgba(245,158,11,0.45) 100%)",
  "linear-gradient(135deg, rgba(59,130,246,0.55) 0%, rgba(99,55,255,0.45) 100%)",
  "linear-gradient(135deg, rgba(239,68,68,0.45) 0%, rgba(236,72,153,0.55) 100%)",
  "linear-gradient(135deg, rgba(6,182,212,0.45) 0%, rgba(16,185,129,0.55) 100%)",
  "linear-gradient(135deg, rgba(99,55,255,0.45) 0%, rgba(6,182,212,0.55) 100%)",
  "linear-gradient(135deg, rgba(245,158,11,0.45) 0%, rgba(16,185,129,0.55) 100%)",
  "linear-gradient(135deg, rgba(239,68,68,0.55) 0%, rgba(245,158,11,0.45) 100%)",
  "linear-gradient(135deg, rgba(99,55,255,0.55) 0%, rgba(59,130,246,0.45) 100%)",
  "linear-gradient(135deg, rgba(16,185,129,0.55) 0%, rgba(99,55,255,0.45) 100%)",
  "linear-gradient(135deg, rgba(236,72,153,0.45) 0%, rgba(59,130,246,0.55) 100%)",
  "linear-gradient(135deg, rgba(6,182,212,0.55) 0%, rgba(245,158,11,0.45) 100%)",
  "linear-gradient(135deg, rgba(59,130,246,0.45) 0%, rgba(16,185,129,0.55) 100%)",
  "linear-gradient(135deg, rgba(245,158,11,0.55) 0%, rgba(99,55,255,0.45) 100%)",
  "linear-gradient(135deg, rgba(239,68,68,0.45) 0%, rgba(6,182,212,0.55) 100%)",
  "linear-gradient(135deg, rgba(99,55,255,0.45) 0%, rgba(236,72,153,0.55) 100%)",
  "linear-gradient(135deg, rgba(16,185,129,0.45) 0%, rgba(245,158,11,0.55) 100%)",
  "linear-gradient(135deg, rgba(236,72,153,0.55) 0%, rgba(239,68,68,0.45) 100%)",
  "linear-gradient(135deg, rgba(59,130,246,0.55) 0%, rgba(6,182,212,0.45) 100%)",
];

function Panel({
  index,
  total,
  waveY,
  scaleY,
}: {
  index: number;
  total: number;
  waveY: ReturnType<typeof useSpring>;
  scaleY: ReturnType<typeof useSpring>;
}) {
  const t = index / (total - 1);
  const baseZ = (index - (total - 1)) * Z_SPREAD;

  const w = 200 + t * 80;
  const h = 280 + t * 120;

  const opacity = 0.25 + t * 0.75;
  const imageUrl = PANEL_IMAGES[index % PANEL_IMAGES.length];
  const gradient = GRADIENT_OVERLAYS[index % GRADIENT_OVERLAYS.length];

  return (
    <motion.div
      className="absolute rounded-xl pointer-events-none overflow-hidden"
      style={{
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        translateZ: baseZ,
        y: waveY,
        scaleY,
        transformOrigin: "bottom center",
        opacity,
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Aesthetic gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: gradient,
          mixBlendMode: "multiply",
        }}
      />
      {/* Subtle dark vignette for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.32) 100%)",
        }}
      />
      {/* Border glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: `1px solid rgba(255,255,255,${0.08 + t * 0.22})`,
          boxSizing: "border-box",
        }}
      />
    </motion.div>
  );
}

export default function StackedPanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  const waveYSprings = Array.from({ length: PANEL_COUNT }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring(0, WAVE_SPRING)
  );

  const scaleYSprings = Array.from({ length: PANEL_COUNT }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring(1, WAVE_SPRING)
  );

  const rotY = useSpring(-42, SCENE_SPRING);
  const rotX = useSpring(18, SCENE_SPRING);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      isHovering.current = true;

      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;

      rotY.set(-42 + (cx - 0.5) * 14);
      rotX.set(18 + (cy - 0.5) * -10);

      const cursorCardPos = cx * (PANEL_COUNT - 1);

      waveYSprings.forEach((spring, i) => {
        const dist = Math.abs(i - cursorCardPos);
        const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        spring.set(-influence * 70);
      });

      scaleYSprings.forEach((spring, i) => {
        const dist = Math.abs(i - cursorCardPos);
        const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        spring.set(0.35 + influence * 0.65);
      });
    },
    [rotY, rotX, waveYSprings, scaleYSprings]
  );

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    rotY.set(-42);
    rotX.set(18);
    waveYSprings.forEach((s) => s.set(0));
    scaleYSprings.forEach((s) => s.set(1));
  }, [rotY, rotX, waveYSprings, scaleYSprings]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ perspective: "900px" }}
    >
      <motion.div
        style={{
          rotateY: rotY,
          rotateX: rotX,
          transformStyle: "preserve-3d",
          position: "relative",
          width: 0,
          height: 0,
        }}
      >
        {Array.from({ length: PANEL_COUNT }).map((_, i) => (
          <Panel
            key={i}
            index={i}
            total={PANEL_COUNT}
            waveY={waveYSprings[i]}
            scaleY={scaleYSprings[i]}
          />
        ))}
      </motion.div>
    </div>
  );
}