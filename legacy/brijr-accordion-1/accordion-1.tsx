// app/components/FAQ.tsx
import * as React from "react";
import { ArrowUpRight } from "lucide-react";

// shadcn/ui accordion
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

// --- minimal craft-ds inline -----------------------------------
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type SectionProps = { children: React.ReactNode; className?: string; id?: string };
type ContainerProps = { children: React.ReactNode; className?: string; id?: string };

const Section = ({ children, className, id }: SectionProps) => (
  <section className={cn("py-8 md:py-12", className)} id={id}>
    {children}
  </section>
);

const Container = ({ children, className, id }: ContainerProps) => (
  <div className={cn("mx-auto max-w-5xl p-6 sm:p-8", className)} id={id}>
    {children}
  </div>
);
// ----------------------------------------------------------------

type FAQItem = {
  question: string;
  answer: string;
  link?: string;
};

const content: FAQItem[] = [
  {
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    link: "https://google.com",
  },
  {
    question: "Ut enim ad minim veniam?",
    answer:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "Duis aute irure dolor in reprehenderit?",
    answer:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    question: "Excepteur sint occaecat cupidatat non proident?",
    answer:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

export default function FAQ() {
  return (
    <Section>
      <Container>
        <h3 className="!mt-0">Frequently Asked Questions</h3>
        <h4 className="text-muted-foreground">
          Can&apos;t find the answer you&apos;re looking for? Reach out to our customer support team.
        </h4>

        <div className="not-prose mt-4 md:mt-8">
          {/* Single accordion with multiple items (better a11y & keyboard nav) */}
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            {content.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base md:w-3/4">
                  <p>{item.answer}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-2 inline-flex items-center opacity-60 transition-opacity hover:opacity-100"
                    >
                      Learn more <ArrowUpRight className="ml-1" size={16} />
                    </a>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>
  );
}
