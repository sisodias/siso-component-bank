"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "./button";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Card, CardContent, CardHeader } from "./card";
import { Copy, Check } from "lucide-react";
import { SiNpm, SiPnpm, SiYarn, SiBun } from "react-icons/si"; // React icons

interface PackageTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  command: string;
  packageName: string;
  extra: string;
}

const tabs: PackageTab[] = [
  {
    id: "npm",
    label: "npm",
    icon: <SiNpm className="w-4 h-4" />,
    command: "npx",
    packageName: "dlx shadcn@latest add https://ruixen.com/r/staggered-faq-section",
    extra: "add button",
  },
  {
    id: "pnpm",
    label: "pnpm",
    icon: <SiPnpm className="w-4 h-4" />,
    command: "pnpm dlx",
    packageName: "dlx shadcn@latest add https://ruixen.com/r/staggered-faq-section",
    extra: "add button",
  },
  {
    id: "yarn",
    label: "yarn",
    icon: <SiYarn className="w-4 h-4" />,
    command: "yarn dlx",
    packageName: "dlx shadcn@latest add https://ruixen.com/r/staggered-faq-section",
    extra: "add button",
  },
  {
    id: "bun",
    label: "bun",
    icon: <SiBun className="w-4 h-4" />,
    command: "bunx",
    packageName: "dlx shadcn@latest add https://ruixen.com/r/staggered-faq-section",
    extra: "add button",
  },
];

const PackageInstallerTabs = () => {
  const [activeTab, setActiveTab] = useState<string>("npm");
  const [copied, setCopied] = useState(false);

  const activeCommand = tabs.find((tab) => tab.id === activeTab)!;

  const handleCopy = () => {
    const commandText = `${activeCommand.command} ${activeCommand.packageName} ${activeCommand.extra}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(commandText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="p-4 border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="relative p-4">
        <div className="flex items-center justify-between">
          <pre className="font-mono text-sm bg-zinc-100 dark:bg-zinc-950 p-2 rounded-md w-full overflow-x-auto">
            <span className="text-amber-400">{activeCommand.command}</span>{" "}
            <span className="text-teal-500">{activeCommand.packageName}</span>{" "}
            <span className="text-zinc-700 dark:text-zinc-300">
              {activeCommand.extra}
            </span>
          </pre>
          <Button
            variant="outline"
            className="ml-2 flex items-center gap-1"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageInstallerTabs;
