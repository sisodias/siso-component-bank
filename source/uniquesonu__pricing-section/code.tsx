"use client"

import { Check, Zap, Crown, Rocket } from "lucide-react"

const pricingPlans = [
  {
    name: "Basic",
    price: 29,
    period: "month",
    description: "Perfect for individuals and small projects",
    features: [
      "Up to 5 projects",
      "10GB storage",
      "Basic analytics",
      "Email support",
      "SSL certificate",
      "99.9% uptime",
    ],
    icon: Zap,
    popular: false,
    gradient: "from-slate-900 to-slate-800",
    accent: "border-slate-600",
    button: "bg-slate-700 hover:bg-slate-600",
  },
  {
    name: "Pro",
    price: 79,
    period: "month",
    description: "Ideal for growing businesses and teams",
    features: [
      "Unlimited projects",
      "100GB storage",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
      "API access",
    ],
    icon: Crown,
    popular: true,
    gradient: "from-blue-900 via-purple-900 to-cyan-900",
    accent: "border-cyan-400",
    button: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400",
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    description: "For large organizations with advanced needs",
    features: [
      "Unlimited everything",
      "1TB storage",
      "Real-time analytics",
      "24/7 phone support",
      "White-label solution",
      "Dedicated manager",
    ],
    icon: Rocket,
    popular: false,
    gradient: "from-purple-900 to-indigo-900",
    accent: "border-purple-400",
    button: "bg-purple-600 hover:bg-purple-500",
  },
]

// Custom Badge Component
const Badge = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

// Custom Button Component
const Button = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"

  const variants = {
    default: "text-white",
    outline: "border-2 bg-transparent",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Unlock the power of next-generation technology with our flexible pricing options
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative group transition-all duration-500 ease-out hover:scale-105 ${
                  plan.popular ? "lg:-mt-4 lg:mb-4" : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg animate-pulse">
                      ⭐ Most Popular
                    </Badge>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`relative h-full rounded-2xl bg-gradient-to-br ${plan.gradient} 
                    backdrop-blur-xl border ${plan.accent} border-opacity-30
                    shadow-2xl group-hover:shadow-cyan-500/25 transition-all duration-500
                    before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br 
                    before:from-white/10 before:to-transparent before:opacity-0 
                    group-hover:before:opacity-100 before:transition-opacity before:duration-500`}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${plan.gradient} 
                    opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}
                  />

                  {/* Geometric Pattern Overlay */}
                  <div className="absolute inset-0 rounded-2xl opacity-5">
                    <div className="absolute top-4 right-4 w-32 h-32 border border-cyan-400 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 border border-purple-400 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-blue-400 rounded-full"></div>
                  </div>

                  <div className="relative p-8 h-full flex flex-col">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                        bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm mb-4
                        group-hover:scale-110 group-hover:rotate-12 transition-all duration-300
                        shadow-lg group-hover:shadow-cyan-500/50"
                      >
                        <IconComponent className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors duration-300">
                        {plan.name}
                      </h3>
                      <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center">
                        <span className="text-lg text-slate-400 mr-1">$</span>
                        <span
                          className="text-5xl font-bold text-white group-hover:text-cyan-300 
                          transition-all duration-300 group-hover:scale-110"
                        >
                          {plan.price}
                        </span>
                        <span className="text-slate-400 ml-2 group-hover:text-slate-300 transition-colors duration-300">
                          /{plan.period}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                        Billed {plan.period}ly
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex-1 mb-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center group/item opacity-0 animate-fade-in"
                            style={{ animationDelay: `${featureIndex * 100}ms`, animationFillMode: "forwards" }}
                          >
                            <div
                              className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r 
                              from-cyan-500 to-blue-500 flex items-center justify-center mr-3
                              group-hover/item:scale-110 group-hover/item:shadow-lg 
                              group-hover/item:shadow-cyan-500/50 transition-all duration-200"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span
                              className="text-slate-300 group-hover/item:text-white 
                              transition-colors duration-200"
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className={`w-full h-12 rounded-xl font-semibold text-white 
                        ${plan.button} transition-all duration-300 
                        hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1
                        active:translate-y-0 active:shadow-md transform
                        focus:ring-cyan-500 relative overflow-hidden group/button`}
                    >
                      <span className="relative z-10">Get Started</span>
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000"
                      ></div>
                    </Button>
                  </div>

                  {/* Animated Border */}
                  <div
                    className={`absolute inset-0 rounded-2xl border-2 ${plan.accent} 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Pulse Ring */}
                  <div
                    className={`absolute inset-0 rounded-2xl border-2 ${plan.accent} 
                    opacity-0 group-hover:opacity-30 group-hover:scale-105 
                    transition-all duration-1000 animate-pulse`}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-4">Need a custom solution? We've got you covered.</p>
          <Button
            variant="outline"
            className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white
              transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 
              focus:ring-cyan-500 hover:scale-105 bg-transparent"
          >
            Contact Sales
          </Button>
        </div>

        {/* Floating Elements */}
        <div className="fixed top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-20"></div>
        <div className="fixed top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
        <div className="fixed bottom-32 left-20 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-25"></div>
      </div>
    </div>
  )
}
