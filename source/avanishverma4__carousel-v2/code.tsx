import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsItem {
  id: number;
  date: string;
  type: string;
  title: string;
  image: string;
}

const NewsInsightCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Helper function to format date
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Helper function to get date offset from today
  const getDateOffset = (daysOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return formatDate(date);
  };

  const newsItems: NewsItem[] = [
    {
      id: 1,
      date: getDateOffset(0), // Today
      type: 'Insight',
      title: 'The Future of Sustainable Supply Chains',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'
    },
    {
      id: 2,
      date: getDateOffset(1), // Tomorrow
      type: 'Insight',
      title: 'The Future of Sustainable Supply Chains',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'
    },
    {
      id: 3,
      date: getDateOffset(2), // 2 days from now
      type: 'Insight',
      title: 'The Future of Sustainable Supply Chains',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80'
    },
    {
      id: 4,
      date: getDateOffset(3), // 3 days from now
      type: 'Insight',
      title: 'The Future of Sustainable Supply Chains',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    },
    {
      id: 5,
      date: getDateOffset(4), // 4 days from now
      type: 'Insight',
      title: 'The Future of Sustainable Supply Chains',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'
    },
    {
      id: 6,
      date: getDateOffset(5), // 5 days from now
      type: 'Insight',
      title: 'The Future of Sustainable Supply Chains',
      image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80'
    }
  ];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-7xl bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl p-12 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-5xl font-bold text-gray-900">
            News & Insight
          </h1>
          
          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
                canScrollLeft 
                  ? 'bg-white hover:shadow-xl' 
                  : 'bg-white/50 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className={`w-6 h-6 ${canScrollLeft ? 'text-gray-800' : 'text-gray-400'}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
                canScrollRight 
                  ? 'bg-gray-900 hover:shadow-xl' 
                  : 'bg-gray-900/50 cursor-not-allowed'
              }`}
            >
              <ChevronRight className={`w-6 h-6 ${canScrollRight ? 'text-white' : 'text-gray-400'}`} />
            </motion.button>
          </div>
        </div>

        {/* Scrollable Cards Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newsItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex-shrink-0 w-80"
            >
              {/* Card Header */}
              <div className="p-5 pb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{item.date}</span>
                  <span className="text-gray-400">|</span>
                  <span className="font-medium">{item.type}</span>
                </div>
              </div>

              {/* Card Title */}
              <div className="px-5 pb-4">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {item.title}
                </h3>
              </div>

              {/* Card Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {newsItems.map((_, idx) => (
            <div
              key={idx}
              className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300"
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default NewsInsightCarousel;