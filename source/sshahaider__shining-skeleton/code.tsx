import { cn } from '@/lib/utils';

export function ShiningSkeleton({
	className,
	children,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'bg-accent/50 relative overflow-hidden rounded-md',
				className,
			)}
			{...props}
		>
			<div className="via-accent animate-shinner absolute inset-0 bg-gradient-to-r from-transparent to-transparent" />
			{children}
		</div>
	);
}
