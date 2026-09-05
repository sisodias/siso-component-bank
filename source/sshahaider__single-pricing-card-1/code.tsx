'use client';
import React from 'react';
import { PlusIcon, ShieldCheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { BorderTrail } from './border-trail';

export function Pricing() {
	return (
		<section className="relative min-h-screen overflow-hidden py-24">
			<div id="pricing" className="mx-auto w-full max-w-6xl space-y-5 px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
					viewport={{ once: true }}
					className="mx-auto max-w-xl space-y-5"
				>
					<div className="flex justify-center">
						<div className="rounded-lg border px-4 py-1 font-mono">Pricing</div>
					</div>
					<h2 className="mt-5 text-center text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl">
						Pricing Based on Your Success
					</h2>
					<p className="text-muted-foreground mt-5 text-center text-sm md:text-base">
						We offer a single price for all our services. We believe that pricing is a critical component of any
						successful business.
					</p>
				</motion.div>

				<div className="relative">
					<div
						className={cn(
							'z--10 pointer-events-none absolute inset-0 size-full',
							'bg-[linear-gradient(to_right,--theme(--color-foreground/.2)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.2)_1px,transparent_1px)]',
							'bg-[size:32px_32px]',
							'[mask-image:radial-gradient(ellipse_at_center,var(--background)_10%,transparent)]',
						)}
					/>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						viewport={{ once: true }}
						className="mx-auto w-full max-w-2xl space-y-2"
					>	
						<div className="grid md:grid-cols-2 bg-background relative border p-4">
							<PlusIcon className="absolute -top-3 -left-3  size-5.5" />
							<PlusIcon className="absolute -top-3 -right-3 size-5.5" />
							<PlusIcon className="absolute -bottom-3 -left-3 size-5.5" />
							<PlusIcon className="absolute -right-3 -bottom-3 size-5.5" />

							<div className="w-full px-4 pt-5 pb-4">
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<h3 className="leading-none font-semibold">Monthly</h3>
										<div className="flex items-center gap-x-1">
											<span className="text-muted-foreground text-sm line-through">$8.99</span>
											<Badge variant="secondary">11% off</Badge>
										</div>
									</div>
									<p className="text-muted-foreground text-sm">Best value for growing businesses!</p>
								</div>
								<div className="mt-10 space-y-4">
									<div className="text-muted-foreground flex items-end gap-0.5 text-xl">
										<span>$</span>
										<span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
											7.99
										</span>
										<span>/month</span>
									</div>
									<Button className="w-full" variant="outline" asChild>
										<a href="#">Start Your Journey</a>
									</Button>
								</div>
							</div>
							<div className="relative w-full rounded-lg border px-4 pt-5 pb-4">
								<BorderTrail
									style={{
										boxShadow:
											'0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
									}}
									size={100}
								/>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<h3 className="leading-none font-semibold">Yearly</h3>
										<div className="flex items-center gap-x-1">
											<span className="text-muted-foreground text-sm line-through">$8.99</span>
											<Badge>22% off</Badge>
										</div>
									</div>
									<p className="text-muted-foreground text-sm">Unlock savings with an annual commitment!</p>
								</div>
								<div className="mt-10 space-y-4">
									<div className="text-muted-foreground flex items-end text-xl">
										<span>$</span>
										<span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
											6.99
										</span>
										<span>/month</span>
									</div>
									<Button className="w-full" asChild>
										<a href="#">Get Started Now</a>
									</Button>
								</div>
							</div>
						</div>

						<div className="text-muted-foreground flex items-center justify-center gap-x-2 text-sm">
							<ShieldCheckIcon className="size-4" />
							<span>Access to all features with no hidden fees</span>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

