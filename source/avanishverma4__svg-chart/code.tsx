import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '' }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={`rounded-xl border ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 400 });
  const containerRef = useRef(null);

  // Sample data
  const data = [
    { x: 0, y: 30, label: 'Jan' },
    { x: 1, y: 45, label: 'Feb' },
    { x: 2, y: 38, label: 'Mar' },
    { x: 3, y: 65, label: 'Apr' },
    { x: 4, y: 52, label: 'May' },
    { x: 5, y: 78, label: 'Jun' },
    { x: 6, y: 85, label: 'Jul' },
  ];

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const width = Math.min(containerWidth - 32, 800);
        const height = Math.max(Math.min(width * 0.6, 400), 300);
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { width, height } = dimensions;

  // Responsive padding
  const padding = width < 500 ? 40 : 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Scale functions
  const xScale = (x) => padding + (x / (data.length - 1)) * chartWidth;
  const yScale = (y) => height - padding - (y / 100) * chartHeight;

  // Generate path for the line
  const linePath = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(d.x)} ${yScale(d.y)}`
  ).join(' ');

  // Generate path for the area fill
  const areaPath = `${linePath} L ${xScale(data[data.length - 1].x)} ${height - padding} L ${xScale(0)} ${height - padding} Z`;

  // Grid lines
  const gridLines = {
    horizontal: [0, 25, 50, 75, 100],
    vertical: data.map(d => d.x),
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-8 w-full">
      <Card className="bg-zinc-950 border-zinc-800 p-4 sm:p-6 lg:p-8 shadow-2xl w-screen max-w-5xl">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-light text-white mb-1 sm:mb-2">
            Performance Analytics
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">Monthly growth metrics</p>
        </div>

        <div ref={containerRef} className="w-full overflow-x-auto">
          <svg 
            width={width} 
            height={height} 
            className="overflow-visible min-w-full"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Orthogonal Grid */}
            <g className="grid">
              {/* Horizontal grid lines */}
              {gridLines.horizontal.map((value, i) => (
                <motion.line
                  key={`h-${i}`}
                  x1={padding}
                  y1={yScale(value)}
                  x2={width - padding}
                  y2={yScale(value)}
                  stroke="#27272a"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}

              {/* Vertical grid lines */}
              {gridLines.vertical.map((value, i) => (
                <motion.line
                  key={`v-${i}`}
                  x1={xScale(value)}
                  y1={padding}
                  x2={xScale(value)}
                  y2={height - padding}
                  stroke="#27272a"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </g>

            {/* Y-axis labels */}
            {gridLines.horizontal.map((value, i) => (
              <text
                key={`y-label-${i}`}
                x={padding - 10}
                y={yScale(value)}
                fill="#71717a"
                fontSize={width < 500 ? "10" : "12"}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {value}
              </text>
            ))}

            {/* Area fill with gradient */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            <motion.path
              d={areaPath}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Line path */}
            <motion.path
              d={linePath}
              fill="none"
              stroke="#ffffff"
              strokeWidth={width < 500 ? "2" : "3"}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Data points */}
            {data.map((d, i) => (
              <g key={i}>
                <motion.circle
                  cx={xScale(d.x)}
                  cy={yScale(d.y)}
                  r={hoveredPoint === i ? (width < 500 ? 6 : 8) : (width < 500 ? 4 : 6)}
                  fill="#000000"
                  stroke="#ffffff"
                  strokeWidth={width < 500 ? "2" : "3"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="cursor-pointer"
                />

                {/* Value label on hover */}
                {hoveredPoint === i && (
                  <motion.g
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <rect
                      x={xScale(d.x) - 25}
                      y={yScale(d.y) - 40}
                      width="50"
                      height="28"
                      fill="#ffffff"
                      rx="4"
                    />
                    <text
                      x={xScale(d.x)}
                      y={yScale(d.y) - 22}
                      fill="#000000"
                      fontSize="14"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {d.y}%
                    </text>
                  </motion.g>
                )}
              </g>
            ))}

            {/* X-axis labels */}
            {data.map((d, i) => (
              <text
                key={`x-label-${i}`}
                x={xScale(d.x)}
                y={height - padding + (width < 500 ? 20 : 25)}
                fill="#71717a"
                fontSize={width < 500 ? "10" : "12"}
                textAnchor="middle"
              >
                {d.label}
              </text>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 sm:w-8 h-0.5 bg-white"></div>
            <span className="text-xs sm:text-sm text-zinc-400">Growth Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-black border-2 border-white"></div>
            <span className="text-xs sm:text-sm text-zinc-400">Data Points</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnimatedChart;
