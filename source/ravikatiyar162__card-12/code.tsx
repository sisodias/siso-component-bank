import * as React from 'react';
import { Mail, CalendarDays, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Define the types for the props for strong typing and reusability
interface UserProfile {
  name: string;
  avatarUrl: string;
  company: string;
  location: string;
}

export interface OpportunityCardProps {
  status: string;
  postedBy: UserProfile;
  salaryRange: {
    min: number;
    max: number;
  };
  deadline: string;
  matchPercentage: number;
  rating: number;
  tags: string[];
  description: string;
  recruiter: UserProfile;
  onAccept: () => void;
  onDecline: () => void;
  className?: string;
}

const OpportunityCard = React.forwardRef<HTMLDivElement, OpportunityCardProps>(
  (
    {
      status,
      postedBy,
      salaryRange,
      deadline,
      matchPercentage,
      rating,
      tags,
      description,
      recruiter,
      onAccept,
      onDecline,
      className,
    },
    ref
  ) => {
    // Helper to format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };
    
    // Animation variants for Framer Motion
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm font-sans',
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-lg">New Opportunity</h2>
          </div>
          <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">{status}</Badge>
        </div>

        <hr className="my-4 border-border" />

        {/* Main Job Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={postedBy.avatarUrl} alt={postedBy.name} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-medium">{postedBy.name}</p>
              <p className="text-sm text-muted-foreground">
                {postedBy.company} &bull; {postedBy.location}
              </p>
            </div>
          </div>

          <h3 className="text-3xl font-bold tracking-tight">
            {formatCurrency(salaryRange.min)} - {formatCurrency(salaryRange.max)}
          </h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>{deadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="font-medium text-green-500">{matchPercentage}% Match</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800">
              <Star className="mr-1.5 h-3.5 w-3.5 fill-current" />
              {rating}
            </Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-muted hover:bg-muted/80">{tag}</Badge>
            ))}
             <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800">
              Responsive
            </Badge>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        {/* Recruiter Info */}
        <div className="mt-6 flex items-center gap-3">
          <img src={recruiter.avatarUrl} alt={recruiter.name} className="h-8 w-8 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium">{recruiter.name}</p>
            <p className="text-xs text-muted-foreground">
              {recruiter.company} &bull; {recruiter.location}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button onClick={onAccept} className="w-full" size="lg">Accept Project</Button>
          <Button onClick={onDecline} variant="outline" className="w-full" size="lg">Decline Offer</Button>
        </div>
      </motion.div>
    );
  }
);

OpportunityCard.displayName = 'OpportunityCard';

export { OpportunityCard };