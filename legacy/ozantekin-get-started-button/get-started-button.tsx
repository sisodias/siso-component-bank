import { Button } from "./button";
import { ChevronRight } from "lucide-react";

export function GetStartedButton() {
  return (
    <Button className="group relative overflow-hidden" size="lg">
      <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
        Get Started
      </span>
      <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
        <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
      </i>
    </Button>
  );
}
