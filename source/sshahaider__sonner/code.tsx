'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			expand
			className="toaster group"
			toastOptions={{
				classNames: {
					success:
						'!bg-gradient-to-r !from-green-400/25 !via-green-400/5 !to-transparent !border-green-400/50 [&_svg]:text-green-400  [&_svg]:text-green-400 dark:[&_svg]:text-green-250',
					error:
						'!bg-gradient-to-r !from-destructive/25 !via-destructive/5 !to-transparent !border-destructive/25 [&_svg]:text-destructive',
					info: '!bg-gradient-to-r !from-blue-400/25 !via-blue-400/5 !to-transparent !border-blue-400/50 [&_svg]:text-blue-400  [&_svg]:text-blue-400 dark:[&_svg]:text-blue-250',
					warning:
						'!bg-gradient-to-r !from-yellow-400/25 !via-yellow-400/5 !to-transparent !border-yellow-400/50 [&_svg]:text-yellow-400  [&_svg]:text-yellow-400 dark:[&_svg]:text-yellow-250',
					description: 'text-muted-foreground',
					actionButton: 'bg-primary text-primary-foreground',
					cancelButton: 'bg-muted text-muted-foreground',
				},
			}}
			style={
				{
					'--normal-bg': 'var(--background)',
					'--normal-text': 'var(--foreground)',
					'--normal-border': 'var(--border)',
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
