// components/ui/travel-card.tsx

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Assuming you have a shadcn button

// Define the props for the component
export interface TravelCardProps {
  travelsName: string;
  busType: string;
  rating: number;
  reviewsCount: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableSeats: number;
  price: number;
  currencySymbol?: string;
  offerTag?: string;
  logoSrc?: string;
  onViewSeats: () => void;
  className?: string;
}

// Reusable Icon with Text component
const InfoItem: React.FC<{ icon: React.ReactNode; text: string | number }> = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
    {icon}
    <span>{text}</span>
  </div>
);

export const TravelCard: React.FC<TravelCardProps> = ({
  travelsName,
  busType,
  rating,
  reviewsCount,
  departureTime,
  arrivalTime,
  duration,
  price,
  currencySymbol = '₹',
  offerTag,
  logoSrc,
  onViewSeats,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'w-full max-w-4xl rounded-xl border bg-card text-card-foreground shadow-sm transition-transform',
        className
      )}
    >
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Left Section: Details */}
          <div className="flex flex-col gap-4 md:col-span-3">
            <div className="flex items-start justify-between">
              <div>
                {logoSrc && (
                  <div className="relative mb-2 h-6 w-20">
                    <Image src={logoSrc} alt={`${travelsName} logo`} layout="fill" objectFit="contain" />
                  </div>
                )}
                <h3 className="text-lg font-semibold">{travelsName}</h3>
                <p className="text-sm text-muted-foreground">{busType}</p>
              </div>
              <div className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-white">
                <Star className="h-4 w-4" fill="white" />
                <span className="text-sm font-bold">{rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <p className="text-xl font-bold">{departureTime}</p>
                <p className="text-sm text-muted-foreground">Departure</p>
              </div>
              <InfoItem icon={<Clock className="h-4 w-4" />} text={duration} />
              <div>
                <p className="text-xl font-bold">{arrivalTime}</p>
                <p className="text-sm text-muted-foreground">Arrival</p>
              </div>
            </div>
          </div>

          {/* Right Section: Price and Action */}
          <div className="flex flex-col items-start justify-between md:items-end">
            <div>
              <p className="text-2xl font-bold text-primary">
                {currencySymbol}
                {price.toLocaleString('en-IN')}
              </p>
              <p className="text-right text-sm text-muted-foreground">Onwards</p>
            </div>
            <Button
              onClick={onViewSeats}
              className="mt-4 w-full bg-red-500 text-white hover:bg-red-600 md:w-auto"
            >
              View Seats
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Section: Offer */}
      {offerTag && (
        <div className="border-t bg-muted/50 px-6 py-3">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-500">{offerTag}</p>
        </div>
      )}
    </motion.div>
  );
};