import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import * as Tone from 'tone';
import { Delaunay } from 'd3-delaunay';

// --- SVG Icon ---
const DiamondIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-violet-100 mb-4"
  >
    <path d="M2.7 10.3a2.4 2.4 0 0 0-1.4 4.3l8 8a2.4 
             2.4 0 0 0 3.4 0l8-8a2.4 2.4 
             0 0 0-1.4-4.3h-13Z" />
    <path d="m2.7 10.3 8.6-8.6a2.4 
             2.4 0 0 1 3.4 0l8.6 8.6" />
  </svg>
);

// --- Canvas for shattered shards ---
function ShardCanvas({ shards, containerRef, state }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (state !== 'shattered') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    // clone shards to mutate
    const active = shards.map(s => ({ ...s, x: 0, y: 0, r: 0 }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let anyAlive = false;

      active.forEach(shard => {
        if (shard.life > 0) {
          anyAlive = true;
          shard.x += shard.vx;
          shard.y += shard.vy;
          shard.r += shard.vr;
          shard.vy += 0.2; // gravity
          shard.life -= 0.01;

          ctx.save();
          ctx.translate(shard.x, shard.y);
          ctx.rotate((shard.r * Math.PI) / 180);
          ctx.fillStyle = `rgba(167,139,250,${shard.life})`;
          ctx.fill(new Path2D(shard.path));
          ctx.restore();
        }
      });

      if (anyAlive) {
        animationId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [shards, state]);

  return (
    <canvas
      ref={canvasRef}
      width={containerRef.current?.clientWidth || 0}
      height={containerRef.current?.clientHeight || 0}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

// --- Overlay content before shatter ---
function CardContent({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DiamondIcon />
          <h2 className="text-3xl font-bold text-white">UNBREAKABLE</h2>
          <p className="text-violet-200">Click to test our promise.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Main Component ---
export default function ShatterableGlassCard() {
  const [state, setState] = useState('intact'); // intact → cracked → shattered
  const [shards, setShards] = useState([]);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  const audioRefs = useRef({});

  // initialize synths
  useEffect(() => {
    audioRefs.current.crackSynth = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.9,
    }).toDestination();

    audioRefs.current.shatterSynth = new Tone.PolySynth(
      Tone.MetalSynth,
      {
        frequency: 200,
        envelope: { attack: 0.001, decay: 0.4, release: 0.2 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }
    ).toDestination();

    return () =>
      Object.values(audioRefs.current).forEach((s) => s.dispose());
  }, []);

  // generate voronoi shards
  const generateShards = (x, y) => {
    const rect = containerRef.current.getBoundingClientRect();
    const points = Array.from({ length: 100 }, () => [
      Math.random() * rect.width,
      Math.random() * rect.height,
    ]);
    points.push([x, y]);

    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([
      0,
      0,
      rect.width,
      rect.height,
    ]);

    const newShards = Array.from(voronoi.cellPolygons()).map(
      (poly, i) => {
        const centroid = poly
          .reduce(
            ([sx, sy], [px, py]) => [sx + px, sy + py],
            [0, 0]
          )
          .map((v) => v / poly.length);
        const dx = centroid[0] - x;
        const dy = centroid[1] - y;
        const angle = Math.atan2(dy, dx);
        const dist = Math.hypot(dx, dy);
        const force = (rect.width - dist) / rect.width;

        return {
          id: i,
          path: `M${poly.join('L')}Z`,
          vx:
            Math.cos(angle) *
            (10 + Math.random() * 10) *
            force,
          vy:
            Math.sin(angle) *
              (10 + Math.random() * 10) -
            5,
          vr: (Math.random() - 0.5) * 2,
          life: 1,
        };
      }
    );
    setShards(newShards);
  };

  // click handler
  const handleClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (state === 'intact') {
      generateShards(x, y);
      setState('cracked');
      audioRefs.current.crackSynth.triggerAttack('C6');
    } else if (state === 'cracked') {
      setState('shattered');
      audioRefs.current.shatterSynth.triggerAttackRelease(
        ['C4', 'E4', 'G4', 'B4'],
        0.4
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white select-none">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-200 md:text-5xl">
          Shatterable Interface
        </h1>
        <p className="mt-2 text-neutral-400">
          An interface you can literally break.
        </p>
      </div>

      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative h-[450px] w-[300px] cursor-pointer rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-violet-500 to-indigo-700"
      >
        <CardContent visible={state !== 'shattered'} />

        {/* Crack overlay */}
        <svg
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            state === 'cracked' ? 'opacity-50' : 'opacity-0'
          }`}
          fill="none"
          stroke="white"
        >
          {shards.map((s) => (
            <path key={s.id} d={s.path} strokeWidth="0.5" />
          ))}
        </svg>

        {/* Shatter canvas */}
        {state === 'shattered' && (
          <ShardCanvas
            shards={shards}
            containerRef={containerRef}
            state={state}
          />
        )}

        {/* Revealed back */}
        <AnimatePresence>
          {state === 'shattered' && (
            <motion.div
              className="absolute inset-0 bg-amber-500 flex flex-col items-center justify-center text-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
              <h2 className="text-2xl font-bold text-white">
                Promise Broken!
              </h2>
              <p className="text-sm text-amber-100">
                You found the easter egg.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
