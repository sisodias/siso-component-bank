import React, { useState, useCallback, useRef, useEffect } from 'react';

// --- Custom Hooks ---

/**
 * A custom hook to throttle a callback function.
 * This ensures the function is not called more than once every `delay` milliseconds.
 * Useful for performance-critical event handlers like mouse move or scroll.
 * @param callback The function to throttle.
 * @param delay The throttle delay in milliseconds.
 * @returns A memoized, throttled version of the callback.
 */
const useThrottledCallback = (callback, delay) => {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  // Keep the latest callback in a ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args) => {
    if (!timeoutRef.current) {
      callbackRef.current(...args);
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
      }, delay);
    }
  }, [delay]);
};


/**
 * A custom hook to encapsulate all WebGL shader logic.
 * It handles scene setup, the animation loop, and cleanup.
 * @param canvasRef Ref to the canvas element.
 * @param params Shader parameters (hue, speed, etc.).
 */
const useShaderAnimation = (canvasRef, params) => {
    const { hue, speed, intensity, complexity } = params;
    const mousePos = useRef({ x: 0.5, y: 0.5 });
    
    // Throttled mouse move handler for performance
    const throttledMouseMove = useThrottledCallback((e) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        mousePos.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mousePos.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    }, 16); // Throttle to ~60fps

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        if (!gl) {
            console.error("WebGL not supported.");
            return;
        }

        // --- Shaders (GLSL) ---
        const vertexShaderSource = `
            attribute vec2 a_position;
            void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
        `;
        const fragmentShaderSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform float u_hue;
            uniform float u_speed;
            uniform float u_intensity;
            uniform float u_complexity;

            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }

            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
            }

            float fbm(vec2 st) {
                float value = 0.0;
                float amplitude = 0.5;
                for (int i = 0; i < 10; i++) {
                    if (float(i) >= u_complexity) break;
                    value += amplitude * noise(st);
                    st *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
                float t = u_time * u_speed * 0.1;
                float mouse_dist = distance(uv, u_mouse);
                float warp = smoothstep(0.5, 0.0, mouse_dist) * 0.5;
                vec2 p = uv * 2.0 + vec2(t, t * 0.5) + warp;
                float noise_pattern = fbm(p);
                float vignette = 1.0 - smoothstep(0.8, 1.5, length(uv));
                float saturation = 0.6 + noise_pattern * 0.4;
                float value = 0.2 + (noise_pattern * 0.8) * u_intensity * vignette;
                vec3 color = hsv2rgb(vec3(u_hue / 360.0, saturation, value));
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // --- WebGL Setup ---
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
            console.error(`Program link error: ${gl.getProgramInfoLog(program)}`);
            return;
        }
        gl.useProgram(program);
        
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        const timeLocation = gl.getUniformLocation(program, "u_time");
        const mouseLocation = gl.getUniformLocation(program, "u_mouse");
        const hueLocation = gl.getUniformLocation(program, "u_hue");
        const speedLocation = gl.getUniformLocation(program, "u_speed");
        const intensityLocation = gl.getUniformLocation(program, "u_intensity");
        const complexityLocation = gl.getUniformLocation(program, "u_complexity");

        // --- Render Loop ---
        let animationFrameId;
        const startTime = performance.now();
        const render = () => {
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            }
            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeLocation, (performance.now() - startTime) * 0.001);
            gl.uniform2f(mouseLocation, mousePos.current.x, mousePos.current.y);
            gl.uniform1f(hueLocation, hue);
            gl.uniform1f(speedLocation, speed);
            gl.uniform1f(intensityLocation, intensity);
            gl.uniform1f(complexityLocation, complexity);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        // --- Event Listeners & Cleanup ---
        window.addEventListener('mousemove', throttledMouseMove);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', throttledMouseMove);
            if (gl && !gl.isContextLost()) {
                gl.deleteProgram(program);
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
                gl.deleteBuffer(positionBuffer);
            }
        };
    }, [hue, speed, intensity, complexity, canvasRef, throttledMouseMove]);
};


// --- Components ---

// Memoized slider component to prevent re-renders when props haven't changed.
const ControlSlider = React.memo(({ label, value, onChange, min, max, step }) => (
    <div className="flex flex-col text-white">
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium select-none">{label}</label>
            <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full select-none">{value}</span>
        </div>
        <input
            type="range"
            min={min} max={max} step={step} value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
    </div>
));

// The core canvas component, now cleaner by using the useShaderAnimation hook.
const ShaderCanvas = React.memo(({ hue, speed, intensity, complexity }) => {
    const canvasRef = useRef(null);
    useShaderAnimation(canvasRef, { hue, speed, intensity, complexity });
    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
});

// Main ShaderComponent
const ShaderComponent = () => {
    const [hue, setHue] = useState(210);
    const [speed, setSpeed] = useState(0.4);
    const [intensity, setIntensity] = useState(1.2);
    const [complexity, setComplexity] = useState(5.0);

    // Memoize onChange handlers to prevent re-rendering of ControlSlider components.
    const handleHueChange = useCallback((e) => setHue(parseFloat(e.target.value)), []);
    const handleSpeedChange = useCallback((e) => setSpeed(parseFloat(e.target.value)), []);
    const handleIntensityChange = useCallback((e) => setIntensity(parseFloat(e.target.value)), []);
    const handleComplexityChange = useCallback((e) => setComplexity(parseFloat(e.target.value)), []);

    return (
        <div className="relative w-full h-screen bg-gray-900 font-sans overflow-hidden">
            <ShaderCanvas hue={hue} speed={speed} intensity={intensity} complexity={complexity} />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                <h1 className="text-5xl md:text-8xl font-bold text-white mix-blend-overlay select-none">
                    Interactive Shader
                </h1>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg p-4">
                <div className="bg-black/50 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-4 border border-white/10">
                    <ControlSlider label="Hue" value={hue} onChange={handleHueChange} min="0" max="360" step="1" />
                    <ControlSlider label="Speed" value={speed} onChange={handleSpeedChange} min="0.0" max="2.0" step="0.01" />
                    <ControlSlider label="Intensity" value={intensity} onChange={handleIntensityChange} min="0.1" max="3.0" step="0.01" />
                    <ControlSlider label="Complexity" value={complexity} onChange={handleComplexityChange} min="1.0" max="10.0" step="0.1" />
                </div>
            </div>
        </div>
    );
};

export default ShaderComponent;
