import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone } from 'lucide-react';
import { cn } from '@/lib/utils'; // Make sure to have a utility function for classnames

// --- PROPS INTERFACE ---
interface OccasionsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName: string;
  primaryTitle: string;
  secondaryTitle: string;
  imageUrl: string;
  backgroundColor: string;
  children: React.ReactNode;
}

const OccasionsCard = React.forwardRef<HTMLDivElement, OccasionsCardProps>(
  ({ brandName, primaryTitle, secondaryTitle, imageUrl, backgroundColor, children, className, ...props }, ref) => {
    // --- ANIMATION VARIANTS ---
    const cardVariants = {
      initial: { opacity: 0, y: 30, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
      exit: { opacity: 0, y: -30, scale: 1.02, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
    };

    const imageVariants = {
      initial: { opacity: 0, scale: 0.5, rotate: -15 },
      animate: { opacity: 1, scale: 1, rotate: 0, transition: { delay: 0.2, duration: 0.5, ease: 'backOut' } },
    };

    return (
      <div
        ref={ref}
        style={{ '--card-bg-color': backgroundColor } as React.CSSProperties}
        className={cn(
          'relative w-full max-w-sm overflow-hidden rounded-2xl bg-[var(--card-bg-color)] font-sans shadow-2xl shadow-black/20',
          className
        )}
        {...props}
      >
        <div className="relative p-6 text-white">
          {/* Decorative pattern in the background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020M40%2040V20L20%2040%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={secondaryTitle} // Animate when the title changes
              initial="initial"
              animate="animate"
              exit="exit"
              variants={cardVariants}
              className="relative z-10"
            >
              {/* Header Text */}
              <div className="mb-4">
                <p className="text-sm font-medium uppercase tracking-widest text-white/80">{brandName}</p>
                <p className="text-2xl font-bold text-yellow-300">{primaryTitle}</p>
                <h1 className="text-4xl font-extrabold tracking-tight">{secondaryTitle}</h1>
              </div>

              {/* Top Right Image */}
              <motion.img
                key={imageUrl} // Animate when the image changes
                src={imageUrl}
                alt={`${secondaryTitle} special`}
                width={140}
                height={140}
                variants={imageVariants}
                className="absolute -right-6 -top-5 h-auto w-36"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card Content Area */}
        <div className="relative rounded-t-2xl bg-background p-5 pt-6">{children}</div>
      </div>
    );
  }
);
OccasionsCard.displayName = 'OccasionsCard';

// --- CHILD COMPONENTS FOR DEMO ---
const DateSelector = () => (
  <div className="flex items-center justify-between rounded-lg border bg-secondary/30 p-3 text-sm">
    <span className="text-muted-foreground">Selected delivery date</span>
    <button className="flex items-center gap-2 font-semibold text-foreground">
      10th December <ChevronDown className="h-4 w-4" />
    </button>
  </div>
);

const HelpBanner = () => (
  <div className="mt-4 flex items-center justify-between rounded-lg bg-card p-3">
    <div className="flex items-center gap-3">
      <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" alt="Support avatar" className="h-10 w-10 rounded-full" />
      <div>
        <p className="font-semibold text-foreground">Need help?</p>
        <p className="text-xs text-muted-foreground">Tap here to connect with us.</p>
      </div>
    </div>
    <Phone className="h-5 w-5 text-orange-500" />
  </div>
);

export { OccasionsCard, DateSelector, HelpBanner };