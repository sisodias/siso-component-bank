import React, { useState } from 'react';
import { Moon, Sun, Quote, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Testimonial data type
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

// Sample testimonials data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "CEO",
    company: "TechVision Inc",
    content: "The attention to detail and premium quality exceeded all expectations. This partnership has transformed our entire operation.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Creative Director",
    company: "Studio Noir",
    content: "Exceptional craftsmanship and unwavering commitment to excellence. A truly remarkable experience from start to finish.",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Founder",
    company: "Luxe Brands",
    content: "Sophisticated, elegant, and flawlessly executed. Every detail reflects a dedication to perfection that's truly rare.",
    rating: 5
  },
  {
    id: 4,
    name: "David Park",
    role: "Managing Partner",
    company: "Elite Ventures",
    content: "An unparalleled level of sophistication and professionalism. They've set a new standard for excellence in our industry.",
    rating: 5
  },
  {
    id: 5,
    name: "Isabella Martinez",
    role: "Head of Design",
    company: "Avant Studios",
    content: "The perfect blend of artistry and precision. Every interaction has been nothing short of extraordinary.",
    rating: 5
  },
  {
    id: 6,
    name: "James Wu",
    role: "Co-Founder",
    company: "Prestige Labs",
    content: "Outstanding quality and meticulous attention to every detail. A truly premium experience that exceeds all expectations.",
    rating: 5
  },
  {
    id: 7,
    name: "Sophie Laurent",
    role: "Chief Strategy Officer",
    company: "Lumière Group",
    content: "Remarkable dedication to perfection and client satisfaction. They've elevated our brand to unprecedented heights.",
    rating: 5
  },
  {
    id: 8,
    name: "Alexander King",
    role: "Executive Director",
    company: "Apex Holdings",
    content: "Exceptional service delivered with elegance and precision. A partnership that has truly transformed our business.",
    rating: 5
  },
  {
    id: 9,
    name: "Victoria Stone",
    role: "Creative Principal",
    company: "Noir Collective",
    content: "Impeccable craftsmanship and visionary approach. They understand luxury and excellence at the highest level.",
    rating: 5
  }
];

// Orthogonal Grid Background Component
const OrthogonalGrid: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

// Star Rating Component
const StarRating: React.FC<{ rating: number; isDark: boolean }> = ({ rating, isDark }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < rating
              ? isDark
                ? 'fill-white text-white'
                : 'fill-black text-black'
              : isDark
              ? 'fill-none text-white/20'
              : 'fill-none text-black/20'
          }`}
        />
      ))}
    </div>
  );
};

// Single Testimonial Card Component
const TestimonialCard: React.FC<{
  testimonial: Testimonial;
  isDark: boolean;
  index: number;
}> = ({ testimonial, isDark, index }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateXValue = (mouseY / (rect.height / 2)) * -10;
    const rotateYValue = (mouseX / (rect.width / 2)) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className="relative"
    >
      <motion.div
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        className={`p-8 rounded-lg ${
          isDark
            ? 'bg-white/5 border border-white/10'
            : 'bg-black/5 border border-black/10'
        } backdrop-blur-sm`}
      >
      {/* Quote Icon */}
      <div className={`mb-6 ${isDark ? 'text-white/20' : 'text-black/20'}`}>
        <Quote size={32} />
      </div>

      {/* Content */}
      <p
        className={`text-lg leading-relaxed mb-6 ${
          isDark ? 'text-white/90' : 'text-black/90'
        }`}
      >
        {testimonial.content}
      </p>

      {/* Rating */}
      <div className="mb-6">
        <StarRating rating={testimonial.rating} isDark={isDark} />
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
            isDark
              ? 'bg-white/10 text-white'
              : 'bg-black/10 text-black'
          }`}
        >
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h4
            className={`font-semibold ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            {testimonial.name}
          </h4>
          <p
            className={`text-sm ${
              isDark ? 'text-white/60' : 'text-black/60'
            }`}
          >
            {testimonial.role} • {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
    </motion.div>
  );
};

// Main Testimonials Component
const TestimonialsSection: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <div
      className={`w-full min-h-screen relative transition-colors duration-500 ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* Orthogonal Grid Background */}
      <OrthogonalGrid isDark={isDark} />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className={`fixed top-8 right-8 p-4 rounded-full ${
            isDark
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-black/10 hover:bg-black/20'
          } backdrop-blur-sm transition-colors duration-300 border ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sun size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Moon size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`inline-block px-4 py-2 rounded-full mb-6 ${
              isDark
                ? 'bg-white/5 border border-white/10'
                : 'bg-black/5 border border-black/10'
            }`}
          >
            <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              TESTIMONIALS
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-5xl md:text-6xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            Trusted by Excellence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-white/70' : 'text-black/70'
            }`}
          >
            Discover why industry leaders choose our premium solutions for their most critical needs
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              isDark={isDark}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className={`mt-20 h-px ${
            isDark ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'bg-gradient-to-r from-transparent via-black/20 to-transparent'
          }`}
        />
      </div>
    </div>
  );
};

export default TestimonialsSection;