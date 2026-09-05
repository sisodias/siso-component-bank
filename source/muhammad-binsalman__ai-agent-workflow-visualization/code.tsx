export default function AIAgentFlow() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-gradient-to-br from-stone-950 via-neutral-900 to-black p-8">
      <div className="w-full max-w-6xl">
        <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-2xl">
          <defs>
            <linearGradient id="agentGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <linearGradient id="nodeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>

            <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.6"/>
            </filter>
          </defs>

          <style>{`
            .trace-bg {
              stroke: #374151;
              stroke-width: 2.5;
              fill: none;
              opacity: 0.5;
            }
            .trace-flow {
              stroke-width: 3;
              fill: none;
              stroke-dasharray: 50 400;
              stroke-dashoffset: 450;
              filter: drop-shadow(0 0 8px currentColor);
              animation: flow 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            .trigger-flow {
              stroke: url(#greenGradient);
              color: #10b981;
            }
            .tool-flow {
              stroke: url(#orangeGradient);
              color: #f59e0b;
            }
            .query-flow {
              stroke: url(#purpleGradient);
              color: #8b5cf6;
            }
            @keyframes flow {
              to {
                stroke-dashoffset: 0;
              }
            }
            @keyframes rotate {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
            .node-text {
              font-family: 'Inter', -apple-system, sans-serif;
              font-size: 14px;
              font-weight: 700;
              fill: #ffffff;
            }
            .node-label {
              font-family: 'Inter', -apple-system, sans-serif;
              font-size: 10px;
              fill: #9ca3af;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: 600;
            }
          `}</style>

          {/* Decorative Background Circles */}
          <circle cx="450" cy="300" r="200" fill="url(#agentGradient)" opacity="0.03" />
          <circle cx="450" cy="300" r="150" fill="url(#agentGradient)" opacity="0.05" />

          {/* Input Nodes (Left Side) */}
          {/* User Input */}
          <g className="pulse-animation">
            <rect
              x="50"
              y="120"
              width="110"
              height="65"
              rx="16"
              fill="url(#nodeGradient)"
              stroke="url(#greenGradient)"
              strokeWidth="2.5"
              filter="url(#shadow)"
            />
            <circle cx="105" cy="137" r="8" fill="#10b981" opacity="0.2" />
            <path d="M100 135 L105 130 L110 135 L105 140 Z" fill="#10b981" />
            <text x="105" y="160" className="node-label" textAnchor="middle">Input</text>
            <text x="105" y="175" className="node-text" textAnchor="middle">User</text>
          </g>

          {/* API Trigger */}
          <g className="pulse-animation" style={{animationDelay: '0.2s'}}>
            <rect
              x="50"
              y="220"
              width="110"
              height="65"
              rx="16"
              fill="url(#nodeGradient)"
              stroke="url(#greenGradient)"
              strokeWidth="2.5"
              filter="url(#shadow)"
            />
            <circle cx="105" cy="237" r="8" fill="#10b981" opacity="0.2" />
            <rect x="100" y="234" width="10" height="6" rx="1" fill="#10b981" />
            <text x="105" y="260" className="node-label" textAnchor="middle">Trigger</text>
            <text x="105" y="275" className="node-text" textAnchor="middle">API</text>
          </g>

          {/* Event Stream */}
          <g className="pulse-animation" style={{animationDelay: '0.4s'}}>
            <rect
              x="50"
              y="320"
              width="110"
              height="65"
              rx="16"
              fill="url(#nodeGradient)"
              stroke="url(#greenGradient)"
              strokeWidth="2.5"
              filter="url(#shadow)"
            />
            <circle cx="105" cy="337" r="8" fill="#10b981" opacity="0.2" />
            <path d="M100 337 Q105 332 110 337" stroke="#10b981" strokeWidth="2" fill="none" />
            <text x="105" y="360" className="node-label" textAnchor="middle">Stream</text>
            <text x="105" y="375" className="node-text" textAnchor="middle">Event</text>
          </g>

          {/* Scheduler */}
          <g className="pulse-animation" style={{animationDelay: '0.6s'}}>
            <rect
              x="50"
              y="420"
              width="110"
              height="65"
              rx="16"
              fill="url(#nodeGradient)"
              stroke="url(#greenGradient)"
              strokeWidth="2.5"
              filter="url(#shadow)"
            />
            <circle cx="105" cy="437" r="8" fill="#10b981" opacity="0.2" />
            <circle cx="105" cy="437" r="6" stroke="#10b981" strokeWidth="2" fill="none" />
            <line x1="105" y1="437" x2="105" y2="433" stroke="#10b981" strokeWidth="2" />
            <text x="105" y="460" className="node-label" textAnchor="middle">Cron</text>
            <text x="105" y="475" className="node-text" textAnchor="middle">Schedule</text>
          </g>

          {/* Central AI Agent - Only Lottie Animation */}
          <g filter="url(#strongGlow)">
            {/* Centered Lottie Animation - Larger */}
            <foreignObject x="370" y="230" width="160" height="160">
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent'
              }}>
                <iframe 
                  src="https://lottie.host/embed/2a775044-47e0-4382-998d-332ea2c149b3/vpmb02cMgH.lottie" 
                  style={{
                    width: '160px',
                    height: '160px',
                    border: 'none',
                    background: 'transparent'
                  }}
                />
              </div>
            </foreignObject>
          </g>

          {/* Output Nodes (Right Side) */}
          {/* Web Search Tool */}
          <g className="pulse-animation" style={{animationDelay: '0.8s'}}>
            <rect
              x="740"
              y="120"
              width="110"
              height="65"
              rx="16"
              fill="url(#nodeGradient)"
              stroke="url(#orangeGradient)"
              strokeWidth="2.5"
              filter="url(#shadow)"
            />
            <circle cx="795" cy="137" r="8" fill="#f59e0b" opacity="0.2" />
            <circle cx="795" cy="137" r="5" stroke="#f59e0b" strokeWidth="2" fill="none" />
            <line x1="800" y1="142" x2="803" y2="145" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <text x="795" y="160" className="node-label" textAnchor="middle">Tool</text>
            <text x="795" y="175" className="node-text" textAnchor="middle">Search</text>
          </g>

          {/* API Call */}
          <g className="pulse-animation" style={{animationDelay: '1s'}}>
            <rect
              x="740"
              y="220"
              width="110"
              height="65"
              rx="16"
              fill="url(#nodeGradient)"
              stroke="url(#orangeGradient)"
              strokeWidth="2.5"
              filter="url(#shadow)"
            />
            <circle cx="795" cy="237" r="8" fill="#f59e0b" opacity="0.2" />
            <path d="M790 237 L795 232 L800 237 L795 242 Z" fill="#f59e0b" />
            <text x="795" y="260" className="node-label" textAnchor="middle">Tool</text>
            <text x="795" y="275" className="node-text" textAnchor="middle">API Call</text>
          </g>

          {/* Database Query */}
          <g className="pulse-animation" style={{animationDelay: '1.2s'}}>
            <rect
              x="740"
              y="320"
              width="110"
              height="65"
              rx="16"
              fill="url(#nodeGradient)"
              stroke="url(#purpleGradient)"
              strokeWidth="2.5"
              filter="url(#shadow)"
            />
            <circle cx="795" cy="337" r="8" fill="#8b5cf6" opacity="0.2" />
            <rect x="790" y="333" width="10" height="8" rx="1" stroke="#8b5cf6" strokeWidth="2" fill="none" />
            <text x="795" y="360" className="node-label" textAnchor="middle">Query</text>
            <text x="795" y="375" className="node-text" textAnchor="middle">Database</text>
          </g>

          {/* Vector DB */}
          <g className="pulse-animation" style={{animationDelay: '1.4s'}}>
            <rect
              x="740"
              y="420"
              width="110"
              height="65"
              rx="16"
              fill="url(#nodeGradient)"
              stroke="url(#purpleGradient)"
              strokeWidth="2.5"
              filter="url(#shadow)"
            />
            <circle cx="795" cy="437" r="8" fill="#8b5cf6" opacity="0.2" />
            <path d="M790 435 L795 440 L800 435 M790 437 L795 442 L800 437" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round" />
            <text x="795" y="460" className="node-label" textAnchor="middle">Query</text>
            <text x="795" y="475" className="node-text" textAnchor="middle">Vector DB</text>
          </g>

          {/* Connection Lines */}
          <g id="traces">
            {/* Input connections */}
            <path d="M160 152.5 H280 V280 H365" className="trace-bg" />
            <path d="M160 152.5 H280 V280 H365" className="trace-flow trigger-flow" />

            <path d="M160 252.5 H310 V290 H365" className="trace-bg" />
            <path d="M160 252.5 H310 V290 H365" className="trace-flow trigger-flow" style={{animationDelay: '0.3s'}} />

            <path d="M160 352.5 H310 V310 H365" className="trace-bg" />
            <path d="M160 352.5 H310 V310 H365" className="trace-flow trigger-flow" style={{animationDelay: '0.6s'}} />

            <path d="M160 452.5 H280 V320 H365" className="trace-bg" />
            <path d="M160 452.5 H280 V320 H365" className="trace-flow trigger-flow" style={{animationDelay: '0.9s'}} />

            {/* Output connections */}
            <path d="M535 280 H620 V152.5 H740" className="trace-bg" />
            <path d="M535 280 H620 V152.5 H740" className="trace-flow tool-flow" style={{animationDelay: '0.2s'}} />

            <path d="M535 290 H660 V252.5 H740" className="trace-bg" />
            <path d="M535 290 H660 V252.5 H740" className="trace-flow tool-flow" style={{animationDelay: '0.5s'}} />

            <path d="M535 310 H660 V352.5 H740" className="trace-bg" />
            <path d="M535 310 H660 V352.5 H740" className="trace-flow query-flow" style={{animationDelay: '0.8s'}} />

            <path d="M535 320 H620 V452.5 H740" className="trace-bg" />
            <path d="M535 320 H620 V452.5 H740" className="trace-flow query-flow" style={{animationDelay: '1.1s'}} />
          </g>

          {/* Connection dots with glow */}
          <circle cx="160" cy="152.5" r="5" fill="#10b981" className="node-glow" style={{color: '#10b981'}}>
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="160" cy="252.5" r="5" fill="#10b981" className="node-glow" style={{color: '#10b981'}}>
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="0.3s" />
          </circle>
          <circle cx="160" cy="352.5" r="5" fill="#10b981" className="node-glow" style={{color: '#10b981'}}>
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="0.6s" />
          </circle>
          <circle cx="160" cy="452.5" r="5" fill="#10b981" className="node-glow" style={{color: '#10b981'}}>
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="0.9s" />
          </circle>

          <circle cx="740" cy="152.5" r="5" fill="#f59e0b" className="node-glow" style={{color: '#f59e0b'}}>
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="0.2s" />
          </circle>
          <circle cx="740" cy="252.5" r="5" fill="#f59e0b" className="node-glow" style={{color: '#f59e0b'}}>
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          <circle cx="740" cy="352.5" r="5" fill="#8b5cf6" className="node-glow" style={{color: '#8b5cf6'}}>
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="0.8s" />
          </circle>
          <circle cx="740" cy="452.5" r="5" fill="#8b5cf6" className="node-glow" style={{color: '#8b5cf6'}}>
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="1.1s" />
          </circle>
        </svg>
      </div>

      {/* Info Text */}
      <div className="mt-8 text-center">
        <p className="text-sm font-semibold text-gray-400">
          <span className="inline-block animate-pulse">●</span> Live Agent Processing
        </p>
      </div>
    </div>
  );
}