import React, { useRef, useEffect } from 'react';

// Vertex Shader: A simple passthrough for rendering a full-screen quad
const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// Fragment Shader: The core of the visual effect
const fragmentShaderSource = `
    precision highp float;

    uniform vec2 iResolution;
    uniform float iTime;

    // --- Noise Functions ---
    // A simple hash function to generate pseudo-random numbers
    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    // 2D Value Noise function
    float noise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);

        // Smooth interpolation (quintic smoothstep)
        vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);

        // Get random values at the corners of the cell
        float a = hash(i + vec2(0.0, 0.0));
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));

        // Mix the values
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // --- Fractal Brownian Motion (fBm) to create cloud-like structures ---
    float fbm(vec2 uv) {
        float value = 0.0;
        float amplitude = 0.5;
        
        // Loop through multiple "octaves" of noise
        for (int i = 0; i < 6; i++) {
            value += amplitude * noise(uv);
            uv *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    // --- Starfield Function ---
    float starfield(vec2 uv) {
        float starValue = hash(uv * 1000.0);
        return pow(starValue, 20.0) * 0.8;
    }

    void main() {
        // Normalize and center coordinates
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 original_uv = uv; // Keep a copy

        // --- Nebula Calculation ---
        // Animate the noise by moving the coordinate space over time
        vec2 motion = vec2(iTime * 0.05);

        // Create two layers of fractal noise for the nebula clouds
        float noise1 = fbm(uv * 2.0 + motion);
        float noise2 = fbm(uv * 1.5 - motion * 0.8);

        // Combine the noise layers
        float combinedNoise = noise1 + noise2;

        // --- Color Palette ---
        // Create a colorful gradient for the nebula
        vec3 color = vec3(0.0);
        color = mix(color, vec3(0.1, 0.0, 0.4), smoothstep(0.2, 0.5, combinedNoise)); // Deep purple
        color = mix(color, vec3(0.8, 0.2, 0.3), smoothstep(0.4, 0.7, combinedNoise)); // Magenta/Pink
        color = mix(color, vec3(1.0, 0.9, 0.7), smoothstep(0.6, 0.8, combinedNoise)); // Bright core

        // --- Star Calculation ---
        float stars = starfield(original_uv);
        
        // --- Final Composition ---
        // Add the stars to the final color
        vec3 finalColor = color + stars;

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

function ShaderComponent() {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');

        if (!gl) {
            console.error("WebGL not supported!");
            return;
        }

        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                return shader;
            }
            console.error(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        };
        
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const createProgram = (gl, vertexShader, fragmentShader) => {
            if (!vertexShader || !fragmentShader) return null;
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                return program;
            }
            console.error("Error linking program:", gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        };

        const program = createProgram(gl, vertexShader, fragmentShader);
        if (!program) return;

        gl.useProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const resolutionUniformLocation = gl.getUniformLocation(program, "iResolution");
        const timeUniformLocation = gl.getUniformLocation(program, "iTime");

        const render = (time) => {
            time *= 0.001; // convert to seconds

            const displayWidth = gl.canvas.clientWidth;
            const displayHeight = gl.canvas.clientHeight;

            if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
                gl.canvas.width = displayWidth;
                gl.canvas.height = displayHeight;
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            }

            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeUniformLocation, time);
            
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animationFrameId.current = requestAnimationFrame(render);
        };

        animationFrameId.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ display: 'block', width: '100vw', height: '100vh' }} />;
}

export default function App() {
    return (
        <div style={{ margin: 0, padding: 0, overflow: 'hidden', height: '100vh', backgroundColor: '#000' }}>
            <ShaderComponent />
        </div>
    );
}
