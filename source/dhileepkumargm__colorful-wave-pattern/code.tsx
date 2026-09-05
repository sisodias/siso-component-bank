import { useRef, useEffect } from 'react';

// --- GLSL Fragment Shader ---
// This code runs on the GPU to create the visual effect.
const fragmentShaderSource = `#version 300 es
/*********
* A colorful wave pattern we created together.
* Refactored for clarity and maintainability.
* Original concept by Matthias Hurrle (@atzedent)
*/
precision highp float;

// Uniforms are global variables passed from JavaScript to the shader.
uniform float time;
uniform vec2 resolution;

// The final color output for each pixel.
out vec4 fragColor;

// --- Constants for easy tweaking ---
const float WAVE_COUNT = 3.0;
const float WAVE_AMPLITUDE = 0.2;
const float WAVE_FREQUENCY = 1.5;
const float BRIGHTNESS = 0.005;
const float COLOR_SEPARATION = 0.03;

/**
 * @name pattern
 * @description Generates the core wave effect for a single color channel.
 */
float pattern(vec2 uv) {
    float intensity = 0.0;
    for (float i = 0.0; i < WAVE_COUNT; i++) {
        uv.x += sin(time * (1.0 + i) + uv.y * WAVE_FREQUENCY) * WAVE_AMPLITUDE;
        intensity += BRIGHTNESS / abs(uv.x);
    }
    return intensity;
}

/**
 * @name scene
 * @description Composes the final color by layering three wave patterns.
 */
vec3 scene(vec2 uv) {
    vec3 color = vec3(0.0);
    vec2 rotated_uv = vec2(uv.y, uv.x); // Rotate coordinates for horizontal waves.

    for (float i = 0.0; i < WAVE_COUNT; i++) {
        int colorChannel = int(mod(i, 3.0));
        vec2 channel_uv = rotated_uv + vec2(0.0, i * COLOR_SEPARATION);
        color[colorChannel] += pattern(channel_uv);
    }
    return color;
}

void main() {
    // Normalize coordinates.
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
    vec3 color = scene(uv);
    fragColor = vec4(color, 1.0);
}
`;

// --- WebGL Renderer Class ---
// Encapsulates all the WebGL setup and rendering logic.
class Renderer {
    #vertexSrc = "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}";
    #vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2");
    }

    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error("Shader compilation error:", this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    init() {
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, this.#vertexSrc);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        if (!vertexShader || !fragmentShader) return false;

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error("Program linking error:", this.gl.getProgramInfoLog(this.program));
            return false;
        }

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.#vertices), this.gl.STATIC_DRAW);
        
        const position = this.gl.getAttribLocation(this.program, "position");
        this.gl.enableVertexAttribArray(position);
        this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);

        this.uniforms = {
            resolution: this.gl.getUniformLocation(this.program, "resolution"),
            time: this.gl.getUniformLocation(this.program, "time"),
        };
        
        return true;
    }

    render(time = 0) {
        if (!this.program) return;
        
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        this.gl.useProgram(this.program);
        
        this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.uniforms.time, time * 1e-3);
        
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}

// --- React Component ---
// This component manages the canvas and the animation loop.
const WavesComponent = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const renderer = new Renderer(canvas);
        let animationFrameId;

        const handleResize = () => {
            const dpr = Math.max(1, window.devicePixelRatio);
            const { innerWidth: width, innerHeight: height } = window;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            renderer.gl.viewport(0, 0, canvas.width, canvas.height);
        };

        if (renderer.init()) {
            handleResize();
            window.addEventListener('resize', handleResize);

            const animate = (time) => {
                renderer.render(time);
                animationFrameId = requestAnimationFrame(animate);
            };
            animate(0);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default WavesComponent;