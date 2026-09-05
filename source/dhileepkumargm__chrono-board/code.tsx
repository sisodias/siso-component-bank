"use client";

import React from "react";

// Utility for conditional class names
const cn = (...inputs) => inputs.filter(Boolean).join(" ");

// Icon components
export const CheckCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export const Zap = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

export const AlertTriangle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <line x1="12" x2="12" y1="9" y2="13"></line>
    <line x1="12" x2="12.01" y1="17" y2="17"></line>
  </svg>
);

// DisplayCard component
export function DisplayCard({
  icon,
  title,
  description,
  date,
  status,
  statusColor,
  active = false,
}) {
  return (
    <div className="group relative flex items-start gap-x-4">
      <div className="absolute left-[11px] top-5 h-full w-0.5 bg-slate-800"></div>

      <div
        className={cn(
          "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
          active ? statusColor : "bg-slate-700 group-hover:bg-slate-600"
        )}
      >
        <div
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            active ? "bg-slate-900" : "bg-slate-500 group-hover:bg-slate-400"
          )}
        ></div>
        {icon &&
          React.cloneElement(icon, {
            className:
              "absolute opacity-0 group-hover:opacity-100 transition-opacity scale-125 text-white",
          })}
      </div>

      <div
        className={cn(
          "flex-grow rounded-xl border border-transparent p-4 transition-all duration-300",
          active
            ? `bg-slate-800/50 border-slate-700 shadow-lg shadow-black/20`
            : "group-hover:bg-slate-800/50 group-hover:border-slate-700/50"
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-100">{title}</p>
          <span className="text-sm text-slate-500">{date}</span>
        </div>
        <p className="mt-1 text-slate-400">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              statusColor,
              "text-slate-900"
            )}
          >
            {status}
          </span>
          <div className="flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button className="rounded-md bg-slate-700/50 px-3 py-1 text-sm text-slate-300 hover:bg-slate-700">Details</button>
            <button className="rounded-md bg-slate-700/50 px-3 py-1 text-sm text-slate-300 hover:bg-slate-700">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// DisplayCards list
export function DisplayCards({ cards }) {
  return (
    <div className="relative w-full space-y-4">
      {cards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}

// Demo container
export default function DisplayCardsDemo() {
  const cardsData = [
    {
      icon: <CheckCircle />,
      title: "System Status: Nominal",
      description: "All systems are running optimally. No issues detected.",
      date: "2:16 PM",
      status: "Completed",
      statusColor: "bg-green-400",
      active: true,
    },
    {
      icon: <Zap />,
      title: "New AI Model Deployed",
      description: "The 'Phoenix-Next' model is now live across all platforms.",
      date: "1:30 PM",
      status: "In Progress",
      statusColor: "bg-blue-400",
    },
    {
      icon: <AlertTriangle />,
      title: "Server Maintenance",
      description: "Scheduled maintenance in 2 hours. Expect brief downtime.",
      date: "12:00 PM",
      status: "Upcoming",
      statusColor: "bg-amber-400",
    },
  ];

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-b from-slate-950 to-transparent"></div>
      <div className="relative z-10 w-full max-w-2xl px-4">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-300">Today's Activity</h1>
        <DisplayCards cards={cardsData} />
      </div>
    </div>
  );
}
