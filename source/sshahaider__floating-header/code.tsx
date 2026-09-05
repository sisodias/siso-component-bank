import React from 'react';
import { Grid2x2PlusIcon, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FloatingHeader() {
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
		<header
			className={cn(
				'sticky top-5 z-50',
				'mx-auto w-full max-w-3xl rounded-lg border shadow',
				'bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-lg',
			)}
		>
			<nav className="mx-auto flex items-center justify-between p-1.5">
				<div className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100">
					<Grid2x2PlusIcon className="size-5" />
					<p className="font-mono text-base font-bold">Asme</p>
				</div>
				<div className="hidden items-center gap-1 lg:flex">
					{links.map((link) => (
						<a
							className={buttonVariants({ variant: 'ghost', size: 'sm' })}
							href={link.href}
						>
							{link.label}
						</a>
					))}
				</div>
				<div className="flex items-center gap-2">
					<Button size="sm">Login</Button>
					<Sheet open={open} onOpenChange={setOpen}>
						<Button
							size="icon"
							variant="outline"
							onClick={() => setOpen(!open)}
							className="lg:hidden"
						>
							<MenuIcon className="size-4" />
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
				</div>
			</nav>
		</header>
	);
}
