import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a utility for class names
import { Button } from "./button"; // Assuming a shadcn button component

// TypeScript interface for each team member
interface TeamMember {
  name: string;
  role: string;
  imageSrc: string;
  themeColor: string; // e.g., 'bg-[#F9D4D5]'
}

// Props for the main component
interface TeamShowcaseProps {
  title?: string;
  description?: string;
  buttonText?: string;
  members: TeamMember[];
}

const TeamShowcase = React.forwardRef<HTMLDivElement, TeamShowcaseProps>(
  (
    {
      title = "THE MAGIC DEVS YOU'VE BEEN SEARCHING FOR",
      description = "Why wasting time on so many different platforms for searching, interviewing and find out that it’s not a good fit? We do all of these for you. No more back and forth. Get matched today.",
      buttonText = "FIND YOUR DEVELOPER",
      members,
      className,
      ...props
    },
    ref
  ) => {
    // Animation variants for the container to stagger children
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
        },
      },
    };

    // Animation variants for each card
    const cardVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 10,
        },
      },
    };

    return (
      <section
        ref={ref}
        className={cn("w-full bg-background text-foreground py-16 px-4 md:px-8", className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Header Section */}
          <div className="max-w-xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              {title}
            </h1>
            <p className="text-muted-foreground mb-8">{description}</p>
            <Button size="lg">{buttonText}</Button>
          </div>

          {/* Members Showcase Section */}
          <motion.div
            className="w-full flex justify-center items-end -space-x-8 md:space-x-4 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {members.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="w-full max-w-[200px] md:max-w-[250px]"
                  variants={cardVariants}
                  whileHover={{ y: -10, scale: 1.05, zIndex: 40 }}
                  style={{ zIndex: members.length - index }}
                >
                  <div
                    className={cn(
                      "relative pt-8 pb-4 px-4 rounded-t-[50%] h-[280px] md:h-[350px] flex flex-col items-center justify-between text-center overflow-hidden",
                      member.themeColor
                    )}
                  >
                    <div className="text-black">
                      <h3 className="font-bold text-sm md:text-base">{member.name}</h3>
                      <p className="text-xs md:text-sm opacity-80">{member.role}</p>
                    </div>
                    <img
                      src={member.imageSrc}
                      alt={member.name}
                      className="absolute bottom-0 left-0 w-full h-auto object-cover object-bottom"
                      style={{ maxHeight: "85%" }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    );
  }
);

TeamShowcase.displayName = "TeamShowcase";

export { TeamShowcase };
export type { TeamMember, TeamShowcaseProps };