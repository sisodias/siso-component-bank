// components/ui/mentors-section.tsx
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../_utils/cn"; // Your utility for merging class names

// --- TYPE DEFINITIONS ---
interface Mentor {
  id: number;
  name: string;
  role: string;
  category: string;
  gigs: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  description: string;
}

interface MentorsSectionProps {
  mentors: Mentor[];
  categories: string[];
}

// --- SUB-COMPONENTS ---

// A single mentor card with hover animation
const MentorCard = ({ mentor }: { mentor: Mentor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="relative flex flex-col overflow-hidden rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
  >
    {/* Bookmark Icon */}
    <button className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm transition-colors hover:bg-muted">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
    </button>
    
    <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg">
      <img src={mentor.imageUrl} alt={mentor.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
    </div>
    
    <h3 className="text-lg font-semibold">{mentor.name}</h3>
    <p className="text-sm text-muted-foreground">{mentor.role} &middot; {mentor.gigs} Gigs</p>
    
    <div className="my-3 flex items-center gap-2">
      <span className="font-bold text-lg">{mentor.rating.toFixed(1)}</span>
      <div className="flex text-muted-foreground">
        {/* Simple star rating representation */}
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < Math.round(mentor.rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(i < Math.round(mentor.rating) ? "text-primary" : "text-muted-foreground/50")}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        ))}
      </div>
      <span className="text-xs text-muted-foreground uppercase">({mentor.reviews} Reviews)</span>
    </div>

    <p className="text-sm text-muted-foreground flex-grow">{mentor.description}</p>
  </motion.div>
);

// --- MAIN COMPONENT ---
export const MentorsSection = ({ mentors, categories }: MentorsSectionProps) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMentors = activeCategory === "All"
    ? mentors
    : mentors.filter((mentor) => mentor.category === activeCategory);

  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h2 className="text-4xl font-serif text-foreground mb-4 sm:mb-0">Mentors</h2>
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Animated Mentor Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};