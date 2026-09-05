import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// A function to generate a smooth SVG path from data points
const generateSmoothPath = (data, width, height, yAxisRange) => {
    if (!data || data.length < 2) {
        return `M 0 ${height}`;
    }

    const [minY, maxY] = yAxisRange;
    const xStep = width / (data.length - 1);

    const pathData = data.map((point, i) => {
        const x = i * xStep;
        // Scale y-value to the height based on the provided y-axis range
        const y = height - ((point.value - minY) / (maxY - minY)) * height;
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

// Theme toggle button component
const ThemeToggle = ({ isDark, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="fixed top-6 right-6 p-3 rounded-full bg-card border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-10"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-foreground" />
            ) : (
                <Moon className="w-5 h-5 text-foreground" />
            )}
        </button>
    );
};

// The main Project Deliveries Chart Component
const ProjectDeliveriesChart = () => {
    const linePathRef = useRef(null);
    const areaPathRef = useRef(null);
    
    // Static data representing the chart in the image
    const chartData = [
        { label: 'Mar 2022', value: 2.8 },
        { label: 'Apr 2022', value: 5.8 },
        { label: '', value: 4.4 },
        { label: 'May 2022', value: 8 },
        { label: '', value: 6.5 },
        { label: 'Jun 2022', value: 3.5 },
    ];
    
    const yAxisLabels = [0, 2, 4, 6, 8];
    const yAxisRange = [0, 9]; // Give a little extra space at the top

    // SVG dimensions and padding
    const svgWidth = 500;
    const svgHeight = 200;
    const padding = { top: 10, right: 10, bottom: 30, left: 30 };

    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    // Memoized path calculations
    const linePath = useMemo(() => generateSmoothPath(chartData, chartWidth, chartHeight, yAxisRange), [chartData, chartWidth, chartHeight, yAxisRange]);
    
    const areaPath = useMemo(() => {
        if (!linePath) return "";
        return `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
    }, [linePath, chartWidth, chartHeight]);

    // Find the coordinates for the highlighted point ('May 2022')
    const highlightedPointIndex = chartData.findIndex(d => d.label === 'May 2022');
    const highlightedPoint = useMemo(() => {
        if (highlightedPointIndex === -1) return null;
        
        const x = (chartWidth / (chartData.length - 1)) * highlightedPointIndex;
        const y = chartHeight - ((chartData[highlightedPointIndex].value - yAxisRange[0]) / (yAxisRange[1] - yAxisRange[0])) * chartHeight;
        return { x, y };
    }, [chartData, chartWidth, chartHeight, yAxisRange, highlightedPointIndex]);

    // Animate the line graph on change/load
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
            path.style.transition = 'stroke-dashoffset 1.2s ease-in-out';
            path.style.strokeDashoffset = '0';

            area.style.transition = 'opacity 1.2s ease-in-out 0.3s'; // Delay start
            area.style.opacity = '1';
        }
    }, [linePath]); // Re-run animation when the path data changes


    return (
        <div className="w-full max-w-2xl bg-card text-card-foreground rounded-3xl shadow-lg p-6 border">
            <h2 className="text-xl font-semibold text-foreground mb-4">
                Project Deliveries
            </h2>
            <div className="w-full">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--chart-color-primary)" stopOpacity={0.2}/>
                            <stop offset="100%" stopColor="var(--chart-color-primary)" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="highlightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--chart-color-primary)" stopOpacity={0.25}/>
                            <stop offset="100%" stopColor="var(--chart-color-primary)" stopOpacity={0.05}/>
                        </linearGradient>
                    </defs>

                    {/* Y-Axis Labels */}
                    <g transform={`translate(0, ${padding.top})`} className="text-xs text-muted-foreground fill-current">
                        {yAxisLabels.map((label) => {
                            const y = chartHeight - ((label - yAxisRange[0]) / (yAxisRange[1] - yAxisRange[0])) * chartHeight;
                            return (
                                <text key={label} x={padding.left - 10} y={y} textAnchor="end" alignmentBaseline="middle">
                                    {label}
                                </text>
                            );
                        })}
                    </g>
                    
                    {/* Chart Area */}
                    <g transform={`translate(${padding.left}, ${padding.top})`}>
                        {/* Highlighted Bar */}
                        {highlightedPoint && (
                             <rect
                                x={highlightedPoint.x - 20}
                                y={highlightedPoint.y}
                                width="40"
                                height={chartHeight - highlightedPoint.y}
                                fill="url(#highlightGradient)"
                                rx="4"
                            />
                        )}

                        {/* Area Path */}
                        <path ref={areaPathRef} d={areaPath} fill="url(#areaGradient)" />

                        {/* Line Path */}
                        <path
                            ref={linePathRef}
                            d={linePath}
                            fill="none"
                            stroke="var(--chart-color-primary)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        
                        {/* Highlighted Point Circle */}
                         {highlightedPoint && (
                            <g>
                                <circle
                                    cx={highlightedPoint.x}
                                    cy={highlightedPoint.y}
                                    r="8"
                                    fill="var(--card)"
                                    stroke="var(--chart-color-primary)"
                                    strokeWidth="3"
                                />
                                <circle
                                    cx={highlightedPoint.x}
                                    cy={highlightedPoint.y}
                                    r="4"
                                    fill="var(--chart-color-primary)"
                                />
                            </g>
                        )}

                        {/* X-Axis Labels */}
                        <g transform={`translate(0, ${chartHeight})`} className="text-xs text-muted-foreground fill-current">
                            {chartData.map((d, i) => {
                                if (!d.label) return null;
                                const x = (chartWidth / (chartData.length - 1)) * i;
                                return (
                                    <text key={d.label} x={x} y={padding.bottom - 5} textAnchor="middle">
                                        {d.label}
                                    </text>
                                );
                            })}
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    );
};

// Main App component to display the widget
export function Component() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <>
            <style>{`
                :root {
                  /* Light mode variables */
                  --background-light: 240 10% 97%;
                  --foreground-light: 222.2 84% 4.9%;
                  --card-light: 0 0% 100%;
                  --card-foreground-light: 222.2 84% 4.9%;
                  --muted-foreground-light: 215.4 16.3% 56.9%;
                  --border-light: 214.3 31.8% 91.4%;
                  --chart-color-primary-light: #6366F1;
                  
                  /* Dark mode variables */
                  --background-dark: 222.2 84% 4.9%;
                  --foreground-dark: 210 40% 98%;
                  --card-dark: 222.2 84% 4.9%;
                  --card-foreground-dark: 210 40% 98%;
                  --muted-foreground-dark: 215 20.2% 65.1%;
                  --border-dark: 217.2 32.6% 17.5%;
                  --chart-color-primary-dark: #8B5CF6;
                }

                .theme-light {
                  --background: var(--background-light);
                  --foreground: var(--foreground-light);
                  --card: var(--card-light);
                  --card-foreground: var(--card-foreground-light);
                  --muted-foreground: var(--muted-foreground-light);
                  --border: var(--border-light);
                  --chart-color-primary: var(--chart-color-primary-light);
                }

                .theme-dark {
                  --background: var(--background-dark);
                  --foreground: var(--foreground-dark);
                  --card: var(--card-dark);
                  --card-foreground: var(--card-foreground-dark);
                  --muted-foreground: var(--muted-foreground-dark);
                  --border: var(--border-dark);
                  --chart-color-primary: var(--chart-color-primary-dark);
                }
                
                .bg-background { background-color: hsl(var(--background)); }
                .text-foreground { color: hsl(var(--foreground)); }
                .bg-card { background-color: hsl(var(--card)); }
                .text-card-foreground { color: hsl(var(--card-foreground)); }
                .text-muted-foreground { color: hsl(var(--muted-foreground)); }
                .border { border-color: hsl(var(--border)); }

                /* Grid background animation */
                @keyframes grid-move {
                    from { background-position: 0px 0px, 0px 0px; }
                    to { background-position: 40px 40px, 40px 40px; }
                }

                .animated-grid-bg.theme-light {
                    background: radial-gradient(circle at 50% 50%, transparent 0%, hsl(var(--background)) 50%, hsl(var(--background)) 100%),
                                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px);
                    background-size: cover, 40px 40px, 40px 40px;
                    animation: grid-move 4s linear infinite;
                    transition: background 0.3s ease;
                }

                .animated-grid-bg.theme-dark {
                    background: linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
                    background-size: 40px 40px, 40px 40px;
                    animation: grid-move 4s linear infinite;
                    transition: background 0.3s ease;
                }

                .theme-transition {
                    transition: all 0.3s ease;
                }
            `}</style>
            <div className={`w-full min-h-screen flex flex-col items-center justify-center font-sans p-4 bg-background animated-grid-bg theme-transition ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
                <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
                <ProjectDeliveriesChart />
            </div>
        </>
    );
}