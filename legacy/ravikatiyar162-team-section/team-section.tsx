import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility for classnames

// Define the type for each team member
interface TeamMember {
  name: string;
  image: string;
}

// Define the props for the component
export interface AnimatedTeamSectionProps {
  title: string;
  description: string;
  members: TeamMember[];
  className?: string;
}

// Helper function to calculate the final transform values for each card
const getCardState = (index: number, total: number) => {
  const centerIndex = (total - 1) / 2;
  const distanceFromCenter = index - centerIndex;

  // Horizontal spread to ensure cards are wide apart
  const x = distanceFromCenter * 90;
  // Vertical lift to form the curve
  const y = Math.abs(distanceFromCenter) * -30;
  // Rotation for the fanned effect
  const rotate = distanceFromCenter * 12;

  return { x, y, rotate };
};

const AnimatedTeamSection = React.forwardRef<
  HTMLDivElement,
  AnimatedTeamSectionProps
>(({ title, description, members, className, ...props }, ref) => {
  const controls = useAnimation();
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Animation for the container to stagger children
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // REBUILT ANIMATION LOGIC: Integrated positioning directly into framer-motion
  const itemVariants = {
    // All cards start at the center, scaled down
    hidden: { opacity: 0, scale: 0.5, x: 0, y: 0, rotate: 0 },
    // Animate to the final calculated position
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      x: getCardState(i, members.length).x,
      y: getCardState(i, members.length).y,
      rotate: getCardState(i, members.length).rotate,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    }),
  };

  return (
    <section
      ref={ref}
      className={cn("w-full py-20 lg:py-28 overflow-hidden", className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col items-center text-center px-4">
        {/* Section Header */}
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
          {title}
        </h2>
        <p className="max-w-3xl text-muted-foreground md:text-xl">
          {description}
        </p>

        {/* Sized container for the absolute positioning */}
        <motion.div
          ref={inViewRef}
          className="relative mt-20 flex items-center justify-center"
          style={{ minHeight: "250px" }}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {members.map((member, index) => (
            <motion.div
              key={index}
              className="absolute w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-xl overflow-hidden shadow-lg border-2 border-background"
              custom={index} // Pass index to variants for calculation
              variants={itemVariants}
              // Set initial zIndex based on distance from center
              style={{ zIndex: members.length - Math.abs(index - (members.length - 1) / 2) }}
              whileHover={{
                scale: 1.1,
                zIndex: 99,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

AnimatedTeamSection.displayName = "AnimatedTeamSection";

export { AnimatedTeamSection };