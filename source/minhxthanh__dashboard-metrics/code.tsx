import { useState, useEffect } from "react";

export function Dashboard() {
  // Annual Profits State
  const [circlesVisible, setCirclesVisible] = useState([false, false, false, false]);
  const [showNumbers, setShowNumbers] = useState(false);
  const [showText, setShowText] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  // Top Expenses State
  const [showExpenseCard, setShowExpenseCard] = useState(false);
  const [expenseProgress, setExpenseProgress] = useState(0);
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [showExpenseText, setShowExpenseText] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const profits = [
    { value: 25, label: "$25k", size: 120 },
    { value: 42, label: "$42k", size: 200 },
    { value: 48, label: "$48k", size: 280 },
    { value: 49, label: "$49k", size: 360 },
  ];

  const expenses = [
    { name: "Marketing", color: "#E8A882", percent: 30, startAngle: 160, endAngle: 260 },
    { name: "Office rent", color: "#C9A0DC", percent: 35, startAngle: 270, endAngle: 360 },
    { name: "Advertising", color: "#6BB8E8", percent: 25, startAngle: 10, endAngle: 90 },
  ];

  const totalExpense = 95900.87;

  // Annual Profits Animation
  useEffect(() => {
    const circleDelays = [100, 350, 600, 850];
    circleDelays.forEach((delay, index) => {
      setTimeout(() => {
        setCirclesVisible((prev) => {
          const newState = [...prev];
          newState[3 - index] = true;
          return newState;
        });
      }, delay);
    });

    setTimeout(() => setShowNumbers(true), 2200);
    setTimeout(() => setShowText(true), 2600);
  }, []);

  useEffect(() => {
    if (!showNumbers) return;

    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts(profits.map((p) => Math.round(p.value * eased)));
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [showNumbers]);

  // Top Expenses Animation
  useEffect(() => {
    setTimeout(() => setShowExpenseCard(true), 300);
    setTimeout(() => setShowLegend(true), 600);
    
    // Start progress animation
    setTimeout(() => {
      const duration = 2000;
      const steps = 80;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setExpenseProgress(eased * 100);
        setExpenseAmount(eased * totalExpense);
        if (step >= steps) clearInterval(timer);
      }, interval);
    }, 800);

    setTimeout(() => setShowExpenseText(true), 2800);
  }, []);

  const circleColors = [
    "rgba(232, 165, 130, 1)",
    "rgba(242, 200, 180, 0.85)",
    "rgba(248, 218, 200, 0.7)",
    "rgba(252, 232, 220, 0.5)",
  ];

  // SVG Arc calculation
  const createArc = (startAngle, percent, radius, strokeWidth) => {
    const endAngle = startAngle + (percent / 100) * 360;
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = 150 + radius * Math.cos(startRad);
    const y1 = 150 + radius * Math.sin(startRad);
    const x2 = 150 + radius * Math.cos(endRad);
    const y2 = 150 + radius * Math.sin(endRad);
    
    const largeArc = percent > 50 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8b4a0 0%, #dba090 50%, #c99080 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "20px",
        gap: "32px",
        flexWrap: "wrap",
      }}
    >
      <style>{`
        @keyframes dropFromTop {
          0% {
            bottom: 360px;
            transform: translateX(-50%) scaleX(0.85) scaleY(1.25);
            opacity: 0;
          }
          8% { opacity: 1; }
          50% {
            bottom: 0px;
            transform: translateX(-50%) scaleX(1.25) scaleY(0.75);
          }
          65% {
            bottom: 60px;
            transform: translateX(-50%) scaleX(0.92) scaleY(1.1);
          }
          78% {
            bottom: 0px;
            transform: translateX(-50%) scaleX(1.12) scaleY(0.88);
          }
          88% {
            bottom: 25px;
            transform: translateX(-50%) scaleX(0.97) scaleY(1.04);
          }
          94% {
            bottom: 0px;
            transform: translateX(-50%) scaleX(1.05) scaleY(0.95);
          }
          97% {
            bottom: 10px;
            transform: translateX(-50%) scaleX(0.99) scaleY(1.02);
          }
          100% {
            bottom: 0px;
            transform: translateX(-50%) scaleX(1) scaleY(1);
          }
        }

        @keyframes teardropWobble {
          0%, 100% { border-radius: 50%; }
          15% { border-radius: 47% 53% 53% 47% / 43% 43% 57% 57%; }
          30% { border-radius: 53% 47% 47% 53% / 57% 57% 43% 43%; }
          45% { border-radius: 49% 51% 51% 49% / 48% 48% 52% 52%; }
          60% { border-radius: 51% 49% 49% 51% / 52% 52% 48% 48%; }
          75% { border-radius: 50%; }
        }

        @keyframes subtleFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }

        .circle-drop {
          animation: dropFromTop 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards,
                     teardropWobble 0.8s ease-in-out 1.1s,
                     subtleFloat 4s ease-in-out 1.9s infinite;
        }

        .number-animate {
          animation: numberPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes numberPop {
          0% { opacity: 0; transform: scale(0.5) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .title-animate {
          animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .description-animate {
          animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s forwards;
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardFadeIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .card-animate {
          animation: cardFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes legendFade {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .legend-animate {
          animation: legendFade 0.5s ease-out forwards;
        }

        @keyframes drawArc {
          0% { stroke-dashoffset: var(--arc-length); }
          100% { stroke-dashoffset: 0; }
        }

        .arc-animate {
          animation: drawArc 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes centerPulse {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.05); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        .center-animate {
          animation: centerPulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Annual Profits Card */}
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          boxShadow: "0 25px 80px rgba(180, 100, 70, 0.2)",
          width: "420px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "360px",
            height: "360px",
            marginBottom: "32px",
            overflow: "hidden",
            borderRadius: "12px",
          }}
        >
          {profits.map((profit, index) => {
            const reverseIndex = 3 - index;
            const delayTime = reverseIndex * 0.15;
            
            return (
              <div
                key={index}
                className={circlesVisible[index] ? "circle-drop" : ""}
                style={{
                  position: "absolute",
                  width: `${profit.size}px`,
                  height: `${profit.size}px`,
                  borderRadius: "50%",
                  background: circleColors[index],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  left: "50%",
                  bottom: circlesVisible[index] ? "0px" : "360px",
                  transform: "translateX(-50%)",
                  opacity: circlesVisible[index] ? 1 : 0,
                  animationDelay: `${delayTime}s, ${1.1 + delayTime}s, ${1.9 + delayTime}s`,
                  zIndex: 4 - index,
                }}
              >
                {index === 0 ? (
                  <span
                    className={showNumbers ? "number-animate" : ""}
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#c45a30",
                      opacity: showNumbers ? 1 : 0,
                      position: "absolute",
                    }}
                  >
                    ${counts[0]}k
                  </span>
                ) : (
                  <span
                    className={showNumbers ? "number-animate" : ""}
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#c45a30",
                      opacity: showNumbers ? 1 : 0,
                      position: "absolute",
                      top: "27px",
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    ${counts[index]}k
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "left", width: "100%", paddingLeft: "8px" }}>
          <h2
            className={showText ? "title-animate" : ""}
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#1a1a1a",
              margin: "0 0 8px 0",
              opacity: showText ? 1 : 0,
            }}
          >
            Annual profits
          </h2>
          <p
            className={showText ? "description-animate" : ""}
            style={{
              fontSize: "14px",
              color: "#666",
              margin: 0,
              lineHeight: 1.5,
              opacity: showText ? 1 : 0,
            }}
          >
            It reflects the company's overall financial
            <br />
            performance and growth
          </p>
        </div>
      </div>

      {/* Top Expenses Card */}
      <div
        className={showExpenseCard ? "card-animate" : ""}
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          boxShadow: "0 25px 80px rgba(180, 100, 70, 0.2)",
          width: "420px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: showExpenseCard ? 1 : 0,
        }}
      >
        {/* Legend */}
        <div
          className={showLegend ? "legend-animate" : ""}
          style={{
            display: "flex",
            gap: "24px",
            marginBottom: "32px",
            opacity: showLegend ? 1 : 0,
          }}
        >
          {expenses.map((expense, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: expense.color,
                }}
              />
              <span style={{ fontSize: "14px", color: "#333", fontWeight: 500 }}>
                {expense.name}
              </span>
            </div>
          ))}
        </div>

        {/* Donut Chart */}
        <div
          style={{
            position: "relative",
            width: "300px",
            height: "300px",
            marginBottom: "32px",
          }}
        >
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
          >
            {/* Background circle */}
            <circle
              cx="150"
              cy="150"
              r="110"
              fill="none"
              stroke="#f0ebe8"
              strokeWidth="28"
            />
            
            {/* Animated arcs */}
            {expenses.map((expense, index) => {
              const radius = 110;
              const circumference = 2 * Math.PI * radius;
              const arcAngle = expense.endAngle - expense.startAngle;
              const arcLength = (arcAngle / 360) * circumference;
              const gapSize = 15;
              const adjustedArcLength = arcLength - gapSize;
              const currentArcLength = (expenseProgress / 100) * adjustedArcLength;
              const dashOffset = circumference * (expense.startAngle / 360);
              
              return (
                <circle
                  key={index}
                  cx="150"
                  cy="150"
                  r={radius}
                  fill="none"
                  stroke={expense.color}
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeDasharray={`${currentArcLength} ${circumference}`}
                  strokeDashoffset={-dashOffset}
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "150px 150px",
                    transition: "stroke-dasharray 0.05s linear",
                  }}
                />
              );
            })}
          </svg>

          {/* Center content */}
          <div
            className={expenseProgress > 50 ? "center-animate" : ""}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              opacity: expenseProgress > 50 ? 1 : 0,
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: 600,
                color: "#E8A882",
                marginBottom: "4px",
              }}
            >
              {expenseAmount.toFixed(2)}
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "#333",
                fontWeight: 500,
              }}
            >
              Expense
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <div style={{ textAlign: "left", width: "100%", paddingLeft: "8px" }}>
          <h2
            className={showExpenseText ? "title-animate" : ""}
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#1a1a1a",
              margin: "0 0 8px 0",
              opacity: showExpenseText ? 1 : 0,
            }}
          >
            Top Expenses
          </h2>
          <p
            className={showExpenseText ? "description-animate" : ""}
            style={{
              fontSize: "14px",
              color: "#666",
              margin: 0,
              lineHeight: 1.5,
              opacity: showExpenseText ? 1 : 0,
            }}
          >
            It highlights your biggest spending categories
            <br />
            helping you identify patterns
          </p>
        </div>
      </div>
    </div>
  );
}