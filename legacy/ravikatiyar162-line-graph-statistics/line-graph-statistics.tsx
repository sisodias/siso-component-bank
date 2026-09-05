import React, { useState, useEffect } from 'react';

const CleanWireframeAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [chartVisible, setChartVisible] = useState(false);

  // Sample data for different periods
  const data = {
    'Last 3 months': {
      dates: ['Jun 1', 'Jun 3', 'Jun 5', 'Jun 7', 'Jun 9', 'Jun 12', 'Jun 15', 'Jun 18', 'Jun 21', 'Jun 24', 'Jun 27', 'Jun 30'],
      mobile: [290, 270, 310, 280, 260, 350, 320, 340, 400, 370, 420, 480],
      desktop: [200, 180, 220, 255, 230, 280, 260, 270, 300, 285, 310, 320],
      peak: 480,
      average: 315,
      growth: '+15%'
    },
    'Last 30 days': {
      dates: ['Jun 1', 'Jun 3', 'Jun 5', 'Jun 7', 'Jun 9', 'Jun 12', 'Jun 15', 'Jun 18', 'Jun 21', 'Jun 24', 'Jun 27', 'Jun 30'],
      mobile: [290, 270, 310, 280, 260, 350, 320, 340, 400, 370, 420, 480],
      desktop: [200, 180, 220, 255, 230, 280, 260, 270, 300, 285, 310, 320],
      peak: 480,
      average: 315,
      growth: '+12%'
    },
    'Last 7 days': {
      dates: ['Jun 24', 'Jun 25', 'Jun 26', 'Jun 27', 'Jun 28', 'Jun 29', 'Jun 30'],
      mobile: [370, 420, 380, 450, 480, 520, 550],
      desktop: [285, 310, 295, 340, 320, 365, 380],
      peak: 550,
      average: 458,
      growth: '+18%'
    }
  };

  const currentData = data[selectedPeriod];
  const maxValue = Math.max(...currentData.mobile, ...currentData.desktop) * 1.1;

  // Generate path for smooth curves
  const generateSmoothPath = (values, height = 300, isArea = false) => {
    const width = 800;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = values.map((value, index) => ({
      x: padding + (index / (values.length - 1)) * chartWidth,
      y: padding + (1 - value / maxValue) * chartHeight
    }));

    if (points.length < 2) return '';

    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = curr.x - (next ? (next.x - curr.x) * 0.3 : 0);
      const cp2y = curr.y;
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
    }
    
    if (isArea) {
      path += ` L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;
    }
    
    return path;
  };

  useEffect(() => {
    setChartVisible(false);
    setAnimationPhase(0);
    
    const timers = [
      setTimeout(() => setAnimationPhase(1), 100),
      setTimeout(() => setAnimationPhase(2), 400),
      setTimeout(() => setAnimationPhase(3), 800),
      setTimeout(() => setChartVisible(true), 1200)
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [selectedPeriod]);

  const periods = [
    { label: 'Last 3 months', size: '2.32 KB', color: 'bg-green-500' },
    { label: 'Last 30 days', size: '1.45 KB', color: 'bg-blue-500' },
    { label: 'Last 7 days', size: '0.89 KB', color: 'bg-orange-500' }
  ];

  const metrics = [
    { label: 'Peak', value: currentData.peak, color: 'border-blue-500', size: '0.25 KB' },
    { label: 'Average', value: currentData.average, color: 'border-orange-500', size: '0.24 KB' },
    { label: 'Growth', value: currentData.growth, color: 'border-green-500', size: '0.16 KB' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-light">
      <div className="max-w-7xl mx-auto p-12">
        {/* Header */}
        <div className="mb-16">
          <h1 
            className={`text-6xl font-extralight text-gray-900 mb-4 tracking-tight transition-all duration-1000 ${
              animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Total Visitors
          </h1>
          <p 
            className={`text-xl text-gray-500 font-light transition-all duration-1000 delay-200 ${
              animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Total for the last 3 months
          </p>
        </div>

        {/* Main Chart Container */}
        <div className="relative bg-white rounded-none shadow-sm border-0">
          
          {/* Legend */}
          <div className="absolute top-8 left-8 z-10 flex gap-8">
            <div 
              className={`flex items-center gap-2 transition-all duration-800 delay-300 ${
                animationPhase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-50"></div>
              <span className="text-gray-700 font-medium">Mobile</span>
              <span className="text-gray-900 font-semibold">{currentData.mobile[currentData.mobile.length - 1]}</span>
            </div>
            <div 
              className={`flex items-center gap-2 transition-all duration-800 delay-400 ${
                animationPhase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="w-3 h-3 rounded-full border-2 border-gray-700 bg-gray-50"></div>
              <span className="text-gray-700 font-medium">Desktop</span>
              <span className="text-gray-900 font-semibold">{currentData.desktop[currentData.desktop.length - 1]}</span>
            </div>
          </div>

          {/* Period Selection */}
          <div className="absolute top-8 right-8 z-10 flex flex-col gap-2">
            {periods.map((period, index) => (
              <div
                key={period.label}
                className={`
                  cursor-pointer transition-all duration-700 hover:scale-105 hover:shadow-lg
                  ${selectedPeriod === period.label 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
                  }
                  ${animationPhase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
                `}
                style={{
                  transitionDelay: `${500 + index * 150}ms`,
                  borderRadius: '8px',
                  padding: '10px 16px',
                  minWidth: '140px'
                }}
                onClick={() => setSelectedPeriod(period.label)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={`w-2 h-2 rounded-full ${period.color}`}></div>
                  <span className="text-sm font-medium">{period.size}</span>
                </div>
                <div className="text-xs opacity-80">{period.label}</div>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="p-8 pt-20 pb-16">
            <div className="h-96 relative">
              <svg className="w-full h-full" viewBox="0 0 800 400">
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f8fafc" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="800" height="400" fill="url(#grid)"/>

                {/* Desktop Area */}
                <path
                  d={generateSmoothPath(currentData.desktop, 340, true)}
                  fill="rgba(107, 114, 128, 0.08)"
                  className={`transition-all duration-2000 ${
                    chartVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: chartVisible ? 'scale(1)' : 'scale(0.95)',
                    transformOrigin: 'center bottom'
                  }}
                />

                {/* Mobile Area */}
                <path
                  d={generateSmoothPath(currentData.mobile, 340, true)}
                  fill="rgba(59, 130, 246, 0.08)"
                  className={`transition-all duration-2000 ${
                    chartVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: chartVisible ? 'scale(1)' : 'scale(0.95)',
                    transformOrigin: 'center bottom',
                    transitionDelay: '300ms'
                  }}
                />

                {/* Desktop Line */}
                <path
                  d={generateSmoothPath(currentData.desktop, 340)}
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={`transition-all duration-2000 ${
                    chartVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    strokeDasharray: chartVisible ? 'none' : '1000',
                    strokeDashoffset: chartVisible ? '0' : '1000',
                    transitionDelay: '600ms'
                  }}
                />

                {/* Mobile Line */}
                <path
                  d={generateSmoothPath(currentData.mobile, 340)}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={`transition-all duration-2000 ${
                    chartVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    strokeDasharray: chartVisible ? 'none' : '1000',
                    strokeDashoffset: chartVisible ? '0' : '1000',
                    transitionDelay: '900ms'
                  }}
                />

                {/* Data Points */}
                {currentData.dates.map((date, index) => {
                  const padding = 60;
                  const chartWidth = 800 - padding * 2;
                  const chartHeight = 340 - padding * 2;
                  const x = padding + (index / (currentData.dates.length - 1)) * chartWidth;
                  const mobileY = padding + (1 - currentData.mobile[index] / maxValue) * chartHeight;
                  const desktopY = padding + (1 - currentData.desktop[index] / maxValue) * chartHeight;
                  
                  return (
                    <g key={index}>
                      {/* Desktop Point */}
                      <circle
                        cx={x}
                        cy={desktopY}
                        r={hoveredPoint === index ? 5 : 3}
                        fill="#374151"
                        className={`transition-all duration-500 cursor-pointer ${
                          chartVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        }`}
                        style={{
                          transitionDelay: `${1200 + index * 100}ms`
                        }}
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      
                      {/* Mobile Point */}
                      <circle
                        cx={x}
                        cy={mobileY}
                        r={hoveredPoint === index ? 5 : 3}
                        fill="#3b82f6"
                        className={`transition-all duration-500 cursor-pointer ${
                          chartVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        }`}
                        style={{
                          transitionDelay: `${1300 + index * 100}ms`
                        }}
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}

                {/* X-axis Labels */}
                {currentData.dates.map((date, index) => {
                  const padding = 60;
                  const chartWidth = 800 - padding * 2;
                  const x = padding + (index / (currentData.dates.length - 1)) * chartWidth;
                  
                  return (
                    <text
                      key={index}
                      x={x}
                      y={365}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="13"
                      fontWeight="400"
                      className={`transition-all duration-500 ${
                        chartVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        transitionDelay: `${1500 + index * 50}ms`
                      }}
                    >
                      {date}
                    </text>
                  );
                })}

                {/* Hover Tooltip */}
                {hoveredPoint !== null && (
                  <g>
                    <rect
                      x={60 + (hoveredPoint / (currentData.dates.length - 1)) * 680 - 50}
                      y={20}
                      width="100"
                      height="70"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      rx="6"
                      className="drop-shadow-xl"
                    />
                    <text
                      x={60 + (hoveredPoint / (currentData.dates.length - 1)) * 680}
                      y={38}
                      textAnchor="middle"
                      fill="#1f2937"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {currentData.dates[hoveredPoint]}
                    </text>
                    <text
                      x={60 + (hoveredPoint / (currentData.dates.length - 1)) * 680}
                      y={55}
                      textAnchor="middle"
                      fill="#3b82f6"
                      fontSize="11"
                      fontWeight="500"
                    >
                      Mobile: {currentData.mobile[hoveredPoint]}
                    </text>
                    <text
                      x={60 + (hoveredPoint / (currentData.dates.length - 1)) * 680}
                      y={72}
                      textAnchor="middle"
                      fill="#374151"
                      fontSize="11"
                      fontWeight="500"
                    >
                      Desktop: {currentData.desktop[hoveredPoint]}
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Bottom Metrics */}
          <div className="px-8 pb-8 flex justify-between items-end">
            <div className="flex gap-4">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className={`
                    bg-white rounded-lg shadow-sm border-2 ${metric.color} p-4 min-w-[120px]
                    transition-all duration-800 hover:scale-105 hover:shadow-md
                    ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                  `}
                  style={{
                    transitionDelay: `${1800 + index * 200}ms`
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                    <span className="text-xs text-gray-500 font-medium">{metric.size}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Bundle Size */}
            <div 
              className={`bg-gray-900 text-white px-6 py-3 rounded-lg transition-all duration-800 ${
                animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '2400ms' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-300 font-medium">Bundle size</span>
                <span className="font-bold">{currentData.peak + currentData.average} visitors</span>
              </div>
              <div className="w-48 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-blue-500 via-green-500 to-orange-500 rounded-full transition-all duration-2000 ${
                    chartVisible ? 'w-full' : 'w-0'
                  }`}
                  style={{ transitionDelay: '2800ms' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanWireframeAnalytics;