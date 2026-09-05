"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// =================================
//  STYLES
// =================================
const styles = `
    body { 
        margin: 0; 
        overflow: hidden; 
        background-color: #0c011a;
        font-family: 'Inter', sans-serif;
        color: white;
        cursor: crosshair;
    }
    #scene-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    .overlay {
        position: relative;
        z-index: 1;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        height: 100vh;
        box-sizing: border-box;
    }
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .logo {
        font-weight: 700;
        font-size: 1.5rem;
    }
    nav {
        display: flex;
        gap: 2rem;
    }
    nav a {
        color: white;
        text-decoration: none;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
        opacity: 0.8;
        transition: opacity 0.3s;
    }
    nav a:hover {
        opacity: 1;
    }
    .contact-btn {
        background-color: white;
        color: black;
        padding: 0.7rem 1.5rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        transition: background-color 0.3s;
    }
    .contact-btn:hover {
        background-color: #e0e0e0;
    }
    .main-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        text-align: center;
        padding-bottom: 8rem;
    }
    .main-content h1 {
        font-size: 4rem;
        animation: text-fade-in-up 1s ease-out forwards;
    }
    .main-content p {
        font-size: 1.1rem;
        opacity: 0;
        animation: text-fade-in-up 1s ease-out 0.3s forwards;
    }
    
    .animated-gradient-text {
        background: linear-gradient(90deg, #ff00c8, #00ffc8, #ff00c8);
        background-size: 200% auto;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        animation: gradient-animation 5s linear infinite, text-fade-in-up 1s ease-out forwards;
    }

    @keyframes gradient-animation {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
    }
    
    @keyframes text-fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        .main-content h1 { font-size: 2.5rem; }
        nav { display: none; }
    }
`;

