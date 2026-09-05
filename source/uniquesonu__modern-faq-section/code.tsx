import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProfessionalAccordion = () => {
  const [activePanel, setActivePanel] = useState(items[0].id);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 1024;

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full uppercase tracking-wide">
              Platform Overview
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight"
          >
            Enterprise Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Comprehensive business tools designed to streamline operations, 
            enhance productivity, and drive sustainable growth for modern enterprises.
          </motion.p>
        </div>

        {/* Accordion Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`flex ${isMobile ? 'flex-col' : 'flex-row'} bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden ${isMobile ? 'gap-0' : 'gap-0'} ${isMobile ? 'min-h-fit' : 'h-[600px]'}`}
        >
          {items.map((item, index) => (
            <AccordionPanel
              key={item.id}
              item={item}
              isActive={activePanel === item.id}
              onClick={() => setActivePanel(item.id)}
              isMobile={isMobile}
              index={index}
            />
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 bg-white rounded-xl p-8 shadow-sm border border-slate-200"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2">500+</div>
            <div className="text-sm text-slate-600 uppercase tracking-wide">Enterprise Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2">99.9%</div>
            <div className="text-sm text-slate-600 uppercase tracking-wide">Uptime SLA</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2">24/7</div>
            <div className="text-sm text-slate-600 uppercase tracking-wide">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-2">ISO</div>
            <div className="text-sm text-slate-600 uppercase tracking-wide">Security Certified</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AccordionPanel = ({ item, isActive, onClick, isMobile, index }) => {
  return (
    <motion.div
      className={`relative cursor-pointer transition-all duration-500 ease-out ${
        isMobile ? 'w-full border-b border-slate-200 last:border-b-0' : 'h-full border-r border-slate-200 last:border-r-0'
      }`}
      style={{
        flex: isActive ? (isMobile ? '0 0 auto' : '1 1 60%') : (isMobile ? '0 0 80px' : '0 0 120px'),
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={onClick}
    >
      {/* Background */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isActive 
          ? 'bg-gradient-to-br from-slate-50 to-blue-50' 
          : 'bg-white hover:bg-slate-50'
      }`} />
      
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className={`absolute ${isMobile ? 'top-0 left-0 right-0 h-1' : 'left-0 top-0 bottom-0 w-1'} bg-gradient-to-r from-blue-600 to-indigo-600`}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className={`p-6 ${isMobile ? 'flex items-center justify-between' : 'flex flex-col items-center text-center h-full justify-center'} ${isActive && !isMobile ? 'justify-start pt-8' : ''}`}>
          <div className={`flex items-center gap-4 ${isMobile ? 'flex-row' : isActive ? 'flex-row mb-6' : 'flex-col gap-6'}`}>
            <motion.div 
              className={`p-4 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <item.Icon className="w-6 h-6" />
            </motion.div>
            
            <div className={isMobile ? 'flex-1' : 'text-center'}>
              <motion.h3 
                className={`font-bold transition-all duration-300 ${
                  isActive ? 'text-slate-900' : 'text-slate-700'
                } ${isMobile ? 'text-xl' : isActive ? 'text-2xl' : 'text-lg'}`}
                style={{
                  writingMode: !isMobile && !isActive ? 'vertical-lr' : 'horizontal-tb',
                  transform: !isMobile && !isActive ? 'rotate(180deg)' : 'none',
                }}
              >
                {item.title}
              </motion.h3>
              {(!isActive || isMobile) && (
                <p className={`text-sm text-slate-500 mt-1 ${!isMobile && !isActive ? 'hidden' : ''}`}>
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Expand Icon */}
          <motion.div 
            className={`text-slate-400 ${isMobile ? 'ml-4' : 'mt-auto mb-4'}`}
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {item.features.map((feature, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-center gap-3 text-sm text-slate-600"
                        >
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  {item.metrics && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                      {item.metrics.map((metric, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="text-center"
                        >
                          <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide">{metric.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3 pt-4"
                  >
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
                      Learn More
                    </button>
                    <button className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200">
                      Schedule Demo
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Professional business-focused content
const items = [
  {
    id: 1,
    title: "Revenue Optimization",
    subtitle: "Drive growth & profitability",
    Icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    description: "Advanced analytics and optimization tools designed to maximize revenue streams, improve conversion rates, and identify high-value opportunities across all business channels.",
    features: [
      "Real-time Revenue Analytics",
      "Conversion Rate Optimization",
      "Predictive Revenue Forecasting",
      "Multi-channel Attribution",
      "Customer Lifetime Value Analysis",
      "Dynamic Pricing Strategies"
    ],
    metrics: [
      { value: "35%", label: "Avg Increase" },
      { value: "24/7", label: "Monitoring" },
      { value: "99%", label: "Accuracy" }
    ]
  },
  {
    id: 2,
    title: "Operational Excellence",
    subtitle: "Streamline & optimize workflows",
    Icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: "Comprehensive process automation and workflow optimization platform that eliminates inefficiencies, reduces manual overhead, and ensures consistent operational performance.",
    features: [
      "Process Automation",
      "Workflow Optimization",
      "Performance Monitoring",
      "Resource Allocation",
      "Quality Assurance",
      "Compliance Management"
    ],
    metrics: [
      { value: "60%", label: "Time Saved" },
      { value: "45%", label: "Cost Reduction" },
      { value: "98%", label: "Efficiency" }
    ]
  },
  {
    id: 3,
    title: "Business Intelligence",
    subtitle: "Data-driven decision making",
    Icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    description: "Enterprise-grade business intelligence platform providing comprehensive insights, predictive analytics, and automated reporting to support strategic decision-making processes.",
    features: [
      "Advanced Analytics Dashboard",
      "Predictive Modeling",
      "Automated Reporting",
      "Real-time Data Visualization",
      "Custom KPI Tracking",
      "Cross-department Integration"
    ],
    metrics: [
      { value: "50+", label: "Data Sources" },
      { value: "<5min", label: "Query Time" },
      { value: "100%", label: "Real-time" }
    ]
  },
  {
    id: 4,
    title: "Enterprise Security",
    subtitle: "Protect & secure business assets",
    Icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    description: "Comprehensive security infrastructure with advanced threat detection, compliance management, and enterprise-grade protection to safeguard critical business operations and data.",
    features: [
      "Multi-layer Security Architecture",
      "Advanced Threat Detection",
      "Compliance Automation",
      "Identity & Access Management",
      "Data Encryption & Privacy",
      "24/7 Security Monitoring"
    ],
    metrics: [
      { value: "0", label: "Security Incidents" },
      { value: "ISO27001", label: "Certified" },
      { value: "24/7", label: "Monitoring" }
    ]
  },
];

export default ProfessionalAccordion;