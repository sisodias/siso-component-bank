import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkPreviewProps {
  url: string;
  children: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ 
  url, 
  children, 
  className = '',
  width = 300,
  height = 200
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  // Extract domain from URL for preview title
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative cursor-pointer ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: position.x,
              top: position.y - height - 20,
              transform: 'translateX(-50%)',
              width: `${width}px`,
            }}
          >
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
              {/* Preview Image/Content Area */}
              <div 
                className="relative flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600"
                style={{ height: `${height - 60}px` }}
              >
                <div className="text-center p-4">
                  <div className="text-4xl mb-2">🔗</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {getDomain(url)}
                  </p>
                </div>
              </div>

              {/* Preview Footer */}
              <div className="p-3 bg-gray-50 dark:bg-gray-900">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                  {getDomain(url)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {url}
                </p>
              </div>
            </div>

            {/* Arrow pointer */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700"
              style={{ bottom: '-6px' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export function Component() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 transition-colors">
      <div className="flex h-[40rem] flex-col items-center justify-center px-4">
        <p className="mx-auto mb-10 max-w-3xl text-xl text-neutral-500 md:text-3xl dark:text-neutral-400">
          <LinkPreview
            url="https://tailwindcss.com"
            className="font-bold"
          >
            Tailwind CSS
          </LinkPreview>
          {' '}and{' '}
          <LinkPreview
            url="https://motion.unovue.com/"
            className="font-bold"
          >
            motion-v
          </LinkPreview>
          {' '}are a great way to build modern websites.
        </p>
        <p className="mx-auto max-w-3xl text-xl text-neutral-500 md:text-3xl dark:text-neutral-400">
          Visit{' '}
          <LinkPreview
            url="https://inspira-ui.com"
            width={400}
            height={200}
          >
            <span className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent">
              Inspira UI
            </span>
          </LinkPreview>
          {' '}for more cool components
        </p>
      </div>
    </div>
  );
}