import { cn } from '@/lib/utils';

interface CircularProgressProps {
	value: number;
	variant?: 'default' | 'gaped';
	className?: React.ComponentProps<'div'>['className'];
	primaryColor?: string;
	secondaryColor?: string;
	strokeWidth?: number;
}

export function CircularProgress({ value = 0, strokeWidth = 10, variant = 'default', className, primaryColor = 'var(--primary)', secondaryColor  = 'var(--secondary)' }: CircularProgressProps) {
	const radius = 50 - strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;
	const percentPx = circumference / 100;
	const currentPercent = Math.round(((value - 0) / (100 - 0)) * 100);
	const isGaped = variant === 'gaped';
	const pValue = isGaped ? 90 : 100;

	return (
		<div
			className={cn('relative flex items-center justify-center size-24 text-lg', className)}
			style={
				{
					'--circle-size': '100px',
					'--circumference': circumference,
					'--percent-to-px': `${percentPx}px`,
					'--gap-percent': isGaped ? 5 : 0,
					'--offset-factor': '0',
					'--transition-length': '1s',
					'--transition-step': '200ms',
					'--delay': '0s',
					'--percent-to-deg': '3.6deg',
					transform: 'translateZ(0)',
				} as React.CSSProperties
			}
		>
			<svg fill="none" className="size-max" strokeWidth="2" viewBox="0 0 100 100">
				{currentPercent <= pValue && currentPercent >= 0 && (
					<circle
						cx="50"
						cy="50"
						r={radius}
						strokeWidth={strokeWidth}
						strokeDashoffset="0"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="opacity-100"
						style={
							{
								stroke: secondaryColor,
								'--stroke-percent': pValue - currentPercent,
								'--offset-factor-secondary': 'calc(1 - var(--offset-factor))',
								strokeDasharray: 'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
								transform:
									'rotate(calc(1turn - 90deg - (var(--gap-percent) * var(--percent-to-deg) * var(--offset-factor-secondary)))) scaleY(-1)',
								transition: 'all var(--transition-length) ease var(--delay)',
								transformOrigin: 'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
							} as React.CSSProperties
						}
					/>
				)}
				<circle
					cx="50"
					cy="50"
					r={radius}
					strokeWidth={strokeWidth}
					strokeDashoffset="0"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="opacity-100"
					style={
						{
							stroke: primaryColor,
							'--stroke-percent': currentPercent,
							strokeDasharray: 'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
							transition:
								'var(--transition-length) ease var(--delay),stroke var(--transition-length) ease var(--delay)',
							transitionProperty: 'stroke-dasharray,transform',
							transform: 'rotate(calc(-90deg + var(--gap-percent) * var(--offset-factor) * var(--percent-to-deg)))',
							transformOrigin: 'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
						} as React.CSSProperties
					}
				/>
			</svg>
			<span
				data-current-value={currentPercent}
				className="animate-in fade-in absolute inset-0 m-auto size-fit ease-linear"
			>
				{currentPercent}%
			</span>
		</div>
	);
}
