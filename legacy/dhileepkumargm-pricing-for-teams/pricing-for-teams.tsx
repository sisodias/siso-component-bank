import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * A reusable, high-quality pricing card component.
 *
 * @param {{
 * planName: string;
 * price: string;
 * priceFrequency: string;
 * description: string;
 * features: string[];
 * ctaText: string;
 * href: string;
 * isFeatured?: boolean;
 * }} props - The props for the component.
 * @returns {JSX.Element} The rendered pricing card.
 */
const PricingCard = ({
  planName,
  price,
  priceFrequency,
  description,
  features,
  ctaText,
  href,
  isFeatured = false,
}) => {
  const cardClasses = `
    relative flex flex-col h-full p-8 bg-white rounded-2xl shadow-sm border
    ${isFeatured ? 'border-blue-500' : 'border-gray-200'}
    dark:bg-gray-800 dark:border-gray-700
    ${isFeatured ? 'dark:border-blue-500' : ''}
  `;

  const buttonClasses = `
    inline-flex items-center justify-center w-full px-5 py-3 font-medium rounded-lg text-center
    transition-colors duration-200
    ${isFeatured
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
    }
  `;

  return (
    <div className={cardClasses}>
      {isFeatured && (
        <div className="absolute top-0 -translate-y-1/2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
          Most Popular
        </div>
      )}

      <div className="flex-grow">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{planName}</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{description}</p>
        <div className="mt-6">
          <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">${price}</span>
          <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">{priceFrequency}</span>
        </div>

        <ul className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-blue-500" />
              <span className="ml-3 text-base text-gray-600 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <a href={href} className={buttonClasses}>
          {ctaText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default PricingCard;