// =================================
//  3D EYES COMPONENT (LOCAL)
// =================================
const CreativeEyes = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        let scene, camera, renderer, composer, particles;
        let eyeGroup1, eyeGroup2;
        const mouse = new THREE.Vector2();
        const lookTarget = new THREE.Vector3();
        const jiggleVelocity = new THREE.Vector2();
        const lastMouse = new THREE.Vector2();
        const clock = new THREE.Clock();

        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(50, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 18);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            currentMount.appendChild(renderer.domElement);

            setupCreativeEyes();
            setupParticles();
            setupPostProcessing();
            addEventListeners();
            animate();
        };

        const setupCreativeEyes = () => {
            const eyeGeometry = new THREE.SphereGeometry(3, 64, 32);
            eyeGroup1 = new THREE.Group();
            eyeGroup1.add(new THREE.Mesh(eyeGeometry, createIrisMaterial()));
            eyeGroup1.position.x = -4.5;
            scene.add(eyeGroup1);

            eyeGroup2 = new THREE.Group();
            eyeGroup2.add(new THREE.Mesh(eyeGeometry, createIrisMaterial()));
            eyeGroup2.position.x = 4.5;
            scene.add(eyeGroup2);
        };

        const setupParticles = () => {
            const particleCount = 500;
            const positions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 30;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
            }
            const particlesGeometry = new THREE.BufferGeometry();
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particleMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.05,
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0.5
            });
            particles = new THREE.Points(particlesGeometry, particleMaterial);
            scene.add(particles);
        };

        const createIrisMaterial = () => {
             return new THREE.ShaderMaterial({
                uniforms: {
                    iTime: { value: 0.0 },
                    pupilSize: { value: 0.4 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec2 vUv;
                    uniform float iTime;
                    uniform float pupilSize;

                    vec3 hsl2rgb(vec3 c) {
                        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
                        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
                    }

                    void main() {
                        vec2 centeredUv = vUv - 0.5;
                        float dist = length(centeredUv);
                        float angle = atan(centeredUv.y, centeredUv.x);
                        vec3 color = vec3(0.9);
                        float dynamicPupilSize = pupilSize * (0.8 + 0.2 * sin(iTime * 2.0));
                        float irisMask = smoothstep(dynamicPupilSize - 0.01, dynamicPupilSize, dist) - smoothstep(0.5, 0.51, dist);
                        if (irisMask > 0.0) {
                            float lines = sin((angle + iTime * 0.5) * 40.0) * 0.5 + 0.5;
                            lines = smoothstep(0.4, 0.6, lines);
                            float hue = angle / (2.0 * 3.14159) + 0.5;
                            vec3 irisColor = hsl2rgb(vec3(hue, 1.0, 0.5));
                            color = mix(irisColor * 0.6, irisColor, lines);
                        }
                        float pupilMask = 1.0 - smoothstep(dynamicPupilSize - 0.02, dynamicPupilSize, dist);
                        color = mix(color, vec3(0.05), pupilMask);
                        float highlight = smoothstep(0.05, 0.07, length(centeredUv - vec2(0.1, 0.1)));
                        color = mix(color, vec3(1.0), (1.0 - highlight) * pupilMask * 0.5);
                        gl_FragColor = vec4(color, 1.0);
                    }
                `
             });
        };

        const setupPostProcessing = () => {
            composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));
            const bloomPass = new UnrealBloomPass(new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight), 1.5, 0.6, 0.1);
            composer.addPass(bloomPass);
        };

        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            
            lookTarget.x += (mouse.x * 10 - lookTarget.x) * 0.05;
            lookTarget.y += (mouse.y * 10 - lookTarget.y) * 0.05;
            lookTarget.z = 15;

            if (eyeGroup1 && eyeGroup2) {
                eyeGroup1.lookAt(lookTarget);
                eyeGroup2.lookAt(lookTarget);
                eyeGroup1.rotation.x += jiggleVelocity.y * 0.3;
                eyeGroup1.rotation.y += jiggleVelocity.x * 0.3;
                eyeGroup2.rotation.x += jiggleVelocity.y * 0.3;
                eyeGroup2.rotation.y += jiggleVelocity.x * 0.3;
                
                eyeGroup1.children[0].material.uniforms.iTime.value = elapsedTime;
                eyeGroup2.children[0].material.uniforms.iTime.value = elapsedTime;
            }
            if(particles) {
                particles.rotation.y = elapsedTime * 0.05;
            }

            jiggleVelocity.multiplyScalar(0.92);
            composer.render();
        };

        const onWindowResize = () => {
            if (!currentMount) return;
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            composer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        
        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            jiggleVelocity.x = (mouse.x - lastMouse.x) * 0.5;
            jiggleVelocity.y = (mouse.y - lastMouse.y) * 0.5;
            lastMouse.copy(mouse);
        };

        const addEventListeners = () => {
            window.addEventListener('resize', onWindowResize);
            document.addEventListener('mousemove', onMouseMove);
        };

        const removeEventListeners = () => {
            window.removeEventListener('resize', onWindowResize);
            document.removeEventListener('mousemove', onMouseMove);
        };

        init();

        return () => {
            cancelAnimationFrame(animationFrameId);
            removeEventListeners();
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div id="scene-container" ref={mountRef} />;
};


// =================================
//  MAIN HeroSection COMPONENT (DEFAULT EXPORT)
// =================================
export default function HeroSection() {
  return (
    <>
      <style>{styles}</style>
      <div className="overlay">
        <header>
          <div className="logo animated-gradient-text">21st LOVE</div>
          <nav>
            <a href="#">HOME</a>
            <a href="#">SERVICES</a>
            <a href="#">COMPANY</a>
          </nav>
          <a href="#" className="contact-btn">CONTACT US</a>
        </header>
        <div className="main-content">
          <h1 className="animated-gradient-text">The Future is Watching.</h1>
          <p className="animated-gradient-text">Interactive experiences that captivate and convert.</p>
        </div>
      </div>
      <CreativeEyes />
    </>
  );
}
