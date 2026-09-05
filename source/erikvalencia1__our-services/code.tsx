import React from 'react';
import { cn } from '@/lib/utils';
import {
	LucideIcon,
	Code,
	ShieldCheck,
	Layers,
	BarChart,
	Database,
	Cloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ServicesPage() {
	const techStack = [
		{
			icon: Database,
			label: 'Databases',
		},
		{
			icon: Code,
			label: 'APIs',
		},
		{
			icon: Cloud,
			label: 'Cloud Hosting',
		},
		{
			icon: BarChart,
			label: 'Analytics',
		},
	];

	return (
		<div className="min-h-screen w-full">
			<div className="mx-auto h-full max-w-6xl lg:border-x">
				{/* Background Decoration */}
				<div
					aria-hidden
					className="absolute inset-0 isolate -z-10 opacity-80 contain-strict"
				>
					<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
				</div>

				{/* Header */}
				<div className="flex grow flex-col justify-center px-4 md:px-6 pt-32 pb-16">
					<h1 className="text-4xl font-bold md:text-5xl">
						Our Services
					</h1>
					<p className="text-muted-foreground mb-5 text-base">
						We provide cutting-edge solutions to elevate your business.
					</p>
				</div>
				<BorderSeparator />

				{/* Services Grid */}
				<div className="grid md:grid-cols-3">
					<ServiceBox
						icon={Code}
						title="Web Development"
						description="Building responsive and high-performance websites."
					>
						<ul className="list-disc pl-5 font-mono text-base font-medium tracking-wide space-y-2">
							<li>Frontend Development</li>
							<li>Backend APIs</li>
							<li>E-commerce Solutions</li>
						</ul>
					</ServiceBox>
					<ServiceBox
						icon={Layers}
						title="UI/UX Design"
						description="Crafting intuitive and beautiful user experiences."
					>
						<ul className="list-disc pl-5 font-mono text-base font-medium tracking-wide space-y-2">
							<li>Wireframing & Prototyping</li>
							<li>User Research</li>
							<li>Design Systems</li>
						</ul>
					</ServiceBox>
					<ServiceBox
						icon={ShieldCheck}
						title="Cyber Security"
						description="Protecting your digital assets from modern threats."
						className="border-b-0 md:border-r-0"
					>
						<ul className="list-disc pl-5 font-mono text-base font-medium tracking-wide space-y-2">
							<li>Penetration Testing</li>
							<li>Security Audits</li>
							<li>Threat Monitoring</li>
						</ul>
					</ServiceBox>
				</div>
				<BorderSeparator />

				{/* Technologies Section */}
				<div className="relative flex h-full min-h-[320px] items-center justify-center">
					<div
						className={cn(
							'z--10 absolute inset-0 size-full',
							'bg-[radial-gradient(color-mix(in_oklab,var(--foreground)30%,transparent)_1px,transparent_1px)]',
							'bg-[size:32px_32px]',
							'[mask-image:radial-gradient(ellipse_at_center,var(--background)_30%,transparent)]',
						)}
					/>
					<div className="relative z-1 space-y-6 text-center">
						<h2 className="text-3xl font-bold md:text-4xl">
							Technologies We Use
						</h2>
						<div className="flex flex-wrap items-center justify-center gap-4">
							{techStack.map((tech) => (
								<div
									key={tech.label}
									className="bg-muted/50 flex items-center gap-x-2 rounded-full border px-4 py-2"
								>
									<tech.icon className="size-4" />
									<span className="font-mono text-sm font-medium tracking-wide">
										{tech.label}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function BorderSeparator() {
	return <div className="absolute inset-x-0 h-px w-full border-b" />;
}

// Re-usable Box component, renamed for clarity
type ServiceBoxProps = React.ComponentProps<'div'> & {
	icon: LucideIcon;
	title: string;
	description: string;
};

function ServiceBox({
	title,
	description,
	className,
	children,
	icon: Icon,
}: ServiceBoxProps) {
	return (
		<div
			className={cn(
				'flex flex-col justify-between border-b md:border-r md:border-b-0',
				className,
			)}
		>
			<div className="bg-muted/40 flex items-center gap-x-3 border-b p-4">
				<Icon className="text-muted-foreground size-5" strokeWidth={1} />
				<h2 className="font-heading text-lg font-medium tracking-wider">
					{title}
				</h2>
			</div>
			<div className="flex items-center p-4 py-12">{children}</div>
			<div className="border-t p-4">
				<p className="text-muted-foreground text-sm">{description}</p>
			</div>
		</div>
	);
}