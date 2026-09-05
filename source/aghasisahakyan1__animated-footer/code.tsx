"use client";

import Link from "next/link";
import { FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef, useState, MouseEvent, useCallback, useEffect } from "react";
import * as THREE from "three";
import { useMotionValue, motion, useMotionTemplate, animate, useTransform } from "framer-motion";

interface ShinyTextProps {
  text?: string;
  isShining?: boolean;
  speed?: number;
  className?: string;
  children?: React.ReactNode;
}

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

interface FooterProps {
  heading?: {
    line1?: string;
    line2?: string;
    line3?: string;
  };
  socialLinks?: SocialLink[];
  links?: FooterLink[];
  companyDescription?: string;
  copyright?: {
    companyName?: string;
    year?: number;
    additionalText?: string;
  };
}

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 4,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
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
            return min2 + (value - min1) * (max2 - min1) / (max1 - min1);
        }
        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
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
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

const ShinyText = ({
  text,
  children,
  isShining = false,
  speed = 1,
  className = ''
}: ShinyTextProps) => {
  const content = children || text;

  return (
    <div
      className={cn("text-inherit bg-clip-text inline-block transition-opacity", className)}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundPosition: isShining ? '-100%' : '110%',
        transition: isShining ? `background-position ${speed}s linear` : 'none',
      }}
    >
      {content}
    </div>
  );
};

const DecryptText = ({
  text,
  className,
  isDecrypting = false,
  duration = 0.1
}: {
  text: string;
  className?: string;
  isDecrypting?: boolean;
  duration?: number;
}) => {
  const [displayText, setDisplayText] = useState(text);
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?/";

  useEffect(() => {
    if (!isDecrypting) {
      setDisplayText(text);
      return;
    }

    let interval: NodeJS.Timeout | undefined;
    let iteration = 0;

    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      setDisplayText(prev =>
        prev.split("").map((char, index) => {
          if (char === " ") return " ";

          if (index < iteration) return text[index];

          return characters[Math.floor(Math.random() * characters.length)];
        }).join("")
      );

      iteration += 1 / 3;

      if (iteration >= text.length) {
        if (interval) {
          clearInterval(interval);
        }
        setDisplayText(text);
      }
    }, duration * 1000 / text.length);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDecrypting, text, duration]);

  return <span className={className}>{displayText}</span>;
};

