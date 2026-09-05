import React from 'react';
import { cn } from '@/lib/utils';
import {
	LucideIcon,
	User,
	Users,
	Building,
	CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingPage() {
	const plans = [
		{
			icon: User,
			title: 'Starter',
			price: '$29',
			period: '/month',
			description: 'Perfect for individuals and small projects.',
			features: [
				'10GB Storage',
				'5 Projects',
				'Basic Analytics',
				'Email Support',
			],
			className: '',
		},
		{
			icon: Users,
			title: 'Team',
			price: '$99',
			period: '/month',
			description: 'Ideal for growing teams and businesses.',
			features: [
				'50GB Storage',
				'Unlimited Projects',
				'Advanced Analytics',
				'Priority Support',
				'Team Collaboration',
			],
			className: 'md:border-r', // Ensure borders are correct
		},
		{
			icon: Building,
			title: 'Enterprise',
			price: 'Custom',
			period: '',
			description: 'For large organizations with custom needs.',
			features: [
				'Unlimited Storage',
				'Dedicated Account Manager',
				'Custom Integrations',
				'24/7 Support',
				'SSO & Security Audits',
			],
			className: 'border-b-0 md:border-r-0',
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
				</div>

				{/* Header */}
				<div className="flex grow flex-col justify-center px-4 md:px-6 pt-32 pb-16 text-center">
					<h1 className="text-4xl font-bold md:text-5xl">
						Choose Your Plan
					</h1>
					<p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-base">
						Simple, transparent pricing. No hidden fees. Cancel anytime.
					</p>
				</div>
				<BorderSeparator />

				{/* Pricing Grid */}
				<div className="grid md:grid-cols-3">
					{plans.map((plan) => (
						<PricingBox
							key={plan.title}
							icon={plan.icon}
							title={plan.title}
							description={plan.description}
							className={plan.className}
						>
							<div className="flex flex-col h-full">
								<div className="mb-6">
									<span className="text-5xl font-bold">{plan.price}</span>
									<span className="text-muted-foreground font-mono text-base">
										{plan.period}
									</span>
								</div>
								<ul className="flex-grow space-y-3">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-center gap-x-3">
											<CheckCircle2 className="size-4 text-emerald-500" />
											<span className="font-mono text-sm tracking-wide">
												{feature}
											</span>
										</li>
									))}
								</ul>
							</div>
						</PricingBox>
					))}
				</div>
				<BorderSeparator />
			</div>
		</div>
	);
}

function BorderSeparator() {
	return <div className="absolute inset-x-0 h-px w-full border-b" />;
}

// Re-usable Box component adapted for pricing
type PricingBoxProps = React.ComponentProps<'div'> & {
	icon: LucideIcon;
	title: string;
	description: string;
};

function PricingBox({
	title,
	description,
	className,
	children,
	icon: Icon,
}: PricingBoxProps) {
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
			<div className="flex p-4 py-12">{children}</div>
			<div className="border-t p-4 flex flex-col gap-y-3">
				<Button className="w-full">Choose Plan</Button>
				<p className="text-muted-foreground text-center text-sm">{description}</p>
			</div>
		</div>
	);
}