import { useState, useEffect } from "react"
import { Check, Crown, Rocket, Shield, Star, Zap, Sparkles, ArrowRight, Users, Trophy, Award, Target, Flame, Diamond, Gift, Heart, ChevronDown } from "lucide-react"

export default function PricingComponent() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const plans = [
    {
      name: "Starter",
      subtitle: "Get Started",
      description: "Perfect for individuals and small projects",
      monthlyPrice: 9,
      annualPrice: 90,
      icon: Zap,
      decorativeIcon: Target,
      popular: false,
      features: [
        "Up to 5 projects",
        "10GB storage",
        "Basic analytics",
        "Email support",
        "SSL certificate",
        "99.9% uptime",
        "Community access",
        "Mobile app"
      ],
      buttonText: "Start Building",
      buttonVariant: "outline",
      accentColor: "emerald",
      gradient: "from-emerald-400 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      name: "Professional",
      subtitle: "Most Popular",
      description: "Ideal for growing businesses and teams",
      monthlyPrice: 29,
      annualPrice: 290,
      icon: Rocket,
      decorativeIcon: Trophy,
      popular: true,
      features: [
        "Unlimited projects",
        "100GB storage",
        "Advanced analytics",
        "Priority support",
        "Custom domain",
        "Team collaboration",
        "API access",
        "Advanced security",
        "White-label solution",
        "Priority features"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default",
      accentColor: "orange",
      gradient: "from-orange-400 via-red-400 to-pink-400",
      bgGradient: "from-orange-50 via-red-50 to-pink-50"
    },
    {
      name: "Enterprise",
      subtitle: "Scale Up",
      description: "For large organizations with custom needs",
      monthlyPrice: 99,
      annualPrice: 990,
      icon: Crown,
      decorativeIcon: Diamond,
      popular: false,
      features: [
        "Everything in Professional",
        "Unlimited storage",
        "Custom integrations",
        "24/7 phone support",
        "SLA guarantee",
        "Advanced permissions",
        "Audit logs",
        "Single sign-on (SSO)",
        "Dedicated manager",
        "Custom training"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      accentColor: "violet",
      gradient: "from-violet-400 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50"
    },
  ]

  // Custom Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-14 sm:h-9 sm:w-16 items-center rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
        checked ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-200' : 'bg-gray-200 hover:bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-6 w-6 sm:h-7 sm:w-7 transform rounded-full bg-white transition-all duration-300 shadow-lg ${
          checked ? 'translate-x-7 sm:translate-x-8 shadow-orange-200' : 'translate-x-1'
        }`}
      >
        {checked && <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 m-auto mt-1.5 sm:mt-2" />}
      </span>
    </button>
  )

  // Custom Badge Component
  const Badge = ({ children, className = "" }) => (
    <span className={`inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold animate-pulse ${className}`}>
      {children}
    </span>
  )

  // Custom Button Component
  const Button = ({ children, variant = "default", size = "md", className = "", onClick, disabled = false, ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"

    const variants = {
      default: "bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 focus:ring-gray-500 shadow-lg hover:shadow-xl",
      outline: "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 shadow-md hover:shadow-lg backdrop-blur-sm"
    }

    const sizes = {
      md: "px-6 py-3 text-sm sm:text-base",
      lg: "px-8 py-4 text-base sm:text-lg"
    }

    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }

  // Floating Particles Component
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r ${i % 3 === 0 ? 'from-orange-400 to-red-400' : i % 3 === 1 ? 'from-blue-400 to-purple-400' : 'from-emerald-400 to-teal-400'} rounded-full opacity-20`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  )

  // Decorative Orb Component
  const DecorativeOrb = ({ className = "", color = "orange" }) => (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className={`w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-full opacity-10 blur-xl animate-pulse`} />
      <div className={`absolute top-4 left-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-${color}-300 to-${color}-500 rounded-full opacity-20 blur-lg animate-ping`} />
    </div>
  )

  // Geometric Shape Component
  const GeometricShape = ({ className = "", type = "circle" }) => {
    if (type === "circle") {
      return (
        <div className={`absolute pointer-events-none ${className}`}>
          <svg width="60" height="60" viewBox="0 0 80 80" className="text-orange-200 opacity-30">
            <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="10 5" className="animate-spin" style={{ animationDuration: '20s' }} />
            <circle cx="40" cy="40" r="20" fill="currentColor" fillOpacity="0.1" />
          </svg>
        </div>
      )
    }
    return (
      <div className={`absolute pointer-events-none ${className}`}>
        <svg width="50" height="50" viewBox="0 0 60 60" className="text-blue-200 opacity-40">
          <polygon points="30,5 55,45 5,45" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" className="animate-pulse" />
        </svg>
      </div>
    )
  }

  // Stats Component
  const StatsSection = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 sm:mb-16">
      {[
        { icon: Users, value: "50K+", label: "Happy Users", color: "blue" },
        { icon: Trophy, value: "99.9%", label: "Uptime", color: "green" },
        { icon: Award, value: "24/7", label: "Support", color: "purple" },
        { icon: Heart, value: "150+", label: "Countries", color: "red" }
      ].map((stat, i) => (
        <div
          key={i}
          className="text-center group hover:scale-110 transition-all duration-300"
          style={{
            animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
          }}
        >
          <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-2xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
            <stat.icon className={`w-7 h-7 sm:w-8 sm:h-8 text-${stat.color}-600`} />
          </div>
          <div className={`text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1`}>{stat.value}</div>
          <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  )

  // Mouse follower effect
  const MouseFollower = () => (
    <div
      className="fixed w-4 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full pointer-events-none z-50 opacity-30 transition-all duration-300"
      style={{
        left: mousePosition.x - 8,
        top: mousePosition.y - 8,
        transform: 'scale(0.5)',
      }}
    />
  )

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16 overflow-hidden relative bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <MouseFollower />

      {/* Enhanced Decorative elements */}
      <DecorativeOrb className="top-10 left-0 sm:top-20 -left-16" color="orange" />
      <DecorativeOrb className="bottom-10 right-0 sm:bottom-32 -right-16" color="blue" />
      <DecorativeOrb className="top-1/2 left-1/4 translate-x-1/2 sm:top-1/2 sm:left-1/4" color="purple" />

      <GeometricShape className="top-20 right-1/4 sm:top-32 sm:right-1/4" type="circle" />
      <GeometricShape className="bottom-20 left-1/3 sm:bottom-40 sm:left-1/3" type="triangle" />
      <GeometricShape className="top-1/4 -right-4 sm:top-1/3 sm:-right-8" type="circle" />

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #f97316 1px, transparent 0)`,
          backgroundSize: '32px 32px',
          animation: 'drift 30s linear infinite'
        }} />
      </div>

      <FloatingParticles />

      {/* Header Section */}
      <div
        className="text-center mb-12 sm:mb-16 md:mb-20 relative z-10"
        style={{
          animation: 'fadeInUp 0.8s ease-out'
        }}
      >
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm border border-orange-200">
          <div className="flex items-center animate-bounce">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 -ml-1" />
          </div>
          Trusted by 50,000+ customers worldwide
          <Gift className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-red-800 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
          Choose Your
          <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
            Perfect Plan
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-2xl text-gray-600 max-w-xl md:max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
          Unlock powerful features and scale your business with our flexible pricing options.
          <span className="text-orange-600 font-semibold"> Start free, grow unlimited.</span>
        </p>

        {/* Enhanced Stats Section */}
        <StatsSection />

        {/* Enhanced Billing Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 max-w-xs sm:max-w-md mx-auto backdrop-blur-sm">
          <span className={`text-base sm:text-lg font-semibold transition-all duration-300 ${!isAnnual ? "text-gray-900 scale-105 sm:scale-110" : "text-gray-500"}`}>
            Monthly
          </span>
          <ToggleSwitch checked={isAnnual} onChange={setIsAnnual} />
          <span className={`text-base sm:text-lg font-semibold transition-all duration-300 ${isAnnual ? "text-gray-900 scale-105 sm:scale-110" : "text-gray-500"}`}>
            Annually
          </span>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ml-0 sm:ml-2 animate-bounce shadow-lg">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20 relative z-10">
        {plans.map((plan, index) => {
          const IconComponent = plan.icon
          const DecorativeIconComponent = plan.decorativeIcon
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
          const period = isAnnual ? "year" : "month"
          const isSelected = selectedPlan === plan.name

          return (
            <div
              key={plan.name}
              className={`relative group transition-all duration-500 ${plan.popular ? 'lg:scale-110 lg:-mt-4' : ''}`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
              }}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {/* Enhanced Card Container */}
              <div className={`relative h-full cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-500 group-hover:scale-105 ${
                isSelected
                  ? `ring-4 ring-${plan.accentColor}-400 shadow-2xl shadow-${plan.accentColor}-200`
                  : plan.popular
                    ? "shadow-2xl shadow-orange-200 ring-2 ring-orange-200"
                    : "shadow-xl hover:shadow-2xl border border-gray-100"
              }`}>

                {/* Enhanced Background with Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.bgGradient} opacity-50`} />
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

                {/* Animated decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden">
                  <div className={`absolute -top-6 -right-6 w-20 h-20 sm:-top-8 sm:-right-8 sm:w-24 sm:h-24 bg-gradient-to-br ${plan.gradient} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-pulse`} />
                </div>

                <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden">
                  <DecorativeIconComponent className={`absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 text-${plan.accentColor}-200 opacity-30 group-hover:opacity-50 transition-all duration-300 group-hover:rotate-12`} />
                </div>

                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-5 py-1.5 sm:px-6 sm:py-2 shadow-xl animate-bounce">
                      <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {plan.subtitle}
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                    </Badge>
                  </div>
                )}

                {/* Enhanced Card Content */}
                <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 mx-auto transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg ${
                      plan.popular
                        ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-orange-300"
                        : `bg-gradient-to-br ${plan.gradient} text-white shadow-${plan.accentColor}-300`
                    }`}>
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{plan.description}</p>

                    {/* Enhanced Price Display */}
                    <div className="mt-6 sm:mt-8 relative">
                      <div className="flex items-baseline justify-center gap-1 mb-1">
                        <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          ${price}
                        </span>
                        <span className="text-lg sm:text-xl text-gray-600 font-medium">/{period}</span>
                      </div>
                      {isAnnual && (
                        <div className="inline-flex items-center gap-1 text-xs sm:text-sm bg-green-100 text-green-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-semibold">
                          <Gift className="w-3 h-3" />
                          2 months free!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Features List */}
                  <div className="flex-grow mb-6 sm:mb-8">
                    <ul className="space-y-3 sm:space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-2 sm:gap-3 group/item"
                          style={{
                            animation: `slideInLeft 0.4s ease-out ${featureIndex * 0.05}s both`
                          }}
                        >
                          <div className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br ${plan.gradient} rounded-full flex items-center justify-center mt-0.5 group-hover/item:scale-110 transition-transform duration-200 shadow-md`}>
                            <Check className="w-2.5 h-2.5 sm:w-3 h-3 text-white font-bold" />
                          </div>
                          <span className="text-sm sm:text-base text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-200">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Enhanced CTA Button */}
                  <div className="mt-auto">
                    <Button
                      variant={plan.buttonVariant}
                      size="lg"
                      className={`w-full group/btn text-base sm:text-lg font-bold py-3 sm:py-4 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white border-0 shadow-orange-300"
                          : `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-${plan.accentColor}-300 border-0`
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {plan.buttonText}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Enhanced Trust Indicators */}
      <div
        className="text-center mb-12 sm:mb-16 relative z-10"
        style={{ animation: 'fadeInUp 0.6s ease-out 1s both' }}
      >
        <div className="inline-flex flex-wrap justify-center items-center gap-4 sm:gap-8 bg-white/80 backdrop-blur-lg px-6 py-5 sm:px-10 sm:py-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-2xl">
          {[
            { icon: Shield, text: "30-day money back", color: "green" },
            { icon: Check, text: "No setup fees", color: "blue" },
            { icon: Zap, text: "Cancel anytime", color: "purple" },
            { icon: Heart, text: "24/7 support", color: "red" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 group hover:scale-110 transition-all duration-300">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${item.color}-600`} />
              </div>
              <span className="text-sm sm:text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced FAQ Section */}
      <div
        className="text-center relative z-10 px-4"
        style={{ animation: 'fadeInUp 0.6s ease-out 1.2s both' }}
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Still have questions?</h2>
          <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto">
            Our friendly team is here to help you find the perfect plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="group/faq bg-white text-gray-900 border-white hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8"
            >
              <Users className="w-4 h-4 sm:w-5 h-5 mr-2" />
              Talk to Sales
              <ArrowRight className="w-4 h-4 sm:w-5 h-5 ml-2 group-hover/faq:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-base sm:text-lg px-6 sm:px-8"
            >
              <Trophy className="w-4 h-4 sm:w-5 h-5 mr-2" />
              View FAQ
              <ChevronDown className="w-4 h-4 sm:w-5 h-5 ml-2 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(5px) rotate(240deg);
          }
        }

        @keyframes drift {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 32px 32px; /* Adjust based on background-size */
          }
        }
      `}</style>
    </div>
  )
}