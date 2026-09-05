import React, { useState, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Spiral 1: Animated growing spiral line, color is prop
function GrowingSpiral({ color = "#38bdf8" }: { color?: string }) {
  const ref = useRef<THREE.Line>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    const spiralTurns = 3 + Math.sin(t * 0.7) * 1.2;
    for (let i = 0; i < 200; i++) {
      const a = (i / 200) * Math.PI * 2 * spiralTurns + t * 0.6;
      const r = 0.7 + 1.2 * (i / 200);
      positions[i * 3 + 0] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = 0.12 * Math.sin(a * 2 + t * 0.7);
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.z = t * 0.2;
  });
  const points = [];
  for (let i = 0; i < 200; i++) {
    const a = (i / 200) * Math.PI * 2 * 3;
    const r = 0.7 + 1.2 * (i / 200);
    points.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
}

// Spiral 2: Multi-arm flower spiral, each arm animates with phase offset
function FlowerSpiral() {
  const group = useRef<THREE.Group>(null!);
  const arms = useRef<Array<THREE.Line>>([]);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.z = t * 0.18;
    arms.current.forEach((line, idx) => {
      const positions = line.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 120; i++) {
        const a = (i / 120) * Math.PI * 2;
        const r =
          1.3 +
          0.35 *
            Math.sin(
              a * (3 + idx) +
                t * (0.7 + idx * 0.18) +
                idx * Math.PI * 0.5
            );
        positions[i * 3 + 0] = Math.cos(a + idx * Math.PI / 2) * r;
        positions[i * 3 + 1] = Math.sin(a + idx * Math.PI / 2) * r;
        positions[i * 3 + 2] = 0.08 * Math.sin(a * 2 + t * 0.5 * (idx + 1));
      }
      line.geometry.attributes.position.needsUpdate = true;
    });
  });
  const armsArr = useMemo(() => {
    return [0, 1, 2, 3].map((idx) => {
      const points = [];
      for (let i = 0; i < 120; i++) {
        const a = (i / 120) * Math.PI * 2;
        const r = 1.3 + 0.35 * Math.sin(a * (3 + idx));
        points.push(
          new THREE.Vector3(
            Math.cos(a + idx * Math.PI / 2) * r,
            Math.sin(a + idx * Math.PI / 2) * r,
            0
          )
        );
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return geometry;
    });
  }, []);
  const colors = ["#fbbf24", "#a21caf", "#38bdf8", "#f12b30"];
  return (
    <group ref={group}>
      {armsArr.map((geometry, idx) => (
        <line
          key={idx}
          ref={(el) => (arms.current[idx] = el!)}
          geometry={geometry}
        >
          <lineBasicMaterial color={colors[idx]} linewidth={2} />
        </line>
      ))}
    </group>
  );
}

