"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Utility classnames function
function cn(...args: any[]) {
  return args.filter(Boolean).join(" ");
}

// --- CanvasRevealEffect and Shader Logic ---

interface CanvasRevealEffectProps {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  replaceBackground?: boolean;
  backgroundColor?: string;
}

const CanvasRevealEffect: React.FC<CanvasRevealEffectProps> = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  replaceBackground = false,
  backgroundColor,
}) => (
  <div
    className={cn(
      "absolute inset-0 w-full h-full pointer-events-none",
      containerClassName
    )}
    style={{
      zIndex: 0,
      borderRadius: "inherit",
      overflow: "hidden",
      background: backgroundColor && !replaceBackground ? backgroundColor : undefined,
    }}
  >
    <DotMatrix
      colors={colors}
      dotSize={dotSize ?? 3}
      opacities={opacities}
      shader={`
        float animation_speed_factor = ${animationSpeed.toFixed(1)};
        float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
        opacity *= step(intro_offset, u_time * animation_speed_factor);
        opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
      `}
      center={["x", "y"]}
    />
    {showGradient && (
      <>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" style={{ pointerEvents: "none" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" style={{ pointerEvents: "none" }} />
      </>
    )}
  </div>
);

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 4,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = useMemo(() => {
    let colorsArray = [
      colors[0], colors[0], colors[0], colors[0], colors[0], colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0], colors[0], colors[0],
        colors[1], colors[1], colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0], colors[0],
        colors[1], colors[1],
        colors[2], colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
    };
  }, [colors, opacities, totalSize, dotSize]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;
        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
          return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
          return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }
        void main() {
          vec2 st = fragCoord.xy;
          ${center.includes("x") ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));" : ""}
          ${center.includes("y") ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));" : ""}
          float opacity = step(0.0, st.x);
          opacity *= step(0.0, st.y);
          vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));
          float frequency = 5.0;
          float show_offset = random(st2);
          float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
          opacity *= u_opacities[int(rand * 10.0)];
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));
          vec3 color = u_colors[int(show_offset * 6.0)];
          ${shader}
          fragColor = vec4(color, opacity);
          fragColor.rgb *= fragColor.a;
        }
      `}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

type Uniforms = {
  [key: string]: {
    value: number | number[] | number[][];
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}

const ShaderMaterialComponent: React.FC<{
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}> = ({ source, uniforms, maxFps = 60 }) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  const lastFrameTime = useRef<number>(0);

  useFrame((state: { clock: THREE.Clock }) => {
    if (!ref.current) return;
    const timestamp = state.clock.getElapsedTime();
    if (timestamp - lastFrameTime.current < 1 / maxFps) {
      return;
    }
    lastFrameTime.current = timestamp;
    const material = ref.current.material as THREE.ShaderMaterial;
    const timeLocation = material.uniforms.u_time;
    if (timeLocation) {
      timeLocation.value = timestamp;
    }
  });

  const getUniforms = () => {
    const preparedUniforms: Record<string, { value: any; type?: string }> = {};
    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];
      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value as number };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value as number[]),
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value as number[] };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: (uniform.value as number[][]).map(
              (v) => new THREE.Vector3().fromArray(v)
            ),
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value as number[]),
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }
    preparedUniforms["u_time"] = { value: 0 };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };
    return preparedUniforms;
  };

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        precision mediump float;
        in vec2 coordinates;
        uniform vec2 u_resolution;
        out vec2 fragCoord;
        void main(){
          float x = position.x;
          float y = position.y;
          gl_Position = vec4(x, y, 0.0, 1.0);
          fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
          fragCoord.y = u_resolution.y - fragCoord.y;
        }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterialComponent
        source={source}
        uniforms={uniforms}
        maxFps={maxFps}
      />
    </Canvas>
  );
};

// --- useDynamicTextLayout Hook ---

function useDynamicTextLayout(
  containerRef: React.RefObject<HTMLDivElement>,
  textArray: string[],
  minWidth: number,
  maxWidth: number,
  minTextSize: number,
  maxTextSize: number,
  manualLetterSpacing: number | undefined,
  componentId: string
) {
  const [textSize, setTextSize] = useState(maxTextSize);
  const [letterSpacing, setLetterSpacing] = useState(manualLetterSpacing ?? 0);

  useEffect(() => {
    const updateTextSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const calculatedTextSize =
          ((maxTextSize - minTextSize) / (maxWidth - minWidth)) *
            (width - minWidth) +
          minTextSize;
        const cappedTextSize = Math.min(calculatedTextSize, maxTextSize);
        setTextSize(cappedTextSize);
      }
    };
    const handleResize = () => {
      setTimeout(updateTextSize, 500);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    updateTextSize();
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [minWidth, maxWidth, minTextSize, maxTextSize, containerRef]);

  useEffect(() => {
    if (manualLetterSpacing !== undefined) {
      setLetterSpacing(manualLetterSpacing);
      return;
    }
    const textElement = containerRef.current?.querySelector(
      `#${componentId}-text`
    );
    if (!textElement) return;
    const letterHeight =
      (textElement as HTMLElement).clientHeight / textArray.length;
    setLetterSpacing(letterHeight);
  }, [textArray, textSize, manualLetterSpacing, componentId, containerRef]);

  return { textSize, letterSpacing };
}

// --- PlayingCard Component ---

