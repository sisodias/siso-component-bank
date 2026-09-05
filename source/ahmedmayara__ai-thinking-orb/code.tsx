import { useEffect, useState } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";

interface Particle {
  id: number;
  angle: number;
  distance: number;
  speed: number;
  size: number;
}

const orbVariants = cva("", {
  variants: {
    variant: {
      default: "",
      emerald: "",
      amber: "",
      rose: "",
      violet: "",
      slate: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const colorPalettes = {
  default: {
    core: "radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.9) 0%, rgba(59, 130, 246, 0.8) 40%, rgba(139, 92, 246, 0.9) 100%)",
    outerGlow:
      "radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)",
    midGlow:
      "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.2) 50%, transparent 70%)",
    innerGlow:
      "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(34, 211, 238, 0.4) 50%, transparent 70%)",
    particle:
      "radial-gradient(circle, rgba(34, 211, 238, 1) 0%, rgba(255, 255, 255, 0.8) 100%)",
    ring: "radial-gradient(circle, rgba(34, 211, 238, 1) 0%, rgba(34, 211, 238, 0) 70%)",
    processingRing: "rgba(236, 72, 153, 0.6)",
    boxShadow: {
      primary: "59, 130, 246",
      secondary: "139, 92, 246",
    },
    particleShadow: "rgba(34, 211, 238, 0.8)",
    ringShadow: "rgba(34, 211, 238, 0.8)",
  },
  emerald: {
    core: "radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.8) 40%, rgba(6, 95, 70, 0.9) 100%)",
    outerGlow:
      "radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.08) 40%, transparent 70%)",
    midGlow:
      "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(20, 184, 166, 0.2) 50%, transparent 70%)",
    innerGlow:
      "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(52, 211, 153, 0.4) 50%, transparent 70%)",
    particle:
      "radial-gradient(circle, rgba(52, 211, 153, 1) 0%, rgba(255, 255, 255, 0.8) 100%)",
    ring: "radial-gradient(circle, rgba(20, 184, 166, 1) 0%, rgba(20, 184, 166, 0) 70%)",
    processingRing: "rgba(16, 185, 129, 0.6)",
    boxShadow: {
      primary: "16, 185, 129",
      secondary: "5, 150, 105",
    },
    particleShadow: "rgba(52, 211, 153, 0.8)",
    ringShadow: "rgba(20, 184, 166, 0.8)",
  },
  amber: {
    core: "radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.9) 0%, rgba(245, 158, 11, 0.8) 40%, rgba(217, 119, 6, 0.9) 100%)",
    outerGlow:
      "radial-gradient(circle, rgba(252, 211, 77, 0.15) 0%, rgba(245, 158, 11, 0.08) 40%, transparent 70%)",
    midGlow:
      "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(251, 146, 60, 0.2) 50%, transparent 70%)",
    innerGlow:
      "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(252, 211, 77, 0.4) 50%, transparent 70%)",
    particle:
      "radial-gradient(circle, rgba(252, 211, 77, 1) 0%, rgba(255, 255, 255, 0.8) 100%)",
    ring: "radial-gradient(circle, rgba(251, 191, 36, 1) 0%, rgba(251, 191, 36, 0) 70%)",
    processingRing: "rgba(251, 146, 60, 0.6)",
    boxShadow: {
      primary: "245, 158, 11",
      secondary: "217, 119, 6",
    },
    particleShadow: "rgba(252, 211, 77, 0.8)",
    ringShadow: "rgba(251, 191, 36, 0.8)",
  },
  rose: {
    core: "radial-gradient(circle at 30% 30%, rgba(251, 113, 133, 0.9) 0%, rgba(244, 63, 94, 0.8) 40%, rgba(225, 29, 72, 0.9) 100%)",
    outerGlow:
      "radial-gradient(circle, rgba(252, 165, 165, 0.15) 0%, rgba(244, 63, 94, 0.08) 40%, transparent 70%)",
    midGlow:
      "radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, rgba(236, 72, 153, 0.2) 50%, transparent 70%)",
    innerGlow:
      "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(251, 113, 133, 0.4) 50%, transparent 70%)",
    particle:
      "radial-gradient(circle, rgba(251, 113, 133, 1) 0%, rgba(255, 255, 255, 0.8) 100%)",
    ring: "radial-gradient(circle, rgba(236, 72, 153, 1) 0%, rgba(236, 72, 153, 0) 70%)",
    processingRing: "rgba(236, 72, 153, 0.6)",
    boxShadow: {
      primary: "244, 63, 94",
      secondary: "225, 29, 72",
    },
    particleShadow: "rgba(251, 113, 133, 0.8)",
    ringShadow: "rgba(236, 72, 153, 0.8)",
  },
  violet: {
    core: "radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.9) 0%, rgba(139, 92, 246, 0.8) 40%, rgba(124, 58, 237, 0.9) 100%)",
    outerGlow:
      "radial-gradient(circle, rgba(196, 181, 253, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)",
    midGlow:
      "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%)",
    innerGlow:
      "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(167, 139, 250, 0.4) 50%, transparent 70%)",
    particle:
      "radial-gradient(circle, rgba(196, 181, 253, 1) 0%, rgba(255, 255, 255, 0.8) 100%)",
    ring: "radial-gradient(circle, rgba(168, 85, 247, 1) 0%, rgba(168, 85, 247, 0) 70%)",
    processingRing: "rgba(168, 85, 247, 0.6)",
    boxShadow: {
      primary: "139, 92, 246",
      secondary: "124, 58, 237",
    },
    particleShadow: "rgba(196, 181, 253, 0.8)",
    ringShadow: "rgba(168, 85, 247, 0.8)",
  },
  slate: {
    core: "radial-gradient(circle at 30% 30%, rgba(203, 213, 225, 0.9) 0%, rgba(148, 163, 184, 0.8) 40%, rgba(100, 116, 139, 0.9) 100%)",
    outerGlow:
      "radial-gradient(circle, rgba(226, 232, 240, 0.15) 0%, rgba(148, 163, 184, 0.08) 40%, transparent 70%)",
    midGlow:
      "radial-gradient(circle, rgba(148, 163, 184, 0.3) 0%, rgba(203, 213, 225, 0.2) 50%, transparent 70%)",
    innerGlow:
      "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(226, 232, 240, 0.4) 50%, transparent 70%)",
    particle:
      "radial-gradient(circle, rgba(226, 232, 240, 1) 0%, rgba(255, 255, 255, 0.8) 100%)",
    ring: "radial-gradient(circle, rgba(203, 213, 225, 1) 0%, rgba(203, 213, 225, 0) 70%)",
    processingRing: "rgba(148, 163, 184, 0.6)",
    boxShadow: {
      primary: "148, 163, 184",
      secondary: "100, 116, 139",
    },
    particleShadow: "rgba(226, 232, 240, 0.8)",
    ringShadow: "rgba(203, 213, 225, 0.8)",
  },
};

export interface AIThinkingOrbProps extends VariantProps<typeof orbVariants> {
  state?: "idle" | "thinking" | "processing";
  size?: number;
}

export const Component = ({
  state = "thinking",
  size = 120,
  variant = "default",
}: AIThinkingOrbProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const colors = colorPalettes[variant || "default"];

  useEffect(() => {
    const particleCount = state === "idle" ? 8 : state === "thinking" ? 12 : 15;
    const newParticles: Particle[] = Array.from(
      { length: particleCount },
      (_, i) => ({
        id: i,
        angle: (Math.PI * 2 * i) / particleCount + Math.random() * 0.5,
        distance: size * 0.5 + Math.random() * size * 0.35,
        speed: 0.3 + Math.random() * 0.4,
        size: 2 + Math.random() * 4,
      }),
    );
    setParticles(newParticles);
  }, [state, size]);

  const pulseSpeed = state === "idle" ? 3.5 : state === "thinking" ? 2 : 1.5;
  const glowIntensity =
    state === "idle" ? 0.6 : state === "thinking" ? 0.85 : 1;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size * 3, height: size * 3 }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 2.5,
          height: size * 2.5,
          background: colors.outerGlow,
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [
            glowIntensity * 0.5,
            glowIntensity * 0.7,
            glowIntensity * 0.5,
          ],
        }}
        transition={{
          duration: pulseSpeed * 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          background: colors.midGlow,
          filter: "blur(30px)",
        }}
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [
            glowIntensity * 0.7,
            glowIntensity * 0.9,
            glowIntensity * 0.7,
          ],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute"
        style={{
          width: size * 1.4,
          height: size * 1.4,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: state === "processing" ? 8 : 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <div
          className="absolute top-0 left-1/2 h-1 w-1 rounded-full"
          style={{
            background: colors.ring,
            boxShadow: `0 0 20px ${colors.ringShadow}`,
            transform: "translateX(-50%)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: colors.core,
          boxShadow: `
            0 0 ${size * 0.3}px rgba(${colors.boxShadow.primary}, ${glowIntensity * 0.6}),
            0 0 ${size * 0.5}px rgba(${colors.boxShadow.secondary}, ${glowIntensity * 0.4}),
            inset 0 0 ${size * 0.3}px rgba(255, 255, 255, 0.3)
          `,
        }}
        animate={{
          scale: [0.95, 1.08, 0.95],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          background: colors.innerGlow,
          filter: "blur(15px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: pulseSpeed * 0.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background:
            "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
          filter: "blur(10px)",
        }}
        animate={{
          opacity: [0, 0.6, 0],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: state === "processing" ? 3 : 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeOut",
          repeatDelay: state === "processing" ? 0 : 1,
        }}
      />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            background: colors.particle,
            boxShadow: `0 0 10px ${colors.particleShadow}`,
          }}
          animate={{
            x: [
              Math.cos(particle.angle) * particle.distance,
              Math.cos(particle.angle + Math.PI * 2) * particle.distance,
            ],
            y: [
              Math.sin(particle.angle) * particle.distance,
              Math.sin(particle.angle + Math.PI * 2) * particle.distance,
            ],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 6 / particle.speed,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: particle.id * 0.3,
          }}
        />
      ))}

      {state === "processing" && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 1.1,
            height: size * 1.1,
            border: `2px solid ${colors.processingRing}`,
            filter: "blur(2px)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />
      )}
    </div>
  );
};
