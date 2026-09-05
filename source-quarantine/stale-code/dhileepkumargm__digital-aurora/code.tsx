import React, { useRef, useEffect } from 'react';

// ===================== HERO COMPONENT =====================
const AuroraHero = ({
  title,
  description,
  badgeText,
  badgeLabel,
  ctaButtons = [],
  microDetails = []
}) => {
  return (
    <section className="relative h-screen w-screen overflow-hidden">
      <ShaderBackground />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 pb-24 pt-36 sm:gap-8 sm:pt-44 md:px-10 lg:px-16">
        {badgeText && badgeLabel && (
           <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
             <span className="text-[10px] font-light uppercase tracking-[0.08em] text-white/70">{badgeLabel}</span>
             <span className="h-1 w-1 rounded-full bg-white/40" />
             <span className="text-xs font-light tracking-tight text-white/80">{badgeText}</span>
           </div>
        )}

        <h1 className="max-w-2xl text-left text-5xl font-extralight leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
          {title}
        </h1>

        <p className="max-w-xl text-left text-base font-light leading-relaxed tracking-tight text-white/75 sm:text-lg">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {ctaButtons.map((button, index) => (
            <a
              key={index}
              href={button.href}
              className={`rounded-2xl border border-white/10 px-5 py-3 text-sm font-light tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 duration-300 ${
                button.primary
                  ? "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              {button.text}
            </a>
          ))}
        </div>

        <ul className="mt-8 flex flex-wrap gap-6 text-xs font-extralight tracking-tight text-white/60">
          {microDetails.map((detail, index) => (
             <li key={index} className="flex items-center gap-2">
               <span className="h-1 w-1 rounded-full bg-white/40" /> {detail}
             </li>
          ))}
        </ul>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
    </section>
  );
};

// ===================== SHADER BACKGROUND =====================
const ShaderBackground = () => {
    const shaderProps = {
        flowSpeed: 0.4,
        colorIntensity: 1.2,
        noiseLayers: 4.0,
        mouseInfluence: 0.3,
    };

    return (
        <div className="bg-black absolute inset-0 -z-10 w-full h-full" aria-hidden>
            <InteractiveShader {...shaderProps} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
        </div>
    );
};

// ===================== SHADER COMPONENT =====================
const InteractiveShader = ({
  flowSpeed = 0.4,
  colorIntensity = 1.2,
  noiseLayers = 4.0,
  mouseInfluence = 0.3,
}) => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL is not supported in this browser.");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform float uFlowSpeed;
      uniform float uColorIntensity;
      uniform float uNoiseLayers;
      uniform float uMouseInfluence;

      #define MARCH_STEPS 32

      mat2 rot(float a) {
          float s=sin(a), c=cos(a);
          return mat2(c, -s, s, c);
      }

      float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p+45.32);
          return fract(p.x*p.y);
      }

      float fbm(vec3 p) {
          float f = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 8; i++) {
              if (float(i) >= uNoiseLayers) break;
              f += amp * hash(p.xy);
              p *= 2.0;
              amp *= 0.5;
          }
          return f;
      }

      float map(vec3 p) {
          vec3 q = p;
          q.z += iTime * uFlowSpeed;
          vec2 mouse = (iMouse.xy / iResolution.xy - 0.5) * 2.0;
          q.xy += mouse * uMouseInfluence;
          float f = fbm(q * 2.0);
          f *= sin(p.y * 2.0 + iTime) * 0.5 + 0.5;
          return clamp(f, 0.0, 1.0);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec3 ro = vec3(0, -1, 0);
        vec3 rd = normalize(vec3(uv, 1.0));
        vec3 col = vec3(0);
        float t = 0.0;
        
        for (int i=0; i<MARCH_STEPS; i++) {
            vec3 p = ro + rd * t;
            float density = map(p);
            if (density > 0.0) {
                vec3 auroraColor = 0.5 + 0.5 * cos(iTime * 0.5 + p.y * 2.0 + vec3(0,2,4));
                col += auroraColor * density * 0.1 * uColorIntensity;
            }
            t += 0.1;
        }
        
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Shader compile error: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program linking error: ${gl.getProgramInfoLog(program)}`);
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uFlowSpeedLocation = gl.getUniformLocation(program, "uFlowSpeed");
    const uColorIntensityLocation = gl.getUniformLocation(program, "uColorIntensity");
    const uNoiseLayersLocation = gl.getUniformLocation(program, "uNoiseLayers");
    const uMouseInfluenceLocation = gl.getUniformLocation(program, "uMouseInfluence");

    const startTime = performance.now();
    let animationFrameId;

    const handleMouseMove = (e) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mousePos.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height
        };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(iResolutionLocation, gl.canvas.width, gl.canvas.height);
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const renderLoop = () => {
      if (!gl || gl.isContextLost()) return;
      
      const currentTime = performance.now();
      gl.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0);
      
      gl.uniform2f(iMouseLocation, mousePos.current.x * canvas.width, (1.0 - mousePos.current.y) * canvas.height);
      gl.uniform1f(uFlowSpeedLocation, flowSpeed);
      gl.uniform1f(uColorIntensityLocation, colorIntensity);
      gl.uniform1f(uNoiseLayersLocation, noiseLayers);
      gl.uniform1f(uMouseInfluenceLocation, mouseInfluence);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (gl && !gl.isContextLost()) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(vertexBuffer);
      }
    };
  }, [flowSpeed, colorIntensity, noiseLayers, mouseInfluence]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default AuroraHero;
