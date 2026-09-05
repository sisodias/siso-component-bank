'use client';
import React from 'react';
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from '@/components/ui/accordion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type Category = {
  id: string;
  icon: LucideIcon;
  label: string;
};

export type Question = {
  id: string;
  category: string;
  title: string;
  content: string;
};

interface FaqsSectionProps {
  categories: Category[];
  questions: Question[];
  defaultCategory: string;
}

export function FaqsSection({
  categories,
  questions,
  defaultCategory,
}: FaqsSectionProps) {

	const [activeCategory, setActiveCategory] = React.useState(defaultCategory);

	const filtered = questions.filter((faq) => {
		const matchesCategory = activeCategory === defaultCategory || faq.category === activeCategory;
		return matchesCategory;
	});

	const currentCategory = React.useMemo(
		() => categories.find((cat) => cat.id === activeCategory),
		[activeCategory],
	);

	return (
		<section className="mx-auto min-h-screen w-full max-w-5xl">
			<div className="flex flex-col items-center justify-center gap-4 px-4 pt-12 pb-16">
				<h2 className="font-mono text-4xl font-bold text-balance md:text-5xl lg:font-black">
					FaQs
				</h2>
				<p className="text-muted-foreground">Your questions answered here.</p>
			</div>
			<div className="relative grid min-h-full grid-cols-1 md:grid-cols-3 py-12">
				<div className="flex h-full items-start justify-center border-b pb-2 px-4 md:px-0 md:border-b-0">
					<div className="flex w-max flex-wrap justify-start md:flex-col items-start md:justify-center gap-2">
						{categories.map((cat) => (
							<Button
								key={cat.id}
								onClick={() => setActiveCategory(cat.id)}
								variant={activeCategory === cat.id ? 'outline' : 'ghost'}
								className={cn("border border-transparent", activeCategory === cat.id && "border-border")}
							>
								<cat.icon className="size-4 mr-2" />
								{cat.label}
							</Button>
						))}
					</div>
				</div>
				<div className="col-span-2 space-y-5 px-4 py-5">
					{currentCategory && (
						<div className="flex items-center gap-2">
							<currentCategory.icon className="size-4" />
							<span className="font-medium">{currentCategory.label}</span>
						</div>
					)}
					<Accordion type="single" collapsible defaultValue="1" className="space-y-2">
						{filtered.map((item) => (
							<AccordionItem
								value={item.id.toString()}
								key={item.id}
								className="border-b-0"
							>
								<AccordionTrigger className="rounded-md bg-card shadow px-4 border hover:no-underline">
									{item.title}
								</AccordionTrigger>

								<AccordionContent className="px-4 py-4 text-muted-foreground">
									{item.content}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}