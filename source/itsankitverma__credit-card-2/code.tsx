'use client';
import React, { useState } from "react";

interface CreditCardProps {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
}

const CreditCard: React.FC<CreditCardProps> = ({
  cardNumber,
  cardHolder,
  expiryDate,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const maskCardNumber = (number: string = "") => {
    if (!number) return "";
    // Remove any existing spaces and format into groups of 4
    const cleaned = number.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    const formatted = showDetails
      ? groups.join(' ')
      : groups.map((group, i) => i === groups.length - 1 ? group : '••••').join(' ');
    return formatted;
  };

  const maskName = (name: string = "") => {
    return showDetails ? name : "•••• ••••";
  };

  return (
    <div className="w-full max-w-[384px] lg:max-w-[480px] aspect-[1.78/1] bg-gradient-to-br from-pink-900 via-indigo-950 to-indigo-950 rounded-2xl p-4 sm:p-6 md:p-5 relative overflow-hidden transition-transform hover:scale-105 cursor-pointer">
      {/* Card background patterns */}
      <div className="absolute inset-0">
        {/* Colorful Circuit Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-90" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="neonPink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff1493" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#ff69b4" stopOpacity="0.1"/>
            </linearGradient>
            <linearGradient id="neonBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00bfff" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#1e90ff" stopOpacity="0.1"/>
            </linearGradient>
          </defs>

          {/* Curved Circuit Lines */}
          <g className="circuit-paths">
            {/* Main flowing curves */}
            <path d="M-10,50 C50,20 100,80 150,50 S250,0 320,40" 
              stroke="url(#neonPink)" strokeWidth="1.5" fill="none">
              <animate attributeName="stroke-opacity"
                values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
            </path>
            <path d="M-20,100 C40,140 120,60 180,120 S280,150 350,90" 
              stroke="url(#neonBlue)" strokeWidth="1.5" fill="none">
              <animate attributeName="stroke-opacity"
                values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
            </path>
            
            {/* Secondary curves */}
            <path d="M50,20 Q120,-10 200,30 T350,60" 
              stroke="url(#neonPink)" strokeWidth="1" opacity="0.2">
              <animate attributeName="stroke-opacity"
                values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M30,150 Q100,180 160,140 T300,160" 
              stroke="url(#neonBlue)" strokeWidth="1" opacity="0.2">
              <animate attributeName="stroke-opacity"
                values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
            </path>

            {/* Glowing nodes at curve intersections */}
            <circle cx="150" cy="50" r="2" fill="#ff1493" opacity="0.3">
              <animate attributeName="opacity"
                values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r"
                values="2;3;2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="180" cy="120" r="2" fill="#00bfff" opacity="0.3">
              <animate attributeName="opacity"
                values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="r"
                values="2;3;2" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>


      </div>

      {/* Card content */}
      <div className="relative h-full flex flex-col justify-between text-white">
        {/* Chip and Network */}
        <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
            {/* Chip */}
            <div className="relative w-10 h-8 sm:w-12 sm:h-10 lg:w-14 lg:h-12">
              {/* Main chip container */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md">
                {/* Inner chip details */}
                <div className="absolute inset-[2px] rounded-[4px] bg-gradient-to-br from-yellow-500 to-yellow-600 p-1">
                  {/* Circuit pattern */}
                  <div className="h-full w-full bg-yellow-500 rounded-sm grid grid-cols-3 gap-[2px] p-[2px]">
                    {/* Top circuit lines */}
                    <div className="h-1 bg-yellow-700/50 rounded-full col-span-2" />
                    <div className="h-1 bg-yellow-700/50 rounded-full" />
                    {/* Middle square */}
                    <div className="h-3 bg-yellow-700/50 rounded-sm col-span-2 mt-1" />
                    {/* Right circuit lines */}
                    <div className="space-y-[2px]">
                      <div className="h-1 bg-yellow-700/50 rounded-full" />
                      <div className="h-1 bg-yellow-700/50 rounded-full" />
                    </div>
                    {/* Bottom circuit lines */}
                    <div className="h-1 bg-yellow-700/50 rounded-full" />
                    <div className="h-1 bg-yellow-700/50 rounded-full col-span-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* WiFi Symbol */}
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8">
              <svg viewBox="0 0 24 24" className="w-full h-full text-white/90 rotate-90">
                <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 19L12 19" />
                  <path d="M8 15.5C9.93299 13.9033 14.067 13.9033 16 15.5" />
                  <path d="M5 12C8.07255 9.31371 15.9274 9.31371 19 12" />
                  <path d="M2 8.5C6.97578 4.73876 17.0242 4.73876 22 8.5" />
                </g>
              </svg>
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider">NEXUS</div>
        </div>

        {/* Card Number with Eye Toggle */}
        <div className="flex items-center gap-4">
          <div className="text-sm sm:text-base md:text-lg lg:text-xl tracking-wider font-mono flex-1 whitespace-nowrap px-1">{maskCardNumber(cardNumber)}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="text-white/70 hover:text-white transition-colors"
          >
            {showDetails ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            )}
          </button>
        </div>

        {/* Card Holder and Expiry */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs lg:text-sm opacity-70">Card Holder</span>
            <span className="text-sm sm:text-base lg:text-lg font-semibold tracking-wider">{maskName(cardHolder)}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] sm:text-xs opacity-70">Expires</span>
            <span className="text-sm sm:text-base font-semibold">{showDetails ? expiryDate : "••/••"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="w-full font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 sm:p-8 md:p-20 bg-white">
      <main className="w-full max-w-[384px] flex flex-col gap-[32px] row-start-2 items-center relative z-10">
        {/* Credit card with shadow */}
        <div className="shadow-xl">
          <CreditCard
            cardNumber="4242 4242 4242 4242"
            cardHolder="ANKIT VERMA"
            expiryDate="12/25"
          />
        </div>
      </main>
    </div>
  );
}
