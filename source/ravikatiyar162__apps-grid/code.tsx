import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Make sure you have this utility from shadcn

// -- PROPS INTERFACES -- //

/**
 * @property {string} iconSrc - The URL for the app's icon.
 * @property {string} name - The name of the app.
 * @property {string} description - A short description of the app.
 * @property {string} href - The URL the card should link to.
 * @property {string} bgColor - The unique background color for the card (e.g., 'hsl(0, 100%, 96.9%)').
 * @property {string} [className] - Optional additional class names.
 */
interface AppCardProps {
  iconSrc: string;
  name: string;
  description: string;
  href: string;
  bgColor: string;
  className?: string;
}

/**
 * @property {Omit<AppCardProps, 'className'>[]} apps - An array of app data objects.
 */
interface LifestyleAppsGridProps {
  apps: Omit<AppCardProps, 'className'>[];
}


// -- SUB-COMPONENT: AppCard -- //
// This card is a self-contained, animated link block.

const AppCard = ({ iconSrc, name, description, href, bgColor }: AppCardProps) => {
  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg',
        'border border-transparent'
      )}
      style={{ backgroundColor: bgColor }}
      variants={cardVariants}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div>
        <div className="mb-4 h-16 w-16 overflow-hidden rounded-xl bg-white/50 flex items-center justify-center">
          <img src={iconSrc} alt={`${name} logo`} className="h-16 w-16 object-contain" />
        </div>
        <h3 className="text-lg font-bold text-card-foreground">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6 flex items-center text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">
        Check it out
        <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </div>
    </motion.a>
  );
};


// -- MAIN COMPONENT: LifestyleAppsGrid -- //
// This component orchestrates the layout and renders the AppCards.

export const LifestyleAppsGrid = ({ apps }: LifestyleAppsGridProps) => {
  // Stagger animation for the grid container
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-4 text-center">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src="https://b.zmtcdn.com/data/o2_assets/81ed35564614cbdf5188bb72dc7e57b51739536377.png" 
          alt="Eternal Logo" 
          className="mx-auto h-16 w-auto mb-2" 
        />
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          eternal
        </h1>
        <p className="mt-4 text-lg tracking-wider font-medium text-muted-foreground uppercase">
          Powering India's Changing Lifestyles
        </p>
      </motion.div>

      {/* Grid Section */}
      <motion.div
        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {apps.map((app, index) => (
          <AppCard key={index} {...app} />
        ))}
      </motion.div>
    </div>
  );
};