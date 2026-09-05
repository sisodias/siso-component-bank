import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Props interface for type safety and reusability
interface PricingCardProps {
  planName: string;
  description: string;
  price: number;
  priceFrequency: string;
  features: string[];
  buttonText: string;
  imageSrc: string;
  popular?: boolean;
  className?: string;
}

// Animation variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export function PricingCard({
  planName,
  description,
  price,
  priceFrequency,
  features,
  buttonText,
  imageSrc,
  popular = false,
  className,
}: PricingCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <Card
        className={cn(
          "relative flex h-full flex-col transition-transform duration-300 hover:scale-105",
          popular ? "border-primary" : "border-border",
          className,
        )}
      >
        {popular && (
          <Badge
            variant="default"
            className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1"
          >
            Popular
          </Badge>
        )}
        <CardHeader>
          <motion.div variants={itemVariants}>
            <CardTitle>{planName}</CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription>{description}</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="flex-1 space-y-6">
          <motion.div variants={itemVariants} className="flex items-baseline">
            <span className="text-5xl font-bold tracking-tight">${price}</span>
            <span className="ml-2 text-sm text-muted-foreground">
              {priceFrequency}
            </span>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button className="w-full">{buttonText}</Button>
          </motion.div>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-center text-sm"
              >
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="flex-1 text-muted-foreground">{feature}</span>
                <Info className="ml-2 h-4 w-4 text-muted-foreground/50" />
              </motion.li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="mt-auto">
          <motion.div variants={itemVariants} className="w-full">
            <img
              src={imageSrc}
              alt={`${planName} plan illustration`}
              className="mx-auto h-40 w-auto object-contain"
            />
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}