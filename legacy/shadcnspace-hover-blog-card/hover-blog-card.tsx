"use client";

import { Button } from "./button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./hover-card";

const HoverCardTooltipDemo = () => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="outline">Hover Blog Tooltip</Button>
      </HoverCardTrigger>
      <HoverCardContent className="p-0 overflow-hidden">
        <div>
          <img
            src="https://images.shadcnspace.com/assets/blog/blog-img9.jpg"
            alt="Tooltip image"
            className="w-full"
          />
          <div className="p-3 flex flex-col gap-2">
            <p className="text-sm font-medium">About Blog</p>
            <p className="text-muted-foreground text-xs">
              This blog is a space where ideas, insights, and practical
              knowledge come together.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardTooltipDemo;
