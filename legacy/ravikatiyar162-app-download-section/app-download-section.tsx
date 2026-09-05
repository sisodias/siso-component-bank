// components/ui/app-download-section.tsx
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming you have a utils file for clsx

// Define the types for the props to ensure type safety and clarity
interface Feature {
  icon: React.ReactNode;
  title: string;
}

interface Benefit {
  icon: React.ReactNode;
  title: string;
}

export interface AppDownloadSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
  benefits: Benefit[];
  qrCodeUrl: string;
  qrCodeAlt: string;
  mainImageUrl: string;
  mainImageAlt: string;
  className?: string;
}

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
    },
  },
};

const imageVariants = {
    hidden: { x: 50, opacity: 0, scale: 0.9 },
    visible: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            duration: 1.2,
            bounce: 0.3,
        }
    }
}

export const AppDownloadSection = ({
  title,
  subtitle,
  features,
  benefits,
  qrCodeUrl,
  qrCodeAlt,
  mainImageUrl,
  mainImageAlt,
  className,
}: AppDownloadSectionProps) => {
  return (
    <section className={cn('w-full bg-background text-foreground py-12 lg:py-24', className)}>
      <motion.div 
        className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Left Content Column */}
        <div className="flex flex-col space-y-8">
          <motion.div className="space-y-2" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          </motion.div>

          {/* Features Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} className="flex flex-col items-center text-center space-y-2" variants={itemVariants}>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium">{feature.title}</span>
              </motion.div>
            ))}
          </div>

          {/* QR Code Section */}
          <motion.div className="flex flex-col items-center space-y-2" variants={itemVariants}>
            <img src={qrCodeUrl} alt={qrCodeAlt} className="w-36 h-36 rounded-lg border" />
            <p className="text-sm text-muted-foreground">Scan QR Code to Download</p>
          </motion.div>

          {/* Benefits Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
             {benefits.map((benefit, index) => (
              <motion.div key={index} className="flex items-center space-x-2" variants={itemVariants}>
                <div className='text-primary'>{benefit.icon}</div>
                <span className="text-sm font-medium">{benefit.title}</span>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Right Image Column */}
        <motion.div className="flex items-center justify-center" variants={imageVariants}>
          <img
            src={mainImageUrl}
            alt={mainImageAlt}
            className="max-w-md w-full h-auto object-contain"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};