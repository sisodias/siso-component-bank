"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- Simplex Noise Library ---
// Included directly to resolve dependency issues in this environment.
// Source: https://github.com/jwagner/simplex-noise.js
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;
const F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
const G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

class SimplexNoise {
    constructor(random) {
        if (typeof random !== 'function') random = Math.random;
        this.p = new Uint8Array(256);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        for (let i = 0; i < 256; i++) {
            this.p[i] = i;
        }
        for (let i = 255; i > 0; i--) {
            const r = Math.floor(random() * (i + 1));
            const t = this.p[i];
            this.p[i] = this.p[r];
            this.p[r] = t;
        }
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
            this.permMod12[i] = this.perm[i] % 12;
        }
    }

    noise2D(xin, yin) {
        const permMod12 = this.permMod12;
        const perm = this.perm;
        let n0, n1, n2;
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        let i1, j1;
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        }
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        const ii = i & 255;
        const jj = j & 255;
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.grad2(perm[ii + perm[jj]], x0, y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.grad2(perm[ii + i1 + perm[jj + j1]], x1, y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.grad2(perm[ii + 1 + perm[jj + 1]], x2, y2);
        }
        return 70.0 * (n0 + n1 + n2);
    }

    noise3D(xin, yin, zin) {
        const permMod12 = this.permMod12;
        const perm = this.perm;
        let n0, n1, n2, n3;
        const s = (xin + yin + zin) * F3;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const k = Math.floor(zin + s);
        const t = (i + j + k) * G3;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        const z0 = zin - Z0;
        let i1, j1, k1;
        let i2, j2, k2;
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
            } else {
                i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
            }
        } else {
            if (y0 < z0) {
                i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
            } else if (x0 < z0) {
                i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
            } else {
                i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
            }
        }
        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2.0 * G3;
        const y2 = y0 - j2 + 2.0 * G3;
        const z2 = z0 - k2 + 2.0 * G3;
        const x3 = x0 - 1.0 + 3.0 * G3;
        const y3 = y0 - 1.0 + 3.0 * G3;
        const z3 = z0 - 1.0 + 3.0 * G3;
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.grad3(perm[ii + perm[jj + perm[kk]]], x0, y0, z0);
        }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.grad3(perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]], x1, y1, z1);
        }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.grad3(perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]], x2, y2, z2);
        }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
            t3 *= t3;
            n3 = t3 * t3 * this.grad3(perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]], x3, y3, z3);
        }
        return 32.0 * (n0 + n1 + n2 + n3);
    }

    noise4D(x, y, z, w) {
        const permMod12 = this.permMod12;
        const perm = this.perm;
        let n0, n1, n2, n3, n4;
        const s = (x + y + z + w) * F4;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const l = Math.floor(w + s);
        const t = (i + j + k + l) * G4;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const W0 = l - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        const z0 = z - Z0;
        const w0 = w - W0;
        const c = (x0 > y0) ? 32 : 0;
        const c1 = (x0 > z0) ? 16 : 0;
        const c2 = (x0 > w0) ? 8 : 0;
        const c3 = (y0 > z0) ? 4 : 0;
        const c4 = (y0 > w0) ? 2 : 0;
        const c5 = (z0 > w0) ? 1 : 0;
        const C = c + c1 + c2 + c3 + c4 + c5;
        const i1 = (C & 1) !== 0 ? 1 : 0;
        const j1 = (C & 2) !== 0 ? 1 : 0;
        const k1 = (C & 4) !== 0 ? 1 : 0;
        const l1 = (C & 8) !== 0 ? 1 : 0;
        const i2 = (C & 16) !== 0 ? 1 : 0;
        const j2 = (C & 32) !== 0 ? 1 : 0;
        const k2 = (C & 64) !== 0 ? 1 : 0;
        const l2 = (C & 128) !== 0 ? 1 : 0;
        const x1 = x0 - i1 + G4;
        const y1 = y0 - j1 + G4;
        const z1 = z0 - k1 + G4;
        const w1 = w0 - l1 + G4;
        const x2 = x0 - i2 + 2.0 * G4;
        const y2 = y0 - j2 + 2.0 * G4;
        const z2 = z0 - k2 + 2.0 * G4;
        const w2 = w0 - l2 + 2.0 * G4;
        const x3 = x0 - 1.0 + 3.0 * G4;
        const y3 = y0 - 1.0 + 3.0 * G4;
        const z3 = z0 - 1.0 + 3.0 * G4;
        const w3 = w0 - 1.0 + 3.0 * G4;
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        const ll = l & 255;
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.grad4(perm[ii + perm[jj + perm[kk + perm[ll]]]], x0, y0, z0, w0);
        }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.grad4(perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]], x1, y1, z1, w1);
        }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.grad4(perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]], x2, y2, z2, w2);
        }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (t3 < 0) n3 = 0.0;
        else {
            t3 *= t3;
            n3 = t3 * t3 * this.grad4(perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]], x3, y3, z3, w3);
        }
        return 27.0 * (n0 + n1 + n2 + n3);
    }

    grad2(hash, x, y) {
        const h = hash & 7;
        const u = h < 4 ? x : y;
        const v = h < 4 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
    }

    grad3(hash, x, y, z) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }

    grad4(hash, x, y, z, t) {
        const h = hash & 31;
        const u = h < 24 ? x : y;
        const v = h < 16 ? y : z;
        const w = h < 8 ? z : t;
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v) + ((h & 4) ? -w : w);
    }
}

