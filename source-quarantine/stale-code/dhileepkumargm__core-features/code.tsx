import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * A reusable, high-quality feature card component.
 *
 * @param {{
 * icon: React.ReactNode;
 * title: string;
 * description: string;
 * badgeText?: string;
 * href: string;
 * }} props - The props for the component.
 * @returns {JSX.Element} The rendered feature card.
 */
const FeatureCard = ({ icon, title, description, badgeText, href }) => {
  return (
    <a
      href={href}
      className="group relative block w-full max-w-sm overflow-hidden rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg dark:border-gray-700/80 dark:bg-gray-800"
    >
      {/* Optional Badge */}
      {badgeText && (
        <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {badgeText}
        </span>
      )}

      {/* Icon */}
      <div className="mb-4 inline-block rounded-lg bg-gray-100 p-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="text-base text-gray-500 dark:text-gray-400">
        {description}
      </p>

      {/* Call to Action */}
      <div className="mt-4 flex items-center font-medium text-blue-600 dark:text-blue-400">
        Learn More
        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </a>
  );
};

export default FeatureCard;
