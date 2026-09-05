import React from "react";
import { Annoyed } from "lucide-react";

interface CTACardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  badge?: string;
  showBadge?: boolean;
  variant?: "light" | "dark" | "gradient";
  icon?: React.ReactNode;
}

const CTACard: React.FC<CTACardProps> = ({
  title = "This is supposed to be a cool title",
  description = "Your description goes here but idk what to write so im gonna continue with this to just take up some of the space on here",
  buttonText = "Subscribe",
  buttonUrl = "https://www.youtube.com/@axorax",
  badge = "New",
  showBadge = true,
  variant = "light",
  icon = <Annoyed className="w-6 h-6 text-white" />,
}) => {
  const variantStyles = {
    light: {
      container: "bg-white border border-gray-100",
      badge: "text-indigo-700 bg-indigo-100",
      iconContainer: "bg-indigo-600",
      text: "text-gray-900",
      button: "bg-indigo-600 hover:bg-indigo-700 text-white",
      description: "text-gray-600",
    },
    dark: {
      container: "bg-gray-900 border border-gray-800",
      badge: "text-indigo-300 bg-indigo-950",
      iconContainer: "bg-indigo-500",
      text: "text-white",
      button: "bg-indigo-500 hover:bg-indigo-400 text-white",
      description: "text-gray-300",
    },
    gradient: {
      container:
        "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700",
      badge: "text-white bg-white/20 backdrop-blur-sm",
      iconContainer: "bg-white/20 backdrop-blur-sm",
      text: "text-white",
      button: "bg-white hover:bg-gray-100 text-indigo-700",
      description: "text-gray-100",
    },
  };

  const variantStyle = variantStyles[variant];

  return (
    <div
      className={`max-w-md mx-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${variantStyle.container}`}
    >
      <div className="px-6 py-8">
        {showBadge && (
          <span
            className={`inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full ${variantStyle.badge}`}
          >
            {badge}
          </span>
        )}

        <div className="flex items-center mb-4">
          <div className={`p-2 rounded-lg mr-3 ${variantStyle.iconContainer}`}>
            {icon}
          </div>
          <h3 className={`text-xl font-bold ${variantStyle.text}`}>
            Sigma Nuts
          </h3>
        </div>

        <h2
          className={`text-2xl font-bold mb-3 leading-tight ${variantStyle.text}`}
        >
          {title}
        </h2>
        <p className={`mb-6 leading-relaxed ${variantStyle.description}`}>
          {description}
        </p>

        <a
          href={buttonUrl}
          className={`w-full inline-flex items-center justify-center px-5 py-3 font-medium rounded-lg transition-colors duration-200 text-center ${variantStyle.button}`}
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default CTACard;