// Main Hero Component - Now exported correctly
export const FuturisticAlienHero = () => {
    const mountRef = useRef(null);

    // useEffect hook to set up and manage the three.js scene
    useEffect(() => {
        // --- Scene Setup ---
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: currentMount,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 5;

        // --- Lighting ---
        const pointLight = new THREE.PointLight(0x00ffff, 1.5, 100);
        pointLight.position.set(0, 0, 7);
        scene.add(pointLight);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 3);
        scene.add(ambientLight);

        // --- Alien Artifact & Core ---
        const simplex = new SimplexNoise(); // Now using the vendored class
        const artifactGeometry = new THREE.IcosahedronGeometry(1.5, 20);
        artifactGeometry.setAttribute('originalPosition', artifactGeometry.attributes.position.clone());

        const artifactMaterial = new THREE.MeshStandardMaterial({
            color: 0xADD8E6,
            metalness: 0.2,
            roughness: 0.1,
            envMapIntensity: 0.9,
            transparent: true,
            opacity: 0.6,
            premultipliedAlpha: true
        });
        const artifact = new THREE.Mesh(artifactGeometry, artifactMaterial);
        scene.add(artifact);

        const coreGeometry = new THREE.IcosahedronGeometry(0.5, 5);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4500,
            wireframe: true
        });
        const energyCore = new THREE.Mesh(coreGeometry, coreMaterial);
        artifact.add(energyCore);

        // --- Nebula Particle System ---
        const nebulaGeometry = new THREE.BufferGeometry();
        const nebulaCount = 20000;
        const posArray = new Float32Array(nebulaCount * 3);
        const colorArray = new Float32Array(nebulaCount * 3);
        const nebulaColors = [new THREE.Color(0x00ffff), new THREE.Color(0x8a2be2), new THREE.Color(0xff4500)];

        for(let i = 0; i < nebulaCount; i++) {
            posArray[i*3 + 0] = (Math.random() - 0.5) * 20;
            posArray[i*3 + 1] = (Math.random() - 0.5) * 20;
            posArray[i*3 + 2] = (Math.random() - 0.5) * 20;
            const randomColor = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            colorArray[i*3 + 0] = randomColor.r;
            colorArray[i*3 + 1] = randomColor.g;
            colorArray[i*3 + 2] = randomColor.b;
        }
        nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const nebulaMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.7
        });
        const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
        scene.add(nebula);

        // --- Mouse Interaction ---
        let mouseX = 0, mouseY = 0;
        const handleMouseMove = (event) => {
            mouseX = (event.clientX - window.innerWidth / 2) / 100;
            mouseY = (event.clientY - window.innerHeight / 2) / 100;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // --- Window Resize ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // --- Animation Loop ---
        const clock = new THREE.Clock();
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            artifact.rotation.y = 0.1 * elapsedTime;
            artifact.rotation.x = 0.1 * elapsedTime;
            energyCore.rotation.y = -0.5 * elapsedTime;
            energyCore.scale.setScalar(Math.sin(elapsedTime * 2) * 0.2 + 1);

            nebula.rotation.y += 0.0002;

            const positions = artifact.geometry.attributes.position;
            const originalPositions = artifact.geometry.attributes.originalPosition;
            for (let i = 0; i < positions.count; i++) {
                const ox = originalPositions.getX(i);
                const oy = originalPositions.getY(i);
                const oz = originalPositions.getZ(i);
                const noise = simplex.noise4D(ox * 0.5, oy * 0.5, oz * 0.5, elapsedTime * 0.15);
                const displacement = new THREE.Vector3(ox, oy, oz).normalize().multiplyScalar(noise * 0.2);
                positions.setX(i, ox + displacement.x);
                positions.setY(i, oy + displacement.y);
                positions.setZ(i, oz + displacement.z);
            }
            positions.needsUpdate = true;

            renderer.render(scene, camera);
        };
        animate();

        // --- Cleanup on unmount ---
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            // Dispose geometries and materials if needed
        };
    }, []);

    // Framer Motion variants for staggered fade-in animation
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i,
                duration: 1.5,
                ease: [0.23, 0.86, 0.39, 0.96]
            },
        }),
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black" style={{ cursor: 'crosshair' }}>
            <canvas ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />
            <section className="relative h-screen flex items-center justify-center overflow-hidden z-10">
                <div className="text-center p-4">
                    <motion.h1
                        className="font-orbitron text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider"
                        style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7), 0 0 15px rgba(0, 255, 255, 0.5), 0 0 25px rgba(173, 216, 230, 0.5)' }}
                    >
                        <motion.span variants={fadeUpVariants} custom={0.5} initial="hidden" animate="visible" className="block">
                            Transcend
                        </motion.span>
                        <motion.span variants={fadeUpVariants} custom={1.5} initial="hidden" animate="visible" className="block mt-4">
                            The Known
                        </motion.span>
                    </motion.h1>
                    <motion.div variants={fadeUpVariants} custom={2} initial="hidden" animate="visible" className="mt-12">
                        <a
                            href="#"
                            className="inline-block bg-cyan-400/10 border-2 border-cyan-400 text-cyan-300 font-bold uppercase tracking-widest py-3 px-8 rounded-md transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:shadow-lg hover:shadow-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
                        >
                            Initiate Contact
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

// Main App component to render the Hero
export default function App() {
    return <FuturisticAlienHero />;
}
