"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const coderData = {
  name: "Ruhith G",
  role: "Software Engineer",
  seniority: "Mid-Level",
  location: "Bangalore, India",
  skills: [
    "Java",
    "Spring Boot",
    "React.js",
    "Next.js",
    "TypeScript",
    "MySQL",
    "AWS",
    "Docker",
    "Git",
  ],
};

export function CodeProfileCard() {
  return (
    <Card className="relative overflow-hidden border border-border bg-white dark:bg-zinc-950 shadow-sm">
      {/* Top Line */}
      <div className="h-[2px] w-full bg-zinc-200 dark:bg-zinc-800" />

      {/* Header */}
      <CardHeader className="flex flex-row justify-between items-center border-b border-border bg-zinc-50 dark:bg-zinc-900 px-4 py-3">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <CardTitle className="text-xs text-muted-foreground font-mono">
          coder.js
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="relative border-t border-border p-4 md:p-6 font-mono text-xs md:text-sm text-foreground">
        <div className="relative flex">
          {/* Line Numbers */}
          <div className="hidden md:flex flex-col items-end pr-4 text-zinc-400 dark:text-zinc-600 select-none text-xs">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Content */}
          <ScrollArea className="w-full">
            <pre className="whitespace-pre-wrap leading-relaxed">
              <code>
                const coder = {"{"}
                {"\n"}
                {"  "}name: '{coderData.name}',{"\n"}
                {"  "}role: '{coderData.role}',{"\n"}
                {"  "}seniority: '{coderData.seniority}',{"\n"}
                {"  "}location: '{coderData.location}',{"\n"}
                {"  "}skills: [
                {coderData.skills.map((skill, index) => (
                  <React.Fragment key={skill}>
                    '{skill}'
                    {index < coderData.skills.length - 1 && ", "}
                  </React.Fragment>
                ))}
                ],{"\n"}
                {"};"}
              </code>
            </pre>
          </ScrollArea>
        </div>
      </CardContent>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border px-4 py-3">
        <span>UTF-8</span>
        <span>JavaScript</span>
        <span>Ln 12, Col 2</span>
      </div>
    </Card>
  );
}
