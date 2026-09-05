import React from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

export type Question = {
  id: string;
  title: string;
  content: string;
};

export function FaqsSection({ questions }: { questions: Question[] }) {
	return (
		<div className="mx-auto min-h-screen w-full max-w-5xl lg:border-x">
			<div className="grid h-[calc(100vh-3.5rem)] grid-cols-1 md:grid-cols-2">
				<div className="space-y-4 px-4 pt-12 pb-4 md:border-r">
					<h2 className="text-2xl font-bold md:text-3xl">FAQs</h2>
					<p className="text-muted-foreground">
						Here are some common questions and answers that you might encounter when using Efferd.
					</p>
				</div>
				<div className="place-content-center">
					<Accordion
						type="single"
						collapsible
						defaultValue="item-1"
					>
						{questions.map((item) => (
							<AccordionItem
								value={item.id}
								key={item.id}
								className="first:border-t last:border-b"
							>
								<AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline">
									{item.title}
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground pb-4 px-4">
									{item.content}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
			<div className="flex h-14 items-center justify-center border-t">
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