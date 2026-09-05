import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "./card";
import { Button } from "./button";
import { cn } from "../_utils/cn";
// Define the icon type. Using React.ElementType for flexibility.
type IconType = React.ElementType | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

// --- 📦 API (Props) Definition ---
export interface CardDisplayItem {
  /** A unique identifier for the card item. */
  id: string;
  /** Title of the card. */
  title: string;
  /** Main value or content of the card. */
  value: string;
  /** Detailed description or subtext. */
  description: string;
  /** Optional icon to display in the header. */
  icon?: IconType;
  /** Label for the optional footer action button. */
  actionLabel?: string;
  /** Disables the action button if true. */
  isDisabled?: boolean;
  /** Callback for when the action button is clicked. */
  onActionClick?: (id: string) => void;
}

export interface CardDisplayProps {
  /** Array of card items to display. */
  items: CardDisplayItem[];
  /** Optional class name to apply to the main container. */
  className?: string;
}

/**
 * A professional, monochrome, and responsive display for a collection of data cards.
 * Uses shadcn/ui components for styling, light/dark theme support, and accessibility.
 */
const CardDisplay: React.FC<CardDisplayProps> = ({ items, className }) => {
  if (!items || items.length === 0) {
    return <p className="text-center text-muted-foreground p-8">No display items configured.</p>;
  }

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 md:p-6",
        className
      )}
      role="list" // ARIA role for a list of cards
    >
      {items.map((item) => (
        <Card
          key={item.id}
          className="flex flex-col h-full transition-shadow duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
          role="listitem" // ARIA role for a card item
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium tracking-tight text-foreground">
              {item.title}
            </CardTitle>
            {item.icon && (
              <item.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold mb-1 text-foreground">{item.value}</div>
            <CardDescription className="text-xs text-muted-foreground min-h-[1.5rem]">
              {item.description}
            </CardDescription>
          </CardContent>
          {item.actionLabel && (
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => item.onActionClick?.(item.id)}
                disabled={item.isDisabled}
                className="w-full text-sm font-semibold transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
                aria-label={`Action for ${item.title}: ${item.actionLabel}`}
              >
                {item.actionLabel}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};


import { Users, DollarSign, Clock, CheckCircle } from "lucide-react";

const ExampleUsage = () => {
  const mockData: CardDisplayItem[] = [
    {
      id: "users-active",
      title: "Active Users",
      value: "1,234",
      description: "+20.1% from last month",
      icon: Users,
      actionLabel: "View Report",
      onActionClick: (id) => console.log(`Action clicked for ID: ${id}`),
    },
    {
      id: "revenue-total",
      title: "Total Revenue",
      value: "$45,231.89",
      description: "Revenue year-to-date",
      icon: DollarSign,
      actionLabel: "Export Data",
      isDisabled: false,
      onActionClick: (id) => console.log(`Action clicked for ID: ${id}`),
    },
    {
      id: "avg-time",
      title: "Avg. Session Time",
      value: "12m 34s",
      description: "The average user session duration.",
      icon: Clock,
      actionLabel: "Analyze",
      onActionClick: (id) => console.log(`Action clicked for ID: ${id}`),
    },
    {
      id: "tasks-complete",
      title: "Tasks Completed",
      value: "95%",
      description: "Monthly task completion rate.",
      icon: CheckCircle,
      actionLabel: "Details",
      onActionClick: (id) => console.log(`Action clicked for ID: ${id}`),
    },
  ];

  return (
    <div className="p-4 bg-background">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Dashboard Overview</h2>
      <CardDisplay items={mockData} className="max-w-7xl mx-auto" />
    </div>
  );
};

export default ExampleUsage; 