import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

// Define the types for the component props for reusability and type safety
export interface Highlight {
  icon: React.ReactNode;
  text: string;
}

export interface EventCardProps {
  title: string;
  subtitle: string;
  tagline: string;
  imageUrl: string;
  eventDate: string;
  eventLocation: string;
  highlights: Highlight[];
  qrCodeUrl: string;
  ctaText: string;
  ctaSubtitle: string;
  className?: string;
}

// Reusable IconWrapper component for consistent styling
const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
    {children}
  </div>
);

// Main EventCard component
export const EventCard = React.forwardRef<HTMLDivElement, EventCardProps>(
  (
    {
      title,
      subtitle,
      tagline,
      imageUrl,
      eventDate,
      eventLocation,
      highlights,
      qrCodeUrl,
      ctaText,
      ctaSubtitle,
      className,
    },
    ref
  ) => {
    // Animation variants for Framer Motion
    const cardVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 15,
          stiffness: 100,
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-sm rounded-3xl p-6 font-sans text-white overflow-hidden",
          "bg-gradient-to-br from-[#FF8C42] to-[#FF5722] shadow-2xl shadow-orange-500/30",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        aria-label={`${title} Event Card`}
      >
        {/* Header Section */}
        <motion.header variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
          <h2 className="text-lg font-medium opacity-90">{subtitle}</h2>
          <div className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mt-3">
            {tagline}
          </div>
        </motion.header>

        {/* Main Image Section */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative my-6"
        >
          <img
            src={imageUrl}
            alt="Food festival collage"
            className="w-full h-auto rounded-xl shadow-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
            <span className="text-3xl font-bold tracking-widest text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              FOOD FESTIVAL
            </span>
          </div>
        </motion.div>

        {/* Event Details Section */}
        <motion.div variants={itemVariants} className="space-y-3 bg-black/10 p-4 rounded-xl">
          <div className="flex items-center">
            <IconWrapper>{highlights[0].icon}</IconWrapper>
            <span className="font-semibold">{eventDate}</span>
          </div>
          <div className="flex items-center">
            <IconWrapper>{highlights[1].icon}</IconWrapper>
            <span className="font-semibold">{eventLocation}</span>
          </div>
        </motion.div>
        
        {/* Highlights Section */}
        <motion.div variants={itemVariants} className="my-6 bg-black/10 p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-3">Festival Highlights</h3>
          <ul className="space-y-3">
            {highlights.map((item, index) => (
              <li key={index} className="flex items-center">
                <IconWrapper>{item.icon}</IconWrapper>
                <span className="font-medium">{item.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        
        {/* QR Code / CTA Section */}
        <motion.div variants={itemVariants} className="bg-white/90 p-4 rounded-xl flex items-center gap-4">
          <img src={qrCodeUrl} alt="QR Code to buy tickets" className="w-20 h-20 rounded-md" />
          <div className="text-slate-800">
            <p className="font-bold text-lg">{ctaText}</p>
            <p className="text-sm font-medium text-orange-600">{ctaSubtitle}</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

EventCard.displayName = "EventCard";