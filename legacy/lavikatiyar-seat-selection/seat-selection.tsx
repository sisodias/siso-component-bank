import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assumes shadcn/ui's utility function

// SECTION: Type Definitions for component props

export interface SeatInfo {
  id: string; // Unique identifier for the seat, e.g., 'A1'
  number?: number; // The display number on the seat
  isSpacer?: boolean; // Renders an empty space instead of a seat
}

export interface SeatRowInfo {
  rowId: string; // The row identifier, e.g., 'A'
  seats: SeatInfo[];
}

export interface SeatCategoryInfo {
  categoryName: string; // e.g., 'PRIME', 'CLASSIC'
  price: number;
  rows: SeatRowInfo[];
}

interface SeatSelectionProps {
  layout: SeatCategoryInfo[];
  selectedSeats: string[];
  occupiedSeats: string[];
  onSeatSelect: (seatId: string) => void; // Callback function for seat interaction
  className?: string;
}

// !SECTION

// --- Sub-components ---

// Renders the curved screen at the top
const Screen = () => (
  <div className="relative w-full flex justify-center items-center mb-12">
    <motion.div
      className="h-12 w-full max-w-2xl border-b-4 border-foreground"
      style={{
        borderBottomLeftRadius: '50%',
        borderBottomRightRadius: '50%',
        boxShadow: '0px 15px 30px -5px hsl(var(--foreground) / 0.5)',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
    <motion.span
      className="absolute -bottom-2 text-sm font-medium tracking-widest text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      SCREEN
    </motion.span>
  </div>
);

// Renders an individual seat
interface SeatProps {
  seat: SeatInfo;
  status: 'available' | 'selected' | 'occupied';
  onSelect: (id: string) => void;
}

const Seat = React.memo(({ seat, status, onSelect }: SeatProps) => {
  // Render a spacer div if the seat is a spacer
  if (seat.isSpacer) {
    return <div className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />;
  }

  const isOccupied = status === 'occupied';

  return (
    <motion.button
      onClick={() => !isOccupied && onSelect(seat.id)}
      disabled={isOccupied}
      aria-label={`Seat ${seat.id}, ${status}`}
      aria-pressed={status === 'selected'}
      className={cn(
        'w-8 h-8 md:w-10 md:h-10 rounded-md border flex items-center justify-center text-xs font-semibold transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:ring-offset-background',
        {
          'bg-card text-card-foreground hover:bg-accent hover:border-primary cursor-pointer': status === 'available',
          'bg-primary text-primary-foreground border-primary cursor-pointer': status === 'selected',
          'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50': isOccupied,
        }
      )}
      // Animation props for visual feedback
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: isOccupied ? 1 : 1.1, y: isOccupied ? 0 : -2 }}
      whileTap={{ scale: isOccupied ? 1 : 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {seat.number}
    </motion.button>
  );
});
Seat.displayName = 'Seat';

// --- Main Component ---

export const SeatSelection = ({
  layout,
  selectedSeats,
  occupiedSeats,
  onSeatSelect,
  className,
}: SeatSelectionProps) => {
  // Framer Motion variants for staggered animations
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.02 } },
  };

  return (
    <div className={cn('w-full flex flex-col items-center gap-12 p-4 bg-background', className)}>
      <Screen />
      <motion.div
        className="w-full flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {layout.map((category) => (
          <div key={category.categoryName} className="flex flex-col items-center gap-3">
            <h3 className="text-sm font-semibold text-foreground">
              {category.categoryName} ({new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(category.price)} + GST)
            </h3>
            <div className="w-full bg-card p-2 sm:p-4 rounded-lg border flex flex-col gap-2">
              {category.rows.map((row) => (
                <motion.div
                  key={row.rowId}
                  className="flex items-center justify-center gap-2"
                  variants={rowVariants}
                >
                  <div className="w-6 text-sm font-medium text-muted-foreground select-none">{row.rowId}</div>
                  <div className="flex-1 flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap">
                    {row.seats.map((seat) => (
                      <Seat
                        key={seat.id}
                        seat={seat}
                        onSelect={onSeatSelect}
                        status={
                          occupiedSeats.includes(seat.id)
                            ? 'occupied'
                            : selectedSeats.includes(seat.id)
                            ? 'selected'
                            : 'available'
                        }
                      />
                    ))}
                  </div>
                  <div className="w-6 text-sm font-medium text-muted-foreground select-none">{row.rowId}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};