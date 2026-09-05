import { PlusIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type Question = {
  id: string;
  title: string;
  content: string;
};

export function FaqsSection({ questions }: { questions: Question[] }) {
  return (
    <section className="mx-auto grid min-h-screen w-full max-w-5xl grid-cols-1 md:grid-cols-2 lg:border-x">
      <div className="px-4 pt-12 pb-6">
        <div className="space-y-5">
          <h2 className="text-balance font-bold text-4xl md:text-6xl lg:font-black">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Quick answers to common questions about Efferd. Open any question to
            learn more.
          </p>
          <p className="text-muted-foreground">
            {"Can't find what you're looking for? "}
            <a className="text-primary hover:underline" href="#">
              Contact Us
            </a>
          </p>
        </div>
      </div>
      <div className="relative place-content-center">
        {/* vertical guide line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-3 h-full w-px bg-border"
        />

        <Accordion collapsible type="single">
          {questions.map((item) => (
            <AccordionItem
              className="group relative border-b pl-5 first:border-t last:border-b"
              key={item.id}
              value={item.id}
            >
              {/*  plus */}
              <PlusIcon
                aria-hidden="true"
                className="-bottom-[5.5px] -translate-x-1/2 pointer-events-none absolute left-[12.5px] size-2.5 text-muted-foreground group-last:hidden"
              />

              <AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline">
                {item.title}
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 text-muted-foreground">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}