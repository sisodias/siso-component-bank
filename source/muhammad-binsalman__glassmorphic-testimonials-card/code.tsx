import React from 'react';

const GlasmoCard = ({ name, role, testimonial }) => {
  return (
    <div className="relative h-full w-full flex justify-center items-center z-20">
      {/* Animated background elements */}
      
      <div className="absolute h-[80px] w-[80px] left-[46%] bottom-3/4 -translate-x-full bg-gradient-to-r from-orange-400 to-pink-400 rounded-full z-[-1] border-2 border-white/65 shadow-[inset_10px_0px_20px_#fff]"></div>
      
      {/* Glassmorphic card */}
      <div className="w-[230px] h-[254px] border border-white/30 rounded-2xl bg-black/10 backdrop-blur-[15.5px] p-2.5 relative shadow-[inset_2px_1px_6px_rgba(255,255,255,0.27)] overflow-hidden z-0 group">
        {/* Shine effect */}
        <div className="absolute z-[-1] w-[150%] top-0 left-0 h-2.5 bg-white rotate-[50deg] blur-[30px] animate-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Content */}
        <div className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent text-4xl font-extrabold leading-none my-2.5">
          {name}
        </div>
        <div className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent text-xl font-bold leading-none mb-2">
          {role}
        </div>
        <p className="p-1 text-gray-600 text-sm mt-4">
          {testimonial}
        </p>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes ani {
          0% {
            transform: translateX(0%) scale(1);
          }
          50% {
            transform: translateX(-100%) scale(0.8);
          }
          100% {
            transform: translateX(0%) scale(1);
          }
        }
        @keyframes shine {
          0% {
            top: 100%;
            left: -100%;
          }
          50%, 100% {
            top: 0%;
            left: 70%;
          }
        }
        .animate-ani {
          animation: ani 28s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 10s ease infinite;
        }
      `}</style>
    </div>
  );
};

// Example usage
const TestimonialSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Client Testimonials</h2>
      <p className="text-gray-600 mb-8 max-w-lg text-center">
        See what our clients are saying about our services
      </p>
      
      <div className="grid relative grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <GlasmoCard
          name="Sarah Johnson"
          role="Marketing Director"
          testimonial="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id dictum augue, id viverra."
        />
        <GlasmoCard
          name="Michael Chen"
          role="Product Manager"
          testimonial="The team delivered exceptional results that exceeded our expectations. Highly recommended!"
        />
        <GlasmoCard
          name="Emily Rodriguez"
          role="Creative Director"
          testimonial="Their attention to detail and creative approach made all the difference for our brand."
        />
        <GlasmoCard
          name="Micheal Serafim"
          role="Creative Director"
          testimonial="Their attention to detail and creative approach made all the difference for our brand."
        />
        <div className="absolute z-30 h-[80px] w-[80px] left-2 -bottom-8 -translate-x-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full border-2 border-white/65 shadow-[inset_10px_0px_20px_#fff]"></div>
        <div className="absolute h-[80px] w-[80px] -right-1 -bottom-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full border-2 border-white/65 shadow-[inset_10px_0px_20px_#fff]"></div>
      </div>
    </div>
  );
};

export default TestimonialSection;