// Spiral 3: Color Rush (psychedelic, undulating, brick/berry spheres)
function ColorRush() {
  const group = useRef<THREE.Group>(null!);
  const N = 8;
  const spheres = useRef<Array<THREE.Mesh>>([]);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.x = Math.sin(t * 0.22) * 0.18 + 0.18;
    group.current.rotation.z = Math.sin(t * 0.16) * 0.18 + Math.sin(t * 0.41) * 0.18;
    group.current.position.y = Math.sin(t * 0.13) * 0.2;
    group.current.position.x = Math.sin(t * 0.19) * 0.1;
    group.current.scale.setScalar(1 + 0.07 * Math.sin(t * 0.3));
    spheres.current.forEach((mesh, i) => {
      const x = i % N;
      const y = Math.floor(i / N);
      const isBerry = (x + y) % 2 === 0;
      const baseColor = new THREE.Color(isBerry ? "#d72660" : "#bfa16c");
      const hue =
        ((x + y) / (N * 2) +
          0.25 * Math.sin(t * 0.7 + x * 0.3 - y * 0.13) +
          0.25 * Math.sin(t * 1.4 + x * 0.1 + y * 0.17)) %
        1;
      const sat = isBerry
        ? 0.7 + 0.3 * Math.sin(t * 2 + i * 0.13)
        : 0.5 + 0.2 * Math.sin(t * 2.3 + i * 0.11);
      const light = isBerry
        ? 0.55 + 0.15 * Math.sin(t * 1.3 + i * 0.23)
        : 0.45 + 0.14 * Math.sin(t * 1.7 + i * 0.19);
      const mosaicColor = new THREE.Color().setHSL(hue, sat, light);
      mesh.material.color.copy(baseColor.clone().lerp(mosaicColor, 0.7));
      (mesh.material as THREE.MeshStandardMaterial).emissive.copy(
        mosaicColor.clone().multiplyScalar(isBerry ? 0.6 : 0.35)
      );
      (mesh.material as THREE.MeshStandardMaterial).metalness =
        0.7 + 0.3 * Math.sin(t * 1.7 + i * 0.21);
      (mesh.material as THREE.MeshStandardMaterial).roughness =
        0.18 + 0.15 * Math.cos(t * 1.1 + i * 0.19);
      mesh.position.z =
        0.6 +
        0.28 *
          Math.sin(
            t * 1.2 +
              x * 0.6 +
              y * 0.8 +
              Math.sin(t * 0.7 + x * 0.2 - y * 0.13)
          );
      mesh.scale.setScalar(
        0.87 +
          0.18 * Math.sin(t * 2.1 + i * 0.11) +
          (isBerry
            ? 0.08 * Math.sin(t * 3.1 + x * 0.3 + y * 0.4)
            : 0.08 * Math.cos(t * 2.7 + x * 0.2 - y * 0.2))
      );
      mesh.position.x =
        x - N / 2 + 0.5 + 0.18 * Math.sin(t + y * 0.4 + x * 0.2);
      mesh.position.y =
        y - N / 2 + 0.5 + 0.18 * Math.cos(t + x * 0.4 + y * 0.2);
    });
  });
  const spheresArr = useMemo(() => {
    return Array.from({ length: N * N }, (_, i) => {
      const x = i % N;
      const y = Math.floor(i / N);
      const isBerry = (x + y) % 2 === 0;
      return (
        <mesh
          key={i}
          ref={(el) => (spheres.current[i] = el!)}
          position={[
            x - N / 2 + 0.5,
            y - N / 2 + 0.5,
            0.6,
          ]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.47, 32, 32]} />
          <meshStandardMaterial
            color={isBerry ? "#d72660" : "#bfa16c"}
            metalness={0.7}
            roughness={0.18}
            emissive={isBerry ? "#d72660" : "#bfa16c"}
            envMapIntensity={1.2}
          />
        </mesh>
      );
    });
  }, []);
  return <group ref={group}>{spheresArr}</group>;
}

