import React, { useState, useEffect } from "react";

interface CheckmarkProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const Checkmark = ({ size = 100, strokeWidth = 2, className = "" }: CheckmarkProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transform transition-all duration-500 ease-out"
        style={{
          transform: isVisible ? 'scale(1)' : 'scale(0.8)',
          opacity: isVisible ? 1 : 0
        }}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#059669"
          strokeWidth={strokeWidth}
          fill="none"
          style={{
            strokeDasharray: '283',
            strokeDashoffset: isVisible ? '0' : '283',
            transition: 'stroke-dashoffset 1s ease-out 0.3s',
            strokeLinecap: 'round'
          }}
        />
        <path
          d="M30 50L42 62L70 34"
          stroke="#059669"
          strokeWidth={strokeWidth + 1}
          fill="none"
          style={{
            strokeDasharray: '50',
            strokeDashoffset: isVisible ? '0' : '50',
            transition: 'stroke-dashoffset 0.6s ease-out 1s',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          }}
        />
      </svg>
    </div>
  );
};

const CurrencyIcon = ({ symbol, delay = 0 }: { symbol: string; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 transition-all duration-500 ease-out"
      style={{
        transform: isVisible ? 'translateY(0px) scale(1)' : 'translateY(10px) scale(0.9)',
        opacity: isVisible ? 1 : 0
      }}
    >
      <span className="text-gray-700 font-semibold text-sm">
        {symbol}
      </span>
    </div>
  );
};

export default function CurrencyTransfer() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div 
        className="w-full max-w-md mx-auto transition-all duration-700 ease-out"
        style={{
          transform: showContent ? 'translateY(0px)' : 'translateY(20px)',
          opacity: showContent ? 1 : 0
        }}
      >
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          
          {/* Content */}
          <div className="space-y-8">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="bg-green-50 rounded-full p-4 border border-green-100">
                <Checkmark size={64} strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <div 
              className="text-center transition-all duration-500 ease-out delay-1000"
              style={{
                transform: showContent ? 'translateY(0px)' : 'translateY(10px)',
                opacity: showContent ? 1 : 0
              }}
            >
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Transfer Successful
              </h1>
              <p className="text-gray-600 text-sm">
                Your transfer has been completed successfully
              </p>
            </div>

            {/* Transfer Details */}
            <div 
              className="space-y-4 transition-all duration-500 ease-out delay-1200"
              style={{
                transform: showContent ? 'translateY(0px)' : 'translateY(15px)',
                opacity: showContent ? 1 : 0
              }}
            >
              {/* From Section */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <CurrencyIcon symbol="$" delay={1400} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">From</p>
                        <p className="text-gray-900 font-semibold text-lg">$500.00</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">USD</p>
                        <p className="text-gray-700 text-sm font-medium">US Dollar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow Separator */}
              <div className="flex justify-center py-2">
                <div 
                  className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center transition-all duration-500 ease-out delay-1600"
                  style={{
                    transform: showContent ? 'scale(1)' : 'scale(0.8)',
                    opacity: showContent ? 1 : 0
                  }}
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* To Section */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <CurrencyIcon symbol="€" delay={1800} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">To</p>
                        <p className="text-gray-900 font-semibold text-lg">€460.00</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">EUR</p>
                        <p className="text-gray-700 text-sm font-medium">Euro</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Rate & Details */}
            <div 
              className="space-y-4 transition-all duration-500 ease-out delay-2000"
              style={{
                transform: showContent ? 'translateY(0px)' : 'translateY(10px)',
                opacity: showContent ? 1 : 0
              }}
            >
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Exchange Rate</span>
                    <span className="text-gray-900 font-medium">1 USD = 0.92 EUR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Transfer Fee</span>
                    <span className="text-gray-900 font-medium">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Transaction ID</span>
                      <span className="text-gray-900 font-mono text-sm">#TX-2024-001</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div 
              className="space-y-3 transition-all duration-500 ease-out delay-2200"
              style={{
                transform: showContent ? 'translateY(0px)' : 'translateY(15px)',
                opacity: showContent ? 1 : 0
              }}
            >
              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200">
                View Receipt
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200 border border-gray-200">
                Make Another Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}