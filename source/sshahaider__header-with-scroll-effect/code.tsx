import React from 'react';
import { Grid2x2PlusIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { MenuToggle } from '@/components/ui/menu-toggle';
import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 10;

export function Header() {
	const [open, setOpen] = React.useState(false);

	const links = [
		{
			label: 'Features',
			href: '#',
		},
		{
			label: 'Pricing',
			href: '#',
		},
		{
			label: 'About',
			href: '#',
		},
	];

	return (
		<Headerwraper
			// TODO: remove this top-1/4
			className="top-1/4"
		>
			<nav className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<Grid2x2PlusIcon className="size-6" />
					<p className="font-mono text-lg font-bold">Asme</p>
				</div>
				<div className="hidden items-center gap-2 lg:flex">
					{links.map((link) => (
						<a
							className={buttonVariants({ variant: 'ghost' })}
							href={link.href}
						>
							{link.label}
						</a>
					))}
					<Button variant="outline">Sign In</Button>
					<Button>Get Started</Button>
				</div>
				<Sheet open={open} onOpenChange={setOpen}>
					<Button size="icon" variant="outline" className="lg:hidden">
						<MenuToggle
							strokeWidth={2.5}
							open={open}
							onOpenChange={setOpen}
							className="size-6"
						/>
					</Button>
					<SheetContent
						className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
						showClose={false}
						side="left"
					>
						<div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
							{links.map((link) => (
								<a
									className={buttonVariants({
										variant: 'ghost',
										className: 'justify-start',
									})}
									href={link.href}
								>
									{link.label}
								</a>
							))}
						</div>
						<SheetFooter>
							<Button variant="outline">Sign In</Button>
							<Button>Get Started</Button>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</nav>
		</Headerwraper>
	);
}

// you can you use this component as an external client component
function Headerwraper({
	children,
	className,
	...props
}: React.ComponentProps<'header'>) {
	const [scrolled, setScrolled] = React.useState(false);

	const onScroll = React.useCallback(() => {
		setScrolled(window.scrollY > SCROLL_THRESHOLD);
	}, [SCROLL_THRESHOLD]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	// also check on first load
	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return (
		<header
			className={cn(
				'sticky top-0 z-50 w-full transition-all',
				{
					'bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur-xl':
						scrolled,
				},
				className,
			)}
			{...props}
		>
			{children}
		</header>
	);
}
