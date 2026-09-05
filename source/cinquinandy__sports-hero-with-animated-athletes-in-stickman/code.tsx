'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Sports Hero with Animated Athletes Component
 *
 * A dynamic hero section featuring animated stick-figure runners and cyclists.
 * Perfect for sports events, races, and athletic competitions.
 *
 * Key features:
 * - Animated runners and cyclists traversing the screen
 * - Theme-aware backgrounds (light/dark mode)
 * - Fully responsive layout
 * - Customizable through props
 * - Uses CSS variables for theming
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SportsHeroProps {
	/** Main title (HTML string, use <span> for emphasized text) */
	title?: string
	/** Description text (HTML string, supports <br />) */
	description?: string
	/** Primary CTA button text */
	primaryButtonText?: string
	/** Primary CTA button href */
	primaryButtonHref?: string
	/** Secondary CTA button text */
	secondaryButtonText?: string
	/** Secondary CTA button href */
	secondaryButtonHref?: string
	/** Side image URL (left side) */
	sideImage?: string
	/** Background image for light theme */
	backgroundLight?: string
	/** Background image for dark theme */
	backgroundDark?: string
	/** Topography pattern URL */
	topographyPattern?: string
	/** Animation speed multiplier (default: 0.75) */
	animationSpeed?: number
	/** Entity count multiplier (default: 0.2) */
	entityDensity?: number
	/** Custom className */
	className?: string
}

// ============================================================================
// ANIMATED ATHLETES COMPONENT
// ============================================================================

type Kind = 'bike' | 'runner'
type GroupKind = 'peloton' | 'breakaway' | 'straggler'

