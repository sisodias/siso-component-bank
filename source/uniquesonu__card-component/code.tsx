import React from 'react';

// TypeScript interface for Card component props
interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  onClick?: () => void;
  className?: string;
}

// Modern Card Component
const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  buttonText = "Learn More",
  onClick,
  className = ""
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-lg hover:shadow-xl 
        transition-all duration-300 ease-in-out
        hover:scale-[1.02] hover:-translate-y-1
        overflow-hidden group cursor-pointer
        focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
        ${className}
      `}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `${title} card` : undefined}
    >
      {/* Image Section */}
      {imageUrl && (
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Button */}
        {buttonText && onClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="
              inline-flex items-center px-6 py-3 
              bg-gradient-to-r from-blue-600 to-blue-700 
              hover:from-blue-700 hover:to-blue-800
              text-white font-semibold rounded-lg
              transition-all duration-200 ease-in-out
              transform hover:scale-105 hover:shadow-lg
              focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
              active:scale-95
            "
            aria-label={`${buttonText} for ${title}`}
          >
            {buttonText}
            <svg 
              className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Usage Examples Component
const CardExamples: React.FC = () => {
  const handleCardClick = (cardTitle: string) => {
    alert(`You clicked on: ${cardTitle}`);
  };

  const sampleCards = [
    {
      title: "Modern Web Development",
      description: "Learn the latest techniques in React, TypeScript, and modern CSS. Build responsive, accessible, and performant web applications with cutting-edge tools and best practices.",
      imageUrl: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
      buttonText: "Start Learning",
      onClick: () => handleCardClick("Modern Web Development")
    },
    {
      title: "AI & Machine Learning",
      description: "Dive into the world of artificial intelligence and machine learning. Understand algorithms, neural networks, and how to implement AI solutions in real-world applications.",
      imageUrl: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
      buttonText: "Explore AI",
      onClick: () => handleCardClick("AI & Machine Learning")
    },
    {
      title: "Cloud Computing",
      description: "Master cloud technologies and learn how to deploy scalable applications. Understand AWS, Azure, and Google Cloud platforms for modern software deployment.",
      imageUrl: "https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
      buttonText: "Go Cloud",
      onClick: () => handleCardClick("Cloud Computing")
    },
    {
      title: "Mobile Development",
      description: "Build native and cross-platform mobile applications. Learn React Native, Flutter, and native iOS/Android development to create amazing mobile experiences.",
      imageUrl: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
      buttonText: "Build Apps",
      onClick: () => handleCardClick("Mobile Development")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Modern Card Component
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A beautiful, reusable React card component built with Tailwind CSS. 
            Features responsive design, hover animations, and full accessibility support.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {sampleCards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              buttonText={card.buttonText}
              onClick={card.onClick}
              className="h-full"
            />
          ))}
        </div>

        {/* Card without image example */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Text-Only Card Example
          </h2>
          <div className="max-w-md mx-auto">
            <Card
              title="No Image Card"
              description="This card demonstrates how the component works without an image. The layout automatically adjusts to provide a clean, text-focused design."
              buttonText="Learn More"
              onClick={() => handleCardClick("No Image Card")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardExamples;