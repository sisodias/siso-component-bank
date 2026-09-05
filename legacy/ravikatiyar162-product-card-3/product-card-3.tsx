// components/ui/product-drop-card.tsx
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card"; // Assuming these are your shadcn Card components
import { Button } from "./button"; // Assuming shadcn Button component
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../_utils/cn"; // Your utility for merging class names

// Define the type for a single drop item
export interface DropItem {
  time: string;
  name: string;
  collection: string;
  imageSrc: string;
}

// Define the props for the main component
export interface ProductDropCardProps {
  title: string;
  subtitle: string;
  items: DropItem[];
}

export const ProductDropCard = ({
  title,
  subtitle,
  items,
}: ProductDropCardProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const itemsToShow = 3; // Number of items visible at once

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < items.length - itemsToShow;

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={!canGoPrev}
              aria-label="Previous drop"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="Next drop"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {/* Carousel container with smooth transition */}
        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full rounded-lg border bg-card p-4 text-card-foreground"
              style={{ flexBasis: `calc((100% / ${itemsToShow}) - (${(itemsToShow - 1) * 16}px / ${itemsToShow}))` }}
            >
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{item.time}</p>
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                    className="h-full w-full object-contain object-center"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.collection}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};