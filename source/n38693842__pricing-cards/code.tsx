import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const Component: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'BASIC',
      price: 19,
      popular: false,
      features: [
        '1 User',
        '5GB Storage',
        'Basic Support',
        'Limited API Access',
        'Standard Analytics'
      ],
      description: 'Perfect for individuals and small projects'
    },
    {
      name: 'PRO',
      price: 49,
      popular: true,
      features: [
        '5 Users',
        '50GB Storage',
        'Priority Support',
        'Full API Access',
        'Advanced Analytics'
      ],
      description: 'Ideal for growing businesses and teams'
    },
    {
      name: 'ENTERPRISE',
      price: 99,
      popular: false,
      features: [
        'Unlimited Users',
        '500GB Storage',
        '24/7 Premium Support',
        'Custom Integrations',
        'AI-Powered Insights'
      ],
      description: 'For large-scale operations and high-volume users'
    }
  ];

  return (
    <div className="h-screen w-screen overflow-auto bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 lg:mb-10"
          >
            <p className="text-red-600 text-xs sm:text-sm font-semibold tracking-widest mb-2 sm:mb-3 uppercase">
              PRICING
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2">
              Choose the plan that's right for you
            </h1>

            {/* Toggle */}
            <div className="inline-flex items-center gap-2 sm:gap-3 lg:gap-5 bg-white dark:bg-gray-800 py-1.5 sm:py-2 px-2 rounded-full shadow-lg">
              <span className={`font-semibold text-xs sm:text-sm lg:text-base pl-2 sm:pl-3 transition-colors ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`w-12 sm:w-14 lg:w-16 h-6 sm:h-7 lg:h-8 rounded-full transition-colors relative ${isYearly ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <motion.div
                  animate={{ x: isYearly ? 22 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 bg-white dark:bg-gray-200 rounded-full absolute top-0.5 left-0.5"
                />
              </button>
              <span className={`font-semibold text-xs sm:text-sm lg:text-base pr-2 sm:pr-3 transition-colors ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Yearly
              </span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className={`bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-2 sm:p-4 lg:p-6 relative flex flex-col transition-all duration-300 overflow-hidden ${
                  plan.popular 
                    ? 'border-2 lg:border-4 border-red-600 shadow-2xl shadow-red-200 dark:shadow-red-900' 
                    : 'border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-gray-900'
                }`}
              >
                {/* Animated background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-50 dark:from-red-950 to-transparent opacity-0"
                  whileHover={{ opacity: plan.popular ? 0.5 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                {plan.popular && (
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="absolute -top-px right-4 lg:right-8 bg-red-600 text-white px-3 lg:px-5 py-1.5 lg:py-2 rounded-b-lg lg:rounded-b-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 lg:gap-2 z-10"
                  >
                    <motion.span 
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="text-sm lg:text-base"
                    >
                      ★
                    </motion.span> 
                    Popular
                  </motion.div>
                )}

                <p className={`text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold tracking-wider mb-3 lg:mb-5 relative z-10 ${plan.popular ? 'mt-8 lg:mt-5' : ''}`}>
                  {plan.name}
                </p>

                <div className="mb-4 lg:mb-6 relative z-10">
                  <motion.span 
                    key={`${plan.price}-${isYearly}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white inline-block"
                  >
                    ${plan.price}
                  </motion.span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm lg:text-lg ml-1 lg:ml-2">
                    / month
                  </span>
                  <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-1">
                    billed monthly
                  </p>
                </div>

                <ul className="space-y-2 lg:space-y-3 mb-4 lg:mb-8 flex-1 relative z-10">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-2 lg:gap-3 text-gray-700 dark:text-gray-300 text-xs sm:text-sm lg:text-base cursor-default"
                    >
                      <motion.span 
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="text-red-600 text-base lg:text-xl font-bold flex-shrink-0"
                      >
                        ✓
                      </motion.span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: plan.popular 
                      ? '0 20px 40px rgba(220, 38, 38, 0.4)' 
                      : '0 10px 30px rgba(0, 0, 0, 0.15)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className={`w-full py-2.5 sm:py-3 lg:py-4 rounded-lg lg:rounded-xl text-xs sm:text-sm lg:text-base font-semibold transition-all duration-300 mb-3 lg:mb-5 relative z-10 overflow-hidden hover:cursor-pointer group ${
                    plan.popular
                      ? 'bg-red-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-red-600 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  {/* Animated shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                  <span className="relative z-10">Subscribe</span>
                </motion.button>

                <p className="text-center text-gray-400 dark:text-gray-500 text-xs sm:text-sm leading-relaxed relative z-10">
                  {plan.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
