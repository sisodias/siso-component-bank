"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  BookOpen,
  Trophy,
  Briefcase,
  MessageSquare,
  FileText,
  Search,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Globe,
  Clock,
  BarChart3,
  Sparkles,
  ArrowRight,
  Check,
  Play,
  Award,
  Target,
  Rocket,
  Brain,
  Heart,
  TrendingUp,
  School,
  Video,
  Calendar,
  MapPin,
  Laptop,
  Smartphone,
  Monitor,
  ChevronDown,
  Plus,
  Minus,
  Building2,
  Lightbulb,
  HandshakeIcon,
  MessagesSquare,
  Code2,
  Palette,
  Database,
  Cloud,
} from "lucide-react";

// Reusable Components
const FeatureCard = ({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) => (
  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white group">
    <div className="p-6">
      <div
        className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </Card>
);

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="text-center">
    <div className="flex items-center justify-center mb-2 text-purple-600">
      {icon}
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

const ProcessStepCard = ({
  step,
  title,
  description,
  icon,
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 bg-white relative z-10 group">
    <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
      <span className="text-lg font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
        {step}
      </span>
    </div>
    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Card>
);

const TestimonialCard = ({
  name,
  role,
  content,
  rating,
  image,
}: {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}) => (
  <Card className="h-full border-0 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all duration-300">
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {image}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
      </div>
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 italic">"{content}"</p>
    </div>
  </Card>
);

const PricingCard = ({
  plan,
}: {
  plan: any;
}) => (
  <div className={`relative ${plan.popular ? "md:-mt-4" : ""}`}>
    {plan.popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-4 py-1">
          Most Popular
        </Badge>
      </div>
    )}
    <Card
      className={`h-full ${plan.popular ? "border-2 border-purple-500 shadow-xl" : "border-gray-200"}`}
    >
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold">{plan.price}</span>
          {plan.period && <span className="text-gray-600">{plan.period}</span>}
        </div>
        <p className="text-gray-600 mb-6">{plan.description}</p>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature: string, featureIndex: number) => (
            <li key={featureIndex} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className={`w-full ${
            plan.popular
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
          size="lg"
        >
          {plan.cta}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  </div>
);

const SectionHeader = ({
  badge,
  badgeIcon,
  badgeText,
  title,
  subtitle,
}: {
  badge: string;
  badgeIcon: React.ReactNode;
  badgeText: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="text-center mb-12">
    <Badge className={`mb-4 ${badge}`}>
      {badgeIcon}
      {badgeText}
    </Badge>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    )}
  </div>
);

export const Component = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Campus Management",
      description: "Streamline academic operations with smart tools",
      color: "bg-purple-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Connect & Collaborate",
      description: "Build your campus network and share ideas",
      color: "bg-blue-500",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Skill Development",
      description: "Access courses and enhance your knowledge",
      color: "bg-green-500",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Career Opportunities",
      description: "Find internships and job placements",
      color: "bg-orange-500",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI-Powered Chat",
      description: "Get instant help with smart AI assistance",
      color: "bg-pink-500",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Resume Builder",
      description: "Create professional resumes with ease",
      color: "bg-indigo-500",
    },
  ];

  const stats = [
    {
      label: "Active Students",
      value: "10K+",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Courses Available",
      value: "500+",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: "Job Placements",
      value: "95%",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      label: "Campus Partners",
      value: "50+",
      icon: <Globe className="w-5 h-5" />,
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Sign Up",
      description: "Create your account in seconds with your college email",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: "02",
      title: "Complete Profile",
      description: "Add your academic details and interests",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      step: "03",
      title: "Explore Features",
      description: "Access all campus tools and resources",
      icon: <Rocket className="w-6 h-6" />,
    },
    {
      step: "04",
      title: "Connect & Grow",
      description: "Network with peers and achieve your goals",
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  const campusTools = [
    {
      category: "Academic Excellence",
      icon: <GraduationCap className="w-8 h-8" />,
      tools: [
        { name: "Smart Timetable", desc: "AI-powered schedule optimization" },
        { name: "Grade Tracker", desc: "Real-time academic performance" },
        { name: "Study Groups", desc: "Collaborative learning spaces" },
        { name: "Assignment Hub", desc: "Centralized submission portal" },
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      category: "Career Development",
      icon: <Briefcase className="w-8 h-8" />,
      tools: [
        { name: "Job Portal", desc: "Exclusive campus placements" },
        { name: "Mock Interviews", desc: "AI-powered practice sessions" },
        { name: "Skill Assessments", desc: "Industry-standard evaluations" },
        { name: "Mentor Connect", desc: "1-on-1 guidance from experts" },
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      category: "Campus Life",
      icon: <Heart className="w-8 h-8" />,
      tools: [
        { name: "Event Calendar", desc: "Never miss campus activities" },
        { name: "Club Management", desc: "Join and manage societies" },
        { name: "Campus News", desc: "Stay updated with announcements" },
        { name: "Feedback System", desc: "Voice your opinions" },
      ],
      color: "from-green-500 to-teal-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content:
        "This platform transformed my college experience. The AI tools and career resources are incredible!",
      rating: 5,
      image: "SJ",
    },
    {
      name: "Michael Chen",
      role: "MBA Graduate",
      content:
        "Found my dream job through the placement portal. The interview prep features were game-changing.",
      rating: 5,
      image: "MC",
    },
    {
      name: "Priya Patel",
      role: "Engineering Student",
      content:
        "The collaborative features helped me connect with mentors and build amazing projects.",
      rating: 5,
      image: "PP",
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Access to core features",
        "Basic resume builder",
        "Limited AI chat support",
        "Join study groups",
        "Event notifications",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "Unlock your full potential",
      features: [
        "Everything in Basic",
        "Advanced AI assistance",
        "Unlimited mock interviews",
        "Priority job matching",
        "Personal mentor access",
        "Certificate generation",
        "Analytics dashboard",
      ],
      cta: "Go Pro",
      popular: true,
    },
    {
      name: "Campus",
      price: "Custom",
      description: "For institutions",
      features: [
        "Everything in Pro",
        "Bulk user management",
        "Custom branding",
        "Advanced analytics",
        "Dedicated support",
        "API access",
        "Training sessions",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const partners = [
    { name: "Google", icon: <Building2 className="w-12 h-12" /> },
    { name: "Microsoft", icon: <Building2 className="w-12 h-12" /> },
    { name: "Amazon", icon: <Building2 className="w-12 h-12" /> },
    { name: "Meta", icon: <Building2 className="w-12 h-12" /> },
    { name: "Apple", icon: <Building2 className="w-12 h-12" /> },
    { name: "Netflix", icon: <Building2 className="w-12 h-12" /> },
  ];

  const faqs = [
    {
      question: "How do I get started with Campus Hub?",
      answer:
        "Simply click on 'Get Started' and sign up with your college email. Complete your profile and you're ready to explore all features!",
    },
    {
      question: "Is Campus Hub free for students?",
      answer:
        "Yes! We offer a free Basic plan with core features. For advanced features like unlimited AI assistance and mock interviews, you can upgrade to Pro.",
    },
    {
      question: "Can I use Campus Hub on mobile devices?",
      answer:
        "Absolutely! Campus Hub is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile.",
    },
    {
      question: "How does the AI-powered assistance work?",
      answer:
        "Our AI assistant uses advanced language models to help with academic queries, career guidance, resume building, and interview preparation.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use industry-standard encryption and security measures to protect your data. We never share your personal information without consent.",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Campus Hub
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="hidden sm:flex"
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
              >
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-52 sm:w-72 h-52 sm:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div
            className="absolute top-40 right-10 w-52 sm:w-72 h-52 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute -bottom-8 left-20 w-52 sm:w-72 h-52 sm:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Campus Platform
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  Campus Journey
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Join 10,000+ students using our AI-powered platform to excel
                academically, build meaningful connections, and launch
                successful careers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Start Your Journey
                  <Rocket className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-lg px-8 py-6 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:text-purple-600" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>Award Winning</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-0 shadow-2xl rounded-3xl">
                  <div className="p-8">
                    {/* Animated Dashboard Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                            <BarChart3 className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-semibold">Academic Progress</p>
                            <p className="text-sm text-gray-600">
                              85% Complete
                            </p>
                          </div>
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-xl shadow-sm">
                          <Brain className="w-8 h-8 text-blue-500 mb-2" />
                          <p className="font-semibold">AI Study Assistant</p>
                          <p className="text-sm text-gray-600">Active</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl shadow-sm">
                          <Target className="w-8 h-8 text-green-500 mb-2" />
                          <p className="font-semibold">Career Goals</p>
                          <p className="text-sm text-gray-600">On Track</p>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-90">Next Interview</p>
                            <p className="font-semibold text-lg">
                              Google - SDE Role
                            </p>
                          </div>
                          <Calendar className="w-8 h-8 opacity-80" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-semibold">AI Powered</span>
                  </div>
                </div>

                <div
                  className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-lg animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-semibold">10K+ Students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Visual */}
            <div className="relative lg:hidden mt-8">
              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-0 shadow-xl rounded-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">Your Progress</p>
                        <p className="text-sm text-gray-600">85% Complete</p>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Brain className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs font-medium">AI Tutor</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
                      <p className="text-xs font-medium">Goals</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                      <p className="text-xs font-medium">Schedule</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            badge="bg-green-100 text-green-700 border-green-200"
            badgeIcon={<Lightbulb className="w-3 h-3 mr-1" />}
            badgeText="Simple Process"
            title="Get Started in Minutes"
            subtitle="Join thousands of students already transforming their campus experience"
          />

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 transform -translate-y-1/2 hidden lg:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {processSteps.map((step, index) => (
                <ProcessStepCard key={index} {...step} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campus Tools Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            badge="bg-purple-100 text-purple-700 border-purple-200"
            badgeIcon={<Target className="w-3 h-3 mr-1" />}
            badgeText="Comprehensive Suite"
            title="Everything You Need to Succeed"
            subtitle="Powerful tools designed for every aspect of campus life"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {campusTools.map((category, index) => (
              <div key={index}>
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div
                    className={`p-6 bg-gradient-to-br ${category.color} text-white`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      {category.icon}
                      <ArrowRight className="w-6 h-6 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{category.category}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {category.tools.map((tool, toolIndex) => (
                      <div key={toolIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {tool.name}
                          </p>
                          <p className="text-sm text-gray-600">{tool.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            badge="bg-blue-100 text-blue-700 border-blue-200"
            badgeIcon={<Shield className="w-3 h-3 mr-1" />}
            badgeText="Core Features"
            title="Powerful Features for Modern Students"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            badge="bg-orange-100 text-orange-700 border-orange-200"
            badgeIcon={<Zap className="w-3 h-3 mr-1" />}
            badgeText="Flexible Pricing"
            title="Choose Your Plan"
            subtitle="Start free and upgrade as you grow"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                plan={plan}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            badge="bg-indigo-100 text-indigo-700 border-indigo-200"
            badgeIcon={<HandshakeIcon className="w-3 h-3 mr-1" />}
            badgeText="Trusted Partners"
            title="Partnered with Industry Leaders"
            subtitle="Connecting students with top companies worldwide"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center justify-center">
                <Card className="p-6 w-full hover:shadow-lg transition-all duration-300 bg-white">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">{partner.icon}</div>
                    <p className="text-sm font-medium text-gray-700">
                      {partner.name}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            badge="bg-green-100 text-green-700 border-green-200"
            badgeIcon={<Star className="w-3 h-3 mr-1" />}
            badgeText="Student Success Stories"
            title="Loved by Students Everywhere"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <SectionHeader
            badge="bg-pink-100 text-pink-700 border-pink-200"
            badgeIcon={<MessagesSquare className="w-3 h-3 mr-1" />}
            badgeText="FAQs"
            title="Frequently Asked Questions"
          />

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index}>
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    {openFaq === index ? (
                      <Minus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students already using our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Get Started Free
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-gray-400">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold">Campus Hub</span>
              </div>
              <p className="text-sm">
                Empowering students to achieve their dreams through innovative
                technology.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Code2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm">Stay updated with our newsletter</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />© 2024 Campus Hub
                </span>
                <span>|</span>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <span>|</span>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secured by industry-leading encryption</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
