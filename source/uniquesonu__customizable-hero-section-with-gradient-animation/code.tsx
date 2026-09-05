import React, { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export const AuroraHero = () => {
  const [currentGradient, setCurrentGradient] = useState(0);

  const gradients = [
    "from-blue-600/20 via-purple-600/20 to-indigo-600/20",
    "from-indigo-600/20 via-blue-600/20 to-cyan-600/20",
    "from-purple-600/20 via-indigo-600/20 to-blue-600/20"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-slate-50 overflow-hidden">
      {/* Subtle animated background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradients[currentGradient]} transition-all duration-5000 ease-in-out`}
      />

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgb(0 0 0 / 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgb(0 0 0 / 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          
          {/* Status Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            Production Ready
          </div>

          {/* Main Headline */}
          <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-6">
            Reduce SaaS churn by
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> 90%</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg text-gray-600 leading-relaxed mb-12">
            Enterprise-grade analytics and automation platform that helps SaaS companies 
            identify at-risk customers and take proactive action before they churn.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button className="group inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200">
              Start free trial
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            
            <button className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200">
              Schedule demo
            </button>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
            {[
              "Real-time customer health scoring",
              "Automated intervention workflows",
              "Advanced cohort analysis"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center justify-center sm:justify-start text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center gap-8 mt-16 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="font-medium text-gray-900 mr-1">500+</span>
              companies trust us
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-900 mr-1">99.9%</span>
              uptime SLA
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-900 mr-1">SOC 2</span>
              Type II certified
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
};