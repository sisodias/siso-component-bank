import React from 'react';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const PricingTier = ({
  name,
  price,
  frequency,
  description,
  features,
  buttonText,
  buttonLink,
  isFeatured = false
}) => {
  const cardClasses = isFeatured
    ? "bg-black text-white rounded-lg shadow-2xl p-8 flex flex-col w-full max-w-sm ring-4 ring-blue-500 ring-opacity-50"
    : "bg-white text-gray-800 rounded-lg shadow-lg p-8 flex flex-col w-full max-w-sm";

  const buttonClasses = isFeatured
    ? "w-full px-6 py-3 mt-8 font-medium rounded-lg shadow-lg bg-white text-black transition-transform transform hover:scale-105"
    : "w-full px-6 py-3 mt-8 font-medium rounded-lg shadow-lg bg-black text-white transition-transform transform hover:scale-105";

  return (
    <div className={cardClasses}>
      <h3 className="text-2xl font-bold text-center">{name}</h3>
      <div className="flex items-baseline justify-center mt-4">
        <span className="text-5xl font-extrabold">{price}</span>
        <span className="ml-1 text-lg font-medium">{frequency}</span>
      </div>
      <p className="mt-4 text-center text-sm opacity-80">{description}</p>
      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a href={buttonLink} className={`text-center ${buttonClasses}`}>
        {buttonText}
      </a>
    </div>
  );
};

const PricingSection = ({ data }) => {
  return (
    <div className="pricing-section">
      <div className="pricing-header">
        <h2 className="pricing-title">{data.title}</h2>
        <p className="pricing-subtitle">{data.subtitle}</p>
      </div>
      <div className="pricing-tiers">
        {data.plans.map((plan) => (
          <PricingTier key={plan.id} {...plan} />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
