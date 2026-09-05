import React from "react";

// --- Icon Components ---
const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-emerald-400"
  >
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558
             a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966
             l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558
             a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594
             l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051
             a2 2 0 0 0 1.594-1.594z"
    />
    <path d="M20 2v4" />
    <path d="M22 4h-4" />
    <circle cx="4" cy="20" r="2" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-400"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-purple-400"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <path d="M9 9h6v6H9z" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12" height="12"
    viewBox="0 0 24 24"
    fill="hsl(240, 15%, 9%)"
    stroke="hsl(240, 15%, 9%)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// --- PricingCard Component ---
function PricingCard({
  planName,
  description,
  price,
  priceDescription,
  features,
  icon,
  iconBgClass,
  isPopular,
  buttonText,
}) {
  const cardStyle = {
    width: "19rem",
    backgroundColor: "hsla(240, 15%, 9%, 1)",
    backgroundImage:
      "radial-gradient(at 88% 40%, hsla(240, 15%, 9%, 1) 0px, transparent 85%)," +
      " radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%)," +
      " radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%)," +
      " radial-gradient(at 0% 64%, hsla(263, 93%, 56%, 1) 0px, transparent 85%)," +
      " radial-gradient(at 41% 94%, hsla(284, 100%, 84%, 1) 0px, transparent 85%)," +
      " radial-gradient(at 100% 99%, hsla(306, 100%, 57%, 1) 0px, transparent 85%)",
    boxShadow: "0px -16px 24px 0px rgba(255, 255, 255, 0.25) inset",
  };

  const borderContainerStyle = {
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
    zIndex: "-10",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100% + 2px)",
    height: "calc(100% + 2px)",
    backgroundImage:
      "linear-gradient(0deg, hsl(0, 0%, 100%) -50%, hsl(0, 0%, 40%) 100%)",
    borderRadius: "1rem",
  };

  const rotatingBorderStyle = {
    content: '""',
    pointerEvents: "none",
    position: "fixed",
    zIndex: "200",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(0deg)",
    transformOrigin: "left",
    width: "200%",
    height: "10rem",
    backgroundImage:
      "linear-gradient(0deg, hsla(0, 0%, 100%, 0) 0%, hsl(277, 95%, 60%) 40%, hsl(277, 95%, 60%) 60%, hsla(0, 0%, 40%, 0) 100%)",
    animation: "rotate 8s linear infinite",
  };

  return (
    <div
      className="relative hover:bg-white/[0.04] transition-all duration-300 group rounded-2xl p-6 flex flex-col"
      style={cardStyle}
    >
      <style>{`@keyframes rotate { to { transform: translate(-50%, -50%) rotate(360deg); } }`}</style>

      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <span className="bg-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="flex-grow">
        <div style={borderContainerStyle}>
          <div style={rotatingBorderStyle}></div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-xl border border-white/20 bg-gradient-to-br ${iconBgClass} flex items-center justify-center`}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight text-white">
                {planName}
              </h3>
              <p className="text-xs text-neutral-500">{description}</p>
            </div>
          </div>
          <div className="h-5 w-5 rounded-full border-2 border-white/30"></div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight text-white">
              {price}
            </span>
            <span className="text-sm text-neutral-400">
              {priceDescription}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            No credit card required
          </p>
        </div>

        <ul className="space-y-3 text-sm text-neutral-300">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div
                className="flex items-center justify-center w-4 h-4 bg-violet-500 rounded-full"
              >
                <CheckIcon />
              </div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <button className="w-full h-12 bg-white rounded-lg text-neutral-900 font-bold hover:bg-neutral-200 transition-colors">
          {buttonText}
        </button>
      </div>
    </div>
  );
}

// --- Main PricingPage Component ---
export default function PricingPage() {
  const starterPlan = {
    planName: "Starter",
    description: "Perfect for beginners",
    price: "$0",
    priceDescription: "forever",
    icon: <SparklesIcon />,
    iconBgClass: "from-emerald-500/20 to-teal-500/20",
    features: [
      "Interactive lessons and quizzes",
      "Daily practice and streaks",
      "Community access",
      "Basic AI fundamentals",
    ],
    buttonText: "Get Started Free",
    isPopular: false,
  };

  const proPlan = {
    planName: "Pro",
    description: "For growing teams",
    price: "$29",
    priceDescription: "/ month",
    icon: <BriefcaseIcon />,
    iconBgClass: "from-blue-500/20 to-cyan-500/20",
    features: [
      "Everything in Starter",
      "Advanced AI models",
      "Project collaboration",
      "Priority support",
    ],
    buttonText: "Start Pro Trial",
    isPopular: true,
  };

  const enterprisePlan = {
    planName: "Enterprise",
    description: "For large organizations",
    price: "Custom",
    priceDescription: "pricing",
    icon: <BuildingIcon />,
    iconBgClass: "from-purple-500/20 to-indigo-500/20",
    features: [
      "Everything in Pro",
      "On-premise deployment",
      "Dedicated account manager",
      "Custom integrations",
    ],
    buttonText: "Contact Sales",
    isPopular: false,
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Find the plan that’s right for you
        </h1>
        <p className="mt-4 text-lg text-neutral-400">
          Start for free and scale up as you grow. No credit card required.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        <PricingCard {...starterPlan} />
        <PricingCard {...proPlan} />
        <PricingCard {...enterprisePlan} />
      </div>
    </div>
  );
}
