import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * AuroraHero
 *
 * A full-screen generative hero banner that draws animated simplex-noise ribbons
 * on a <canvas> and overlays interactive text and buttons. Supports dark/light
 * themes via global CSS variables and exposes keyboard shortcut (R) to randomize.
 */
export default function AuroraHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Palettes by name
  const palettes = useMemo(
    () => ({
      "Arctic Frost": ["#00f2ff", "#00a2ff", "#7d00ff"],
      "Solar Flare": ["#ffbe0b", "#fb5607", "#ff006e"],
      Nebula: ["#ff00f5", "#a200ff", "#00a2ff"],
      "Forest Spirit": ["#2dc84d", "#00ff95", "#00b8a2"],
      Classic: ["#00ff6a", "#058c42", "#023020"],
    }),
    []
  );

  // Animation configuration
  const [cfg, setCfg] = useState({
    ribbons: Array.from({ length: 4 }, () => true),
    speed: 0.006,
    complexity: 0.012,
    amplitude: 250,
    mouseIntensity: 0.8,
    pulse: true,
    palette: "Arctic Frost" as keyof typeof palettes,
  });

  const colors = palettes[cfg.palette];

  // Keyboard shortcut: R to randomize ribbon count
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/input|select|textarea/i.test((e.target as HTMLElement).tagName)) return;
      if (e.key.toLowerCase() === "r") {
        setCfg((c) => ({
          ...c,
          ribbons: Array.from({ length: Math.floor(Math.random() * 3 + 3) }, () => true),
        }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Core animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY, active: true };
    };
    window.addEventListener("mousemove", onMouseMove);

    // Simplex noise (self-contained)
    const simplex = (() => {
      const F2 = 0.5 * (Math.sqrt(3) - 1);
      const G2 = (3 - Math.sqrt(3)) / 6;
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [p[i], p[j]] = [p[j], p[i]];
      }
      const perm = new Uint8Array(512);
      const perm12 = new Uint8Array(512);
      const grad3 = new Float32Array([
        1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
        0, 1, -1, 0, -1, 1, 0, 1, -1, 0, -1, 0, -1,
      ]);
      for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        perm12[i] = perm[i] % 12;
      }
      return (xin: number, yin: number) => {
        let n0 = 0,
          n1 = 0,
          n2 = 0;
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        const i1 = x0 > y0 ? 1 : 0;
        const j1 = x0 > y0 ? 0 : 1;
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;
        const ii = i & 255;
        const jj = j & 255;
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
          const gi = perm12[ii + perm[jj]];
          t0 *= t0;
          n0 = t0 * t0 * (grad3[gi * 3] * x0 + grad3[gi * 3 + 1] * y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
          const gi = perm12[ii + i1 + perm[jj + j1]];
          t1 *= t1;
          n1 = t1 * t1 * (grad3[gi * 3] * x1 + grad3[gi * 3 + 1] * y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
          const gi = perm12[ii + 1 + perm[jj + 1]];
          t2 *= t2;
          n2 = t2 * t2 * (grad3[gi * 3] * x2 + grad3[gi * 3 + 1] * y2);
        }
        return 70 * (n0 + n1 + n2);
      };
    })();

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += cfg.speed;

      cfg.ribbons.forEach((_, idx) => {
        const color = colors[idx % colors.length];
        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.5, color);
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < canvas.width; x += 5) {
          const dx = x - mouse.x;
          const dy = canvas.height / 2 - mouse.y;
          const dist = Math.hypot(dx, dy);
          const m = mouse.active
            ? 1 + (1 - Math.min(1, dist / 400)) * cfg.mouseIntensity
            : 1;
          const noise = simplex(x * cfg.complexity * m, idx * 1000 + time);
          const pulse = cfg.pulse ? Math.sin(time * 0.5 + idx * 1000) * 0.1 + 0.9 : 1;
          const y = canvas.height / 2 + noise * cfg.amplitude * pulse * m;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(frameRef.current!);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [cfg, colors]);

  return (
    <div className="aurora-showcase">
      <canvas ref={canvasRef} className="aurora-canvas" />
    </div>
  );
}