export interface PlayingCardProps {
  componentWidth?: string;
  aspectRatio?: string;
  outerRounding?: string;
  innerRounding?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  imageHeightPercentage?: number;
  imageSrc: string;
  imageAlt?: string;
  outlineColor?: string;
  hoverOutlineColor?: string;
  textArray: string[];
  minWidth: number;
  maxWidth: number;
  minTextSize: number;
  maxTextSize: number;
  verticalPadding?: string;
  horizontalPadding?: string;
  manualLetterSpacing?: number;
  componentId?: string;
  onCardClicked: () => void;
  revealCanvas?: boolean;
  textColorTransitionDelay?: string;
  textColorTransitionDuration?: string;
  revealCanvasBackgroundColor?: string;
  revealCanvasColors?: number[][];
  inscriptionColor?: string; // new
  inscriptionColorHovered?: string; // new
}

const PlayingCard: React.FC<PlayingCardProps> = ({
  componentWidth = "412px",
  aspectRatio = "9/16",
  outerRounding = "24px",
  innerRounding = "16px",
  backgroundColor = "#FFF",
  foregroundColor = "#000",
  imageHeightPercentage = 70,
  imageSrc,
  imageAlt = "",
  outlineColor = "#E879F9",
  hoverOutlineColor = "#6366F1",
  textArray,
  minWidth,
  maxWidth,
  minTextSize,
  maxTextSize,
  verticalPadding = "20px",
  horizontalPadding = "20px",
  manualLetterSpacing,
  componentId = "card-1",
  onCardClicked,
  revealCanvas = false,
  textColorTransitionDelay = "1s",
  textColorTransitionDuration = "2s",
  revealCanvasBackgroundColor,
  revealCanvasColors,
  inscriptionColor, // new
  inscriptionColorHovered, // new
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Use the concise hook for text layout
  const { textSize, letterSpacing } = useDynamicTextLayout(
    containerRef,
    textArray,
    minWidth,
    maxWidth,
    minTextSize,
    maxTextSize,
    manualLetterSpacing,
    componentId
  );

  // Style for text color transition
  const textTransition = `color ${textColorTransitionDuration} ease-in-out ${textColorTransitionDelay}`;

  // Border color logic for revealCanvas
  const borderColor = revealCanvas ? "#2f2f2f" : outlineColor;
  const borderHoverColor = revealCanvas ? "#3a3a3a" : hoverOutlineColor;

  // Card background logic for revealCanvas
  const cardBg = revealCanvas ? "#000" : backgroundColor;

  // Inscription color logic (main/mirror)
  const mainInscriptionColor = isHovered
    ? inscriptionColorHovered || "#f12b30"
    : inscriptionColor || "#3662f4";

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: componentWidth,
        width: "100%",
      }}
      data-component-id={componentId}
      onClick={onCardClicked}
    >
      <div
        style={{
          borderRadius: outerRounding,
          padding: "1px",
          background: isHovered ? borderHoverColor : borderColor,
          display: "inline-block",
          width: "100%",
          aspectRatio: aspectRatio,
          transition: "background 2s ease-in-out 0.7s",
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            backgroundColor: cardBg,
            borderRadius: innerRounding,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            color: foregroundColor,
            position: "relative",
            overflow: "hidden",
            padding: 0,
          }}
        >
          {/* Reveal Canvas Effect - fills the card, always at the back */}
          {revealCanvas && (
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName=""
              colors={revealCanvasColors || [
                [236, 72, 153],
                [232, 121, 249],
              ]}
              dotSize={4}
              replaceBackground
              backgroundColor={revealCanvasBackgroundColor}
            />
          )}
          {/* Optional: mask for vignette effect */}
          {revealCanvas && (
            <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90 pointer-events-none" style={{ zIndex: 1 }} />
          )}

          {/* Main Text */}
          <div
            id={`${componentId}-text`}
            style={{
              position: "absolute",
              top: verticalPadding,
              left: horizontalPadding,
              display: "flex",
              flexDirection: "column",
              zIndex: 2,
              color: mainInscriptionColor,
              fontWeight: "bold",
              fontSize: `${textSize}px`,
              transition: textTransition,
              pointerEvents: "none",
            }}
          >
            {textArray.map((letter, index) => (
              <div
                key={`${componentId}-letter-${index}`}
                style={{
                  transform:
                    letterSpacing < 0 && index > 0
                      ? `translateY(${letterSpacing * index}px)`
                      : "none",
                  marginBottom:
                    letterSpacing >= 0 ? `${Math.abs(letterSpacing)}px` : "0",
                  letterSpacing: `${letterSpacing}px`,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          {/* Mirrored Text */}
          <div
            id={`${componentId}-mirror`}
            style={{
              position: "absolute",
              bottom: verticalPadding,
              right: horizontalPadding,
              display: "flex",
              flexDirection: "column",
              transform: "scale(-1)",
              zIndex: 2,
              color: mainInscriptionColor,
              fontWeight: "bold",
              fontSize: `${textSize}px`,
              transition: textTransition,
              pointerEvents: "none",
            }}
          >
            {textArray.map((letter, index) => (
              <div
                key={`${componentId}-mirror-letter-${index}`}
                style={{
                  transform:
                    letterSpacing < 0 && index > 0
                      ? `translateY(${letterSpacing * index}px)`
                      : "none",
                  marginBottom:
                    letterSpacing >= 0 ? `${Math.abs(letterSpacing)}px` : "0",
                  letterSpacing: `${letterSpacing}px`,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          {/* Centered Image */}
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
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                height: `${imageHeightPercentage}%`,
                aspectRatio: "1/1",
                width: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                  pointerEvents: "none",
                }}
                priority
                sizes={`${componentWidth} ${aspectRatio.replace("/", " ")}`}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayingCard;