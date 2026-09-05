import React, { useState } from 'react';
import { Moon, Sun, ChevronDown } from 'lucide-react';

const AccordionItem = ({ value, title, content, isOpen, onToggle, isDark }) => {
  return (
    <div 
      className={`border rounded-lg px-6 transition-all duration-300 ${
        isDark 
          ? 'bg-neutral-900/50 border-neutral-800 backdrop-blur-sm' 
          : 'bg-white border-neutral-200'
      }`}
    >
      <button
        onClick={() => onToggle(value)}
        className={`w-full text-left flex justify-between items-center py-5 transition-colors ${
          isDark ? 'text-neutral-100 hover:text-neutral-50' : 'text-neutral-950 hover:text-neutral-800'
        }`}
      >
        <span className="text-lg font-semibold pr-4">{title}</span>
        <ChevronDown 
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`pb-5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default function ThemedAccordion() {
  const [isDark, setIsDark] = useState(true);
  const [openItem, setOpenItem] = useState(null);

  const handleToggle = (value) => {
    setOpenItem(openItem === value ? null : value);
  };

  const accordionData = [
    {
      value: 'item-1',
      title: 'What is this component built with?',
      content: 'This accordion component is built using React, custom components, and Tailwind CSS. It features a responsive design with smooth transitions and a clean, modern aesthetic.'
    },
    {
      value: 'item-2',
      title: 'How does the theme toggle work?',
      content: 'The theme toggle uses React state to switch between dark and light modes. All colors transition smoothly using Tailwind\'s transition utilities, creating a seamless user experience.'
    },
    {
      value: 'item-3',
      title: 'Can I customize the colors?',
      content: 'Absolutely! The component uses Tailwind\'s neutral color palette. You can easily modify the colors by changing the Tailwind classes, or adjust the entire theme by customizing your Tailwind configuration.'
    },
    {
      value: 'item-4',
      title: 'What about the grid background?',
      content: 'The orthogonal grid is created using CSS linear gradients with Tailwind\'s arbitrary values. It\'s positioned as a fixed background layer and adjusts its opacity based on the current theme, ensuring it remains subtle and doesn\'t interfere with readability.'
    }
  ];

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${isDark ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
      {/* Orthogonal Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className={`w-full h-full ${
            isDark 
              ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]' 
              : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'
          }`}
          style={{ backgroundSize: '40px 40px' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-lg transition-all duration-300 ${
              isDark
                ? 'bg-neutral-900 text-neutral-100 hover:bg-neutral-800 border border-neutral-800'
                : 'bg-white text-neutral-900 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-neutral-50' : 'text-neutral-950'}`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Find answers to common questions below
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {accordionData.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              title={item.title}
              content={item.content}
              isOpen={openItem === item.value}
              onToggle={handleToggle}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </div>
  );
}