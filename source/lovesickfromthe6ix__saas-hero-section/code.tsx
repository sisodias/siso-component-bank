import React, { useEffect, RefObject, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';


// constants/hero.constants.ts
export const PARTICLE_CONFIG = {
  DEFAULT_COUNT: 10000,
  RADIUS: {
    MIN: 5,
    MAX: 15,
  },
  ROTATION_SPEED: 0.1,
  WAVE_AMPLITUDE: 0.01,
  MATERIAL: {
    SIZE: 0.04,
    BLUR_INTENSITY: 0.3,
  },
} as const;

export const ANIMATION_CONFIG = {
  TIMELINE_DELAY: 0.5,
  HEADLINE: {
    DURATION: 1.2,
    Y_OFFSET: 100,
  },
  DESCRIPTION: {
    DURATION: 1,
    Y_OFFSET: 50,
  },
  CTA: {
    DURATION: 0.8,
    Y_OFFSET: 30,
  },
  FLOATING: {
    DURATION: 3,
    Y_OFFSET: -10,
  },
} as const;

// types/hero.types.ts
export interface HeroSectionProps {
  headline?: string;
  description?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export interface ParticleFieldProps {
  count?: number;
}

export interface SphereData {
  positions: Float32Array;
  colors: Float32Array;
}

export const generateSphereData = (count: number): SphereData => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = 
      Math.random() * (PARTICLE_CONFIG.RADIUS.MAX - PARTICLE_CONFIG.RADIUS.MIN) + 
      PARTICLE_CONFIG.RADIUS.MIN;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const color = new THREE.Color();
    color.setHSL(0.8 + Math.random() * 0.2, 0.7, 0.5 + Math.random() * 0.3);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  return { positions, colors };
};

interface AnimationRefs {
  heroRef: RefObject<HTMLDivElement>;
  headlineRef: RefObject<HTMLHeadingElement>;
  descriptionRef: RefObject<HTMLParagraphElement>;
  ctaRef: RefObject<HTMLDivElement>;
}

export const useHeroAnimation = ({
  heroRef,
  headlineRef,
  descriptionRef,
  ctaRef,
}: AnimationRefs): void => {
  useEffect(() => {
    const tl = gsap.timeline({ delay: ANIMATION_CONFIG.TIMELINE_DELAY });

    // Headline animation
    if (headlineRef.current) {
      gsap.set(headlineRef.current, { 
        y: ANIMATION_CONFIG.HEADLINE.Y_OFFSET, 
        opacity: 0 
      });
      tl.to(headlineRef.current, {
        y: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.HEADLINE.DURATION,
        ease: 'power3.out',
      });
    }

    // Description animation
    if (descriptionRef.current) {
      gsap.set(descriptionRef.current, { 
        y: ANIMATION_CONFIG.DESCRIPTION.Y_OFFSET, 
        opacity: 0 
      });
      tl.to(
        descriptionRef.current,
        {
          y: 0,
          opacity: 1,
          duration: ANIMATION_CONFIG.DESCRIPTION.DURATION,
          ease: 'power3.out',
        },
        '-=0.8'
      );
    }

    // CTA animation
    if (ctaRef.current) {
      gsap.set(ctaRef.current, { 
        y: ANIMATION_CONFIG.CTA.Y_OFFSET, 
        opacity: 0 
      });
      tl.to(
        ctaRef.current,
        {
          y: 0,
          opacity: 1,
          duration: ANIMATION_CONFIG.CTA.DURATION,
          ease: 'power3.out',
        },
        '-=0.6'
      );
    }

    // Floating animation
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        y: ANIMATION_CONFIG.FLOATING.Y_OFFSET,
        duration: ANIMATION_CONFIG.FLOATING.DURATION,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    return () => {
      tl.kill();
    };
  }, [heroRef, headlineRef, descriptionRef, ctaRef]);
};

const ParticleField: React.FC<ParticleFieldProps> = React.memo(({ 
  count = PARTICLE_CONFIG.DEFAULT_COUNT 
}) => {
  const ref = useRef<THREE.Points>(null);
  const { size, viewport } = useThree();
  
  const sphereData = useMemo(() => generateSphereData(count), [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 10;

    const time = state.clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      
      positions[i3 + 1] = y + Math.sin(time + x * 0.01) * PARTICLE_CONFIG.WAVE_AMPLITUDE;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphereData.positions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          vertexColors
          size={PARTICLE_CONFIG.MATERIAL.SIZE}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
        <bufferAttribute
          attach="geometry-attributes-color"
          args={[sphereData.colors, 3]}
        />
      </Points>
    </group>
  );
});

ParticleField.displayName = 'ParticleField';

const FloatingElements: React.FC = React.memo(() => {
  const groupRef = useRef<THREE.Group>(null);

  const meshes = useMemo(() => 
    Array.from({ length: 2 }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0,
      ] as [number, number, number],
      color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.6),
    })),
    []
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * PARTICLE_CONFIG.ROTATION_SPEED;
    }
  });

  return (
    <group ref={groupRef}>
      {meshes.map((mesh) => (
        <mesh
          key={mesh.id}
          position={mesh.position}
          rotation={mesh.rotation}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={mesh.color}
            transparent
            opacity={PARTICLE_CONFIG.MATERIAL.BLUR_INTENSITY}
          />
        </mesh>
      ))}
    </group>
  );
});

