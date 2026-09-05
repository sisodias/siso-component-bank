// components/ui/team-section.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

// Define the type for a single team member
export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  socials?: {
    icon: React.ReactNode;
    url: string;
    name: string;
  }[];
}

// Define the props for the main component
export interface TeamSectionProps {
  title?: string;
  members: TeamMember[];
  className?: string;
}

const TeamSection = React.forwardRef<HTMLDivElement, TeamSectionProps>(
  ({ title = "Meet Our Team", members, className, ...props }, ref) => {
    
    // Animation variants for the container to orchestrate children animations
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
        },
      },
    };

    // Animation variants for each team member card
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 12,
        },
      },
    };

    return (
      <section
        ref={ref}
        className={cn("w-full py-12 md:py-24", className)}
        {...props}
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {title}
              </h2>
              <div className="mx-auto h-1 w-24 bg-primary" />
            </div>
          </div>
          <motion.div
            className="mx-auto mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {members.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group flex flex-col items-center text-center p-6 rounded-3xl bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
              >
                <div className="w-32 h-32 mb-4 rounded-full overflow-hidden shadow-lg border-4 border-card">
                  <img
                    src={member.imageUrl}
                    alt={`Photo of ${member.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-card-foreground">{member.name}</h3>
                <p className="text-muted-foreground mt-1">{member.role}</p>
                {member.socials && (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {member.socials.map((social, socialIndex) => (
                      <a
                        key={socialIndex}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name}'s ${social.name}`}
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }
);

TeamSection.displayName = "TeamSection";

export { TeamSection };