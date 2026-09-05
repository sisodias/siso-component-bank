import { cn } from "@/lib/utils";
import React, { useState, useMemo, memo } from 'react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import {
  Play,
  FileText,
  Sparkles,
  Bot,
  User,
  MessageCircle,
  Mic,
  Brain,
  BrainCircuit,
  MessageSquare,
  Target,
  Video,
  Trophy,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Zap,
  Shield,
  Clock,
  Calendar,
  Lightbulb,
  HeadphonesIcon,
  Star,
  Briefcase,
  Award,
} from 'lucide-react';

// TypeScript Interfaces
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PricingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  highlighted?: boolean;
}

interface Question {
  id: number;
  question: string;
  score: number;
}

interface SectionProps {
  className?: string;
  children?: React.ReactNode;
}

interface HeadingProps {
  level?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  highlighted?: boolean;
}

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

// Reusable Components
const Section = memo<SectionProps>(({ className = '', children }) => (
  <section className={`py-20 ${className}`}>
    {children}
  </section>
));
Section.displayName = 'Section';

const Container = memo<SectionProps>(({ className = '', children }) => (
  <div className={`container mx-auto px-4 ${className}`}>
    {children}
  </div>
));
Container.displayName = 'Container';

const Heading = memo<HeadingProps>(({ level = 'h2', children, className = '' }) => {
  const Component = level;
  const baseStyles = {
    h1: 'text-5xl lg:text-6xl font-bold',
    h2: 'text-4xl font-bold',
    h3: 'text-3xl font-bold',
  };
  
  return (
    <Component className={`${baseStyles[level]} ${className}`}>
      {children}
    </Component>
  );
});
Heading.displayName = 'Heading';

const Button = memo<ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  className = '',
  icon 
}) => {
  const variants = {
    primary: 'text-white bg-gradient-to-r from-primary to-purple-600 hover:opacity-90',
    secondary: 'bg-white text-primary hover:bg-white/90',
    outline: 'border hover:bg-accent',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-lg',
    lg: 'px-8 py-4 text-xl',
  };
  
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
});
Button.displayName = 'Button';

const Card = memo<CardProps>(({ children, className = '', highlighted = false }) => (
  <div className={`p-6 rounded-lg border ${highlighted ? 'border-primary bg-primary/5' : 'bg-card'} hover:shadow-lg transition-shadow ${className}`}>
    {children}
  </div>
));
Card.displayName = 'Card';

