import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

// Define TypeScript interfaces for component props
// Adheres to: Component Structure guideline
interface SubscribeFormProps {
  // No props needed for this static component, but defining for good practice
}

// Main App component that renders the subscribe form
// Adheres to: Code Quality (Single default export)
export function Component() {
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle the form submission here.
    console.log('Submitted email:', email);
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.2 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-slate-50 min-h-screen w-full flex items-center justify-center font-sans p-8">
      <motion.div 
        className="w-full max-w-2xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top label */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full">
            <Mail className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-sm font-semibold text-purple-600 tracking-wider">
            GET 21st.dev UPDATES
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight mb-8"
        >
          Join the conversation <br/> subscribe to 21st.dev updates.
        </motion.h2>

        {/* Email Form */}
        <motion.form 
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="relative w-full max-w-md mx-auto"
        >
          <motion.div
            className="relative flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required
              className="w-full py-4 pl-6 pr-20 text-lg text-slate-700 bg-white rounded-full border-2 border-transparent focus:border-purple-500 focus:outline-none focus:ring-0 transition-all duration-300 shadow-lg"
              aria-label="Email for updates"
            />
            <motion.button
              type="submit"
              className="absolute right-2 h-14 w-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg"
              whileHover={{ scale: 1.1, backgroundColor: '#8B5CF6' }} // brighter purple on hover
              whileTap={{ scale: 0.9 }}
              aria-label="Subscribe"
            >
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
