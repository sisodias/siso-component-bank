import React, { useRef, useEffect } from 'react';

// --- Custom Hook for Raw WebGL Management ---
// This hook encapsulates all the WebGL setup, state management, and the animation loop.
// By isolating the WebGL logic, we make our components cleaner and more focused.
const useWebGLShader = (canvasRef, fragmentShader, props) => {
  // useRef is used to store WebGL-related objects that persist across re-renders without causing them.
  const webglState = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  // This useEffect handles the one-time setup of the WebGL context, shaders, and program.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize the WebGL context. 'antialias: true' smooths the edges of the 3D object.
    const gl = canvas.getContext('webgl', { antialias: true });
    if (!gl) {
      console.error("WebGL is not supported in this browser.");
      return;
    }

    // The vertex shader is simple; it just positions the vertices of our full-screen quad.
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // A helper function to compile a shader and check for errors.
    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragShader = compileShader(fragmentShader, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragShader) return;

    // Link the vertex and fragment shaders into a WebGL program.
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Create a buffer to hold the vertices for a quad that fills the canvas.
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Get the memory locations of the shader's uniform variables for later access.
    const uniformLocations = {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iMouse: gl.getUniformLocation(program, 'iMouse'),
      uHue: gl.getUniformLocation(program, 'uHue'),
      uComplexity: gl.getUniformLocation(program, 'uComplexity'),
      uSpeed: gl.getUniformLocation(program, 'uSpeed'),
    };

    // Store all the WebGL state in our ref for access in other effects.
    webglState.current = { gl, program, uniformLocations, vertexBuffer };

    // Cleanup function to free WebGL resources when the component unmounts.
    return () => {
      if (gl && !gl.isContextLost()) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragShader);
        gl.deleteBuffer(vertexBuffer);
      }
    };
  }, [canvasRef, fragmentShader]); // This effect runs only when the canvas or shader code changes.
  
  // This useEffect handles the mouse movement listener.
  useEffect(() => {
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mousePos.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: 1.0 - (e.clientY - rect.top) / rect.height, // Y is inverted in WebGL.
        };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [canvasRef]);


  // This useEffect handles the animation loop and resizing.
  useEffect(() => {
    if (!webglState.current) return;
    
    const { gl, uniformLocations } = webglState.current;
    const startTime = performance.now();
    let animationFrameId;

    // Handles window resizing to keep the canvas and shader resolution in sync.
    const handleResize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniformLocations.iResolution, canvas.width, canvas.height);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial resize.

    // The main animation loop.
    const animate = () => {
      const time = ((performance.now() - startTime) / 1000.0);
      
      // Update all shader uniforms with the latest values from props and state.
      gl.uniform1f(uniformLocations.iTime, time);
      gl.uniform2f(uniformLocations.iMouse, mousePos.current.x, mousePos.current.y);
      gl.uniform1f(uniformLocations.uHue, props.hue);
      gl.uniform1f(uniformLocations.uComplexity, props.complexity);
      gl.uniform1f(uniformLocations.uSpeed, props.speed);

      // Draw the quad.
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup for the animation loop and resize listener.
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [webglState, canvasRef, props]); // This effect re-runs if props change, updating the animation behavior.
};