const safeRandomId = (): string => {
	try {
		if (typeof window !== 'undefined' && window.crypto) {
			if (typeof window.crypto.randomUUID === 'function') {
				return window.crypto.randomUUID()
			}
			if (typeof window.crypto.getRandomValues === 'function') {
				const bytes = new Uint8Array(16)
				window.crypto.getRandomValues(bytes)
				bytes[6] = (bytes[6] & 0x0f) | 0x40
				bytes[8] = (bytes[8] & 0x3f) | 0x80
				const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
				return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
			}
		}
	} catch {}
	return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

type RaceEntity = {
	id: string
	kind: Kind
	topPercent: number
	durationMs: number
	delayMs: number
	zIndex: number
	color: string
	internalDurMs: number
}

interface AnimatedAthletesProps {
	speed?: number
	density?: number
}

function AnimatedAthletes({ speed = 0.75, density = 0.2 }: AnimatedAthletesProps) {
	const { resolvedTheme } = useTheme()
	const theme = resolvedTheme || 'light'

	const [entities, setEntities] = useState<RaceEntity[]>([])
	const nextWaveAtRef = useRef<number | null>(null)

	const [speedFactor, setSpeedFactor] = useState<number>(speed)
	const [countFactor, setCountFactor] = useState<number>(density)

	useEffect(() => {
		const compute = () => {
			if (typeof window === 'undefined') return
			const w = window.innerWidth
			if (w <= 640) {
				setSpeedFactor(Math.max(0.1, speed + 0.3))
				setCountFactor(Math.max(0, density * 0.5))
			} else {
				setSpeedFactor(speed)
				setCountFactor(density)
			}
		}
		compute()
		window.addEventListener('resize', compute)
		return () => window.removeEventListener('resize', compute)
	}, [speed, density])

	const randInt = useCallback((min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min, [])

	const clampToOneMinute = useCallback((durationMs: number, delayMs: number) => {
		const cap = 60000
		if (delayMs + durationMs <= cap) return { durationMs, delayMs }
		const maxDuration = Math.max(10000, cap - delayMs - 500)
		return { durationMs: Math.min(durationMs, maxDuration), delayMs }
	}, [])

	const generateGroup = useCallback(
		(kind: Kind, count: number): RaceEntity[] => {
			const pelotonCount = Math.max(3, Math.floor(count * 0.7))
			const breakawayCount = Math.max(1, Math.floor(count * 0.1))
			const stragglerCount = Math.max(0, count - pelotonCount - breakawayCount)

			const result: RaceEntity[] = []

			const neutralForLight = [
				'#0a0a0a',
				'#111111',
				'#171717',
				'#262626',
				'#303030',
				'#404040',
				'#525252',
				'#6b7280',
				'#737373',
				'#9ca3af',
				'#a3a3a3',
			]
			const neutralForDark = [
				'#fafafa',
				'#f9fafb',
				'#f5f5f5',
				'#e5e5e5',
				'#e7e5e4',
				'#d4d4d4',
				'#cfcfcf',
				'#bfbfbf',
				'#a3a3a3',
			]
			const palette = theme === 'dark' ? neutralForDark : neutralForLight
			const pickColor = () => palette[randInt(0, palette.length - 1)]

			const pickDuration = (g: GroupKind) => {
				if (kind === 'bike') {
					if (g === 'breakaway') return randInt(5000, 8000)
					if (g === 'peloton') return randInt(7000, 10000)
					return randInt(10000, 14000)
				}
				if (g === 'breakaway') return randInt(7000, 11000)
				if (g === 'peloton') return randInt(10000, 16000)
				return randInt(16000, 22000)
			}

			const pickDelay = (g: GroupKind) => {
				if (g === 'breakaway') return randInt(0, 500)
				if (g === 'peloton') return randInt(0, 1500)
				return randInt(500, 2500)
			}

			const kindMin = kind === 'bike' ? 5000 : 7000
			const kindMax = kind === 'bike' ? 14000 : 22000
			const internalMin = kind === 'bike' ? 200 : 300
			const internalMax = kind === 'bike' ? 600 : 800
			const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
				const t = Math.min(1, Math.max(0, (value - inMin) / Math.max(1, inMax - inMin)))
				return Math.round(outMin + (outMax - outMin) * t)
			}

			const pushEntity = (g: GroupKind) => {
				let durationMs = pickDuration(g)
				let delayMs = pickDelay(g)
				durationMs = Math.max(1000, Math.round(durationMs / speedFactor))
				delayMs = Math.max(0, Math.round(delayMs / speedFactor))
				const { durationMs: dMs, delayMs: dlMs } = clampToOneMinute(durationMs, delayMs)
				const topPercent = randInt(0, 40)
				let internalDurMs = mapRange(dMs, kindMin, kindMax, internalMin, internalMax)
				internalDurMs = Math.max(150, Math.round(internalDurMs / speedFactor))
				result.push({
					zIndex: kind === 'bike' ? 3 : 2,
					topPercent,
					kind,
					internalDurMs,
					id: `${kind}-${g}-${safeRandomId()}`,
					durationMs: dMs,
					delayMs: dlMs,
					color: pickColor(),
				})
			}

			for (let i = 0; i < pelotonCount; i++) pushEntity('peloton')
			for (let i = 0; i < breakawayCount; i++) pushEntity('breakaway')
			for (let i = 0; i < stragglerCount; i++) pushEntity('straggler')

			return result
		},
		[clampToOneMinute, randInt, theme, speedFactor]
	)

	const spawnWave = useCallback(() => {
		const bikeCount = randInt(Math.round(25 * countFactor), Math.round(55 * countFactor))
		const runnerCount = randInt(Math.round(25 * countFactor), Math.round(55 * countFactor))
		const bikes = generateGroup('bike', bikeCount)
		const runners = generateGroup('runner', runnerCount)
		setEntities([...bikes, ...runners])
		nextWaveAtRef.current = Date.now() + 60000
	}, [generateGroup, randInt, countFactor])

	useEffect(() => {
		spawnWave()
		const id = setInterval(spawnWave, 60000)
		return () => clearInterval(id)
	}, [spawnWave])

	const handleAnimationEnd = useCallback(
		(entity: RaceEntity) => {
			setEntities(prev => {
				const others = prev.filter(e => e.id !== entity.id)
				const fresh = generateGroup(entity.kind, 1)[0]
				return [...others, fresh]
			})
		},
		[generateGroup]
	)

	return (
		<div className="pointer-events-none absolute bottom-0 left-0 z-20 flex h-[45vh] w-screen md:h-[35vh]">
			<div className="relative h-full w-full">
				<style>{`
          @keyframes race-move {
            from { transform: translateX(-25vw); }
            to { transform: translateX(125vw); }
          }
          .race-move {
            animation-name: race-move;
            animation-timing-function: linear;
            animation-fill-mode: both;
            will-change: transform;
            transform: translateX(-25vw);
          }
        `}</style>

				{entities.map(entity => (
					<div
						key={entity.id}
						className="pointer-events-none absolute top-0 left-0"
						style={{ zIndex: entity.zIndex, top: `${entity.topPercent}%` }}
					>
						<div
							className="race-move relative"
							style={{ animationDuration: `${entity.durationMs}ms`, animationDelay: `${entity.delayMs}ms` }}
							onAnimationEnd={() => handleAnimationEnd(entity)}
						>
							{entity.kind === 'bike' ? (
								<Cycling color={entity.color} internalDurMs={entity.internalDurMs} />
							) : (
								<Runner color={entity.color} internalDurMs={entity.internalDurMs} />
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

// ============================================================================
// SVG COMPONENTS
// ============================================================================

function Cycling({ internalDurMs, color }: { color: string; internalDurMs: number }) {
	return (
		<svg width="800" height="800" viewBox="0 0 800 800" fill="none" className="h-10 w-10">
			<path
				d="M644.677 410.63C730.333 410.63 800 480.325 800 565.981C800 651.609 730.333 721.277 644.677 721.277C559.034 721.277 489.367 651.609 489.367 565.981C489.367 480.325 559.034 410.63 644.677 410.63ZM644.677 678.727C706.867 678.727 757.436 628.142 757.436 565.98C757.436 503.777 706.866 453.206 644.677 453.206C582.502 453.206 531.917 503.778 531.917 565.98C531.919 628.142 582.502 678.727 644.677 678.727Z"
				fill={color}
			/>
			<path
				d="M155.323 410.63C240.966 410.63 310.633 480.325 310.633 565.981C310.633 651.609 240.966 721.277 155.323 721.277C69.6672 721.277 1.14441e-05 651.609 1.14441e-05 565.981C1.14441e-05 480.325 69.6672 410.63 155.323 410.63ZM155.323 678.727C217.498 678.727 268.083 628.142 268.083 565.98C268.083 503.777 217.498 453.206 155.323 453.206C93.1344 453.206 42.55 503.778 42.55 565.98C42.55 628.142 93.1344 678.727 155.323 678.727Z"
				fill={color}
			/>
			<path
				d="M393.791 136.427L612.578 170.467C652.644 179.588 650.636 196.35 645.6 222.748L621.278 310.983L706.391 311.703L706.377 311.906C717.248 313.264 725.677 322.52 725.677 333.744C725.677 345.933 715.795 355.786 703.634 355.786L587.698 367.444C565.833 368.394 558.517 348.416 558.967 331.925L563.772 276.073L482.528 253.217C482.528 253.217 521.969 300.028 525.241 304.114C541.581 324.541 547.5 361.986 521.155 381.748L407.106 464.555L400.619 563.852C400.619 580.288 387.291 593.616 370.855 593.616C354.433 593.616 341.105 580.288 341.105 563.852C341.105 563.2 314.909 245.767 314.909 245.767C307.334 179.586 345.405 128.813 393.791 136.427ZM453.889 356.763C459.562 352.514 458.164 346.841 453.889 341.167C449.655 335.48 415.614 307.114 415.614 307.114L408.503 396.475L453.889 356.763Z"
				fill={color}
			/>
			<path
				d="M761.02 154.247H702.863V223.234H694.094V154.247H664.859C664.859 154.247 634.172 138.747 620.681 123.261C616.908 118.917 614.681 108.656 627.359 111.303C627.359 111.303 620.355 94.9344 618.089 88.6094C615.822 82.2578 617.628 76.4485 630.277 79.6125C636.764 81.2407 670.411 87.6735 717.983 98.0969C761.347 107.613 772.719 141.57 772.719 147.202C772.719 152.836 770.616 154.247 761.02 154.247Z"
				fill={color}
			/>
			<path d="M767.183 180.998L754.519 192.602L717.494 182.058V164.114H767.183V180.998Z" fill={color} />
			<path d="M18 563.5H290.5" stroke={color} strokeWidth="25">
				<animateTransform
					attributeName="transform"
					attributeType="XML"
					type="rotate"
					from="0 154.25 563.5"
					to="360 154.25 563.5"
					dur={`${Math.max(0.2, internalDurMs / 1000).toFixed(2)}s`}
					repeatCount="indefinite"
				/>
			</path>
			<path d="M508 563.5H780.5" stroke={color} strokeWidth="25">
				<animateTransform
					attributeName="transform"
					attributeType="XML"
					type="rotate"
					from="0 644.25 563.5"
					to="360 644.25 563.5"
					dur={`${Math.max(0.2, internalDurMs / 1000).toFixed(2)}s`}
					repeatCount="indefinite"
				/>
			</path>
		</svg>
	)
}

function Runner({ internalDurMs, color }: { color: string; internalDurMs: number }) {
	return (
		<svg width="800" height="800" viewBox="0 0 800 800" fill="none" className="h-10 w-10">
			<path d="M583 750L530 559L388.5 419" stroke={color} strokeWidth="80" strokeLinecap="round" strokeLinejoin="round">
				<animate
					attributeName="d"
					values="M583 750L530 559L388.5 419; M135 625L315 625L388.5 419; M583 750L530 559L388.5 419"
					keyTimes="0; 0.5; 1"
					calcMode="spline"
					keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
					dur={`${Math.max(0.25, internalDurMs / 1000).toFixed(2)}s`}
					repeatCount="indefinite"
				/>
			</path>
			<path d="M388 419L430 199" stroke={color} strokeWidth="80" strokeLinecap="round" />
			<path d="M135 625L315 625L388.5 419" stroke={color} strokeWidth="80" strokeLinecap="round" strokeLinejoin="round">
				<animate
					attributeName="d"
					values="M135 625L315 625L388.5 419; M583 750L530 559L388.5 419; M135 625L315 625L388.5 419"
					keyTimes="0; 0.5; 1"
					calcMode="spline"
					keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
					dur={`${Math.max(0.25, internalDurMs / 1000).toFixed(2)}s`}
					repeatCount="indefinite"
				/>
			</path>
			<path
				d="M430 201L268 259L207.5 372.5"
				stroke={color}
				strokeWidth="80"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<animate
					attributeName="d"
					values="M430 201L268 259L207.5 372.5; M430 201L533 358.5L649.5 418; M430 201L268 259L207.5 372.5"
					keyTimes="0; 0.5; 1"
					calcMode="spline"
					keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
					dur={`${Math.max(0.25, internalDurMs / 1000).toFixed(2)}s`}
					repeatCount="indefinite"
				/>
			</path>
			<path d="M430 201L532 366L660.5 348" stroke={color} strokeWidth="80" strokeLinecap="round" strokeLinejoin="round">
				<animate
					attributeName="d"
					values="M430 201L532 366L660.5 348; M430 201L280 257L208 369.5; M430 201L532 366L660.5 348"
					keyTimes="0; 0.5; 1"
					calcMode="spline"
					keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
					dur={`${Math.max(0.25, internalDurMs / 1000).toFixed(2)}s`}
					repeatCount="indefinite"
				/>
			</path>
			<path
				d="M449.063 137.188C467.188 137.188 482.5 130.937 495.313 118.125C508.125 105.312 514.375 90.3126 514.375 73.1251C514.375 55.0001 508.125 39.6874 495.313 26.8749C482.5 14.0624 467.188 7.8125 449.063 7.8125C431.563 7.8125 416.563 14.0624 403.75 26.8749C390.938 39.6874 384.688 55.0001 384.688 73.1251C384.688 90.6251 390.938 105.625 403.75 118.125C416.875 130.937 431.875 137.188 449.063 137.188Z"
				fill={color}
			/>
		</svg>
	)
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Component = ({
	title = "Can't Attend Your Race? <span>Transfer</span> Your Bib Safely!",
	description = 'Legal race bib transfers for running, trail, triathlon & cycling events worldwide. <br />Secure payments, verified sellers, and instant organizer approval.',
	primaryButtonText = 'Get Started',
	primaryButtonHref = '/get-started',
	secondaryButtonText = 'Learn More',
	secondaryButtonHref = '/learn-more',
	sideImage = 'https://r2-andycinquin.andy-cinquin.fr/youpi_40c4613102.jpg',
	backgroundLight = 'https://r2-andycinquin.andy-cinquin.fr/background_v4_dark_cb59f0e4d1.webp',
	backgroundDark = 'https://r2-andycinquin.andy-cinquin.fr/background_v4_white_597dc37eff.webp',
	topographyPattern = 'https://r2-andycinquin.andy-cinquin.fr/topography_7bf885525f.svg',
	animationSpeed = 0.75,
	entityDensity = 0.2,
	className = '',
}: SportsHeroProps) => {
	return (
		<div className={`relative pb-0 md:pb-0 xl:pb-24 ${className}`}>
			{/* Background */}
			<div className="w-screen">
				<img
					alt="Hero background"
					className="absolute inset-0 w-full h-full pointer-events-none z-30 -scale-x-100 object-cover object-bottom pt-36 block dark:hidden"
					src={backgroundLight}
				/>
				<img
					alt="Hero background"
					className="absolute inset-0 w-full h-full pointer-events-none z-30 -scale-x-100 object-cover object-bottom pt-36 grayscale hidden dark:block"
					src={backgroundDark}
				/>
			</div>

			{/* Animated Athletes */}
			<AnimatedAthletes speed={animationSpeed} density={entityDensity} />

			{/* Title Section */}
			<div className="absolute top-8 left-0 z-20 w-full text-center text-[0.9rem] font-bold tracking-tight text-neutral-800 lg:top-10 lg:text-[1.5rem] xl:top-24 xl:text-[2rem] dark:text-neutral-50">
				<h1
					dangerouslySetInnerHTML={{ __html: title }}
					className="font-sans [&_span]:font-bowlby-one-sc [&_span]:mx-2 [&_span]:text-[3.5rem] [&_span]:lg:text-[6rem] [&_span]:xl:text-[8rem]"
				/>

				{/* Mobile Layout */}
				<div className="flex flex-col justify-start gap-6 px-4 lg:hidden">
					<p dangerouslySetInnerHTML={{ __html: description }} className="text-center text-lg text-neutral-800 dark:text-neutral-100" />
					<div className="flex flex-row justify-center gap-4">
						<Link
							className="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md border px-3 text-sm font-medium shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:px-8"
							href={secondaryButtonHref}
						>
							{secondaryButtonText}
						</Link>
						<Link
							className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md px-3 text-sm font-medium shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:px-8"
							href={primaryButtonHref}
						>
							{primaryButtonText}
						</Link>
					</div>
				</div>
			</div>

			{/* Bottom Images */}
			<section className="pointer-events-none relative">
				<div className="absolute top-0 left-0 z-0 flex h-screen w-screen">
					<div className="flex h-full items-end">
						<Image
							alt="Sports hero image"
							className="z-0 mb-[40vh] h-[50vh] w-[50vw] max-w-[50vw] min-w-[50vw] object-cover object-center opacity-75 grayscale lg:mb-[42vh] lg:opacity-100 xl:mb-[25vh] xl:h-[55vh] dark:opacity-50"
							height={500}
							width={500}
							src={sideImage}
						/>
					</div>
					<div
						className="z-0 h-[50vh] max-h-[50vh] w-[50vw] max-w-[50vw] -translate-y-14 overflow-hidden bg-center bg-repeat opacity-100 dark:opacity-50"
						style={{ backgroundImage: `url('${topographyPattern}')` }}
					/>
				</div>
			</section>

			{/* Desktop Layout */}
			<div className="z-20 mx-auto flex max-w-full justify-end">
				<div className="grid min-h-screen w-1/2 grid-cols-12 gap-4">
					<div className="col-span-12 hidden flex-col justify-start gap-6 px-20 pt-[50vh] lg:flex">
						<p dangerouslySetInnerHTML={{ __html: description }} className="text-lg text-neutral-800 dark:text-neutral-300" />
						<div className="flex flex-row gap-4">
							<Link
								className="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md border px-3 text-sm font-medium shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:px-8"
								href={secondaryButtonHref}
							>
								{secondaryButtonText}
							</Link>
							<Link
								className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md px-3 text-sm font-medium shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:px-8"
								href={primaryButtonHref}
							>
								{primaryButtonText}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
