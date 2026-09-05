"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Star } from "lucide-react"

export interface Plan {
  title: string
  price: {
    monthly: number
    yearly: number
  }
  description: string
  features: string[]
  ctaText: string
  ctaHref: string
  isFeatured?: boolean
}

interface PricingTableProps {
  plans: Plan[]
}

// Individual Digit Animation Component
const AnimatedDigit: React.FC<{ digit: string; index: number }> = ({ digit, index }) => {
  return (
    <div className="relative overflow-hidden inline-block min-w-[1ch] text-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={digit}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ 
            duration: 0.3,
            delay: index * 0.05,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="block"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

// Enhanced Scrolling Number Component with individual digit animations
const ScrollingNumber: React.FC<{ value: number }> = ({ value }) => {
  const numberString = value.toString()
  
  return (
    <div className="flex items-center">
      {numberString.split('').map((digit, index) => (
        <AnimatedDigit 
          key={`${value}-${index}`}
          digit={digit}
          index={index}
        />
      ))}
    </div>
  )
}

const PricingTable: React.FC<PricingTableProps> = ({ plans }) => {
  const [isYearly, setIsYearly] = useState(false)

  // Simple check icon for all features
  const getFeatureIcon = () => {
    return <Check className="size-3 text-foreground" />
  }





  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-16">
      {/* Header with Toggle */}
      <motion.div 
        className="text-center space-y-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="space-y-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Choose Your Plan
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Select the perfect plan for your needs. All plans include our core features with different limits and capabilities.
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div 
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Tabs 
            value={isYearly ? "yearly" : "monthly"} 
            onValueChange={(value) => setIsYearly(value === "yearly")}
          >
            <TabsList className="flex w-full h-12 cursor-pointer">
              <TabsTrigger value="monthly" className="text-base font-medium cursor-pointer flex-1 px-3">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="text-base font-medium flex items-center gap-2 cursor-pointer flex-1 px-3">
                Yearly
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                  Save 20%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.title}
            variants={cardVariants}
            className="relative"
          >
            {/* Featured Badge */}
            {plan.isFeatured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                  <Star className="size-3 fill-current" />
                  Most Popular
                </div>
              </motion.div>
            )}

            <div className={`
              relative h-full p-8 rounded-xl border-2 transition-all duration-300
              ${plan.isFeatured 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 dark:border-blue-400 shadow-lg' 
                : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
              }
            `}>
              {/* Plan Header */}
              <div className="text-center space-y-4 mb-8">
                <h3 className="text-2xl font-bold text-foreground">{plan.title}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
                
                {/* Animated Price with Scrolling Numbers */}
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground flex items-center justify-center">
                    $<ScrollingNumber value={isYearly ? Math.round(plan.price.yearly / 12) : plan.price.monthly} />
                    <span className="text-lg text-muted-foreground font-normal ml-1">
                      /month
                    </span>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-muted-foreground flex items-center justify-center gap-2"
                  >
                    <span>{isYearly ? `billed yearly` : `billed monthly`}</span>
                    {isYearly && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium"
                      >
                        Save ${(plan.price.monthly * 12) - plan.price.yearly}
                      </motion.span>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 + featureIndex * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {getFeatureIcon()}
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Button
                  asChild
                  variant={plan.isFeatured ? "default" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  <a href={plan.ctaHref}>
                    {plan.ctaText}
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>


    </div>
  )
}

export default PricingTable 