// --- Shader Background Component ---
// This component is responsible for the canvas element and passing props to the WebGL hook.
const ShaderBackground = (props) => {
  const canvasRef = useRef(null);

  const fragmentShader = `
    precision highp float;
    // Uniforms are variables passed from JS to the shader.
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec2 iMouse;
    uniform float uHue;
    uniform float uComplexity;
    uniform float uSpeed;

    // --- UTILITY FUNCTIONS ---
    // Converts HSV (Hue, Saturation, Value) to RGB color space.
    vec3 hsv2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      return c.z * mix(vec3(1.0), rgb, c.y);
    }
    
    // Creates a 2x2 rotation matrix.
    mat2 rotate2d(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    }
    
    // Creates a 3x3 rotation matrix around an arbitrary axis.
    mat3 rotationMatrix(vec3 axis, float angle) {
        axis = normalize(axis);
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
    }

    // Simplex noise for generating organic, flowing patterns.
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    // --- SCENE DEFINITION (SDF) ---
    // A Signed Distance Function defines the 3D scene. It returns the shortest distance to any object from a given point.
    float map(vec3 p) {
        float time = iTime * uSpeed;
        
        // Twist the coordinate space to create the vortex shape.
        float twist = 5.0 * p.y;
        p.xz = rotate2d(twist) * p.xz;
        
        // Add noise to the surface for a more complex, liquid-like appearance.
        float displacement = snoise(p.xy * 3.0 + time) * 0.1 * uComplexity;
        
        // The base shape is a cylinder (defined by the length of the xz components).
        float cyl = length(p.xz) - 0.5 + displacement;
        
        return cyl;
    }

    // --- RAYMARCHING ---
    // This function simulates a camera ray, "marching" it through the scene to find intersections with objects.
    float rayMarch(vec3 ro, vec3 rd) {
        float d = 0.0; // Total distance traveled by the ray.
        for(int i = 0; i < 100; i++) {
            vec3 p = ro + rd * d; // Current point along the ray.
            float ds = map(p); // Distance from the current point to the nearest surface.
            d += ds; // "March" the ray forward by that distance.
            // If the ray is far away or very close to a surface, stop marching.
            if(d > 100.0 || abs(ds) < 0.001) break;
        }
        return d;
    }
    
    // Calculates the normal vector of a surface point, which is crucial for lighting.
    vec3 getNormal(vec3 p) {
        vec2 e = vec2(0.001, 0.0);
        return normalize(vec3(
            map(p + e.xyy) - map(p - e.xyy),
            map(p + e.yxy) - map(p - e.yxy),
            map(p + e.yyx) - map(p - e.yyx)
        ));
    }

    // --- MAIN SHADER LOGIC ---
    // This function runs for every pixel on the canvas.
    void main() {
      // Normalize pixel coordinates to a -1 to 1 range.
      vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
      vec2 mouse = (iMouse - 0.5);

      // --- Camera Setup ---
      vec3 ro = vec3(0.0, 0.0, -3.0); // Ray Origin (camera position).
      vec3 rd = normalize(vec3(uv, 1.0)); // Ray Direction (from camera through the pixel).
      
      // Rotate the camera based on mouse position for interactivity.
      mat3 rot = rotationMatrix(normalize(vec3(mouse.y, mouse.x, 0.0)), length(mouse) * 2.0);
      ro = rot * ro;
      rd = rot * rd;

      // --- Rendering ---
      // Find the distance to the nearest object.
      float d = rayMarch(ro, rd);
      vec3 col = vec3(0.0); // Start with a black color.

      // If we hit an object...
      if (d < 100.0) {
        vec3 p = ro + rd * d; // Calculate the intersection point.
        vec3 normal = getNormal(p); // Calculate the surface normal at that point.
        
        // --- Lighting & Material ---
        vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));
        float diffuse = max(dot(normal, lightDir), 0.0); // Basic diffuse lighting.
        
        // Fresnel effect simulates reflections on surfaces viewed at a grazing angle, key for a metallic look.
        float fresnel = pow(1.0 - max(dot(normal, -rd), 0.0), 3.0);
        
        // --- Coloring ---
        vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.5, 0.8));
        vec3 reflectionColor = vec3(1.0);
        
        // Combine the base color, lighting, and reflections.
        col = baseColor * diffuse + reflectionColor * fresnel;
        
        // Add fog for depth.
        col = mix(col, vec3(0.0), 1.0 - exp(-0.1 * d));
      }
      
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  useWebGLShader(canvasRef, fragmentShader, props);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 w-full h-full" />;
};


// --- Hero Component ---
// This component lays out the text content over the shader background.
export const Hero = ({ title, description, ctaButtons, shaderProps }) => {
    // Destructure hue from the shaderProps to use for dynamic styling.
    const { hue } = shaderProps;

    // Create dynamic styles for the text based on the current hue.
    const titleStyle = { 
        color: `hsl(${hue}, 90%, 75%)`,
        textShadow: `0 0 15px hsla(${hue}, 90%, 50%, 0.7)` // Added a subtle glow effect.
    };
    const descriptionStyle = { 
        color: `hsl(${hue}, 80%, 85%)` 
    };

    return (
        <section className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
            <ShaderBackground {...shaderProps} />
            <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
                <h1 
                    className="text-5xl font-extrabold leading-tight tracking-tighter mb-4 md:text-7xl transition-colors duration-500 ease-in-out"
                    style={titleStyle}
                >
                    {title}
                </h1>
                <p 
                    className="max-w-2xl text-lg font-light text-white/80 mb-8 transition-colors duration-500 ease-in-out"
                    style={descriptionStyle}
                >
                    {description}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {ctaButtons.map((button, index) => (
                        <a
                            key={index}
                            href={button.href}
                            className={`rounded-full border px-8 py-3 text-sm font-medium tracking-wide transition-colors duration-300 ${
                                button.primary
                                    ? "bg-white text-black border-white hover:bg-transparent hover:text-white"
                                    : "border-white/50 text-white/90 hover:bg-white/10 hover:border-white"
                            }`}
                        >
                            {button.text}
                        </a>
                    ))}
                </div>
            </div>
             <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </section>
    );
};
