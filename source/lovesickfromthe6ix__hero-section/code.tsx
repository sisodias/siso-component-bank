import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Play } from 'lucide-react';

// Hook: prefers-reduced-motion
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(media.matches);
    setReduced(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

// Utility: clamp DPR to keep GPU/CPU in check
const getClampedDpr = () => {
  if (typeof window === 'undefined') return 1;
  const raw = window.devicePixelRatio || 1;
  return Math.max(1, Math.min(1.75, raw)); // balance fidelity vs perf
}

// WebGL Shader Background Component
const WebGLBackground: React.FC<{ className?: string; enabled?: boolean }> = ({
  className,
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    // SSR guard + feature gate
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const gl = canvas.getContext('webgl2', { antialias: false, powerPreference: 'high-performance' });
    if (!gl) {
      // Graceful fallback: no WebGL2 available
      return;
    }

    const vertexShaderSource = `#version 300 es
      precision highp float;
      in vec4 position;
      void main() { gl_Position = position; }
    `;

    const fragmentShaderSource = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 resolution;
      uniform float time;

      float noise(vec2 p) {
        p = fract(p * vec2(12.9898, 78.233));
        p += dot(p, p + 34.56);
        return fract(p.x * p.y);
      }
      float fbm(vec2 p) {
        float t = 0.0, a = 1.0;
        mat2 m = mat2(1.0, -0.5, 0.2, 1.2);
        for (int i = 0; i < 5; i++) {
          t += a * noise(p);
          p *= 2.0 * m;
          a *= 0.5;
        }
        return t;
      }
      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
        vec3 col = vec3(0.0);
        float bg = fbm(vec2(uv.x + time * 0.3, -uv.y));
        uv *= 1.0 - 0.3 * ((sin(time * 0.2) * 0.5 + 0.5) * 0.8);

        for (float i = 1.0; i < 12.0; i++) {
          uv += 0.1 * cos(i * vec2(0.1 + 0.01 * i, 0.8) + i * i + time * 0.5 + 0.1 * uv.x);
          vec2 p = uv;
          float d = length(p);
          col += 0.00125 / max(d, 0.0001) * (cos(sin(i) * vec3(1.0, 2.0, 3.0)) + 1.0);
          float b = noise(i + p + bg * 1.731);
          col += 0.002 * b / max(length(max(p, vec2(b * p.x * 0.02, p.y))), 0.0001);
          col = mix(col, vec3(bg * 0.25, bg * 0.137, bg * 0.05), d);
        }
        fragColor = vec4(col, 1.0);
      }
    `;

    // Compile/link helpers with diagnostics
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    // Fullscreen quad
    const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const timeLocation = gl.getUniformLocation(program, 'time');

    // Resize handling via ResizeObserver (based on CSS box) + DPR
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = getClampedDpr();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Intersection + visibility: only render when visible
    let inView = true;
    let hidden = document.hidden;

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        updateRunState();
      },
      { root: null, threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      hidden = document.hidden;
      updateRunState();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // WebGL context loss/restore
    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    const onContextRestored = () => {
      // In a production app, you’d recreate all resources. Here we reload.
      window.location.reload();
    };
    canvas.addEventListener('webglcontextlost', onContextLost as EventListener, { passive: false });
    canvas.addEventListener('webglcontextrestored', onContextRestored as EventListener);

    // Render loop
    const start = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    const stop = () => {
      runningRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
    const updateRunState = () => {
      if (enabled && inView && !hidden) start();
      else stop();
    };

    const loop = (timeMs: number) => {
      if (!runningRef.current) return;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, timeMs * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    resize();
    updateRunState();

    // Cleanup
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost as EventListener);
      canvas.removeEventListener('webglcontextrestored', onContextRestored as EventListener);
      // GL resource cleanup
      try {
        gl.disableVertexAttribArray(position);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        if (buffer) gl.deleteBuffer(buffer);
        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteProgram(program);
      } catch {
        // ignore cleanup errors
      }
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className={['absolute inset-0 w-full h-full', className].filter(Boolean).join(' ')}
      style={{ background: 'black', display: enabled ? 'block' : 'none' }}
    />
  );
};

// Main Hero Component
interface HeroSectionProps {
  headline?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  headline = 'Im A Headline',
  description = 'I describe the headline',
  primaryButtonText = 'Do This',
  secondaryButtonText = 'Learn This',
  onPrimaryClick = () => console.log('Primary button clicked'),
  onSecondaryClick = () => console.log('Secondary button clicked'),
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  // Split headline once (avoid doing it in render repeatedly)
  const [firstLine, secondLine] = useMemo(() => {
    const parts = headline.split(' ');
    const first = parts.slice(0, 2).join(' ');
    const second = parts.slice(2).join(' ');
    return [first, second];
  }, [headline]);

  // GSAP animations (dynamic import + cleanup + reduced motion)
  useEffect(() => {
    let gsap: any;
    let tl: any;
    let floatTween: any;

    if (prefersReducedMotion) return;

    const load = async () => {
      const mod = await import('gsap');
      gsap = mod.gsap || mod.default || mod;
      if (!heroRef.current || !headlineRef.current || !descriptionRef.current || !buttonsRef.current) return;

      tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: -10, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out' }
      )
        .fromTo(
          descriptionRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(
          Array.from(buttonsRef.current.children),
          { opacity: 0, y: 24, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.08 },
          '-=0.35'
        );

      floatTween = gsap.to(headlineRef.current, {
        y: -10,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    };

    load();

    return () => {
      try {
        floatTween?.kill?.();
        tl?.kill?.();
      } catch {
        // ignore
      }
    };
  }, [prefersReducedMotion]);

  // Enable WebGL background only if motion allowed
  const webglEnabled = !prefersReducedMotion;

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen overflow-hidden bg-background text-center"
      aria-label="Hero section"
    >
      {/* WebGL Background + gradient overlay */}
      <div className="absolute inset-0 z-0">
        <WebGLBackground enabled={webglEnabled} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-6xl space-y-8">
          <h1
            ref={headlineRef}
            className="text-4xl font-bold leading-tight sm:text-6xl lg:text-8xl"
          >
            <span className="bg-gradient-to-r from-orange-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
              {firstLine}
            </span>
            {secondLine && (
              <>
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  {secondLine}
                </span>
              </>
            )}
          </h1>

          <p
            ref={descriptionRef}
            className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-orange-100/90 sm:text-xl lg:text-2xl"
          >
            {description}
          </p>

          <div
            ref={buttonsRef}
            className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            {/* Primary CTA */}
            <button
              type="button"
              onClick={onPrimaryClick}
              className="group relative inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold text-black transition-all duration-300 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 overflow-hidden will-change-transform"
              aria-label={primaryButtonText}
            >
              <span className="relative z-10">{primaryButtonText}</span>

              {/* Soft color lift on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-yellow-400/30"
              />

              {/* Optional sheen sweep */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/25 blur-md opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              />
            </button>

            {/* Secondary CTA */}
            <button
              type="button"
              onClick={onSecondaryClick}
              className="group relative flex items-center gap-3 rounded-full border border-orange-300/30 bg-orange-500/10 px-8 py-4 text-lg font-semibold text-orange-100 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-orange-300/50 hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60 overflow-hidden"
              aria-label={secondaryButtonText}
            >
              <Play className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              <span className="relative z-10">{secondaryButtonText}</span>

              {/* Subtle hover wash */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Ambient light effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
        <div className="absolute top-20 left-20 h-80 w-80 rounded-full bg-orange-600/10 blur-3xl motion-safe:animate-pulse" />
        <div
          className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-yellow-600/10 blur-3xl motion-safe:animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute left-1/2 top-1/2 h-[120vh] w-[120vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.05)_0%,transparent_60%)]" />
      </div>
    </section>
  );
};

export default HeroSection;