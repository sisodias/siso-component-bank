import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Globe, Smartphone, Monitor, TrendingUp, Clock } from 'lucide-react';

interface AppUsage {
  icon: React.ReactNode;
  name: string;
  duration: string;
  color: string;
  percentage?: number;
}

interface ScreenTimeCardProps {
  totalHours: number;
  totalMinutes: number;
  barData: number[];
  timeLabels?: string[];
  topApps: AppUsage[];
  className?: string;
  comparisonText?: string;
}

const ScreenTimeCard = ({
  totalHours,
  totalMinutes,
  barData,
  timeLabels = ["12AM", "6AM", "12PM", "6PM"],
  topApps,
  comparisonText = "+12% from last week",
}: ScreenTimeCardProps) => {
  const maxValue = Math.max(...barData);
  const normalizedData = barData.map((value) => value / maxValue);

  const barVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: (i: number) => ({
      height: `${normalizedData[i] * 100}%`,
      opacity: 1,
      transition: {
        delay: i * 0.015,
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const totalMinutesInDay = totalHours * 60 + totalMinutes;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl bg-white dark:bg-slate-950 rounded-3xl shadow-2xl shadow-amber-500/10 dark:shadow-amber-900/30 overflow-hidden border border-slate-200/50 dark:border-slate-800/50"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 relative overflow-hidden">
        {/* Subtle gold accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-yellow-600/10" />
        
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span className="text-amber-200/90 text-sm font-medium uppercase tracking-wider">
                Screen Time Today
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-6xl font-bold text-white">
                {totalHours}
                <span className="text-3xl text-amber-200/80">h</span>
              </h2>
              <span className="text-4xl font-semibold text-white/90">
                {totalMinutes}
                <span className="text-2xl text-amber-200/70">m</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-400/30">
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span className="text-amber-100 text-sm font-medium">{comparisonText}</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bar Graph Section */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Usage Timeline
            </h3>
            <div className="relative h-64">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <span className="text-xs text-slate-400 dark:text-slate-600 w-8 text-right mr-3">
                      {4 - i}h
                    </span>
                    <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="absolute inset-0 flex items-end gap-1 pl-11 pb-8">
                {normalizedData.map((height, index) => {
                  const isHighPeak = height > 0.7;
                  const isMediumPeak = height > 0.4 && height <= 0.7;
                  
                  let gradientClass = "bg-gradient-to-t from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700";
                  if (isHighPeak) {
                    gradientClass = "bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400";
                  } else if (isMediumPeak) {
                    gradientClass = "bg-gradient-to-t from-amber-400 to-amber-300 dark:from-amber-700 dark:to-amber-600";
                  }

                  return (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={barVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex-1 rounded-t-lg ${gradientClass} hover:scale-105 transition-transform cursor-pointer relative group`}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                        {Math.round(barData[index])} min
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-11 right-0 flex justify-between text-xs text-slate-500 dark:text-slate-500 font-medium">
                {timeLabels.map((label, index) => (
                  <span key={index}>{label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Top Apps Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Most Used Apps
            </h3>
            <div className="space-y-4">
              {topApps.map((app, index) => {
                const [hours, minutes] = app.duration.split(' ');
                const appMinutes = parseInt(hours) * 60 + parseInt(minutes);
                const percentage = Math.round((appMinutes / totalMinutesInDay) * 100);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer border border-transparent hover:border-amber-200 dark:hover:border-amber-900/50 hover:shadow-lg hover:shadow-amber-500/5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                        style={{ 
                          background: `linear-gradient(135deg, ${app.color}20, ${app.color}40)`,
                        }}
                      >
                        {app.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {app.name}
                          </span>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {percentage}%
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: app.color }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {app.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Demo Component
export default function Demo() {
  const sampleBarData = [
    20, 15, 10, 8, 12, 25, 35, 45, 60, 75, 80, 85,
    70, 65, 55, 50, 60, 75, 80, 90, 85, 75, 60, 50
  ];

  const topApps = [
    {
      icon: <MessageSquare className="w-6 h-6" style={{ color: '#3b82f6' }} strokeWidth={2.5} />,
      name: "Messages",
      duration: "10h 1m",
      color: "#3b82f6",
    },
    {
      icon: <Globe className="w-6 h-6" style={{ color: '#f97316' }} strokeWidth={2.5} />,
      name: "Chrome",
      duration: "4h 23m",
      color: "#f97316",
    },
    {
      icon: <Smartphone className="w-6 h-6" style={{ color: '#a855f7' }} strokeWidth={2.5} />,
      name: "Social",
      duration: "2h 38m",
      color: "#a855f7",
    },
    {
      icon: <Monitor className="w-6 h-6" style={{ color: '#6b7280' }} strokeWidth={2.5} />,
      name: "Other",
      duration: "1h 29m",
      color: "#6b7280",
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/20 to-yellow-50/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8">
      <ScreenTimeCard
        totalHours={23}
        totalMinutes={2}
        barData={sampleBarData}
        timeLabels={["12AM", "6AM", "12PM", "6PM"]}
        topApps={topApps}
        comparisonText="+12% from last week"
      />
    </div>
  );
}