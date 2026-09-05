import React from 'react';

// Main component for the Services Section
const App = () => {
  // Data for the service cards
  const services = [
    {
      title: "Web Development",
      image: "https://framerusercontent.com/images/PGqhbyNizzg0WF0Ff8Ct1xJCz4.png?scale-down-to=512",
      overlayImage: "https://framerusercontent.com/images/R8KAWJ8XJ7xyTu7ucAu7MwYY.png?scale-down-to=512"
    },
    {
      title: "Creative Design",
      image: "https://framerusercontent.com/images/icQGsV71x2rSlISc1VdMnw1qP0.png?scale-down-to=512",
      overlayImage: "https://framerusercontent.com/images/lXJpgpSzhcdgjAHyzQ8gL6xZio.png?scale-down-to=512"
    },
    {
      title: "Branding",
      image: "https://framerusercontent.com/images/fDuEIn62K1IFn5Ej7fSyTMA71og.png?scale-down-to=512",
      overlayImage: "https://framerusercontent.com/images/swGfymsPbpYnmJh0xWYUDsjYEVw.png?scale-down-to=512"
    },
    {
      title: "Product Design",
      image: "https://framerusercontent.com/images/fTivRAMCNvUFDAp9M0oddRMjk.png?scale-down-to=512",
      overlayImage: "https://framerusercontent.com/images/ykQMkxdWQtCI1O7dEHnQs9vQmME.png?scale-down-to=512"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen w-full flex items-center justify-center font-sans">
        <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
              body {
                font-family: 'Inter', sans-serif;
              }
            `}
        </style>
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 w-full">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
              How Can I Help?
            </h2>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-light">
              Let's turn your vision into something amazing.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 flex flex-col h-[320px] transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {/* Image Container */}
                <div className="relative flex-grow flex items-center justify-center mb-4">
                  {/* Back Image */}
                  <img
                    src={service.image}
                    alt={`${service.title} showcase`}
                    className="absolute w-44 h-auto rounded-lg shadow-md transform -rotate-6 transition-all duration-400 ease-in-out group-hover:rotate-[-10deg] group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/512x512/e2e8f0/4a5568?text=Image+1'; }}
                  />
                  {/* Front Image */}
                  <img
                    src={service.overlayImage}
                    alt={`${service.title} example`}
                    className="absolute w-44 h-auto rounded-lg shadow-lg transform rotate-3 transition-all duration-400 ease-in-out group-hover:rotate-[5deg] group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/512x512/cbd5e0/2d3748?text=Image+2'; }}
                  />
                </div>

                {/* Service Title */}
                <h3 className="text-left text-lg font-medium text-gray-800 dark:text-gray-100 mt-auto">
                  {service.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
