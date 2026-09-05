'use client'; // Required for Framer Motion and other client-side hooks

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the types for the props to ensure type safety
interface ImageCardData {
  category: string;
  imageUrl: string;
}

interface TabData {
  value: string;
  label: string;
  content: {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
  };
  images: ImageCardData[];
}

interface CaseStudyTabsProps {
  subtitle: string;
  title: string;
  tabs: TabData[];
  defaultTab: string;
  className?: string;
}

// Parent container variants to orchestrate children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between children animating in
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: 'afterChildren', // Ensure children exit first
      staggerChildren: 0.1,
      staggerDirection: -1,
      ease: 'easeIn',
    },
  },
};

// Animation variants for the image grid on the left
const imageGridVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

// Animation variants for the info card on the right
const infoCardVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.3 } },
};

export function CaseStudyTabs({
  subtitle,
  title,
  tabs,
  defaultTab,
  className,
}: CaseStudyTabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  return (
    <section className={cn('w-full overflow-hidden py-12 md:py-20 lg:py-24', className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            {subtitle}
          </h2>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
        </div>

        <Tabs defaultValue={defaultTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Triggers */}
          <TabsList className="mb-8 grid w-full grid-cols-2 sm:grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="py-3">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* AnimatePresence handles the exit/enter animations of tab content */}
          <AnimatePresence mode="wait">
            <TabsContent key={activeTab} value={activeTab} forceMount>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                // Added min-height to ensure container size is consistent across tabs
                className="flex min-h-[620px] flex-col-reverse gap-8 lg:flex-row"
              >
                {/* Left Side: Image Grid */}
                <motion.div
                  variants={imageGridVariants}
                  className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
                >
                  {tabs.find(t => t.value === activeTab)?.images.map((image) => (
                    <div
                      key={image.imageUrl}
                      className="group relative overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl"
                    >
                      <Image
                        src={image.imageUrl}
                        alt={image.category}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-4 left-4 text-sm font-semibold text-white">
                        {image.category}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* Right Side: Content Card */}
                <motion.div variants={infoCardVariants} className="lg:w-1/3">
                  <Card className="flex h-full flex-col p-6 text-left">
                    <CardHeader className="p-0">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
                        {tabs.find(t => t.value === activeTab)?.content.icon}
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground">{tabs.find(t => t.value === activeTab)?.content.title}</h3>
                    </CardHeader>
                    <CardContent className="flex-grow p-0 pt-4">
                      <p className="text-muted-foreground">{tabs.find(t => t.value === activeTab)?.content.description}</p>
                    </CardContent>
                    <div className="mt-6 p-0">
                      <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-muted">
                        <Link href={tabs.find(t => t.value === activeTab)?.content.link || '#'} aria-label={`Learn more about ${tabs.find(t => t.value === activeTab)?.content.title}`}>
                          <ArrowUpRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
}