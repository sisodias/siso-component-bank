'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * Props for PixelTransition component.
 */
interface PixelTransitionProps extends React.ComponentProps<'div'> {
	/**
	 * Determines if the transition is active.
	 */
	isActive: boolean;
	/**
	 * The variant of the transition. Can be 'center', 'horizontal' or 'vertical'.
	 * @default 'center'
	 */
	variant?: 'center' | 'horizontal' | 'vertical';
	/**
	 * The color of the transition.
	 * @default 'var(--foreground)'
	 */
	color?: string;
	/**
	 * The size of the transition blocks.
	 * @default 5
	 */
	blockSize?: number;
	/**
	 * The speed of the transition animation.
	 * @default 0.02
	 */
	animationSpeed?: number;
	/**
	 * Additional class name for the component.
	 */
	className?: string;
}

export function PixelTransition({
	isActive,
	variant = 'center',
	color = 'var(--foreground)',
	blockSize = 5,
	animationSpeed = 0.02,
	className,
	...props
}: Omit<PixelTransitionProps, 'children'>) {
	/**
	 * Shuffles array in place (Fisher–Yates shuffle).
	 */
	const shuffle = (a: number[]): number[] => {
		const array = [...a];
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	// Animation variants based on transition type
	const getAnimationVariants = () => {
		switch (variant) {
			case 'center':
				return {
					initial: { opacity: 0 },
					open: (i: number) => ({
						opacity: 1,
						transition: { duration: 0, delay: animationSpeed * 1.5 * i },
					}),
					closed: (i: number) => ({
						opacity: 0,
						transition: { duration: 0, delay: animationSpeed * 1.5 * i },
					}),
				};

			case 'horizontal':
				return {
					initial: { opacity: 0 },
					open: (delay: number[]) => ({
						opacity: 1,
						transition: { duration: 0, delay: animationSpeed * delay[0] },
					}),
					closed: (delay: number[]) => ({
						opacity: 0,
						transition: { duration: 0, delay: animationSpeed * delay[1] },
					}),
				};

			case 'vertical':
				return {
					initial: { opacity: 0 },
					open: (delay: number[]) => ({
						opacity: 1,
						transition: { duration: 0, delay: animationSpeed * delay[1] },
					}),
					closed: (delay: number[]) => ({
						opacity: 0,
						transition: { duration: 0, delay: animationSpeed * delay[0] },
					}),
				};

			default:
				return {
					initial: { opacity: 0 },
					open: { opacity: 1 },
					closed: { opacity: 0 },
				};
		}
	};

	const anim = getAnimationVariants();

	// Generate blocks for center variant
	const getCenterBlocks = () => {
		if (typeof window === 'undefined') return [];

		const { innerWidth, innerHeight } = window;
		const blockSizePixels = innerWidth * (blockSize / 100);
		const nbOfBlocks = Math.ceil(innerHeight / blockSizePixels);
		const shuffledIndexes = shuffle([...Array(nbOfBlocks)].map((_, i) => i));

		return shuffledIndexes.map((randomIndex, index) => (
			<motion.div
				key={index}
				className="aspect-square w-full"
				style={{ backgroundColor: color }}
				variants={anim}
				initial="initial"
				animate={isActive ? 'open' : 'closed'}
				custom={randomIndex}
			/>
		));
	};

	// Generate blocks for horizontal variant
	const getHorizontalBlocks = (columnIndex: number) => {
		if (typeof window === 'undefined') return [];

		const { innerWidth, innerHeight } = window;
		const blockSizePixels = innerWidth * (blockSize / 100);
		const nbOfBlocks = Math.ceil(innerHeight / blockSizePixels);
		const shuffledIndexes = shuffle([...Array(nbOfBlocks)].map((_, i) => i));

		return shuffledIndexes.map((randomIndex, index) => (
			<motion.div
				key={index}
				className="aspect-square w-full"
				style={{ backgroundColor: color }}
				variants={anim}
				initial="initial"
				animate={isActive ? 'open' : 'closed'}
				custom={[columnIndex + randomIndex, 20 - columnIndex + randomIndex]}
			/>
		));
	};

	// Generate blocks for vertical variant
	const getVerticalBlocks = (rowIndex: number) => {
		if (typeof window === 'undefined') return [];

		const { innerWidth, innerHeight } = window;
		const blockSizePixels = innerHeight * ((blockSize * 2) / 100); // Adjusted for vertical
		const nbOfBlocks = Math.ceil(innerWidth / blockSizePixels);
		const shuffledIndexes = shuffle([...Array(nbOfBlocks)].map((_, i) => i));

		return shuffledIndexes.map((randomIndex, index) => (
			<motion.div
				key={index}
				className="aspect-square"
				style={{
					backgroundColor: color,
					width: `${blockSize * 2}vh`,
					height: '100%',
				}}
				variants={anim}
				initial="initial"
				animate={isActive ? 'open' : 'closed'}
				custom={[rowIndex + randomIndex, 10 - rowIndex + randomIndex]}
			/>
		));
	};

	// Render based on variant
	const renderTransition = (index: number) => {
		switch (variant) {
			case 'center':
				return getCenterBlocks();
			case 'horizontal':
				return getHorizontalBlocks(index);
			case 'vertical':
				return getVerticalBlocks(index);
			default:
				return getCenterBlocks();
		}
	};

	return (
		<div
			className={cn(
				'pointer-events-none relative z-10 flex h-screen overflow-hidden',
				variant === 'vertical' ? 'flex-col' : 'flex-row',
				className,
			)}
			{...props}
		>
			{[...Array(20)].map((_, index) => (
				<div
					key={index}
					className={cn('flex', variant !== 'vertical' ? 'flex-col' : 'w-full')}
					style={{
						width: variant === 'vertical' ? '100%' : `${blockSize}vw`,
						height: variant === 'vertical' ? `${blockSize * 2}vh` : '100%',
					}}
				>
					{renderTransition(index)}
				</div>
			))}
		</div>
	);
}