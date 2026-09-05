import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, ShoppingCart, CreditCard, Package } from "lucide-react";

const StatCard = ({ label, value, trend, trendValue, icon: Icon, color = "blue" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-emerald-600 bg-emerald-50";
    if (trend === "down") return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    pink: "from-pink-500 to-pink-600"
  };

  return (
    <div
      className={`relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-300 ${
        isHovered ? "shadow-2xl -translate-y-1" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient decoration */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorMap[color]} opacity-5 rounded-2xl blur-2xl`}></div>
      
      <div className="relative">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} mb-4 transition-transform duration-300 ${
          isHovered ? "scale-110 rotate-3" : ""
        }`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Label */}
        <div className="text-sm font-medium text-gray-500 mb-2">{label}</div>

        {/* Value and Trend */}
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          
          {trendValue && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${getTrendColor()} transition-all duration-300`}>
              {getTrendIcon()}
              <span className="text-sm font-semibold">{trendValue}</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colorMap[color]} transition-all duration-1000 ${
              isHovered ? "w-full" : "w-0"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export function StatsDemo() {
  const stats = [
    {
      label: "Profits",
      value: "$38,050",
      trend: "up",
      trendValue: "10%",
      icon: DollarSign,
      color: "green"
    },
    {
      label: "Revenue",
      value: "$4,635",
      trend: "down",
      trendValue: "5%",
      icon: TrendingUp,
      color: "blue"
    },
    {
      label: "Staff",
      value: "110",
      trend: "equal",
      trendValue: "0%",
      icon: Users,
      color: "purple"
    },
    {
      label: "Cost",
      value: "$2,800",
      trend: "up",
      trendValue: "10%",
      icon: CreditCard,
      color: "orange"
    },
    {
      label: "Expenses",
      value: "$1,130",
      trend: "up",
      trendValue: "3%",
      icon: Package,
      color: "pink"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Track your business metrics at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
              <p className="text-blue-100">Your business is growing steadily this quarter</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">+12.5%</div>
              <div className="text-blue-100">vs last month</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}