FloatingElements.displayName = 'FloatingElements';

const WebGLBackgroundContent: React.FC = () => (
  <>
    <ambientLight intensity={0.3} />
    <pointLight position={[0, 10, 10]} intensity={0.5} />
    <ParticleField />
    <FloatingElements />
  </>
);

const WebGLBackgroundFallback: React.FC = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20" />
);

const WebGLBackground: React.FC = () => (
  <ErrorBoundary fallback={<WebGLBackgroundFallback />}>
    <Canvas
      camera={{ position: [0, 0, 30], fov: 75 }}
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      gl={{ alpha: true, antialias: true }}
    >
      <WebGLBackgroundContent />
    </Canvas>
  </ErrorBoundary>
);

const DEFAULT_PROPS = {
  headline: 'Transform Your Digital Experience',
  description: 'Discover the power of cutting-edge technology with our innovative solutions. Build faster, scale better, and create extraordinary user experiences that drive real business results.',
  primaryCTA: 'Get Started',
  secondaryCTA: 'Watch Demo',
  onPrimaryClick: () => console.log('Primary CTA clicked'),
  onSecondaryClick: () => console.log('Secondary CTA clicked'),
} as const;

const HeroSection: React.FC<HeroSectionProps> = ({
  headline = DEFAULT_PROPS.headline,
  description = DEFAULT_PROPS.description,
  primaryCTA = DEFAULT_PROPS.primaryCTA,
  secondaryCTA = DEFAULT_PROPS.secondaryCTA,
  onPrimaryClick = DEFAULT_PROPS.onPrimaryClick,
  onSecondaryClick = DEFAULT_PROPS.onSecondaryClick,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useHeroAnimation({ heroRef, headlineRef, descriptionRef, ctaRef });

  const [firstPart, ...restParts] = headline.split(' ');
  const headlineFirstPart = `${firstPart} ${restParts[0] || ''}`;
  const headlineSecondPart = restParts.slice(1).join(' ');

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      role="banner"
      aria-label="Hero section"
    >
      <WebGLBackground />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 z-0" />
      
      {/* Content */}
      <div 
        ref={heroRef} 
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
      >
        <div className="space-y-8">
          <h1
            ref={headlineRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight"
          >
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {headlineFirstPart}
            </span>
            <br />
            <span className="text-foreground">
              {headlineSecondPart}
            </span>
          </h1>
          
          <p
            ref={descriptionRef}
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
          >
            {description}
          </p>
          
          <div 
            ref={ctaRef} 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            role="group"
            aria-label="Call to action buttons"
          >
            <Button
              size="lg"
              onClick={onPrimaryClick}
              className="group px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"
              aria-label={primaryCTA}
            >
              {primaryCTA}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={onSecondaryClick}
              className="group px-8 py-6 text-lg font-semibold border-2 border-border hover:border-primary/50 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
              aria-label={secondaryCTA}
            >
              <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              {secondaryCTA}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500" />
    </section>
  );
};

export default HeroSection;