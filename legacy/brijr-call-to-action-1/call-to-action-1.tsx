// app/components/CTA.tsx
"use client";

import React from "react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { Button } from "./button";

import { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

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
/* ================================================ */

export default function CTA() {
  return (
    <Section>
      <Container className="flex flex-col gap-6">
        <h2 className="!my-0">Lorem ipsum dolor sit amet</h2>
        <h4 className="text-muted-foreground">
          <Balancer>
            Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </Balancer>
        </h4>
        <div className="not-prose flex items-center gap-2">
          <Button asChild>
            <Link href="#">Get Started</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="#">Learn More {"->"}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
