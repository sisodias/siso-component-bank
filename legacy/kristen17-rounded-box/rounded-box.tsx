// src/components/ui/component.tsx
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Define the texture URLs directly
const texture = {
  matcap: 'https://images.unsplash.com/photo-1626908013943-df94de54984c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2673&q=80',
  skin: 'https://images.unsplash.com/photo-1560780552-ba54683cb263?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
  env: 'https://images.unsplash.com/photo-1536566482680-fca31930a0bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
};

// Global config for THREE.js animation parameters
interface Config {
  scene: {
    speed: number;
  };
  object: {
    speed: number;
  };
}

const config: Config = {
  scene: {
    speed: 0.2,
  },
  object: {
    speed: 0,
  },
};

// Control class
class Control {
  controls: OrbitControls;
  constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    this.controls = new OrbitControls(camera, canvas);
    this.init();
  }

  init() {
    this.controls.target.set(0, 0, 0);
    this.controls.rotateSpeed = 0.9;
    this.controls.enableZoom = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.02;
  }

  update() {
    this.controls.update();
  }
}

// LightBar class
class LightBar {
  c_mes: THREE.Mesh;
  constructor(scene: THREE.Scene, uid: number) {
    this.geometry(scene, uid);
  }

  geometry(scene: THREE.Scene, i: number) {
    const amp = 1;
    const c_mat = new THREE.MeshBasicMaterial();
    const c_geo = new THREE.CapsuleGeometry(0.02, 0.5 + Math.random(), 5, 16);
    this.c_mes = new THREE.Mesh(c_geo, c_mat);
    this.c_mes.position.y = -Math.random() * (amp / 2) + Math.random() * (amp / 2);
    this.c_mes.position.x = -Math.sin(i * 0.3) * Math.PI;
    this.c_mes.position.z = -Math.cos(i * 0.3) * Math.PI;
    scene.add(this.c_mes);
  }
}

export const SpinningSphereBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlRef = useRef<Control | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const objectMeshRef = useRef<THREE.Mesh | null>(null);

  const initThree = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;

    const clock = new THREE.Clock();
    clockRef.current = clock;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000a0b);

    const camera = new THREE.PerspectiveCamera(35);
    cameraRef.current = camera;
    camera.position.set(0, -1.7, 5);

    const control = new Control(camera, canvas);
    controlRef.current = control;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const h_light = new THREE.HemisphereLight(0xffffff, 0xaaaacc, 1);
    const p_light = new THREE.PointLight(0xffffff, 0.2);
    p_light.castShadow = true;
    p_light.position.set(1, 5, 1);
    scene.add(h_light, p_light);

    for (let i = 0; i <= 20; i++) {
      new LightBar(scene, i);
    }

    const o_geo = new RoundedBoxGeometry(1, 1, 1, 5, 0.05);
    const o_mat = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      matcap: new THREE.TextureLoader().load(texture.matcap),
      map: new THREE.TextureLoader().load(texture.env),
    });

    const o_mes = new THREE.Mesh(o_geo, o_mat);
    objectMeshRef.current = o_mes;
    scene.add(o_mes);

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (sceneRef.current) {
        sceneRef.current.rotation.y = elapsedTime * config.scene.speed;
      }

      if (objectMeshRef.current) {
        objectMeshRef.current.rotation.y = -elapsedTime * config.object.speed;
        objectMeshRef.current.rotation.z = elapsedTime * config.object.speed;
        objectMeshRef.current.rotation.x = elapsedTime * config.object.speed;
        objectMeshRef.current.position.y = Math.sin(elapsedTime * config.object.speed) * 0.2;
      }

      if (cameraRef.current && sceneRef.current) {
        cameraRef.current.lookAt(sceneRef.current.position);
        cameraRef.current.updateMatrixWorld();
      }

      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      if (controlRef.current) {
        controlRef.current.update();
      }
    };

    animate();

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, []);

  useEffect(() => {
    initThree();
  }, [initThree]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      <div className="footer">
        <a href="https://www.instagram.com/victorvergara.co/" target="_blank" rel="noopener noreferrer">
          <img src="https://victorvergara.co/logo.svg" alt="Victor Vergara Logo" />
        </a>
      </div>
    </>
  );
};