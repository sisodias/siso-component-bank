// components/ui/activity-list.tsx

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn

// --- TYPE DEFINITIONS ---
export interface ActivityItem {
  id: string | number;
  name: string;
  description: string;
  avatarUrl: string;
  amount: number;
  date: string;
  currency: string;
}

interface ActivityListProps {
  title: string;
  items: ActivityItem[];
  className?: string;
}

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// --- HELPER FUNCTION ---
const formatCurrency = (amount: number, currency: string) => {
  const sign = amount > 0 ? '+' : '-';
  const absoluteAmount = Math.abs(amount).toLocaleString('en-US');
  return `${sign} ${currency} ${absoluteAmount}`;
};

// --- MAIN COMPONENT ---
const ActivityList = React.forwardRef<HTMLDivElement, ActivityListProps>(
  ({ title, items, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm',
          className
        )}
      >
        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        {items.length > 0 ? (
          <motion.ul
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => (
              <motion.li key={item.id} className="flex items-center gap-4" variants={itemVariants}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>

                {/* Name and Description */}
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>

                {/* Amount and Date */}
                <div className="flex-shrink-0 text-right">
                  <p
                    className={cn(
                      'font-semibold',
                      item.amount > 0 ? 'text-emerald-500' : 'text-destructive'
                    )}
                  >
                    {formatCurrency(item.amount, item.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            No recent activity.
          </div>
        )}
      </div>
    );
  }
);

ActivityList.displayName = 'ActivityList';

export { ActivityList };