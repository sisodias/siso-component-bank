import React from 'react';
import { Eye, Menu, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, RefreshCw, ChevronDown } from 'lucide-react';

export default function WalletCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-900 p-4 relative w-full overflow-hidden">
      {/* Wall Tile Pattern Background */}
      <div className="absolute inset-0 grid grid-cols-4 gap-0">
        {[...Array(32)].map((_, i) => (
          <div 
            key={i}
            className="relative bg-gradient-to-br opacity-75 from-gray-200 via-gray-300 to-gray-400"
            style={{
              boxShadow: 'inset -8px -8px 16px rgba(0, 0, 0, 0.15), inset 2px 2px 8px rgba(255, 255, 255, 0.3)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/5"></div>
          </div>
        ))}
      </div>

      {/* Glass morphism card */}
      <div className="relative w-full max-w-md z-10">
        <div 
          className="backdrop-blur-xl bg-white/20 rounded-[40px] p-8 border border-white/30 transition-all duration-500 hover:scale-[1.02] hover:bg-white/25 hover:shadow-2xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.5), inset 0 -1px 2px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm font-medium">Salman Jr</span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
            <button 
              className="w-9 h-9 rounded-full backdrop-blur-xl bg-white/40 flex items-center justify-center hover:bg-white/60 hover:scale-110 hover:rotate-90 transition-all duration-300 border border-white/40 active:scale-95"
              style={{
                boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
              }}
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Balance Card */}
          <div 
            className="backdrop-blur-2xl bg-white/40 rounded-3xl p-8 mb-8 border border-white/50 transition-all duration-300 hover:bg-white/50 hover:scale-[1.02] cursor-pointer"
            style={{
              boxShadow: '0 8px 24px rgba(31, 38, 135, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-gray-600 text-sm font-medium">Total Assets</span>
              <Eye className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-1">
              <h1 className="text-6xl font-bold text-gray-900 tracking-tight">$2346</h1>
              <div className="flex items-center gap-1 mt-4">
                <span className="text-2xl font-semibold text-gray-600">USD</span>
                <ChevronDown className="w-5 h-5 text-gray-600 mt-1" />
              </div>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-6">
            {/* Deposit */}
            <button className="flex flex-col items-center gap-3 group">
              <div 
                className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/40 flex items-center justify-center group-hover:bg-white/60 group-hover:scale-110 group-active:scale-95 transition-all duration-300 border border-white/40 group-hover:shadow-xl"
                style={{
                  boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
                }}
              >
                <ArrowDownLeft className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors duration-300">Deposit</span>
            </button>

            {/* Withdraw */}
            <button className="flex flex-col items-center gap-3 group">
              <div 
                className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/40 flex items-center justify-center group-hover:bg-white/60 group-hover:scale-110 group-active:scale-95 transition-all duration-300 border border-white/40 group-hover:shadow-xl"
                style={{
                  boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
                }}
              >
                <ArrowUpRight className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors duration-300">Withdraw</span>
            </button>

            {/* Transfer */}
            <button className="flex flex-col items-center gap-3 group">
              <div 
                className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/40 flex items-center justify-center group-hover:bg-white/60 group-hover:scale-110 group-active:scale-95 transition-all duration-300 border border-white/40 group-hover:shadow-xl"
                style={{
                  boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
                }}
              >
                <ArrowLeftRight className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors duration-300">Transfer</span>
            </button>

            {/* Convert */}
            <button className="flex flex-col items-center gap-3 group">
              <div 
                className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/40 flex items-center justify-center group-hover:bg-white/60 group-hover:scale-110 group-active:scale-95 transition-all duration-300 border border-white/40 group-hover:shadow-xl"
                style={{
                  boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
                }}
              >
                <RefreshCw className="w-6 h-6 text-gray-700 group-hover:scale-110 group-hover:rotate-180 transition-all duration-300" />
              </div>
              <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors duration-300">Convert</span>
            </button>
          </div>
        </div>

        {/* Designer Credit */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex items-center gap-1">
            <span className="text-gray-100 text-xs font-medium">@21st.dev</span>
          </div>
        </div>
      </div>
    </div>
  );
}