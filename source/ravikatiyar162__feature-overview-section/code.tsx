import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Book, Palette } from 'lucide-react';

// Main App Component
export function Component() {
  return (
    <div className= "bg-white w-full dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 transition-colors duration-500" >
    <div className="w-full max-w-4xl" >
      <main>
      <motion.div
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8"
  initial = {{ opacity: 0, scale: 0.95 }
}
animate = {{ opacity: 1, scale: 1 }}
transition = {{ duration: 0.5, ease: "easeOut" }}
            >
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8" >
    {/* Left Column: Gradient Card */ }
    < motion.div
className = "md:col-span-1 bg-gradient-to-br from-red-400 via-pink-500 to-indigo-600 rounded-xl p-8 flex flex-col justify-between text-white shadow-2xl"
whileHover = {{ scale: 1.02, rotate: -1 }}
transition = {{ type: "spring", stiffness: 300 }}
                >
  <div>
  <motion.div
                      className="w-8 h-8 bg-white rounded-full mb-6"
initial = {{ opacity: 0, x: -20 }}
animate = {{ opacity: 1, x: 0 }}
transition = {{ delay: 0.2, duration: 0.5 }}
                    > </motion.div>
  < h2 className = "text-3xl font-bold" > Your Brand < /h2>
    < /div>
    < p className = "text-base font-light mt-4" >
      Modern components for your next project.
                  < /p>
        < /motion.div>

                {/* Right Column: Documentation Links */ }
<div className="md:col-span-2 flex flex-col justify-center space-y-8" >
  <DocumentationItem
                    icon={ <Rocket size={ 24 } className = "text-pink-500" />}
title = "Getting Started"
description = "Learn how to integrate and use our components."
  />
  <DocumentationItem
                    icon={ <Book size={ 24 } className = "text-indigo-500" />}
title = "Core Concepts"
description = "Understand the fundamentals of our design system."
  />
  <DocumentationItem
                    icon={ <Palette size={ 24 } className = "text-red-500" />}
title = "Customization"
description = "Extend and customize the components to fit your brand."
  />
  </div>
  < /div>
  < /motion.div>
  < /main>
  < /div>
  < /div>
  );
}

// Component for individual documentation items
const DocumentationItem = ({ icon, title, description }) => (
  <motion.div
    className= "flex items-start space-x-4"
initial = {{ opacity: 0, x: 20 }}
animate = {{ opacity: 1, x: 0 }}
transition = {{ duration: 0.5, ease: "easeOut" }}
  >
  <div className="flex-shrink-0" > { icon } < /div>
    < div >
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white" > { title } < /h3>
      < p className = "text-base text-gray-600 dark:text-gray-300 mt-1" > { description } < /p>
        < /div>
        < /motion.div>
);