// --- Non-spiral effects (unchanged) ---
function BgEffect1({ innerRadius, dot1Color, dot2Color, dot3Color, hovered }: any) {
  return (
    <div
      style={{
        opacity: hovered ? 0.8 : 0,
        transition: "opacity 0.3s cubic-bezier(0.4,0,0.2,1)",
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        borderRadius: innerRadius,
        pointerEvents: "none",
        background: "#24222b",
        maskImage:
          "radial-gradient(circle at 50% 50%, white 99%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(circle at 50% 50%, white 99%, transparent 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background: `
repeating-radial-gradient(circle at 10% 10%, ${dot1Color} 0 2px, transparent 3px 36px),
repeating-radial-gradient(circle at 80% 80%, ${dot2Color} 0 2px, transparent 3px 36px),
repeating-radial-gradient(circle at 50% 50%, ${dot3Color} 0 1.5px, transparent 2.5px 34px)
`,
          opacity: 0.23,
          filter: "blur(0.5px)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 50%, transparent 60%, #23244a 100%)",
          zIndex: 2,
          opacity: 0.6,
        }}
      />
    </div>
  );
}
function BgEffect2({ innerRadius, columnsGradient }: any) {
  return (
    <div
      style={{
        opacity: 0.93,
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        borderRadius: innerRadius,
        pointerEvents: "none",
        background: columnsGradient,
        backgroundSize: "200% 100%",
        animation: "columns-move 6s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate",
      }}
    />
  );
}
function BgEffect3({ innerRadius, boxColumns, boxRows, boxColors, bgColor }: any) {
  const [grid, setGrid] = useState(
    Array.from({ length: boxColumns }).map((_, col) =>
      Array.from({ length: boxRows }).map(
        (_, row) => boxColors[(col + row) % boxColors.length]
      )
    )
  );
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    for (let col = 0; col < boxColumns; ++col) {
      timers.push(
        setInterval(() => {
          setGrid((prev) => {
            const newGrid = prev.map((arr) => [...arr]);
            const first = newGrid[col][0];
            for (let i = 0; i < boxRows - 1; i++) {
              newGrid[col][i] = newGrid[col][i + 1];
            }
            newGrid[col][boxRows - 1] = first;
            return newGrid;
          });
        }, 300 + col * 30)
      );
    }
    return () => timers.forEach(clearInterval);
  }, [boxColumns, boxRows, boxColors]);
  return (
    <div
      style={{
        opacity: 1,
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        borderRadius: innerRadius,
        display: "grid",
        gridTemplateColumns: `repeat(${boxColumns}, 1fr)`,
        gap: 2,
        background: bgColor,
        pointerEvents: "none",
      }}
    >
      {grid.map((col, ci) => (
        <div
          key={ci}
          style={{
            display: "grid",
            height: "100%",
            gridTemplateRows: `repeat(${boxRows}, 1fr)`,
            gap: 2,
          }}
        >
          {col.map((color, ri) => (
            <div
              key={ri}
              style={{
                width: "100%",
                height: "100%",
                background: color,
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
function BgEffect4({ innerRadius, stripe1, stripe2, stripe3 }: any) {
  return (
    <div
      style={{
        opacity: 0.92,
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        borderRadius: innerRadius,
        pointerEvents: "none",
        background: `repeating-linear-gradient(45deg, ${stripe1} 0 20px, ${stripe2} 20px 40px, ${stripe3} 40px 60px)`,
        backgroundSize: "120px 120px",
        animation: "stripes-move 8s linear infinite alternate",
      }}
    />
  );
}

export type FancyCardProps = {
  width?: number;
  aspectRatio?: string;
  outerRadius?: number;
  innerRadius?: number;
  borderWidth?: number;
  bgColor?: string;
  fgColor?: string;
  outlineColor?: string;
  hoverOutlineColor?: string;
  imageSrc?: string;
  imageHeightPercent?: number;
  inscription?: string[];
  bgEffect?: 1 | 2 | 3 | 4 | 6 | 7 | 8;
  dot1Color?: string;
  dot2Color?: string;
  dot3Color?: string;
  columnsGradient?: string;
  boxColumns?: number;
  boxRows?: number;
  boxColors?: string[];
  stripe1?: string;
  stripe2?: string;
  stripe3?: string;
  rtl?: boolean;
  spiral1Color?: string;
  style?: React.CSSProperties;
  className?: string;
};
export const FancyCard: React.FC<FancyCardProps> = ({
  width = 312,
  aspectRatio = "3/4",
  outerRadius = 18,
  innerRadius = 18,
  borderWidth = 1,
  bgColor = "#f8fafc",
  fgColor = "#0f172a",
  outlineColor = "#ddd",
  hoverOutlineColor = "#aaa",
  imageSrc = "https://raw.githubusercontent.com/Northstrix/my-portfolio/refs/heads/main/public/playground-card-image.webp",
  imageHeightPercent = 76,
  inscription = ["洪", "秀", "全"],
  bgEffect = 1,
  dot1Color = "#8F04A7",
  dot2Color = "#00a9fe",
  dot3Color = "#3d3759",
  columnsGradient = "linear-gradient(90deg, #ffb347 0%, #ff7043 25%, #d97706 50%, #fbbf24 75%, #fffbe6 100%)",
  boxColumns = 8,
  boxRows = 14,
  boxColors = [
    "#ffb347",
    "#ff7043",
    "#d97706",
    "#fbbf24",
    "#fffbe6",
    "#23244a",
    "#eab308",
    "#38bdf8",
  ],
  stripe1 = "#fbbf24",
  stripe2 = "#ff7043",
  stripe3 = "#fffbe6",
  rtl = false,
  spiral1Color = "#38bdf8",
  style,
  className,
}) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!document.getElementById("fancycard-keyframes")) {
      const style = document.createElement("style");
      style.id = "fancycard-keyframes";
      style.textContent = `
@keyframes columns-move {
  0% { background-position: 0% 0; }
  100% { background-position: 100% 0; }
}
@keyframes stripes-move {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}
      `;
      document.head.appendChild(style);
    }
  }, []);

  function SpiralEffect({ variant }: { variant: 1 | 2 | 3 }) {
    return (
      <div
        style={{
          position: "absolute",
          left: -1,
          top: -1,
          width: `calc(100% + 2px)`,
          height: `calc(100% + 2px)`,
          zIndex: 0,
          borderRadius: 0,
          pointerEvents: "auto",
          background: "#18192b",
          maskImage: "radial-gradient(circle at 50% 50%, white 99%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, white 99%, transparent 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "all",
            background: "transparent",
          }}
        />
        <Canvas
          style={{
            width: "100%",
            height: "100%",
            borderRadius: innerRadius,
            pointerEvents: "none",
            background: "transparent",
            position: "relative",
            zIndex: 1,
          }}
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: true }}
          shadows
        >
          <ambientLight intensity={0.7} />
          {variant === 1 ? (
            <GrowingSpiral color={spiral1Color} />
          ) : variant === 2 ? (
            <FlowerSpiral />
          ) : (
            <ColorRush />
          )}
        </Canvas>
      </div>
    );
  }

  function Inscription({ mirrored = false }: { mirrored?: boolean }) {
    return (
      <div
        className="fancy-card-inscription"
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          top: mirrored ? undefined : 20,
          bottom: mirrored ? 20 : undefined,
          display: "flex",
          flexDirection: "column",
          zIndex: 3,
          fontWeight: "bold",
          fontSize: 24,
          letterSpacing: -2,
          userSelect: "none",
          pointerEvents: "none",
          textAlign: rtl
            ? mirrored
              ? "left"
              : "right"
            : mirrored
            ? "right"
            : "left",
          transform: mirrored ? "scaleY(-1)" : undefined,
          color: fgColor,
        }}
      >
        {inscription.map((l, idx) => (
          <div key={idx}>{l}</div>
        ))}
      </div>
    );
  }

  function CardImage() {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <img
          src={imageSrc}
          alt="Card"
          draggable={false}
          style={{
            objectFit: "contain",
            objectPosition: "center",
            width: "auto",
            height: `${imageHeightPercent}%`,
            maxWidth: "90%",
            maxHeight: "90%",
            borderRadius: 12,
            background: "none",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </div>
    );
  }

  // Which effect is threejs?
  const isThreeJsEffect = bgEffect === 6 || bgEffect === 7 || bgEffect === 8;

  return (
    <div
      tabIndex={0}
      className={className}
      style={{
        position: "relative",
        background: hovered ? hoverOutlineColor : outlineColor,
        borderRadius: outerRadius,
        padding: borderWidth,
        cursor: "pointer",
        width,
        minWidth: 120,
        maxWidth: "98vw",
        aspectRatio,
        overflow: "visible",
        transition: "background 0.4s cubic-bezier(0.4,0,0.2,1)",
        ...style,
      }}
      onMouseEnter={isThreeJsEffect ? undefined : () => setHovered(true)}
      onMouseLeave={isThreeJsEffect ? undefined : () => setHovered(false)}
    >
      <div
        style={{
          background: bgColor,
          borderRadius: innerRadius,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          color: fgColor,
          position: "relative",
          overflow: "hidden",
          padding: 0,
          boxSizing: "border-box",
          aspectRatio,
        }}
      >
        {bgEffect === 1 && (
          <BgEffect1
            innerRadius={innerRadius}
            dot1Color={dot1Color}
            dot2Color={dot2Color}
            dot3Color={dot3Color}
            hovered={hovered}
          />
        )}
        {bgEffect === 2 && (
          <BgEffect2 innerRadius={innerRadius} columnsGradient={columnsGradient} />
        )}
        {bgEffect === 3 && (
          <BgEffect3
            innerRadius={innerRadius}
            boxColumns={boxColumns}
            boxRows={boxRows}
            boxColors={boxColors}
            bgColor={bgColor}
          />
        )}
        {bgEffect === 4 && (
          <BgEffect4
            innerRadius={innerRadius}
            stripe1={stripe1}
            stripe2={stripe2}
            stripe3={stripe3}
          />
        )}
        {bgEffect === 6 && <SpiralEffect variant={1} />}
        {bgEffect === 7 && <SpiralEffect variant={2} />}
        {bgEffect === 8 && <SpiralEffect variant={3} />}
        {/* Overlay for threejs cards */}
        {isThreeJsEffect && (
          <div
            style={{
              position: "absolute",
              left: -1,
              top: -1,
              width: "calc(100% + 2px)",
              height: "calc(100% + 2px)",
              zIndex: 10,
              borderRadius: 0,
              pointerEvents: "all",
              background: "transparent",
            }}
          />
        )}
        <Inscription />
        <Inscription mirrored />
        <CardImage />
      </div>
    </div>
  );
};
