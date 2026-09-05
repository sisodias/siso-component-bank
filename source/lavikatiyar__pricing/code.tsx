'use client'; // This component requires client-side state for the slider

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assumes shadcn's 'cn' utility
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

// Define the props for the component for strong typing and reusability
export interface InteractivePricingCardProps {
  planName: string;
  planDescription: string;
  pricePerUnit: number;
  unitName: string;
  minUnits: number;
  maxUnits: number;
  initialUnits: number;
  features: string[];
  ctaText: string;
  currency?: string;
  className?: string;
  highlighted?: boolean; // To make one plan stand out
}

export function InteractivePricingCard({
  planName,
  planDescription,
  pricePerUnit,
  unitName,
  minUnits,
  maxUnits,
  initialUnits,
  features,
  ctaText,
  currency = '$',
  className,
  highlighted = false,
}: InteractivePricingCardProps) {
  // State to manage the number of units selected by the user
  const [units, setUnits] = React.useState(initialUnits);

  // Calculate the total price based on the current number of units
  const totalPrice = (units * pricePerUnit).toFixed(2);

  return (
    <Card
      className={cn(
        'flex w-full max-w-sm flex-col',
        highlighted ? 'border-primary shadow-lg' : '',
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{planName}</CardTitle>
          {highlighted && <Badge variant="default">Popular</Badge>}
        </div>
        <CardDescription>{planDescription}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-6 text-center">
          <span className="text-5xl font-bold">
            {currency}
            {totalPrice}
          </span>
          <span className="text-muted-foreground">/month</span>
        </div>

        <div className="space-y-4">
          {/* Interactive Slider */}
          <div className="space-y-2">
            <div className="flex justify-between font-medium">
              <span>{`${units} ${unitName}${units > 1 ? 's' : ''}`}</span>
              <span>
                {currency}
                {pricePerUnit}/{unitName}
              </span>
            </div>
            <Slider
              value={[units]}
              onValueChange={(value) => setUnits(value[0])}
              min={minUnits}
              max={maxUnits}
              step={1}
              aria-label={`Select number of ${unitName}s`}
            />
          </div>

          {/* Features List */}
          <ul className="space-y-3 text-sm">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" size="lg" variant={highlighted ? 'default' : 'outline'}>
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
}