import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Music, Gamepad2, Video, ArrowLeft, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  icon: React.ElementType;
  title: string;
  count: number;
  color: string;
  iconBgColor: string;
}

interface CategoryItemProps {
  category: Category;
  onSelect: (category: Category) => void;
}

interface DetailsViewProps {
  category: Category;
  onBack: () => void;
}

// Mock data for the categories
// Provides default values for preview
const categoriesData: Category[] = [
  { id: 'all', icon: LayoutGrid, title: 'All', count: 124, color: 'text-blue-400', iconBgColor: 'bg-blue-400/10' },
  { id: 'music', icon: Music, title: 'Music', count: 48, color: 'text-pink-400', iconBgColor: 'bg-pink-400/10' },
  { id: 'gaming', icon: Gamepad2, title: 'Gaming', count: 32, color: 'text-purple-400', iconBgColor: 'bg-purple-400/10' },
  { id: 'movies', icon: Video, title: 'Movies', count: 44, color: 'text-green-400', iconBgColor: 'bg-green-400/10' },
];

// Individual list item component
// Using React.memo for performance optimization
// Adheres to: Performance guideline
const CategoryItem: React.FC<CategoryItemProps> = React.memo(({ category, onSelect }) => (
  <motion.button
    layoutId={`card-container-${category.id}`}
    onClick={() => onSelect(category)}
    className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 focus-visible:ring-blue-500 rounded-xl"
    // Adheres to: Accessibility guideline (focusable button)
  >
    <motion.div className="w-full p-4 bg-neutral-800/80 backdrop-blur-sm rounded-xl flex items-center space-x-4">
      <motion.div 
        layoutId={`icon-container-${category.id}`}
        className={`p-3 rounded-full ${category.iconBgColor}`}
      >
        <category.icon className={`w-6 h-6 ${category.color}`} />
      </motion.div>
      <div className="flex-grow">
        <motion.h3 layoutId={`title-${category.id}`} className="text-lg font-semibold text-neutral-100">
          {category.title}
        </motion.h3>
      </div>
      <motion.div layoutId={`count-${category.id}`} className="flex items-center space-x-2 text-neutral-400">
        <span>{category.count}</span>
        <ChevronRight className="w-4 h-4" />
      </motion.div>
    </motion.div>
  </motion.button>
));

// The view for the list of all categories
const ListView: React.FC<{ onSelectCategory: (category: Category) => void }> = ({ onSelectCategory }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="w-full max-w-md mx-auto p-4"
  >
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-white">Categories</h1>
      <p className="text-neutral-400 mt-1">Select a category to see details</p>
    </div>
    <div className="space-y-3">
      {categoriesData.map(category => (
        <CategoryItem key={category.id} category={category} onSelect={onSelectCategory} />
      ))}
    </div>
  </motion.div>
);

// The detailed view for a selected category
// Adheres to: Component Structure guideline
const DetailsView: React.FC<DetailsViewProps> = ({ category, onBack }) => (
  <motion.div
    layoutId={`card-container-${category.id}`}
    className="w-full max-w-md mx-auto p-4 bg-neutral-800 rounded-xl flex flex-col h-[28rem]"
    // Using shadcn-like theming variable colors
    // Adheres to: Styling Guidelines
  >
    <div className="flex items-center justify-between">
      <motion.button
        onClick={onBack}
        className="p-2 rounded-full hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Go back to categories"
        // Adheres to: Accessibility guideline (aria-label)
      >
        <ArrowLeft className="w-6 h-6 text-neutral-300" />
      </motion.button>
    </div>
    <div className="flex-grow flex flex-col items-center justify-center text-center">
      <motion.div
        layoutId={`icon-container-${category.id}`}
        className={`p-6 rounded-full ${category.iconBgColor}`}
      >
        <category.icon className={`w-12 h-12 ${category.color}`} />
      </motion.div>
      <motion.h3
        layoutId={`title-${category.id}`}
        className="text-4xl font-bold text-neutral-100 mt-6"
      >
        {category.title}
      </motion.h3>
      <motion.div
        layoutId={`count-${category.id}`}
        className="text-xl text-neutral-400 mt-2"
        // Animate opacity to prevent text from being visible during transition
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
      >
        {category.count} items
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }}
        className="mt-8 text-neutral-300"
      >
        Details for the {category.title} category would appear here.
      </motion.p>
    </div>
  </motion.div>
);

export function Component() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="bg-neutral-900 min-h-screen w-full flex items-center justify-center font-sans p-4">
      {/* AnimatePresence is used to orchestrate the enter and exit animations 
        when the selectedCategory state changes.
        Adheres to: Component Dependencies (framer-motion)
      */}
      <AnimatePresence mode="wait">
        {selectedCategory ? (
          <DetailsView key={selectedCategory.id} category={selectedCategory} onBack={handleBack} />
        ) : (
          <ListView key="list-view" onSelectCategory={handleSelectCategory} />
        )}
      </AnimatePresence>
    </div>
  );
}
