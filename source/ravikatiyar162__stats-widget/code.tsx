import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

// A small utility function to generate random numbers in a range
const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// A function to generate a smooth SVG path from data points
const generateSmoothPath = (points, width, height) => {
    if (!points || points.length < 2) {
        return `M 0 ${height}`;
    }

    const xStep = width / (points.length - 1);
    const pathData = points.map((point, i) => {
        const x = i * xStep;
        // Scale point to height, with a small padding from top/bottom
        const y = height - (point / 100) * (height * 0.8) - (height * 0.1);
        return [x, y];
    });

    let path = `M ${pathData[0][0]} ${pathData[0][1]}`;

    for (let i = 0; i < pathData.length - 1; i++) {
        const x1 = pathData[i][0];
        const y1 = pathData[i][1];
        const x2 = pathData[i + 1][0];
        const y2 = pathData[i + 1][1];
        const midX = (x1 + x2) / 2;
        path += ` C ${midX},${y1} ${midX},${y2} ${x2},${y2}`;
    }

    return path;
};


// The main Stats Widget Component, now shadcn/ui theme compatible
const StatsWidget = () => {
    const [stats, setStats] = useState({
        amount: 283,
        change: 36,
        chartData: [30, 55, 45, 75, 60, 85, 70],
    });
    const linePathRef = useRef(null);
    const areaPathRef = useRef(null);

    // Function to generate new random data for interactivity
    const updateStats = () => {
        const newAmount = getRandom(100, 999);
        const newChange = getRandom(-50, 100);
        const newChartData = Array.from({ length: 7 }, () => getRandom(10, 90));

        setStats({
            amount: newAmount,
            change: newChange,
            chartData: newChartData,
        });
    };

    // Auto-update stats every 3 seconds
    useEffect(() => {
        const intervalId = setInterval(updateStats, 3000);
        return () => clearInterval(intervalId);
    }, []);

    // SVG viewbox dimensions
    const svgWidth = 150;
    const svgHeight = 60;

    // Generate the SVG path for the line, memoized for performance
    const linePath = useMemo(() => generateSmoothPath(stats.chartData, svgWidth, svgHeight), [stats.chartData]);

    // Generate the SVG path for the gradient area
    const areaPath = useMemo(() => {
        if (!linePath.startsWith("M")) return "";
        return `${linePath} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
    }, [linePath]);


    // Animate the line graph on change
    useEffect(() => {
        const path = linePathRef.current;
        const area = areaPathRef.current;

        if (path && area) {
            const length = path.getTotalLength();
            // --- Animate Line ---
            path.style.transition = 'none';
            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = length;

            // --- Animate Area ---
            area.style.transition = 'none';
            area.style.opacity = '0';

            // Trigger reflow to apply initial styles before transition
            path.getBoundingClientRect();

            // --- Start Transitions ---
            path.style.transition = 'stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease';
            path.style.strokeDashoffset = '0';

            area.style.transition = 'opacity 0.8s ease-in-out 0.2s, fill 0.5s ease'; // Delay start
            area.style.opacity = '1';
        }
    }, [linePath]); // Re-run animation when the path data changes


    const isPositiveChange = stats.change >= 0;
    // We now use CSS variables for colors, which are defined in the App component's style tag.
    // The component will dynamically change the class/url based on the change direction.
    const changeColorClass = isPositiveChange ? 'text-success' : 'text-destructive';
    const graphStrokeColor = isPositiveChange ? 'var(--success-stroke)' : 'var(--destructive-stroke)';
    const gradientId = isPositiveChange ? 'areaGradientSuccess' : 'areaGradientDestructive';

    return (
        <div
            className="w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-lg p-6 border"
        >
            <div className="flex justify-between items-center">
                {/* Left side content */}
                <div className="flex flex-col w-1/2">
                    <div className="flex items-center text-muted-foreground text-md">
                        <span>This Week</span>
                        <span className={`ml-2 flex items-center font-semibold ${changeColorClass}`}>
                            {Math.abs(stats.change)}%
                            {isPositiveChange ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />}
                        </span>
                    </div>
                    <p className="text-4xl font-bold text-foreground mt-2">
                        ${stats.amount}
                    </p>
                </div>

                {/* Right side chart */}
                <div className="w-1/2 h-16">
                    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                            {/* Gradients now use CSS variables for colors, making them theme-aware */}
                            <linearGradient id="areaGradientSuccess" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--success-stroke)" stopOpacity={0.4}/>
                                <stop offset="100%" stopColor="var(--success-stroke)" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="areaGradientDestructive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--destructive-stroke)" stopOpacity={0.4}/>
                                <stop offset="100%" stopColor="var(--destructive-stroke)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <path
                            ref={areaPathRef}
                            d={areaPath}
                            fill={`url(#${gradientId})`}
                        />
                        <path
                            ref={linePathRef}
                            d={linePath}
                            fill="none"
                            stroke={graphStrokeColor}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};


// Main App component to display the widget
export function Component() {
    return (
        <>
            {/* This style block defines the CSS variables for light and dark themes,
              similar to how shadcn/ui works. This makes the component theme-aware.
            */}
            <style>{`
                :root {
                  --background: 0 0% 100%;
                  --foreground: 222.2 84% 4.9%;
                  --card: 0 0% 100%;
                  --card-foreground: 222.2 84% 4.9%;
                  --muted: 210 40% 96.1%;
                  --muted-foreground: 215.4 16.3% 46.9%;
                  --border: 214.3 31.8% 91.4%;
                  --success: 142.1 76.2% 41.2%;
                  --destructive: 0 84.2% 60.2%;
                  --success-stroke: #22C55E;
                  --destructive-stroke: #F97316;
                  --diag-line-color: #e2e8f0;
                  --diag-bg-color: #f1f5f9;
                }
                
                .dark {
                  --background: 222.2 84% 4.9%;
                  --foreground: 210 40% 98%;
                  --card: 222.2 84% 4.9%;
                  --card-foreground: 210 40% 98%;
                  --muted: 217.2 32.6% 17.5%;
                  --muted-foreground: 215 20.2% 65.1%;
                  --border: 217.2 32.6% 17.5%;
                  --success: 142.1 70.2% 45.2%;
                  --destructive: 0 72.2% 50.6%;
                  --success-stroke: #22C55E;
                  --destructive-stroke: #F97316;
                  --diag-line-color: #1e293b;
                  --diag-bg-color: #0f172a;
                }

                .bg-background { background-color: hsl(var(--background)); }
                .text-foreground { color: hsl(var(--foreground)); }
                .bg-card { background-color: hsl(var(--card)); }
                .text-card-foreground { color: hsl(var(--card-foreground)); }
                .text-muted-foreground { color: hsl(var(--muted-foreground)); }
                .border { border-color: hsl(var(--border)); }
                .text-success { color: hsl(var(--success)); }
                .text-destructive { color: hsl(var(--destructive)); }
                
                @keyframes diagonal-scroll {
                    from { background-position: 0 0; }
                    to { background-position: -56px 56px; }
                }

                .diagonal-lines-bg {
                    background-color: var(--diag-bg-color);
                    background-image: repeating-linear-gradient(
                        45deg,
                        var(--diag-line-color) 0,
                        var(--diag-line-color) 1px,
                        transparent 1px,
                        transparent 28px
                    );
                    animation: diagonal-scroll 20s linear infinite;
                }
            `}</style>
            <div className="w-full min-h-screen flex flex-col items-center justify-center font-sans p-4 diagonal-lines-bg bg-background transition-colors duration-300">
                <StatsWidget />
            </div>
        </>
    );
}
