"use client";

import * as React from "react";
import {
  Activity,
  ArrowRight,
  BarChart,
  Bird,
  Menu,
  Plug,
  Sparkles,
  Zap,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "SOLUTIONS", href: "#" },
  { title: "INDUSTRIES", href: "#" },
  { title: "RESOURCES", href: "#" },
  { title: "ABOUT US", href: "#" },
];

const labels = [
  { icon: Sparkles, label: "Predictive Analytics" },
  { icon: Plug, label: "Machine Learning" },
  { icon: Activity, label: "Natural Language Processing" },
];

const features = [
  {
    icon: BarChart,
    label: "Advanced Analytics",
    description: "Gain deeper insights from your data with our cutting-edge predictive models.",
  },
  {
    icon: Zap,
    label: "Intelligent Automation",
    description: "Streamline your processes with AI-powered automation solutions.",
  },
  {
    icon: Activity,
    label: "Real-time Insights",
    description: "Make informed decisions faster with our real-time data processing capabilities.",
  },
];

export function MynaHero() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const titleWords = [
    "THE",
    "AI", 
    "REVOLUTION",
    "FOR",
    "BUSINESS",
    "INTELLIGENCE",
  ];

  return (
    <div className="container mx-auto px-4 min-h-screen bg-background">
      <header>
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Bird className="h-8 w-8" />
              <span className="font-mono text-xl font-bold">Myna UI</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="text-sm font-mono text-foreground hover:text-[#FF6B2C] transition-colors"
              >
                {item.title}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              className="rounded-none hidden md:inline-flex bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono"
            >
              GET STARTED <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-6 mt-6">
                  {navigationItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="text-sm font-mono text-foreground hover:text-[#FF6B2C] transition-colors"
                    >
                      {item.title}
                    </a>
                  ))}
                  <Button className="cursor-pointer rounded-none bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono">
                    GET STARTED <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        <section className="container py-24">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative font-mono text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-tight"
            >
              {titleWords.map((text, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.15, 
                    duration: 0.6 
                  }}
                  className="inline-block mx-2 md:mx-4"
                >
                  {text}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mx-auto mt-8 max-w-2xl text-xl text-foreground font-mono"
            >
              We empower businesses with cutting-edge AI solutions to transform
              data into actionable insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-6"
            >
              {labels.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 1.8 + (index * 0.15), 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }}
                  className="flex items-center gap-2 px-6"
                >
                  <feature.icon className="h-5 w-5 text-[#FF6B2C]" />
                  <span className="text-sm font-mono">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 2.4, 
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            >
              <Button
                size="lg"
                className="cursor-pointer rounded-none mt-12 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono"
              >
                GET STARTED <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="container" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 3.0, 
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            className="text-center text-4xl font-mono font-bold mb-6"
          >
            Unlock the Power of AI
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="grid md:grid-cols-3 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 3.2 + (index * 0.2), 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
                className="flex flex-col items-center text-center p-8 bg-background border"
              >
                <div className="mb-6 rounded-full bg-[#FF6B2C]/10 p-4">
                  <feature.icon className="h-8 w-8 text-[#FF6B2C]" />
                </div>
                <h3 className="mb-4 text-xl font-mono font-bold">
                  {feature.label}
                </h3>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}