const Badge = memo<BadgeProps>(({ children, icon, className = '' }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full border bg-background ${className}`}>
    {icon}
    {children}
  </div>
));
Badge.displayName = 'Badge';

// Feature Components
const FeatureCard = memo<{ feature: Feature; index: number }>(({ feature, index }) => {
  const Icon = feature.icon;
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
        </div>
      </div>
    </Card>
  );
});
FeatureCard.displayName = 'FeatureCard';

const StepCard = memo<{ step: Step; index: number; isLast: boolean }>(({ step, index, isLast }) => (
  <div className="relative">
    {!isLast && (
      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
    )}
    <Card>
      <div className="text-3xl font-bold text-primary mb-4">{step.number}</div>
      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
      <p className="text-sm text-muted-foreground">{step.description}</p>
    </Card>
  </div>
));
StepCard.displayName = 'StepCard';

const BenefitItem = memo<{ benefit: Benefit }>(({ benefit }) => {
  const Icon = benefit.icon;
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-medium">{benefit.title}</p>
        <p className="text-sm text-muted-foreground">{benefit.description}</p>
      </div>
    </div>
  );
});
BenefitItem.displayName = 'BenefitItem';

// Animation Components
const AnimatedParticles = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800">
      <g className="opacity-30 dark:opacity-20">
        {[...Array(20)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 1440}
            cy={Math.random() * 800}
            r="2"
            fill="currentColor"
            className="text-primary/40"
          >
            <animate
              attributeName="cy"
              from={Math.random() * 800}
              to="-10"
              dur={`${15 + Math.random() * 10}s`}
              begin={`${Math.random() * 5}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur={`${15 + Math.random() * 10}s`}
              begin={`${Math.random() * 5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  </div>
));
AnimatedParticles.displayName = 'AnimatedParticles';

const AIInterviewAnimation = memo(() => (
  <svg className="w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
      </linearGradient>
    </defs>

    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.1" />
    </pattern>
    <rect width="640" height="360" fill="url(#grid)" />

    <g className="opacity-30">
      <line x1="200" y1="180" x2="440" y2="180" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
      </line>
    </g>

    <g transform="translate(160, 180)">
      <circle cx="0" cy="0" r="40" fill="url(#aiGradient)">
        <animate attributeName="r" values="40;42;40" dur="3s" repeatCount="indefinite" />
      </circle>
      <g transform="scale(1.5)">
        <Brain className="w-8 h-8 text-primary" style={{ transform: "translate(-16px, -16px)" }} />
      </g>
      <text x="0" y="70" textAnchor="middle" className="fill-primary text-sm font-semibold">
        AI Interviewer
      </text>
    </g>

    <g transform="translate(480, 180)">
      <circle cx="0" cy="0" r="40" fill="url(#userGradient)" />
      <g transform="scale(1.5)">
        <User className="w-8 h-8 text-primary" style={{ transform: "translate(-16px, -16px)" }} />
      </g>
      <g transform="translate(25, -25)">
        <circle cx="0" cy="0" r="12" fill="hsl(var(--destructive))" opacity="0.9">
          <animate attributeName="r" values="12;14;12" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <Mic className="w-4 h-4 text-white" style={{ transform: "translate(-8px, -8px)" }} />
      </g>
      <text x="0" y="70" textAnchor="middle" className="fill-primary text-sm font-semibold">
        Candidate
      </text>
    </g>
  </svg>
));
AIInterviewAnimation.displayName = 'AIInterviewAnimation';

const VideoPreview = memo(() => (
  <div className="relative bg-card border rounded-2xl shadow-2xl p-8">
    <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-lg flex items-center justify-center relative overflow-hidden">
      <AIInterviewAnimation />
    </div>
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <span className="text-sm font-medium">Interview Progress</span>
        <span className="text-sm text-muted-foreground">Question 3 of 10</span>
      </div>
      <div className="p-4 border rounded-lg">
        <p className="font-medium mb-2">Current Question:</p>
        <p className="text-muted-foreground">
          "Tell me about yourself and your professional background"
        </p>
      </div>
    </div>
  </div>
));
VideoPreview.displayName = 'VideoPreview';

const SuccessMetrics = memo(() => (
  <div className="text-center space-y-4 relative z-10">
    <div className="relative inline-block">
      <svg className="w-32 h-32 mx-auto text-primary/50" viewBox="0 0 128 128" fill="currentColor">
        <rect x="24" y="40" width="80" height="60" rx="4" />
        <rect x="32" y="32" width="64" height="8" rx="2" />
        <circle cx="40" cy="60" r="4" />
        <circle cx="64" cy="60" r="4" />
        <circle cx="88" cy="60" r="4" />
        <rect x="36" y="72" width="56" height="4" rx="2" />
        <rect x="36" y="82" width="40" height="4" rx="2" />
      </svg>
      <svg className="absolute -top-2 -right-2 w-8 h-8 text-green-500 animate-bounce" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="12" fillOpacity="0.2" />
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    </div>
    <p className="text-2xl font-bold">95% Success Rate</p>
    <p className="text-muted-foreground">Users who practice with our mock interviews</p>
  </div>
));
SuccessMetrics.displayName = 'SuccessMetrics';

const InterviewPerformanceReport = memo(() => {
  const questions: Question[] = useMemo(() => [
    { id: 1, question: "Tell me about yourself", score: 75 },
    { id: 2, question: "State management approach", score: 60 }
  ], []);

  const skills = useMemo(() => [
    { name: 'Communication', score: 20, color: 'bg-destructive' },
    { name: 'Technical', score: 25, color: 'bg-orange-500' },
    { name: 'Problem Solving', score: 15, color: 'bg-destructive' }
  ], []);

  return (
    <div className="rounded-lg border bg-card shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-4">
        <h3 className="text-lg font-semibold">Performance Report</h3>
        <div className="flex items-center gap-3 text-xs text-white/70 mt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> 45 min
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Today
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--destructive))" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="276.5" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-destructive">2%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Overall Score</p>
              <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-destructive/10 text-destructive">
                Needs Improvement
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">8/9</p>
            <p className="text-xs text-muted-foreground">Answered</p>
          </div>
        </div>

        <div className="space-y-2 p-3 bg-muted rounded-lg">
          {skills.map((skill, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{skill.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-muted-foreground/20 rounded-full">
                  <div className={`h-full rounded-full ${skill.color}`} style={{ width: `${skill.score}%` }} />
                </div>
                <span>{skill.score}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold">Quick Tips</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            <li>• Use STAR method</li>
            <li>• Include metrics</li>
            <li>• Be specific</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium">Questions Overview</p>
          {questions.map((q) => (
            <div key={q.id} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-xs text-muted-foreground">Q{q.id}: {q.question}</span>
              <span className="text-xs font-medium">{q.score}%</span>
            </div>
          ))}
        </div>

        <Button variant="primary" size="sm" className="w-full">
          View Full Report
        </Button>
      </div>
    </div>
  );
});
InterviewPerformanceReport.displayName = 'InterviewPerformanceReport';

// Main Component
export const Component = () => {
  // Data
  const features: Feature[] = useMemo(
    () => [
      {
        icon: BrainCircuit,
        title: "Smart Question Generation",
        description:
          "Advanced AI creates personalized questions matching your specific role and experience level",
      },
      {
        icon: MessageSquare,
        title: "Instant Performance Analysis",
        description:
          "Get immediate insights on your communication style and answer quality",
      },
      {
        icon: Target,
        title: "Role-Specific Scenarios",
        description:
          "Practice with realistic situations you'll face in your target position",
      },
      {
        icon: Video,
        title: "Complete Interview Simulation",
        description:
          "Experience full interview sessions with comprehensive performance tracking",
      },
    ],
    []
  );

  const steps: Step[] = useMemo(
    () => [
      {
        number: "01",
        title: "Select Your Role",
        description:
          "Choose your target position and industry for tailored questions",
      },
      {
        number: "02",
        title: "Practice Interview",
        description:
          "Answer real-world questions in a simulated interview environment",
      },
      {
        number: "03",
        title: "Get Feedback",
        description: "Receive detailed AI-powered feedback on your performance",
      },
      {
        number: "04",
        title: "Improve & Succeed",
        description: "Apply insights and ace your real interview",
      },
    ],
    []
  );

  const benefits: Benefit[] = useMemo(
    () => [
      {
        icon: CheckCircle,
        title: "Build Confidence",
        description: "Practice makes perfect - reduce interview anxiety",
      },
      {
        icon: Trophy,
        title: "Improve Performance",
        description: "Get actionable feedback to enhance your responses",
      },
      {
        icon: Zap,
        title: "Save Time",
        description: "Efficient preparation with focused practice sessions",
      },
      {
        icon: Shield,
        title: "Industry Insights",
        description: "Learn what top companies are looking for",
      },
      {
        icon: MessageCircle,
        title: "AI Interview Coach",
        description: "Chat with AI to improve answers and identify weaknesses",
      },
      {
        icon: Bot,
        title: "Personalized Guidance",
        description: "Get question-specific tips on where you went wrong",
      },
    ],
    []
  );

  const includedFeatures: Feature[] = useMemo(
    () => [
      {
        icon: FileText,
        title: "Resume Reviews",
        description:
          "You can receive 20 reviews from your peers, tailor-made for each job application.",
      },
      {
        icon: BrainCircuit,
        title: "AI Resume Wizard",
        description:
          "Starting from getting your name, skills, area of expertise, and projects, we tailor the best resumes for you.",
      },
      {
        icon: Briefcase,
        title: "Portfolio",
        description:
          "Showcase your best work and projects in a visually appealing portfolio.",
      },
      {
        icon: Award,
        title: "Certifications",
        description:
          "Track and showcase your professional certifications and achievements to boost your credibility.",
      },
    ],
    []
  );

  const pricingFeatures: PricingFeature[] = useMemo(
    () => [
      {
        icon: MessageSquare,
        title: "Advanced Analytics",
        description:
          "Deep performance insights with detailed scoring across multiple evaluation criteria",
        highlighted: false,
      },
      {
        icon: Target,
        title: "Custom Question Banks",
        description:
          "Access exclusive question libraries curated by industry experts and hiring managers",
        highlighted: true,
      },
      {
        icon: Video,
        title: "Video Interview Practice",
        description:
          "Record and review your video responses with body language and tone analysis.",
        highlighted: false,
      },
    ],
    []
  );

  const checklistItems: string[] = useMemo(
    () => [
      "Unlimited mock interviews",
      "Industry-specific questions",
      "Behavioral interview practice",
      "Technical interview preparation",
      "STAR method coaching",
      "Body language analysis",
      "Voice tone feedback",
      "Personalized improvement tips",
    ],
    []
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
        <AnimatedParticles />

        <Container className="py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge
                icon={
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                }
              >
                <span className="font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  AI-Powered Interview Prep
                </span>
              </Badge>

              <Heading level="h1">
                <span className="text-foreground">Master Your</span>{" "}
                <span className="block mt-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Interview Skills
                </span>
              </Heading>

              <p className="text-xl text-muted-foreground">
                Ace your next interview with AI-powered mock interviews. Get
                role-specific questions, instant feedback, and personalized
                coaching to boost your confidence and land your dream job.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button icon={<Play className="w-5 h-5" />}>
                  Start Mock Interview
                </Button>
                <Button
                  variant="outline"
                  icon={<FileText className="w-5 h-5" />}
                >
                  View Sample Questions
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-4">
                  {[33, 48, 29, 68, 45].map((img, i) => (
                    <div key={i} className="relative" style={{ zIndex: 5 - i }}>
                      <Image
                        src={`https://i.pravatar.cc/150?img=${img}`}
                        alt={`Professional ${i + 1}`}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full border-2 border-background object-cover"
                      />
                      {i === 0 && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                      )}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 border-2 border-background flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">+10k</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  10,000+ interviews practiced
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 blur-3xl animate-pulse" />
              <VideoPreview />
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="bg-muted/50">
        <Container>
          <div className="text-center mb-12">
            <Badge
              icon={<Trophy className="w-4 h-4 text-primary" />}
              className="mb-4"
            >
              Features and Benefits
            </Badge>
            <Heading className="mb-4">Key Features</Heading>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your interview skills with comprehensive training tools
              designed to build confidence and deliver results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>

          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-12 space-y-6">
                <Badge
                  icon={<Sparkles className="w-4 h-4" />}
                  className="bg-secondary"
                >
                  Premium Feature
                </Badge>
                <Heading level="h3">Smart Training System</Heading>
                <p className="text-muted-foreground">
                  Experience comprehensive interview preparation with our
                  intelligent training platform. Build confidence through
                  progressive practice sessions that adapt to your skill level
                  and provide actionable insights for continuous improvement.
                </p>
                <ul className="space-y-3">
                  {[
                    "Progressive difficulty levels for skill development",
                    "Comprehensive performance metrics and analytics",
                    "Personalized coaching recommendations",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button icon={<ArrowRight className="w-5 h-5" />}>
                  Start Training
                </Button>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 p-12 flex items-center justify-center">
                <SuccessMetrics />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* How It Works Section */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <Badge
              icon={<Lightbulb className="w-4 h-4 text-primary" />}
              className="mb-4"
            >
              Ace Your Interview Practice
            </Badge>
            <Heading className="mb-4">How It Works</Heading>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow our proven 4-step process to interview success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                index={index}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Feedback & Analytics Section */}
      <Section className="bg-muted/50">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <InterviewPerformanceReport />
            </div>
            <div className="space-y-6">
              <Badge icon={<BarChart3 className="w-4 h-4 text-primary" />}>
                Detailed Analytics
              </Badge>
              <Heading>Detailed Feedback</Heading>
              <p className="text-xl text-muted-foreground">
                Our AI analyzes your responses and provides detailed feedback on
                areas for improvement, including communication, content, and
                presentation. Enhance your strengths, address your weaknesses,
                and increase your chances of success.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <BenefitItem key={index} benefit={benefit} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Included Features Section */}
      <Section>
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Badge
                  icon={<Star className="w-4 h-4 text-primary" />}
                  className="mb-4"
                >
                  Included with every plan
                </Badge>
                <Heading className="mb-6">
                  Everything You Need to Succeed
                </Heading>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {includedFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-lg border bg-gradient-to-br from-primary/5 to-purple-600/5">
                <h3 className="text-xl font-semibold mb-2">
                  All Features Included
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Everything you need for interview success
                </p>
                <ul className="space-y-3">
                  {checklistItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6">Get Started Free</Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Pricing Section */}
      <Section className="bg-muted/50">
        <Container>
          <div className="text-center mb-12">
            <Badge
              icon={<Zap className="w-4 h-4 text-primary" />}
              className="mb-4"
            >
              Pro Features
            </Badge>
            <Heading className="mb-4">Pro Features</Heading>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlock premium features to enhance your interview preparation.
              Gain access to personalized feedback, industry-specific questions,
              and video interview practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} highlighted={feature.highlighted}>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button icon={<ArrowRight className="w-5 h-5" />}>
              View Pricing Plans
            </Button>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-primary to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute bottom-0 left-0 w-full h-32"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z"
              fill="currentColor"
              fillOpacity="0.1"
            >
              <animate
                attributeName="d"
                values="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z;M0,64 C480,-20 960,150 1440,64 L1440,120 L0,120 Z;M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
        <Container className="text-center relative z-10">
          <Heading className="mb-4 text-white">Ready to Start?</Heading>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Get expert feedback with our mock interview to polish your answers,
            reduce stress, and boost your confidence for your next interview.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" icon={<Play className="w-5 h-5" />}>
              Begin Free Practice
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              icon={<HeadphonesIcon className="w-5 h-5" />}
            >
              Schedule Consultation
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/70">
            No credit card required • 5 free practice sessions included
          </p>
        </Container>
      </Section>
    </div>
  );
};
