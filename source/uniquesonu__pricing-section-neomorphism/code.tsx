import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Shield, Rocket } from 'lucide-react';

const PricingCard = ({ 
  plan, 
  price, 
  period, 
  features, 
  buttonText, 
  isPopular = false, 
  accentColor = 'cyan',
  icon: Icon 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animatedPrice, setAnimatedPrice] = useState(0);
  const [featuresVisible, setFeaturesVisible] = useState([]);

  useEffect(() => {
    // Animate price counter
    const timer = setTimeout(() => {
      let start = 0;
      const increment = price / 20;
      const counter = setInterval(() => {
        start += increment;
        if (start >= price) {
          setAnimatedPrice(price);
          clearInterval(counter);
        } else {
          setAnimatedPrice(Math.floor(start));
        }
      }, 50);
    }, 200);

    // Staggered feature reveal animation
    features.forEach((_, index) => {
      setTimeout(() => {
        setFeaturesVisible(prev => [...prev, index]);
      }, 300 + (index * 100));
    });

    return () => clearTimeout(timer);
  }, [price, features]);

  const colorClasses = {
    cyan: {
      glow: 'shadow-cyan-500/50',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      button: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400',
      hoverGlow: 'hover:shadow-cyan-500/70'
    },
    blue: {
      glow: 'shadow-blue-500/50',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      button: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400',
      hoverGlow: 'hover:shadow-blue-500/70'
    },
    purple: {
      glow: 'shadow-purple-500/50',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400',
      hoverGlow: 'hover:shadow-purple-500/70'
    }
  };

  const colors = colorClasses[accentColor];

  return (
    <div 
      className={`
        relative group
        bg-gray-900/40 backdrop-blur-xl
        border ${colors.border} ${isPopular ? colors.glow : 'shadow-gray-800/50'}
        rounded-2xl p-8
        transform transition-all duration-300 ease-in-out
        hover:scale-105 ${colors.hoverGlow}
        hover:bg-gray-800/50
        ${isPopular ? 'ring-2 ring-' + accentColor + '-500/50 scale-105' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${plan} pricing plan`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className={`
          absolute -top-4 left-1/2 transform -translate-x-1/2
          bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-600
          text-white text-sm font-semibold
          px-6 py-2 rounded-full
          shadow-lg
          animate-pulse
        `}>
          <Star className="inline w-4 h-4 mr-1" />
          Most Popular
        </div>
      )}

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-${accentColor}-500/20 to-${accentColor}-600/20 border border-${accentColor}-500/30 mb-4`}>
            <Icon className={`w-8 h-8 ${colors.text}`} />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
            {plan}
          </h3>
          
          {/* Animated Price */}
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-4xl font-bold text-white">$</span>
            <span className={`text-6xl font-bold ${colors.text} tabular-nums`}>
              {animatedPrice}
            </span>
            <span className="text-gray-400 ml-2">/{period}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8" role="list">
          {features.map((feature, index) => (
            <li 
              key={index}
              className={`
                flex items-center space-x-3
                transform transition-all duration-500 ease-out
                ${featuresVisible.includes(index) 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-8 opacity-0'
                }
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`
                flex-shrink-0 w-6 h-6 rounded-full 
                bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-600
                flex items-center justify-center
                shadow-lg shadow-${accentColor}-500/30
              `}>
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <span className="text-gray-300 text-lg leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button 
          className={`
            w-full py-4 px-6 rounded-xl
            ${colors.button}
            text-white font-semibold text-lg
            transform transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-2xl
            focus:outline-none focus:ring-4 focus:ring-${accentColor}-500/50
            relative overflow-hidden group
          `}
          aria-label={`Choose ${plan} plan`}
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <span className="relative z-10 flex items-center justify-center">
            {buttonText}
            <Rocket className={`ml-2 w-5 h-5 transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          </span>
        </button>
      </div>

      {/* Glow Effect */}
      <div className={`
        absolute inset-0 rounded-2xl
        bg-gradient-to-r from-${accentColor}-500/10 via-transparent to-${accentColor}-500/10
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500 ease-in-out
        pointer-events-none
      `}></div>
    </div>
  );
};

const App = () => {
  const pricingPlans = [
    {
      plan: "Basic",
      price: 29,
      period: "month",
      features: [
        "Up to 5 team members",
        "10GB cloud storage",
        "Basic analytics",
        "Email support",
        "Mobile app access"
      ],
      buttonText: "Get Started",
      accentColor: "blue",
      icon: Zap
    },
    {
      plan: "Pro",
      price: 79,
      period: "month",
      features: [
        "Up to 25 team members",
        "100GB cloud storage",
        "Advanced analytics",
        "Priority support",
        "API access",
        "Custom integrations"
      ],
      buttonText: "Upgrade to Pro",
      isPopular: true,
      accentColor: "cyan",
      icon: Rocket
    },
    {
      plan: "Enterprise",
      price: 199,
      period: "month",
      features: [
        "Unlimited team members",
        "1TB cloud storage",
        "Real-time analytics",
        "24/7 dedicated support",
        "Full API access",
        "Custom solutions"
      ],
      buttonText: "Contact Sales",
      accentColor: "purple",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Future Plan
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Unlock the power of next-generation technology with our revolutionary pricing plans designed for the future.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="flex justify-center">
                <PricingCard {...plan} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-lg">
            All plans include a 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;