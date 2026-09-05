import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, LucideIcon } from 'lucide-react';

interface ComparisonStep {
  text: string;
  time: string;
  isPositive: boolean;
}

interface ComparisonCardProps {
  title: string;
  timeBadgeText: string;
  timeBadgeBgColor?: string;
  timeBadgeTextColor?: string;
  steps: ComparisonStep[];
  totalTimeText: string;
  totalTimeColor?: string;
}

interface ComparisonSectionProps {
  badgeIcon?: LucideIcon;
  badgeText?: string;
  badgeColor?: string;
  badgeBgColor?: string;
  badgeBorderColor?: string;
  headline: string;
  highlightedText: string;
  highlightGradient?: string;
  subheadline: string;
  leftCard: ComparisonCardProps;
  rightCard: ComparisonCardProps;
  footerText?: string;
  footerHighlight?: string;
  footerHighlightColor?: string;
  backgroundColor?: string;
}

const ComparisonCard = ({ 
  title, 
  timeBadgeText, 
  timeBadgeBgColor = 'bg-blue-500/20', 
  timeBadgeTextColor = 'text-blue-400', 
  steps, 
  totalTimeText, 
  totalTimeColor = 'text-blue-400' 
}: ComparisonCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col h-full shadow-xl">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${timeBadgeBgColor} ${timeBadgeTextColor}`}>
          {timeBadgeText}
        </span>
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start space-x-3 text-muted-foreground text-sm">
            <div className="min-w-5 min-h-5 pt-0.5 flex-shrink-0">
              {step.isPositive ? 
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                <XCircle className="w-4 h-4 text-destructive/80" />
              }
            </div>
            <span>{step.text} <span className="text-black/80 dark:text-muted-foreground/60">({step.time})</span></span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-1">Time spent per week</p>
        <p className={`text-2xl font-bold ${totalTimeColor}`}>{totalTimeText}</p>
      </div>
    </div>
  );
};

export const ComparisonSection = ({
  badgeIcon: BadgeIcon,
  badgeText = "Comparison",
  badgeColor = "text-primary",
  badgeBgColor = "bg-primary/10",
  badgeBorderColor = "border-primary/30",
  headline,
  highlightedText,
  highlightGradient = "from-blue-400 via-purple-400 to-pink-400",
  subheadline,
  leftCard,
  rightCard,
  footerText,
  footerHighlight,
  footerHighlightColor = "text-primary",
  backgroundColor = "bg-background"
}: ComparisonSectionProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6 },
    }),
  };

  return (
    <section className={`dark: bg-white py-16 md:py-24 ${backgroundColor} px-4 md:px-8 lg:px-16 relative z-10`}>
      <div className="container mx-auto text-center">
        {BadgeIcon && (
          <motion.div
            className={`inline-flex items-center space-x-1.5 py-1 px-3 mb-4 ${badgeColor} border ${badgeBorderColor} ${badgeBgColor} w-fit font-medium text-xs rounded-full`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <BadgeIcon className="w-3 h-3" />
            <span>{badgeText}</span>
          </motion.div>
        )}

        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight max-w-3xl mx-auto text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {headline}{' '}
          <span className={`bg-gradient-to-r ${highlightGradient} bg-clip-text text-transparent`}>
            {highlightedText}
          </span>
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subheadline}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-8 lg:gap-12 max-w-5xl mx-auto">
          <motion.div 
            variants={cardVariants} 
            custom={0} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
          >
            <ComparisonCard {...leftCard} />
          </motion.div>

          <motion.div
            className="hidden md:flex flex-col items-center justify-center py-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-px h-full bg-border"></div>
            <span className="absolute text-xs font-semibold text-muted-foreground bg-background px-2 py-1">
              VS
            </span>
          </motion.div>

          <motion.div 
            variants={cardVariants} 
            custom={1} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
          >
            <ComparisonCard {...rightCard} />
          </motion.div>
        </div>

        {footerText && (
          <motion.p
            className="mt-12 md:mt-16 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {footerText} {footerHighlight && <span className={`font-semibold ${footerHighlightColor}`}>{footerHighlight}</span>}
          </motion.p>
        )}
      </div>
    </section>
  );
};