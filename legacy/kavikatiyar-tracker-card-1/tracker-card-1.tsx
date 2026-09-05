"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, FileText, Pencil, AlertCircle } from "lucide-react";

import { cn } from "../_utils/cn";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardHeader } from "./card";

// Define the types for the component props
type StepStatus = "completed" | "active" | "pending" | "error";

interface Step {
  title: string;
  description: string;
  date?: string;
  status: StepStatus;
  icon: React.ElementType;
}

interface ProposalTrackerCardProps {
  imageUrl: string;
  status: string;
  title: string;
  price: number;
  steps: Step[];
  buttonText: string;
}

// Helper to get the right icon and style based on status
const getStatusAttributes = (status: StepStatus) => {
  switch (status) {
    case "completed":
      return {
        Icon: CheckCircle2,
        iconClassName: "text-green-500",
        lineClassName: "bg-green-500",
      };
    case "active":
      return {
        Icon: Pencil,
        iconClassName: "text-primary",
        lineClassName: "bg-border",
      };
    case "pending":
      return {
        Icon: FileText,
        iconClassName: "text-muted-foreground",
        lineClassName: "bg-border",
      };
    case "error":
        return {
          Icon: AlertCircle,
          iconClassName: "text-destructive",
          lineClassName: "bg-border",
        };
    default:
      return {
        Icon: Circle,
        iconClassName: "text-muted-foreground",
        lineClassName: "bg-border",
      };
  }
};

export const ProposalTrackerCard: React.FC<ProposalTrackerCardProps> = ({
  imageUrl,
  status,
  title,
  price,
  steps,
  buttonText,
}) => {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden rounded-2xl border-none bg-card shadow-lg">
      <CardHeader className="p-0">
        <div className="flex items-start gap-4 p-6">
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col">
            <Badge
              variant="outline"
              className="mb-2 w-fit border-orange-300 bg-orange-50 text-orange-600"
            >
              {status}
            </Badge>
            <h2 className="text-xl font-bold text-card-foreground">{title}</h2>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">
              ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Expected Total Monthly
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-6 pb-6">
        <motion.ul
          className="relative space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => {
            const { Icon, iconClassName, lineClassName } = getStatusAttributes(step.status);
            const isLastStep = index === steps.length - 1;

            return (
              <motion.li key={index} className="flex items-start gap-4" variants={itemVariants}>
                <div className="relative flex flex-col items-center">
                  <div className="z-10 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                     <Icon className={cn("h-5 w-5", iconClassName)} />
                  </div>
                  {!isLastStep && (
                    <div className={cn("absolute top-9 h-[calc(100%-1.5rem)] w-0.5", lineClassName)} />
                  )}
                </div>
                <div className="flex-1 pb-6 pt-1.5">
                  {step.date && (
                    <p className="text-xs text-muted-foreground">{step.date}</p>
                  )}
                  <p className="font-semibold text-card-foreground">{step.title}</p>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {step.description}
                  </a>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        <Button size="lg" className="w-full rounded-lg text-base font-semibold">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};