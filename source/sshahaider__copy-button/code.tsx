'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Check, Copy } from 'lucide-react';

type CopyButtonProps = ButtonProps & {
	test: string;
};

type UseCopyToClipboardReturn = {
	copied: boolean;
	copy: (text: string) => Promise<boolean>;
};

// Fallback to old browsers
function fallbackCopy(str: string): boolean {
	const textarea = document.createElement('textarea');
	let success = false;

	textarea.value = str;
	textarea.setAttribute('readonly', '');

	textarea.style.position = 'absolute';
	textarea.style.left = '-9999px';

	document.body.appendChild(textarea);

	textarea.select();

	try {
		success = document.execCommand('copy');
	} catch {
		success = false;
	} finally {
		document.body.removeChild(textarea);
	}

	return success;
}

export function useCopyToClipboard(duration: number = 1500): UseCopyToClipboardReturn {
	const [copied, setCopied] = React.useState<boolean>(false);
	const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	const copy = React.useCallback(
		async (text: string): Promise<boolean> => {
			try {
				let success = false;

				if (navigator.clipboard && navigator.clipboard.writeText) {
					await navigator.clipboard.writeText(text);
					success = true;
				} else {
					success = fallbackCopy(text);
				}

				if (success) {
					setCopied(true);
					if (timeoutRef.current) clearTimeout(timeoutRef.current);
					timeoutRef.current = setTimeout(() => setCopied(false), duration);
					return true;
				} else {
					throw new Error('Copy command failed');
				}
			} catch (err: unknown) {
				console.error('Failed to copy text: ', err);
				return false;
			}
		},
		[duration],
	);

	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return {
		copied,
		copy,
	};
}

export function CopyButton({ className, variant = 'outline', size = 'icon', test, ...props }: CopyButtonProps) {
	const { copied, copy } = useCopyToClipboard();

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={variant}
						size={size}
						className={cn('disabled:opacity-100', className)}
						onClick={() => copy(test)}
						aria-label={copied ? 'Copied' : 'Copy to clipboard'}
						disabled={copied || props.disabled}
						{...props}
					>
						<div className={cn('transition-all', copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}>
							<Check className="size-4 stroke-emerald-500" aria-hidden="true" />
						</div>
						<div className={cn('absolute transition-all', copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100')}>
							<Copy className="size-4" aria-hidden="true" />
						</div>
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">Click to copy</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
