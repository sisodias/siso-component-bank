'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Bell, BarChart2, Monitor, Plus } from 'lucide-react';

export function AccordionComponent() {
	const [openItems, setOpenItems] = useState<number[]>([]);

	const toggleItem = (index: number) => {
		setOpenItems((current) =>
			current.includes(index)
				? current.filter((item) => item !== index)
				: [...current, index]
		);
	};

	const accordionItems = [
		{
			title: 'Views',
			description: 'Save time by creating and saving filtered views',
			icon: Eye,
			iconBg: 'bg-yellow-100 dark:bg-yellow-900',
			iconColor: 'text-blue-600 dark:text-blue-400',
		},
		{
			title: 'Alerts',
			description: "Save information about your system's activity",
			icon: Bell,
			iconBg: 'bg-blue-100 dark:bg-blue-900',
			iconColor: 'text-blue-600 dark:text-blue-400',
		},
		{
			title: 'Boards & Graphs',
			description: "Identify trends in your system's activity",
			icon: BarChart2,
			iconBg: 'bg-purple-100 dark:bg-purple-900',
			iconColor: 'text-blue-600 dark:text-blue-400',
		},
		{
			title: 'Screen',
			description: 'Display daily log activity from all your systems',
			icon: Monitor,
			iconBg: 'bg-green-100 dark:bg-green-900',
			iconColor: 'text-blue-600 dark:text-blue-400',
		},
	];

	return (
		<div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
			<h1 className="text-3xl font-bold mb-2 text-foreground">The Accordion</h1>
			<p className="text-muted-foreground mb-8">
				The accordion is a graphical control element comprising a vertical
				stacked list of items, such as labels or thumbnails. Each item can be
				"expanded" or "collapsed" to reveal the content associated with that
				item.
			</p>

			<div className="space-y-4">
				{accordionItems.map((item, index) => (
					<div
						key={index}
						className="border border-border rounded-lg overflow-hidden"
					>
						<div
							className="flex items-center justify-between p-4 cursor-pointer"
							onClick={() => toggleItem(index)}
						>
							<div className="flex items-center gap-4">
								<div
									className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.iconBg}`}
								>
									<item.icon className={`w-5 h-5 ${item.iconColor}`} />
								</div>
								<div>
									<h3 className="font-medium text-foreground">{item.title}</h3>
									<p className="text-sm text-muted-foreground">
										{item.description}
									</p>
								</div>
							</div>
							<motion.div
								animate={{ rotate: openItems.includes(index) ? 45 : 0 }}
								transition={{ duration: 0.2 }}
								className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
							>
								<Plus className="w-4 h-4 text-muted-foreground" />
							</motion.div>
						</div>

						<AnimatePresence>
							{openItems.includes(index) && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.3, ease: 'easeInOut' }}
									className="overflow-hidden"
								>
									<div className="p-4 pt-0 border-t border-border">
										<p className="mt-2 text-muted-foreground">
											This is the expanded content for {item.title}. You can add
											any content here, such as forms, charts, or additional
											information.
										</p>
										<div className="mt-4 p-4 bg-muted rounded-lg">
											<p className="text-sm text-foreground">
												Sample content area for {item.title}
											</p>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				))}
			</div>
		</div>
	);
}
