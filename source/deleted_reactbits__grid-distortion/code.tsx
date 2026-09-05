import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface GridDistortionProps extends React.HTMLAttributes<HTMLDivElement> {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string;
}

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}
`;

export const GridDistortion: React.FC<GridDistortionProps> = ({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className,
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageAspectRef = useRef<number>(1);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: null as THREE.Texture | null },
      uDataTexture: { value: null as THREE.DataTexture | null },
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageSrc, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;
      imageAspectRef.current = texture.image.width / texture.image.height;
      uniforms.uTexture.value = texture;
      handleResize();
    });

    const size = grid;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = 0; 
      data[i * 4 + 1] = 0;
      data[i * 4 + 2] = 0;
      data[i * 4 + 3] = 0;
    }

    const dataTexture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    dataTexture.magFilter = dataTexture.minFilter = THREE.NearestFilter;
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const geometry = new THREE.PlaneGeometry(1, 1, size -1, size -1); // Corrected: size - 1 segments
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !uniforms.uTexture.value) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      const containerAspect = width / height;
      const imageAspect = imageAspectRef.current;

      renderer.setSize(width, height);

      let planeWidth, planeHeight;
      if (containerAspect > imageAspect) {
        planeHeight = 1;
        planeWidth = imageAspect / containerAspect;
      } else {
        planeWidth = 1;
        planeHeight = containerAspect / imageAspect;
      }
       plane.scale.set(planeWidth, planeHeight, 1);


      cameraRef.current.left = -0.5 * (width/height);
      cameraRef.current.right = 0.5 * (width/height);
      cameraRef.current.top = 0.5;
      cameraRef.current.bottom = -0.5;
      cameraRef.current.updateProjectionMatrix();
      
      uniforms.resolution.value.set(width, height, width/height, 1);
    };

    const mouseState = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height; // Inverted Y
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      Object.assign(mouseState, { x, y, prevX: x, prevY: y });
    };

    const handleMouseLeave = () => {
      Object.assign(mouseState, {
        x: 0.5, 
        y: 0.5, 
        prevX: 0.5, 
        prevY: 0.5,
        vX: 0,
        vY: 0,
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);
    
    if (uniforms.uTexture.value) { // Ensure texture is loaded before first resize
        handleResize();
    }


    let lastTime = 0;
    const animate = (time: number) => {
      requestAnimationFrame(animate);
      const delta = (time - lastTime) * 0.001; // Time in seconds
      lastTime = time;

      uniforms.time.value += delta;

      const currentData = uniforms.uDataTexture.value!.image.data as Float32Array;
      for (let i = 0; i < size * size; i++) {
        currentData[i * 4] *= relaxation;
        currentData[i * 4 + 1] *= relaxation;
      }

      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * mouseState.y;
      const maxDist = size * mouse;

      for (let i = 0; i < size; i++) { // Corresponds to texture v (y)
        for (let j = 0; j < size; j++) { // Corresponds to texture u (x)
          const distSq =
            Math.pow(gridMouseX - j - 0.5, 2) + Math.pow(gridMouseY - i - 0.5, 2); // Centered grid cells
          
          if (distSq < maxDist * maxDist) {
            const index = 4 * (j + size * i); // Correct indexing
            const falloff = Math.pow(Math.max(0, 1 - Math.sqrt(distSq) / maxDist), 2); // Smoother falloff
            
            currentData[index] += strength * 50 * mouseState.vX * falloff; // Adjusted multiplier
            currentData[index + 1] -= strength * 50 * mouseState.vY * falloff; // Adjusted multiplier and inverted Y for texture offset
          }
        }
      }
      mouseState.vX *= 0.9; // Dampen velocity
      mouseState.vY *= 0.9;

      uniforms.uDataTexture.value!.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave",handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      if(renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
      if (uniforms.uTexture.value) uniforms.uTexture.value.dispose();
    };
  }, [grid, mouse, strength, relaxation, imageSrc]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${className || ""}`}
      style={style}
      {...rest}
    />
  );
};