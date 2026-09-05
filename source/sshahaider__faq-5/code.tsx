'use client';
import React from 'react';
import { Search, SearchSlash } from 'lucide-react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import {
	Empty,
	EmptyContent,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';

export type Question = {
  id: string;
  category: string;
  title: string;
  content: string;
};

export type Category = {
  id: string;
  label: string;
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
	const [searchTerm, setSearchTerm] = React.useState('');
	const [activeCategory, setActiveCategory] = React.useState(defaultCategory);

	const filtered = questions.filter((faq) => {
		const matchesCategory = activeCategory === defaultCategory || faq.category === activeCategory;
		const matchesSearch =
			faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faq.content.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	return (
		<div className="mx-auto min-h-screen w-full max-w-4xl md:border-x">
			<div className="px-4 py-16 lg:px-6">
				<h1 className="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h1>
				<p className="text-muted-foreground mb-8 max-w-2xl">
					Find answers to common questions about Efferd. Can't find what you're looking for? Our
					support team is here to help.
				</p>

				<InputGroup className="max-w-sm">
					<InputGroupInput
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search FAQs..."
					/>
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
				</InputGroup>
			</div>

			<div className="bg-border absolute inset-x-0 h-px" />

			<div className="flex flex-wrap gap-3 border-b px-4">
				{categories.map((cat) => (
					<button key={cat.id} type="button" onClick={() => setActiveCategory(cat.id)} className="flex flex-col">
						<span
							className={cn(
								'text-muted-foreground hover:text-primary p-1 md:p-2 text-xs md:text-base',
								activeCategory === cat.id && 'text-primary',
							)}
						>
							{cat.label}
						</span>
						{activeCategory === cat.id && (
							<span className="bg-primary h-0.5 w-full rounded-full text-xs" />
						)}
					</button>
				))}
			</div>

			<Accordion
				type="single"
				collapsible
				className="space-y-2 px-4 py-12 lg:px-6"
				defaultValue="item-1"
			>
				{filtered.map((faq) => (
					<AccordionItem
						value={faq.id.toString()}
						key={faq.id}
						className="bg-card dark:bg-card/40 dark:hover:bg-card/60 has-focus-visible:border-ring rounded-md border shadow outline-none last:border-b"
					>
						<AccordionTrigger className="px-4 hover:no-underline focus-visible:ring-0">
							{faq.title}
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground px-4 pt-2 pb-4">
							{faq.content}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

			{filtered.length === 0 && (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Search />
						</EmptyMedia>
						<EmptyTitle>No FAQs found matching your search.</EmptyTitle>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="outline" onClick={() => setSearchTerm('')}>
							<SearchSlash className="size-4 mr-2" />
							Clear search
						</Button>
					</EmptyContent>
				</Empty>
			)}

			<div className="flex items-center px-4 py-6 lg:px-6">
				<p className="text-muted-foreground">
					Can't find what you're looking for?{' '}
					<a href="#" className="text-primary hover:underline">
						Contact Us
					</a>
				</p>
			</div>
		</div>
	);
}
