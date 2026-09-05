"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";
import { cn } from "@/lib/utils";
const METAL_NOISE = 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")';
const GRAIN_NOISE = 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22g%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23g)%22/%3E%3C/svg%3E")';
type RoomProps = {
  backWall?: { tl: [number, number]; tr: [number, number]; br: [number, number]; bl: [number, number] };
  lightsOn?: boolean;
  intensity?: number;
  lightColor?: string;
  spots?: number[];
  vignette?: number;
  isFlickering?: boolean;
  className?: string;
};
function Room({
  backWall = {
    tl: [22, 10],
    tr: [78, 10],
    br: [78, 70],
    bl: [22, 70],
  },
  lightsOn = true,
  intensity = 1,
  lightColor = "230,240,255",
  spots = [35, 50, 65],
  vignette = 0.55,
  isFlickering = false,
  className = "",
}: RoomProps) {
  const { tl, tr, br, bl } = backWall;
  const poly = useMemo(
    () => (pts: readonly (readonly [number, number])[]) =>
      `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(", ")})`,
    []
  );
  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden bg-black pointer-events-none ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          clipPath: poly([tl, tr, br, bl]),
          background:
            "linear-gradient(to bottom, rgba(20,20,22,1) 0%, rgba(8,8,10,1) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: poly([[0, 0], [100, 0], tr, tl]),
          background:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: poly([[0, 0], tl, bl, [0, 100]]),
          background:
            "linear-gradient(to right, rgba(8,8,10,1) 0%, rgba(18,18,20,1) 70%, rgba(26,26,28,1) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: poly([[100, 0], tr, br, [100, 100]]),
          background:
            "linear-gradient(to left, rgba(8,8,10,1) 0%, rgba(18,18,20,1) 70%, rgba(26,26,28,1) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: poly([[0, 100], [100, 100], br, bl]),
          background:
            "linear-gradient(to top, rgba(15,15,17,1) 0%, rgba(6,6,8,1) 100%)",
        }}
      />
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
        <defs>
          <linearGradient id="baseGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="20%" stopColor="white" stopOpacity="0.5" />
            <stop offset="80%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={`${bl[0]}%`} y1={`${bl[1]}%`} x2={`${br[0]}%`} y2={`${br[1]}%`}
          stroke="rgba(255,255,255,0.2)" strokeWidth="5" style={{ filter: "blur(3px)" }} />
        <line x1={`${bl[0]}%`} y1={`${bl[1]}%`} x2={`${br[0]}%`} y2={`${br[1]}%`}
          stroke="url(#baseGrad)" strokeWidth="1" />
        <line x1={`${tl[0]}%`} y1={`${tl[1]}%`} x2={`${bl[0]}%`} y2={`${bl[1]}%`}
          stroke="url(#vGrad)" strokeWidth="1" />
        <line x1={`${tr[0]}%`} y1={`${tr[1]}%`} x2={`${br[0]}%`} y2={`${br[1]}%`}
          stroke="url(#vGrad)" strokeWidth="1" />
      </svg>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 15,
          opacity: lightsOn ? intensity : 0,
          transition: isFlickering ? "none" : `opacity 700ms ${EASE}`,
          mixBlendMode: "screen",
          willChange: "opacity",
        }}
      >
        <div 
          className="absolute inset-0" 
          style={{ 
            clipPath: poly([tl, tr, br, bl]), 
            background: spots.map(x => `radial-gradient(ellipse 25% 40% at ${x}% 68%, rgba(${lightColor},0.15) 0%, transparent 70%)`).join(", ")
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            clipPath: poly([[0, 0], tl, bl, [0, 100]]), 
            background: `radial-gradient(ellipse 40% 50% at 15% 75%, rgba(${lightColor},0.08) 0%, transparent 60%)`
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            clipPath: poly([[100, 0], tr, br, [100, 100]]), 
            background: `radial-gradient(ellipse 40% 50% at 85% 75%, rgba(${lightColor},0.08) 0%, transparent 60%)`
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            clipPath: poly([[0, 100], [100, 100], br, bl]), 
            background: spots.map(x => `radial-gradient(ellipse 35% 30% at ${x}% 80%, rgba(${lightColor},0.06) 0%, transparent 60%)`).join(", ")
          }} 
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 16, mixBlendMode: "screen" }}
      >
        {spots.map((pos, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: lightsOn ? intensity : 0 }}
            transition={isFlickering ? { duration: 0 } : { delay: i * 0.1, duration: 0.8, ease: "easeInOut" }}
            className="absolute flex w-200 h-[80vh] -translate-x-1/2 justify-center pointer-events-none"
            style={{ 
              left: `${pos}%`, 
              top: "calc(3% + 80px)",
              mixBlendMode: "screen",
              willChange: "opacity"
            }}
          >
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} shadows={false} gl={{ alpha: true }}>
              <ambientLight intensity={0.5} />
              <SpotLight
                distance={12}
                angle={0.25}
                attenuation={6}
                anglePower={5}
                color={`rgb(${lightColor})`}
                position={[0, 4.1, 0]}
                volumetric
                opacity={1}
                radiusTop={0.1}
                radiusBottom={4}
              />
            </Canvas>
          </motion.div>
        ))}
      </div>
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          zIndex: 31
        }}
      >
        {[35, 50, 65].map((pos, i) => (
          <div key={i} className="absolute flex flex-col items-center" style={{ left: `${pos}%`, top: '3%', transform: 'translate(-50%, -4px)' }}>
            <div className="w-[14px] h-[34px] rounded-sm border border-zinc-900 shadow-[0_5px_10px_rgba(0,0,0,0.9),inset_0_0_4px_rgba(255,255,255,0.5)] relative overflow-hidden"
                 style={{ background: 'linear-gradient(to right, #666 0%, #ffffff 40%, #999 60%, #333 100%)' }}>
               <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-zinc-900 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,1)]" />
               <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] bg-zinc-900 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,1)]" />
            </div>
            <div className="w-[8px] h-[18px] bg-linear-to-r from-zinc-900 via-zinc-600 to-zinc-950 border-x border-black relative">
               <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full border border-zinc-900 shadow-[0_4px_8px_rgba(0,0,0,1),inset_0_1px_2px_rgba(255,255,255,0.3)]"
                    style={{ background: 'radial-gradient(circle at top left, #777, #111)' }} />
            </div>
            <div className="relative mt-[6px] w-[54px] h-[64px] flex justify-center perspective-near">
              <div className="absolute inset-0 rounded-b-2xl rounded-t-sm border border-black shadow-[0_20px_30px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-evenly"
                   style={{ background: 'linear-gradient(to right, #111 0%, #3a3a3a 30%, #555 50%, #2a2a2a 80%, #000 100%)' }}>
                 <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none" style={{ backgroundImage: METAL_NOISE }} />
                 <div className="w-full h-[2px] bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.15)] z-10" />
                 <div className="w-full h-[2px] bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.15)] z-10" />
                 <div className="w-full h-[2px] bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.15)] z-10" />
                 <div className="w-full h-[2px] bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.15)] z-10" />
              </div>
              <div className="absolute bottom-[-6px] w-[58px] h-[18px] rounded-[50%] border-2 border-zinc-900 shadow-[0_10px_15px_rgba(0,0,0,1)] flex items-center justify-center z-10 overflow-hidden"
                   style={{ background: 'radial-gradient(ellipse at center, #222, #000)' }}>
                 <div className="w-[34px] h-[10px] rounded-[50%] transition-all duration-700"
                      style={{
                        background: lightsOn ? '#ffffff' : '#111',
                        boxShadow: lightsOn 
                          ? `0 0 20px 8px rgba(255,255,255,0.9), inset 0 0 8px #fff`
                          : `inset 0 2px 5px rgba(0,0,0,0.9), inset 0 -1px 1px rgba(255,255,255,0.05)`,
                      }}
                 />
              </div>
              <div className="absolute bottom-[-18px] w-[46px] h-[20px] border border-black shadow-[0_15px_15px_rgba(0,0,0,0.8)] origin-top z-20 flex justify-center"
                   style={{ transform: 'rotateX(-45deg)', background: 'linear-gradient(to bottom, #222, #050505)' }}>
                 <div className="w-[80%] h-full bg-white/3" />
              </div>
              <div className="absolute bottom-[6px] w-[46px] h-[20px] border border-black origin-bottom z-0"
                   style={{ transform: 'rotateX(45deg)', background: 'linear-gradient(to top, #111, #000)' }} />
              <div className="absolute bottom-[-6px] left-[-6px] w-[14px] h-[22px] bg-zinc-900 border border-black origin-right z-10 shadow-[5px_0_10px_rgba(0,0,0,0.5)]"
                   style={{ transform: 'rotateY(-55deg) skewY(15deg)' }} />
              <div className="absolute bottom-[-6px] right-[-6px] w-[14px] h-[22px] bg-zinc-900 border border-black origin-left z-10 shadow-[-5px_0_10px_rgba(0,0,0,0.5)]"
                   style={{ transform: 'rotateY(55deg) skewY(-15deg)' }} />
            </div>
          </div>
        ))}
      </div>
      <div 
        className="absolute pointer-events-none w-full h-[80px] bg-linear-to-b from-black/60 to-transparent blur-xl"
        style={{ zIndex: 29, top: '4%', left: 0 }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          zIndex: 30,
          clipPath: poly([[0, 0], [100, 0], tr, tl])
        }}
      >
        <div 
          className="absolute w-full h-[26px]"
          style={{ 
            top: '3%', 
            left: '0%', 
            background: 'linear-gradient(to bottom, #111 0%, #3a3a3a 30%, #555 50%, #2a2a2a 80%, #000 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.9), 0 10px 20px -5px rgba(0,0,0,0.8)'
          }}
        >
          <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none" style={{ backgroundImage: METAL_NOISE }} />
        </div>
      </div>
      <div
        className="absolute inset-0"
        style={{
          zIndex: 20,
          background: `radial-gradient(ellipse 90% 80% at 50% 45%,
            transparent 55%,
            rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 25,
          opacity: 0.04,
          mixBlendMode: "screen",
          backgroundImage: GRAIN_NOISE,
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
}
export const VolumetricStudio = ({ 
  className,
  children
}: { 
  className?: string;
  children?: React.ReactNode;
}) => {
  const [lightsOn, setLightsOn] = useState(false);
  const [isFlickering, setIsFlickering] = useState(true);
  React.useEffect(() => {
    let mounted = true;
    const runFlicker = async () => {
      const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
      await sleep(600);
      if (!mounted) return;
      setLightsOn(true);
      await sleep(100);
      setLightsOn(false);
      await sleep(300);
      setLightsOn(true);
      await sleep(50);
      setLightsOn(false);
      await sleep(200);
      setLightsOn(true);
      await sleep(40);
      setLightsOn(false);
      await sleep(60);
      setLightsOn(true);
      await sleep(40);
      setLightsOn(false);
      await sleep(400);
      if (!mounted) return;
      setIsFlickering(false);
      setLightsOn(true);
    };
    runFlicker();
    return () => { mounted = false; };
  }, []);
  return (
    <section className={cn("relative w-full h-full min-h-[600px] bg-black overflow-hidden font-sans", className)}>
      <Room
        lightsOn={lightsOn}
        intensity={1}
        lightColor="230,240,255"
        spots={[35, 50, 65]}
        isFlickering={isFlickering}
      />
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </section>
  );
};