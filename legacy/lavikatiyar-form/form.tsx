// components/ui/booking-form.tsx
import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CalendarDays, BedDouble, Users2 } from 'lucide-react';
import { cn } from "../_utils/cn"; // Assuming you have a lib/utils.ts for cn
import { Button, type ButtonProps } from "./button"; // shadcn/ui button

// Define the props for the main component
interface BookingFormProps extends React.HTMLAttributes<HTMLDivElement> {
  destination: string;
  dateRange: string;
  rooms: number;
  guests: number;
  onDestinationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateRangeClick: () => void;
  onRoomsClick: () => void;
  onGuestsClick: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

// A reusable info button for the details section
const InfoButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        'flex h-12 flex-1 items-center justify-start gap-3 rounded-xl bg-background px-4 text-left font-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
InfoButton.displayName = 'InfoButton';

// Main BookingForm component
export const BookingForm = React.forwardRef<HTMLDivElement, BookingFormProps>(
  (
    {
      className,
      destination,
      dateRange,
      rooms,
      guests,
      onDestinationChange,
      onDateRangeClick,
      onRoomsClick,
      onGuestsClick,
      onSubmit,
      ...props
    },
    ref
  ) => {
    // Animation variants for Framer Motion
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'w-full max-w-sm space-y-6 rounded-2xl bg-card p-6 shadow-lg',
          className
        )}
        {...props}
      >
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Destination Section */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="font-medium text-card-foreground">Destinations</h3>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={destination}
                onChange={onDestinationChange}
                placeholder="Bali, Indonesia"
                className="h-12 w-full rounded-xl border border-input bg-transparent pl-10 pr-4 text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="font-medium text-card-foreground">Details</h3>
            <div className="flex flex-col gap-2 sm:flex-row">
              <InfoButton onClick={onDateRangeClick}>
                <CalendarDays className="h-5 w-5" />
                <span>{dateRange}</span>
              </InfoButton>
              <div className="flex flex-1 gap-2">
                <InfoButton onClick={onRoomsClick} className="w-1/2">
                  <BedDouble className="h-5 w-5" />
                  <span>{rooms}</span>
                </InfoButton>
                <InfoButton onClick={onGuestsClick} className="w-1/2">
                  <Users2 className="h-5 w-5" />
                  <span>{guests}</span>
                </InfoButton>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl text-base font-bold"
              asChild
            >
              <motion.button whileTap={{ scale: 0.98 }}>
                Check Availability
              </motion.button>
            </Button>
          </motion.div>
        </form>
      </motion.div>
    );
  }
);
BookingForm.displayName = 'BookingForm';