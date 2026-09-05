import { cn } from "../_utils/cn";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

function FullscreenShader() {
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector3(size.width, size.height, 1) },
    }),
    [size.width, size.height]
  );

  useFrame(({ clock }) => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    shaderRef.current.uniforms.uResolution.value.set(size.width, size.height, 1);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderRef}
        depthWrite={false}
        depthTest={false}
        transparent={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec2 vTexCoord;
          void main() {
            vTexCoord = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;

          uniform vec3 uResolution;   // viewport resolution (pixels)
          uniform float uTime;        // elapsed time (seconds)

          // Isometric space warping effect
          void renderScene(out vec4 fragColor, vec2 fragCoord) {
              float TAU = 6.283; // 2 * PI
              float time = uTime;
              vec3 res = uResolution;

              // Ray origin in isometric projection
              vec3 pos = (vec3(fragCoord + fragCoord, 1.0) - res) * mat3(
                  707.0, -408.0, 577.0,
                  0.0,   816.0, 577.0,
                 -707.0, -408.0, 577.0
              ) / 300.0 / res.y;

              // Sphere repetition logic
              fragColor = res.yyyy * 0.1 * (
                length(
                  fract(
                    pos + 0.5
                    + (time - sin(time * TAU) / TAU)
                      * (mod(vec3(2.0, 0.0, 1.0) - ceil(time), 3.0) - 1.0)
                      * cos(round(pos[int(mod(time, 3.0))]) * TAU * 0.5)
                  ) - 0.5
                ) - 0.5
              );
          }

          void main() {
            vec4 outCol;
            renderScene(outCol, gl_FragCoord.xy);
            gl_FragColor = outCol;
          }
        `}
      />
    </mesh>
  );
}

export const Component = () => {
  return (
    <div className={cn("flex flex-col items-center gap-4 p-0 rounded-lg w-full h-[100vh]")}>
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} dpr={[1, 2]}>
        <color attach="background" args={["#000000"]} />
        <FullscreenShader />
      </Canvas>
    </div>
  );
};
