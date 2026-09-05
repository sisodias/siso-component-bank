import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Define the types for the component props
interface Experience {
  role: string
  company: string
  year: string | number
  link?: string
}

interface ProfileCardProps {
  badge: {
    icon: React.ReactNode
    text: string
  }
  name: string
  title: string
  subtitle: string
  imageUrl: string
  imageAlt: string
  status: {
    isAvailable: boolean
    text: string
  }
  greeting: string
  bio: string
  skills: { text: string; variant?: "default" | "secondary" | "destructive" | "outline" }[]
  experiences: Experience[]
  className?: string
}

// The main ProfileCard component
export const ProfileCard = ({
  badge,
  name,
  title,
  subtitle,
  imageUrl,
  imageAlt,
  status,
  greeting,
  bio,
  skills,
  experiences,
  className,
}: ProfileCardProps) => {
  return (
    <div className={cn("bg-background text-foreground p-8 rounded-2xl w-full max-w-6xl mx-auto", className)}>
      {/* Header Section */}
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4 text-sm font-normal">
          {badge.icon}
          {badge.text}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {name}, <span className="text-muted-foreground">{title}</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Image Card */}
        <div className="lg:col-span-2 w-full">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
            <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Status Indicator */}
            <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm py-1 px-3 rounded-full border border-border/50">
                    <span className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        status.isAvailable ? "bg-green-500 animate-pulse" : "bg-red-500"
                    )}></span>
                    <span className="text-xs text-card-foreground">{status.text}</span>
                </div>
            </div>

            {/* Greeting Text */}
            <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-semibold text-white">{greeting}</h3>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-3 flex flex-col justify-center space-y-8">
          
          {/* Bio Section */}
          <div>
            <p className="text-muted-foreground leading-relaxed">{bio}</p>
          </div>

          <hr className="border-border/50" />

          {/* Skills Section */}
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant={skill.variant || "secondary"} className="text-sm font-normal">
                {skill.text}
              </Badge>
            ))}
          </div>

          {/* Experiences Section */}
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <a 
                href={exp.link || '#'} 
                key={index} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors duration-200 group"
              >
                <div className="text-sm font-medium">{exp.role}</div>
                <div className="text-sm text-muted-foreground">{exp.company}</div>
                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">{exp.year}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground transform transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        <path d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}