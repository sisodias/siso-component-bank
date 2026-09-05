import React from "react";
import { ArrowRight } from "lucide-react";

// ============================================
// UTILITY FUNCTION
// ============================================
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// ============================================
// BADGE COMPONENT
// ============================================
const Badge = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={cn(
    "inline-flex items-center rounded-full border-0",
    "px-4 py-1.5 text-sm font-medium transition-all duration-300",
    "bg-transparent text-neutral-600 hover:scale-105",
    className
  )}>
    {children}
  </div>
);

// ============================================
// BUTTON COMPONENT
// ============================================
const Button = ({ 
  children, 
  variant = "default",
  className,
  href
}: { 
  children: React.ReactNode;
  variant?: "default" | "ghost";
  className?: string;
  href: string;
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full text-base font-semibold transition-all duration-300 px-10 py-4";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-800 hover:shadow-2xl hover:scale-105 transform",
    ghost: "bg-transparent text-neutral-600 border-2 border-neutral-600 hover:text-blue-700 hover:border-blue-700 hover:scale-105 hover:shadow-lg transform"
  };

  return (
    <a 
      href={href}
      className={cn(baseStyles, variants[variant], className)}
    >
      {children}
    </a>
  );
};

// ============================================
// MOCKUP COMPONENTS
// ============================================
const Mockup = ({ 
  children,
}: { 
  children: React.ReactNode;
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-gray-900/60 border border-gray-800/60 ring-1 ring-gray-700/40">
      {children}
    </div>
  );
};

const MockupFrame = ({ 
  children,
  className
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(
      "relative p-3 rounded-3xl bg-gradient-to-br from-gray-900/70 via-gray-900/50 to-gray-800/40 backdrop-blur-xl border border-gray-800/60",
      className
    )}>
      {children}
    </div>
  );
};

// ============================================
// ICONS
// ============================================
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 438.549 438.549" className={className} fill="currentColor">
    <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" />
  </svg>
);

// ============================================
// ANIMATED BLOB COMPONENT
// ============================================
const AnimatedBlob = ({ 
  delay = 0,
  color,
  position,
  size = "600px"
}: {
  delay?: number;
  color: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  size?: string;
}) => {
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const animate = () => {
      const time = Date.now() / 1000 + delay;
      const x = Math.sin(time * 0.5) * 30;
      const y = Math.cos(time * 0.3) * 50;
      const scale = 1 + Math.sin(time * 0.4) * 0.1;
      
      setOffset({ x: x * scale, y: y * scale });
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div 
      className="absolute rounded-full blur-3xl transition-all duration-1000 ease-out"
      style={{
        ...position,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    />
  );
};

// ============================================
// HERO SECTION COMPONENT
// ============================================
interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "ghost";
}

interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
    };
  };
  title: string;
  description: string;
  actions: HeroAction[];
  image: {
    src: string;
    alt: string;
  };
}

function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-32 md:py-40">
      {/* Cinematic Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-pink-200 to-yellow-200">
        {/* Static gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-300/30 via-transparent to-yellow-300/30" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-pink-200/40 to-transparent" />
        
        {/* Animated gradient blobs */}
        <AnimatedBlob 
          delay={0}
          color="rgba(187, 247, 208, 0.4)"
          position={{ top: "0", left: "0" }}
          size="600px"
        />
        <AnimatedBlob 
          delay={2}
          color="rgba(251, 207, 232, 0.4)"
          position={{ top: "0", right: "0" }}
          size="500px"
        />
        <AnimatedBlob 
          delay={4}
          color="rgba(254, 240, 138, 0.4)"
          position={{ bottom: "0", left: "33%" }}
          size="550px"
        />
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-soft-light" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl w-full">
        <div className="flex flex-col items-center gap-12 text-center">
          {/* Badge */}
          {badge && (
            <Badge className="animate-fade-in-up cursor-pointer">
              <span className="text-neutral-600">{badge.text}</span>
              <a href={badge.action.href} className="flex items-center gap-1.5 ml-2 text-blue-600 hover:text-blue-800 transition-colors hover:gap-2">
                {badge.action.text}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Badge>
          )}

          {/* Title - Cinematic spacing */}
          <h1 className="animate-fade-in-up text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[1.1] text-neutral-700 tracking-tight max-w-6xl" style={{ animationDelay: '0.1s' }}>
            {title}
          </h1>

          {/* Description - Generous spacing */}
          <p className="animate-fade-in-up text-xl md:text-2xl font-regular text-neutral-800 max-w-3xl leading-relaxed" style={{ animationDelay: '0.2s' }}>
            {description}
          </p>

          {/* Actions - Extra breathing room */}
          <div className="animate-fade-in-up flex flex-wrap justify-center gap-4 mt-4" style={{ animationDelay: '0.3s' }}>
            {actions.map((action, index) => (
              <Button key={index} variant={action.variant} href={action.href}>
                <span className="flex items-center gap-2.5">
                  {action.icon}
                  {action.text}
                </span>
              </Button>
            ))}
          </div>

          {/* Image - Maximum cinematic spacing */}
          <div className="relative w-full max-w-6xl mt-20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <MockupFrame>
              <Mockup>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto rounded-xl"
                />
              </Mockup>
            </MockupFrame>
            
            {/* Glow effect under image */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-gray-900/20 rounded-full blur-3xl animate-pulse-slow" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

// ============================================
// DEMO
// ============================================
export default function HeroSectionDemo() {
  return (
    <div className="min-h-screen">
      <HeroSection
        badge={{
          text: "Introducing our new components",
          action: {
            text: "Learn more",
            href: "#docs",
          },
        }}
        title="Build faster with beautiful components"
        description="Premium UI components built with React and Tailwind CSS. Save time and ship your next project faster with our ready-to-use components."
        actions={[
          {
            text: "Get Started",
            href: "#getting-started",
            variant: "default",
          },
          {
            text: "GitHub",
            href: "#github",
            variant: "ghost",
            icon: <GitHubIcon className="h-5 w-5" />,
          },
        ]}
        image={{
          src: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200&h=800&fit=crop",
          alt: "UI Components Preview",
        }}
      />
    </div>
  );
}