const AnimatedLink = ({
  href,
  children,
  className
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const textContent = typeof children === 'string' ? children : '';

  return (
    <motion.div
      className="relative overflow-hidden"
      whileHover="hover"
      initial="initial"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 bg-white/10 z-0"
        variants={{
          initial: { x: "-100%" },
          hover: { x: 0 }
        }}
        transition={{ duration: 0.3 }}
      />
      <Link
        href={href}
        className={cn("z-10 relative h-full", className)}
      >
        {typeof children === 'string' ? (
          <ShinyText isShining={isHovered} speed={1}>
            <DecryptText text={textContent} isDecrypting={isHovered} />
          </ShinyText>
        ) : children}
      </Link>
    </motion.div>
  );
};

const AnimatedIconLink = ({
  href,
  icon,
  ariaLabel,
  className
}: {
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      whileHover="hover"
      initial="initial"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 bg-white/10 z-0"
        variants={{
          initial: { x: "-100%" },
          hover: { x: 0 }
        }}
        transition={{ duration: 0.3 }}
      />
      <Link
        href={href}
        aria-label={ariaLabel}
        className="text-white hover:text-white/70 transition-colors z-10 relative"
      >
        {icon}
      </Link>
    </motion.div>
  );
};

const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);
  const [lastMousePosition, setLastMousePosition] = useState<[number, number]>([0, 0]);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverIntensity, setHoverIntensity] = useState(0);

  useEffect(() => {
    let animationControls: { stop: () => void } | null = null;

    if (isHovering) {
      const start = hoverIntensity;
      const target = 1;
      const duration = 0.5;

      let startTime = performance.now();

      const updateFrame = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const newValue = start + (target - start) * progress;

        setHoverIntensity(newValue);

        if (progress < 1) {
          requestId = requestAnimationFrame(updateFrame);
        }
      };

      let requestId = requestAnimationFrame(updateFrame);

      animationControls = {
        stop: () => {
          if (requestId) {
            cancelAnimationFrame(requestId);
          }
        }
      };
    } else {
      setLastMousePosition(mousePosition);

      const start = hoverIntensity;
      const target = 0;
      const duration = 0.5;

      let startTime = performance.now();

      const updateFrame = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const newValue = start + (target - start) * progress;

        setHoverIntensity(newValue);

        if (progress < 1) {
          requestId = requestAnimationFrame(updateFrame);
        }
      };

      let requestId = requestAnimationFrame(updateFrame);

      animationControls = {
        stop: () => {
          if (requestId) {
            cancelAnimationFrame(requestId);
          }
        }
      };
    }

    return () => {
      if (animationControls) {
        animationControls.stop();
      }
    };
  }, [isHovering, mousePosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition([x, y]);
    if (!isHovering) {
      setLastMousePosition([x, y]);
    }
  }, [isHovering]);

  const hoverIntensityValue = hoverIntensity.toFixed(4);
  const currentMousePosition = isHovering ? mousePosition : lastMousePosition;

  return (
    <div
      className={cn("h-full relative bg-white w-full", containerClassName)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
              float animation_speed_factor = ${animationSpeed.toFixed(1)};
              float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
              opacity *= step(intro_offset, u_time * animation_speed_factor);
              opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);

              float hoverFactor = ${hoverIntensityValue};

              vec2 mousePos = vec2(${currentMousePosition[0].toFixed(4)}, ${currentMousePosition[1].toFixed(4)}) * u_resolution / u_total_size;
              float distToMouse = distance(st2, mousePos);

              float hoverRadius = 150.0;
              if (distToMouse < hoverRadius) {
                float colorFactor = smoothstep(hoverRadius, 0.0, distToMouse) * hoverFactor;

                vec3 hoverColor = u_colors[int(mod(random(st2) * 10.0, 6.0))];

                hoverColor = clamp(hoverColor * 1.5, vec3(0.0), vec3(1.0));

                color = mix(color, hoverColor, colorFactor * 0.9);
                opacity = mix(opacity, min(opacity * 1.5, 1.0), colorFactor * 0.7);
              }
            `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />
      )}
    </div>
  );
};

const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  hovered?: boolean;
  maxFps?: number;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    if (timestamp - lastFrameTime < 1 / maxFps) {
      return;
    }
    lastFrameTime = timestamp;

    const material: any = ref.current.material;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};

    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) =>
              new THREE.Vector3().fromArray(v)
            ),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };
    return preparedUniforms;
  };

  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
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

    return materialObject;
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0  h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};


export function Footer({
  heading = {
    line1: "Footer",
    line2: "Component",
    line3: "With cool animations"
  },
  socialLinks = [
    {
      href: "https://github.com",
      icon: <FaLinkedinIn size={24} />,
      ariaLabel: "Social Link 1"
    },
    {
      href: "https://youtube.com",
      icon: <FaYoutube size={24} />,
      ariaLabel: "Social Link 2"
    }
  ],
  links = [
    { label: "Link 1", href: "/link1" },
    { label: "Link 2", href: "/link2" },
    { label: "Link 3", href: "/link3" },
    { label: "Link 4", href: "/link4" },
    { label: "Link 5", href: "/link5" }
  ],
  companyDescription = "Your company description goes here. Describe your products or services in a way that engages your visitors. This area can include multiple sentences about your company's mission, vision, and values.",
  copyright = {
    companyName: "Company Name",
    year: new Date().getFullYear(),
    additionalText: "Optional additional text"
  }
}: FooterProps) {
  return (
   <footer className="w-full bg-black text-white fixed bottom-0 left-0 right-0 z-50">
      <div className="w-full py-8 min-[1250px]:py-16">
        <div className="text-center mb-8 min-[1250px]:mb-16">
          <h2 className="text-4xl min-[1250px]:text-7xl font-light leading-tight">
            {heading.line1}<br />
            {heading.line2}<br />
            {heading.line3}
          </h2>
        </div>

        <div className="grid grid-cols-1 min-[1250px]:grid-cols-12 min-[1250px]:grid-rows-2 border-t border-b border-white/20">

          <div className="flex min-[1250px]:hidden border-b border-white/20">
            {socialLinks.slice(0, 2).map((link, i) => (
              <AnimatedIconLink
                key={link.ariaLabel}
                href={link.href}
                icon={link.icon}
                ariaLabel={link.ariaLabel}
                className={cn(
                  "flex-1 py-6 flex items-center justify-center",
                  i < socialLinks.length - 1 ? "border-r border-white/20" : ""
                )}
              />
            ))}
          </div>

          {socialLinks.slice(0, 2).map((link, i) => (
            <AnimatedIconLink
              key={link.ariaLabel}
              href={link.href}
              icon={link.icon}
              ariaLabel={link.ariaLabel}
              className="hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 border-r border-b border-white/20 py-8 items-center justify-center"
            />
          ))}

          <div className="h-40 min-[1250px]:h-auto min-[1250px]:col-span-8 min-[1250px]:row-span-1 border-b border-white/20 min-[1250px]:border-r relative">
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent absolute inset-0 pointer-events-none"
              colors={[
                [59, 130, 246],
                [139, 92, 246],
              ]}
              dotSize={3}
            />
          </div>

          <div className="grid grid-cols-2 min-[1250px]:hidden border-b border-white/20">
            {links.slice(0, 4).map((link, i) => (
              <AnimatedLink
                key={link.label}
                href={link.href}
                className={cn(
                  "py-6 flex items-center justify-center text-sm text-white hover:text-white/70 transition-colors w-full",
                  i % 2 === 0 ? "border-r border-white/20" : "",
                  i < 2 ? "border-b border-white/20" : ""
                )}
              >
                {link.label}
              </AnimatedLink>
            ))}
          </div>

          {links.slice(0, 2).map((link, i) => (
            <AnimatedLink
              key={link.label}
              href={link.href}
              className={cn(
                "hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 border-b border-white/20 py-8 items-center justify-center text-sm text-white hover:text-white/70 transition-colors w-full",
                i === 0 ? "border-r border-white/20" : ""
              )}
            >
              {link.label}
            </AnimatedLink>
          ))}

          <div className="px-4 py-6 min-[1250px]:py-8 min-[1250px]:col-span-9 min-[1250px]:row-span-1 border-b min-[1250px]:border-b-0 min-[1250px]:border-r border-white/20 text-xs text-white/70 leading-relaxed">
            <p>{companyDescription}</p>
          </div>

          {links.slice(2, 5).map((link, i) => (
            <AnimatedLink
              key={link.label}
              href={link.href}
              className={cn(
                "hidden min-[1250px]:flex min-[1250px]:col-span-1 min-[1250px]:row-span-1 py-8 items-center justify-center text-sm text-white hover:text-white/70 transition-colors w-full",
                i < 2 ? "border-r border-white/20" : ""
              )}
            >
              {link.label}
            </AnimatedLink>
          ))}
        </div>

        <div className="py-6 min-[1250px]:py-8 text-center text-xs text-white/50">
          <p>{copyright.companyName} ©{copyright.year} All rights reserved</p>
          {copyright.additionalText && <p className="mt-2">{copyright.additionalText}</p>}
        </div>
      </div>
    </footer>
  );
}