/**
 * 3D Glass Shapes Scene Component
 *
 * Provides a pre-configured R3F <Canvas> (lighting, environment)
 * and a <GlassPolygonShape> component for generating glass shapes.
 */

'use client'

import { Environment, MeshTransmissionMaterial } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, type ReactNode } from 'react'
import * as THREE from 'three'

// --- Types ---

export type GlassPolygonType =
	| 'triangle'
	| 'square'
	| 'pentagon'
	| 'hexagon'
	| 'heptagon'
	| 'octagon'

/**
 * Props for the <Component> (the Canvas wrapper)
 */
export type ComponentProps = {
	children: ReactNode
	/** Z-index for positioning (default: 40) */
	zIndex?: number
	/** Camera FOV (default: 50) */
	fov?: number
	/** Camera position (default: [0, 0, 600]) */
	cameraPosition?: [number, number, number]
	/** Environment intensity multiplier (default: 1.5) */
	environmentIntensity?: number
	/** Ambient light intensity (default: 0.6) */
	ambientIntensity?: number
	/** Use 8k galaxy texture instead of 4k (default: false, impacts performance) */
	useHighResTexture?: boolean
}

/**
 * Props for the <GlassPolygonShape> component
 */
export interface GlassPolygonShapeProps {
	// Shape configuration
	type: GlassPolygonType
	size: number
	holeRatio: number
	depth: number

	// Transform properties
	position: [number, number, number]
	rotation: [number, number, number]
	rotationSpeed: [number, number, number]

	// Glass material properties
	transmission: number
	thickness: number
	roughness: number
	ior: number
	chromaticAberration: number
	anisotropy: number
	distortion: number
	distortionScale: number
	temporalDistortion: number
	attenuationDistance: number
	attenuationColor: string

	// Surface finish properties
	clearcoat: number
	clearcoatRoughness: number
	sheen: number
	sheenColor: string
}

// --- Constants & Helpers ---

const SHAPE_TO_SIDES: Record<GlassPolygonType, number> = {
	triangle: 3,
	square: 4,
	pentagon: 5,
	hexagon: 6,
	heptagon: 7,
	octagon: 8,
}

/**
 * Creates an extruded polygon geometry with optional inner hole
 */
function createExtrudedPolygon(
	sides: number,
	size: number,
	holeRatio: number,
	depth: number,
): THREE.ExtrudeGeometry {
	// Generate polygon points for a given radius
	const generatePoints = (radius: number): THREE.Vector2[] => {
		const points: THREE.Vector2[] = []
		for (let i = 0; i < sides; i++) {
			const angle = (Math.PI * 2 * i) / sides - Math.PI / 2
			points.push(
				new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius),
			)
		}
		return points
	}

	// Create outer shape
	const shape = new THREE.Shape(generatePoints(size))

	// Add inner hole if specified
	if (holeRatio > 0) {
		const hole = new THREE.Path(generatePoints(size * holeRatio))
		shape.holes.push(hole)
	}

	// Extrude the shape with beveling for smooth edges
	const geometry = new THREE.ExtrudeGeometry(shape, {
		depth: depth,
		bevelEnabled: true,
		bevelThickness: 2,
		bevelSize: 1,
		bevelSegments: 3,
	})

	// Center the geometry for proper rotation
	geometry.center()

	return geometry
}

// --- Exported Components ---

/**
 * Main Canvas Component (formerly GlassShapesCanvas)
 * This is the "Component" that the 21st template expects.
 */
export function Component({
	children,
	zIndex = 40,
	fov = 50,
	cameraPosition = [0, 0, 600],
	environmentIntensity = 1.5,
	ambientIntensity = 0.6,
	useHighResTexture = false,
}: ComponentProps) {
	const galaxyTexture = useHighResTexture
		? 'https://r2-andycinquin.andy-cinquin.fr/starmap_2020_8k_49ec79856d.exr'
		: 'https://r2-andycinquin.andy-cinquin.fr/starmap_2020_4k_6a132608a6.exr'

	return (
		<div
			className="absolute inset-0 w-screen h-screen pointer-events-none overflow-visible"
			style={{ zIndex }}
		>
			<Canvas
				dpr={1}
				camera={{ position: cameraPosition, fov }}
				gl={{
					alpha: true,
					antialias: false,
					powerPreference: 'high-performance',
				}}
				style={{ pointerEvents: 'none' }}
			>
				{/* Lighting setup */}
				<ambientLight intensity={ambientIntensity} />
				<directionalLight position={[5, 5, 5]} intensity={1.2} />
				<pointLight position={[-5, -5, 2]} intensity={0.5} color="#ffffff" />

				{/* Galaxy environment for realistic reflections */}
				<Environment
					files={galaxyTexture}
					background={false}
					environmentIntensity={environmentIntensity}
				/>

				{children}
			</Canvas>
		</div>
	)
}

/**
 * GlassPolygonShape Component
 * We also export this so the demo file can use it.
 */
export function GlassPolygonShape(props: GlassPolygonShapeProps) {
	const meshRef = useRef<THREE.Mesh>(null)

	// Create geometry (memoized to prevent recreation on every render)
	const geometry = useMemo(
		() =>
			createExtrudedPolygon(
				SHAPE_TO_SIDES[props.type],
				props.size,
				props.holeRatio,
				props.depth,
			),
		[props.type, props.size, props.holeRatio, props.depth],
	)

	// Animate rotation on every frame
	useFrame((_, delta) => {
		if (!meshRef.current) return
		meshRef.current.rotation.x += props.rotationSpeed[0] * delta * 60
		meshRef.current.rotation.y += props.rotationSpeed[1] * delta * 60
		meshRef.current.rotation.z += props.rotationSpeed[2] * delta * 60
	})

	return (
		<mesh
			ref={meshRef}
			geometry={geometry}
			position={props.position}
			rotation={props.rotation}
		>
			<MeshTransmissionMaterial
				// Core transmission properties
				transmission={props.transmission}
				thickness={props.thickness}
				roughness={props.roughness}
				ior={props.ior}
				// Distortion effects
				chromaticAberration={props.chromaticAberration}
				anisotropy={props.anisotropy}
				distortion={props.distortion}
				distortionScale={props.distortionScale}
				temporalDistortion={props.temporalDistortion}
				// Light attenuation
				attenuationDistance={props.attenuationDistance}
				attenuationColor={props.attenuationColor}
				// Base color
				color="#ffffff"
				transparent
				samples={6}
				resolution={512}
				// Surface finish
				clearcoat={props.clearcoat}
				clearcoatRoughness={props.clearcoatRoughness}
				sheen={props.sheen}
				sheenColor={props.sheenColor}
				backside
			/>
		</mesh>
	)
}