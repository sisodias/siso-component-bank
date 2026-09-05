// components/ui/team-section.tsx
import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class concatenation

// Define interfaces for props
interface SocialLink {
  icon: React.ElementType; // For Shadcn icons or any SVG component
  href: string;
}

interface TeamMember {
  name: string;
  designation: string;
  imageSrc: string;
  socialLinks?: SocialLink[];
}

interface TeamSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  members: TeamMember[];
  registerLink?: string;
  logo?: React.ReactNode; // For a custom logo, or you can use a string src
  socialLinksMain?: SocialLink[]; // Main social links for the company/section
}

// TeamSection Component
export const TeamSection = React.forwardRef<HTMLDivElement, TeamSectionProps>(
  (
    {
      title,
      description,
      members,
      registerLink,
      logo,
      socialLinksMain,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden bg-background py-12 md:py-24 lg:py-32",
          className
        )}
        {...props}
      >
        <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6">
          {/* Background Grid - for visual appeal */}
          <div className="absolute inset-0 z-0 opacity-5">
            <svg className="h-full w-full" fill="none">
              <defs>
                <pattern
                  id="grid"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M20 0L0 0 0 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-muted-foreground"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Header Section */}
          <div className="relative z-10 flex w-full flex-col items-center justify-between gap-4 md:flex-row md:items-start md:text-left lg:gap-8">
            <div className="grid gap-2 text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-muted-foreground">
                <span className="text-primary block text-xl sm:text-2xl md:text-3xl font-medium">
                  O U R
                </span>
                {title}
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {description}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 md:items-end">
              {logo && <div className="text-2xl font-bold">{logo}</div>}
              {registerLink && (
                <a
                  href={registerLink}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  REGISTER NOW
                </a>
              )}
            </div>
          </div>

          {/* Main Social Links */}
          {socialLinksMain && socialLinksMain.length > 0 && (
            <div className="relative z-10 flex w-full items-center justify-center gap-4 py-4 md:justify-center">
              {socialLinksMain.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
              <span className="text-muted-foreground text-sm">
                www.website.com
              </span>{" "}
              {/* This can also be a prop */}
            </div>
          )}

          {/* Team Members Grid */}
          <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {members.map((member, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center justify-end overflow-hidden rounded-xl bg-card p-6 text-center shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  // Dynamic background color based on index or theme
                  backgroundColor:
                    index === 0
                      ? "hsl(var(--destructive)/0.1)" // Example: using destructive as pinkish
                      : index === 1
                      ? "hsl(var(--muted))" // Example: using muted for grey
                      : "hsl(var(--warning)/0.2)", // Example: using warning as yellowish
                  color: "hsl(var(--foreground))",
                }}
              >
                {/* Background wave animation */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/2 origin-bottom scale-y-0 transform rounded-t-full bg-gradient-to-t from-primary/20 to-transparent transition-transform duration-500 ease-out group-hover:scale-y-100"
                  style={{ transitionDelay: `${index * 50}ms` }}
                />

                {/* Member Image with mask and border animation */}
                <div
                  className="relative z-10 h-36 w-36 overflow-hidden rounded-full border-4 border-transparent bg-background/20 transition-all duration-500 ease-out group-hover:border-primary group-hover:scale-105"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <img
                    src={member.imageSrc}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>

                <h3 className="relative z-10 mt-4 text-xl font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="relative z-10 text-sm text-muted-foreground">
                  {member.designation}
                </p>

                {/* Social Links for individual members */}
                {member.socialLinks && member.socialLinks.length > 0 && (
                  <div className="relative z-10 mt-4 flex gap-3 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                    {member.socialLinks.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <link.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

TeamSection.displayName = "TeamSection";