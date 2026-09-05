"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./card";

type Timeline_02 = {
  date: string;
  title: string;
  content: string;
};

const timelineData: Timeline_02[] = [
  {
    date: "2018",
    title: "Ruixen Founded",
    content:
      "Ruixen began as a small innovation lab focused on AI-driven automation solutions, aiming to bridge the gap between research and real-world applications.",
  },
  {
    date: "2020",
    title: "First Major Product Launch",
    content:
      "Ruixen released its flagship AI platform, empowering businesses to automate complex workflows with minimal setup. This launch marked its transition from an R&D hub to a commercial leader.",
  },
  {
    date: "2023",
    title: "Global Expansion",
    content:
      "Ruixen expanded to multiple countries, partnering with leading enterprises and tech firms. Its solutions became known for reliability, scalability, and adaptability.",
  },
  {
    date: "2025",
    title: "Ruixen AI Cloud",
    content:
      "The company launched Ruixen AI Cloud, offering a unified ecosystem for AI training, deployment, and monitoring, setting new industry benchmarks for performance.",
  },
];

export default function Timeline_02() {
  return (
    <section className="bg-background py-24">
      <div className="container">
        <h1 className="text-foreground mb-16 text-center text-4xl font-bold tracking-tight sm:text-5xl">
          The Journey of Ruixen
        </h1>

        <div className="relative mx-auto max-w-3xl">
          {/* Subtle vertical line */}

          {timelineData.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative mb-12 pl-12"
            >
              {/* Timeline dot */}
              <div className="absolute left-2 top-5 h-3 w-3 rounded-full bg-cyan-500 ring-4 ring-background" />

              {/* Content */}
              <h4 className="text-lg font-normal text-foreground">
                {entry.title}
              </h4>
              <p className="mb-2 text-sm text-muted-foreground">{entry.date}</p>
              <Card className="border bg-card shadow-sm hover:shadow-md transition">
                <CardContent className="px-5 py-4">
                  <p className="leading-relaxed text-muted-foreground">
                    {entry.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}