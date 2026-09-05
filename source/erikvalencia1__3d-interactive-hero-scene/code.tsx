import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export const HeroHandScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    /*** Renderer ***/
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    /*** Scene & Camera ***/
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x11151c, 0.4);
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    /*** Orbit Controls ***/
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.9;
    controls.enablePan = false;
    const limit = Math.PI / 7;
    controls.minPolarAngle = Math.PI / 2 - limit;
    controls.maxPolarAngle = Math.PI / 2 + limit;

    /*** HDR Background ***/
    const hdrLoader = new RGBELoader().setPath("https://miroleon.github.io/daily-assets/");
    hdrLoader.load("GRADIENT_01_01_comp.hdr", (hdr) => {
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = hdr;
    });

    /*** Material & FBX Model ***/
    const tex = new THREE.TextureLoader().load(
      "https://miroleon.github.io/daily-assets/surf_imp_02.jpg"
    );
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x606060,
      roughness: 0.2,
      metalness: 1,
      roughnessMap: tex,
      envMapIntensity: 1.5,
    });

    const loader = new FBXLoader();
    loader.load("https://miroleon.github.io/daily-assets/two_hands_01.fbx", (fbx) => {
      fbx.traverse((child: any) => {
        if (child.isMesh) child.material = mat;
      });
      fbx.position.set(0, 0, 0);
      fbx.scale.setScalar(0.05);
      scene.add(fbx);
    });

    /*** Postprocessing ***/
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const afterPass = new AfterimagePass();
    afterPass.uniforms["damp"].value = 0.9;
    composer.addPass(afterPass);

    const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloom.threshold = 0.1;
    bloom.strength = 1.75;
    bloom.radius = 1;
    composer.addPass(bloom);

    const dispTex = new THREE.TextureLoader().load(
      "https://raw.githubusercontent.com/miroleon/displacement_texture_freebie/main/assets/1K/jpeg/normal/ml-dpt-21-1K_normal.jpeg",
      (t) => (t.minFilter = THREE.NearestFilter)
    );

    const dispShader = {
      uniforms: { tDiffuse: { value: null }, displacement: { value: dispTex }, scale: { value: 0.025 }, tileFactor: { value: 2 } },
      vertexShader: `varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D displacement;
        uniform float scale;
        uniform float tileFactor;
        varying vec2 vUv;
        void main(){
          if(vUv.x>0.25&&vUv.x<0.75&&vUv.y>0.25&&vUv.y<0.75){
            vec2 u = mod(vUv*tileFactor,1.0);
            vec2 d = texture2D(displacement,u).rg*scale;
            gl_FragColor = texture2D(tDiffuse,vUv+d);
          }else{
            gl_FragColor = texture2D(tDiffuse,vUv);
          }
        }
      `,
    };
    const dispPass = new ShaderPass(dispShader);
    composer.addPass(dispPass);

    /*** Camera animation ***/
    let userInteracting = false;
    let progress = 0;
    const transitionTime = 2;
    const transitionInc = 1 / (60 * transitionTime);
    const startPos = new THREE.Vector3();
    const startQuat = new THREE.Quaternion();
    let theta = 0;
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    const updateCam = () => {
      theta += 0.005;
      const targetPos = new THREE.Vector3(Math.sin(theta) * 3, Math.sin(theta), Math.cos(theta) * 3);
      const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -theta, 0));
      if (userInteracting) {
        progress = 0;
        startPos.copy(camera.position);
        startQuat.copy(camera.quaternion);
      } else if (progress < 1) {
        progress += transitionInc;
        const eased = ease(progress);
        camera.position.lerpVectors(startPos, targetPos, eased);
        camera.quaternion.slerp(startQuat, targetQuat, eased);
      } else {
        camera.position.copy(targetPos);
        camera.quaternion.copy(targetQuat);
      }
      camera.lookAt(scene.position);
    };

    controls.addEventListener("start", () => (userInteracting = true));
    controls.addEventListener("end", () => {
      userInteracting = false;
      startPos.copy(camera.position);
      startQuat.copy(camera.quaternion);
      progress = 0;
    });

    /*** Resize ***/
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /*** Animate ***/
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      updateCam();
      composer.render();
    };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen relative">
      {/* Minimal Hero Overlay */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <h1 className="text-5xl font-bold tracking-wide">Immersive 3D Hero</h1>
        <p className="mt-4 text-lg opacity-70">Interactive hands with bloom & distortion</p>
      </div>
    </div>
  );
};
