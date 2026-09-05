import * as React from "react";
import {
  EyeOff,
  Heart,
  RefreshCw,
  Info,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Props interface for type safety and reusability
export interface FounderProfileCardProps {
  /** The URL for the main avatar image. */
  avatarSrc: string;
  /** The initials to display as a fallback if the avatar image fails to load. */
  avatarFallback: string;
  /** The URL for the small icon overlaid on the avatar (e.g., company logo). */
  iconSrc: string;
  /** The main text content, can include JSX for rich formatting like bolding. */
  description: React.ReactNode;
  /** An array of strings to be displayed as tags/badges. */
  tags: string[];
  /** The maximum number of tags to display before showing a "+N more" badge. */
  maxTags?: number;
  /** The title for the collapsible summary section. */
  summaryTitle: string;
  /** The content to be displayed inside the collapsible summary section. */
  summaryContent: React.ReactNode;
  /** Optional class name for custom styling. */
  className?: string;
}

export const FounderProfileCard = React.forwardRef<
  HTMLDivElement,
  FounderProfileCardProps
>(
  (
    {
      avatarSrc,
      avatarFallback,
      iconSrc,
      description,
      tags,
      maxTags = 3,
      summaryTitle,
      summaryContent,
      className,
      ...props
    },
    ref
  ) => {
    // Determine which tags to display
    const displayedTags = tags.slice(0, maxTags);
    const remainingTagsCount = tags.length - maxTags;

    return (
      <Card
        className={cn(
          "w-full max-w-2xl rounded-2xl p-4 sm:p-6",
          "bg-card text-card-foreground",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Header Section */}
        <CardHeader className="flex flex-row items-start gap-4 p-0">
          {/* Avatar with Overlay Icon */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-12 w-12 border-2 border-background">
              <AvatarImage src={avatarSrc} alt="Founder Avatar" />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <img
              src={iconSrc}
              alt="Social Icon"
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background"
            />
          </div>

          {/* Description and Action Icons */}
          <div className="flex-grow">
            <p className="text-sm leading-relaxed sm:text-base">
              {description}
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Hide"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Like"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Refresh"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Content Section: Tags */}
        <CardContent className="p-0 pt-4">
          <div className="flex flex-wrap gap-2">
            {displayedTags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
              >
                {tag}
              </Badge>
            ))}
            {remainingTagsCount > 0 && (
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
              >
                +{remainingTagsCount} more
              </Badge>
            )}
          </div>
        </CardContent>

        {/* Footer Section: Accordion */}
        <CardFooter className="p-0 pt-4">
          <Accordion
            type="single"
            collapsible
            className="w-full"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-4 py-2 text-sm font-medium hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span>{summaryTitle}</span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent className="pt-4 text-sm text-muted-foreground">
                {summaryContent}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      </Card>
    );
  }
);

FounderProfileCard.displayName = "FounderProfileCard";