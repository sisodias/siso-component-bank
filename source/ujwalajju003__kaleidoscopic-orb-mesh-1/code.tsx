import React, { useRef, useEffect } from 'react';

// The main GLSL shader code as a string.
// This is the same shader logic from the HTML file.
const fragmentShaderSource = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform vec2 iResolution;
    uniform float iTime;

    vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d ) {
        return a + b*cos( 6.28318*(c*t+d) );
    }

    float sdCircle( vec2 p, float r ) {
        return length(p) - r;
    }

    float smin( float a, float b, float k ) {
        float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
        return mix( b, a, h ) - k*h*(1.0-h);
    }

    float map(vec2 p, float iTime) {
        vec2 pos1 = vec2(cos(iTime * 0.8) * 0.4, sin(iTime * 0.8) * 0.4);
        float circle1 = sdCircle(p - pos1, 0.2);

        vec2 pos2 = vec2(cos(iTime * -0.5) * 0.6, sin(iTime * -0.5) * 0.6);
        float circle2 = sdCircle(p - pos2, 0.15);

        float radius3 = 0.1 + sin(iTime * 2.0) * 0.05;
        float circle3 = sdCircle(p, radius3);

        float combined = smin(circle1, circle2, 0.2);
        combined = smin(combined, circle3, 0.3);

        return combined;
    }

    void main() {
        vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

        float d = map(uv, iTime);

        vec3 objColor = palette(d + 0.5, vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25));

        vec3 glow = 0.01 / abs(d) * objColor;

        vec3 col = glow;

        col = mix(col, objColor, 1.0 - smoothstep(0.0, 0.01, d));

        if (d > 0.1) {
            col = vec3(0.0);
        }

        col *= 1.0 - length(uv) * 0.5;
        gl_FragColor = vec4(col, 1.0);
    }
`;

const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// A React component to render the shader on a canvas
const ShaderCanvas = () => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error("WebGL not supported!");
            return;
        }

        // --- WebGL Helper Functions ---
        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
            console.error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
        };

        const createProgram = (gl, vertexShader, fragmentShader) => {
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
            console.error(`Error linking program: ${gl.getProgramInfoLog(program)}`);
            gl.deleteProgram(program);
        };

        // --- Shader Setup ---
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = createProgram(gl, vertexShader, fragmentShader);

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const resolutionUniformLocation = gl.getUniformLocation(program, "iResolution");
        const timeUniformLocation = gl.getUniformLocation(program, "iTime");

        // --- Buffer Setup for a full-screen quad ---
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // --- Render Loop ---
        const render = (time) => {
            time *= 0.001; // convert to seconds

            // Handle canvas resizing
            const realToCSSPixels = window.devicePixelRatio || 1;
            const displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
            const displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            // --- Drawing ---
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);
            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            // Update uniforms
            gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
            gl.uniform1f(timeUniformLocation, time);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animationFrameId.current = requestAnimationFrame(render);
        };

        // Start the animation
        animationFrameId.current = requestAnimationFrame(render);

        // --- Cleanup ---
        // This function will be called when the component unmounts
        return () => {
            cancelAnimationFrame(animationFrameId.current);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(positionBuffer);
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100vw', height: '100vh', display: 'block', backgroundColor: '#000' }}
        />
    );
};
export default ShaderCanvas;

