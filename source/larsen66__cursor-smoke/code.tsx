import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
}

export const Component = ({
  color = "#ffffff",
  particlesPerEmit = 2,
}: {
  color?: string;
  particlesPerEmit?: number;
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticle = useCallback(
    (x: number, y: number, id: number) => ({
      id,
      x,
      y,
      angle: (Math.random() * Math.PI) / 3 - Math.PI / 6 - Math.PI / 2,
      speed: Math.random() * 1 + 1,
      size: Math.random() * 12 + 8,
      opacity: Math.random() * 0.3 + 0.1,
    }),
    [],
  );

  const emitParticles = useCallback(
    (x: number, y: number) => {
      const newParticles = Array.from({ length: particlesPerEmit }, (_, i) =>
        createParticle(x, y, Date.now() + i),
      );
      setParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
        );
      }, 1000);
    },
    [createParticle, particlesPerEmit],
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    emitParticles(x, y);
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-gray-900"
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full blur-md"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: particle.opacity,
            }}
            animate={{
              x: particle.x + Math.cos(particle.angle) * 200 * particle.speed,
              y: particle.y + Math.sin(particle.angle) * 200 * particle.speed,
              scale: 2,
              opacity: 0,
            }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: color,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};