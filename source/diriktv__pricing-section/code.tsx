"use client";

import { useState } from 'react';

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    description: "Perfect for individuals getting started",
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: [
      "Up to 10 projects",
      "Basic analytics",
      "Email support",
      "1GB storage",
      "Basic templates"
    ],
    buttonText: "Get Started"
  },
  {
    name: "Professional",
    description: "Best for growing businesses and teams",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "10GB storage",
      "Premium templates",
      "Team collaboration",
      "API access"
    ],
    isPopular: true,
    buttonText: "Start Free Trial"
  },
  {
    name: "Enterprise",
    description: "For large organizations with custom needs",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Dedicated support",
      "Unlimited storage",
      "Custom templates",
      "Advanced security",
      "SLA guarantee",
      "White-label options"
    ],
    buttonText: "Contact Sales"
  }
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const yearlyEquivalent = monthlyPrice * 12;
    const savings = Math.round(((yearlyEquivalent - yearlyPrice) / yearlyEquivalent) * 100);
    return savings;
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-8 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fade-in leading-tight">
            Choose Your Plan
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 mb-8 sm:mb-12 max-w-2xl mx-auto animate-fade-in-delay px-2">
            Start for free and scale as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-neutral-900 rounded-full p-1 animate-slide-up w-full max-w-xs sm:w-auto">
            <button
              onClick={() => setIsYearly(false)}
              className={`flex-1 sm:flex-initial px-4 sm:px-6 py-3 sm:py-2 rounded-full text-sm font-medium transition-all duration-300 min-h-[44px] sm:min-h-0 ${
                !isYearly
                  ? 'bg-white text-neutral-900 shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`flex-1 sm:flex-initial px-4 sm:px-6 py-3 sm:py-2 rounded-full text-sm font-medium transition-all duration-300 relative min-h-[44px] sm:min-h-0 ${
                isYearly
                  ? 'bg-white text-neutral-900 shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Yearly
              {!isYearly && (
                <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-emerald-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full animate-pulse">
                  Save 20%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-neutral-900 rounded-2xl p-4 sm:p-8 transition-all duration-500 hover:scale-105 hover:bg-neutral-800 animate-card-up ${
                plan.isPopular ? 'ring-2 ring-emerald-500 md:scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-500 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold animate-bounce-subtle">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm sm:text-base text-neutral-400 mb-4 sm:mb-6 leading-relaxed">{plan.description}</p>
                
                <div className="relative min-h-[80px] sm:min-h-[90px]">
                  <div className={`transition-all duration-500 ${isYearly ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                    <div className="flex items-center justify-center">
                      <span className="text-3xl sm:text-5xl font-bold text-white">${plan.monthlyPrice}</span>
                      <span className="text-neutral-400 ml-2 text-sm sm:text-base">/month</span>
                    </div>
                  </div>
                  
                  <div className={`absolute inset-0 transition-all duration-500 ${isYearly ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                    <div className="flex items-center justify-center">
                      <span className="text-3xl sm:text-5xl font-bold text-white">${plan.yearlyPrice}</span>
                      <span className="text-neutral-400 ml-2 text-sm sm:text-base">/year</span>
                    </div>
                    <div className="text-emerald-400 text-sm mt-1">
                      Save {calculateSavings(plan.monthlyPrice, plan.yearlyPrice)}%
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={feature}
                    className="flex items-start text-neutral-300 animate-feature-in text-sm sm:text-base"
                    style={{ animationDelay: `${(index * 200) + (featureIndex * 100)}ms` }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 sm:py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base min-h-[48px] ${
                  plan.isPopular
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 hover:border-neutral-600'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-16 animate-fade-in-slow px-4">
          <p className="text-neutral-400 mb-4 text-sm sm:text-base">
            Not sure which plan is right for you?
          </p>
          <button className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-300 hover:underline text-sm sm:text-base min-h-[44px] py-2 px-4">
            Compare all features →
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes card-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes feature-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-subtle {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
          60% {
            transform: translateY(-3px);
          }
        }

        @keyframes fade-in-slow {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s both;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.6s both;
        }

        .animate-card-up {
          animation: card-up 0.8s ease-out both;
        }

        .animate-feature-in {
          animation: feature-in 0.6s ease-out both;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }

        .animate-fade-in-slow {
          animation: fade-in-slow 1.5s ease-out 1s both;
        }
      `}</style>
    </div>
  );
}