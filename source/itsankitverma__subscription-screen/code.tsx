"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Smartphone, Shield, Star, CheckCircle } from "lucide-react";

const SubscriptionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState("annually");

  const features = [
    {
      icon: <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      text: "End-to-end encryption",
    },
    {
      icon: <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      text: "Sync across all devices",
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      text: "Priority customer support",
    },
    {
      icon: <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      text: "Ad-free experience",
    },
  ];

  const pricingOptions = [
    { id: "monthly", price: "$6.99", period: "Monthly", badge: "" },
    { id: "annually", price: "$39.99", period: "Annually", badge: "Save 52%" },
  ];

  const handleSubscribe = (planId) => {
    alert(`Subscribed to ${planId} plan!`);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="h-[812px] w-full max-w-md overflow-hidden rounded-[40px] shadow-xl relative">
        {/* Subtle Background */}
          <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop"
            alt="Mountain landscape background"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Foreground */}
        <div className="relative flex h-full w-full flex-col items-center justify-end overflow-hidden bg-transparent">
          {/* Main Card */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="relative z-10 flex w-full flex-col items-center rounded-t-3xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 px-6 pt-24 pb-6 shadow-2xl"
          >
            {/* Header Icon */}
            <motion.div
              className="absolute -top-16 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg"
              initial={{ y: 50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <CheckCircle className="h-16 w-16 text-white" strokeWidth={2} />
            </motion.div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Secure<span className="text-blue-600 dark:text-blue-400">Pass</span> Premium
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Everything you need, secured
              </p>
            </div>

            {/* Features List */}
            <ul className="mt-6 space-y-1 self-start w-full">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.6 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2">
                    {feature.icon}
                  </div>
                  <span>{feature.text}</span>
                </motion.li>
              ))}
            </ul>

            {/* Pricing Options */}
            <div className="mt-6 w-full space-y-3">
              {pricingOptions.map((option) => (
                <div key={option.id} className="relative">
                  <input
                    type="radio"
                    id={option.id}
                    name="plan"
                    value={option.id}
                    checked={selectedPlan === option.id}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={option.id}
                    className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 transition-all hover:border-slate-300 dark:hover:border-slate-600 peer-checked:border-blue-500 dark:peer-checked:border-blue-400 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-950/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-600 peer-checked:border-blue-500 dark:peer-checked:border-blue-400">
                        <AnimatePresence>
                          {selectedPlan === option.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {option.price}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {option.period}
                        </span>
                      </div>
                    </div>
                    {option.badge && (
                      <div className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-xs font-medium text-white">
                        {option.badge}
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button
              className="mt-6 w-full rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-4 text-base font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98] shadow-md"
              onClick={() => handleSubscribe(selectedPlan)}
            >
              Continue with Premium
            </button>

            {/* Footer Text */}
            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
              Start your free trial today. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;
