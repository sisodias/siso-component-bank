
import React, { useState, useEffect } from 'react';
import { Sun, Moon, ArrowRight } from 'lucide-react';

// --- Internal Components (formerly next/image.tsx and next/link.tsx) ---

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number | string;
  height?: number | string;
}

const Image: React.FC<ImageProps> = ({ src, alt, width, height, className, ...props }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className} 
      loading="lazy"
      {...props} 
    />
  );
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const Link: React.FC<LinkProps> = ({ href, children, className, ...props }) => {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
};

// --- Data for blog articles ---

const articlesData = [
  {
    category: "BRANDING",
    description:
      "Master the art of visual storytelling. Learn how to create a lasting brand identity that resonates with your target audience in the digital age.",
    image:
      "https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=1000&auto=format&fit=crop",
    publishDate: "Dec 22, 2025",
    readMoreLink: "#",
    title: "A Beginner's Guide to Brand Strategy",
  },
  {
    category: "ARTDIRECTION",
    description:
      "Exploring the intersection of aesthetics and functionality. How art direction shapes the user experience and drives emotional connection.",
    image:
      "https://images.unsplash.com/photo-1506143925201-0252c51780b0?q=80&w=1000&auto=format&fit=crop",
    publishDate: "Nov 11, 2025",
    readMoreLink: "#",
    title: "The Ultimate Checklist for Visual Excellence",
  },
  {
    category: "DESIGNSYSTEM",
    description:
      "Scale your design process with consistency. A deep dive into building modular, reusable design systems for cross-platform applications.",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    publishDate: "Oct 9, 2025",
    readMoreLink: "#",
    title: "The Evolution of Design: From Sketch to System",
  },
];

// --- ThemeToggle Sub-component ---

const ThemeToggle: React.FC<{ theme: 'light' | 'dark'; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className="fixed top-6 right-6 z-50 p-3 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 shadow-lg hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Toggle Dark Mode"
  >
    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
  </button>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="relative w-screen min-h-screen bg-white dark:bg-black transition-colors duration-300 overflow-x-hidden font-inter">
      {/* Orthogonal Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" 
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            color: theme === 'dark' ? '#ffffff' : '#000000'
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" 
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '200px 200px',
            color: theme === 'dark' ? '#ffffff' : '#000000'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.2)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      
      <main className="relative z-10 animate-in fade-in duration-700">
        <section className="bg-transparent px-4 py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center sm:mb-12">
              <p className="mb-3 font-medium text-gray-600 text-xs uppercase tracking-wider sm:mb-4 dark:text-blue-400/80">
                INSIGHTS & PERSPECTIVES
              </p>
              <h2 className="font-normal text-3xl text-gray-900 tracking-tight sm:text-4xl md:text-5xl dark:text-gray-100">
                Latest Articles
              </h2>
            </div>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articlesData.map((article, index) => (
                <div
                  className="group cursor-pointer border border-blue-100/60 bg-blue-50/20 shadow-none backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300/50 hover:bg-blue-100/30 dark:border-blue-900/40 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 dark:hover:border-blue-700/50"
                  key={index}
                >
                  <div className="p-0">
                    <div className="relative mb-4 sm:mb-6 overflow-hidden">
                      <Image
                        alt={article.title}
                        className="aspect-square h-64 w-full object-cover sm:h-72 md:h-80 transition-transform duration-700 group-hover:scale-110"
                        height={1080}
                        src={article.image || "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1000"}
                        width={1920}
                      />
                      <p
                        className="absolute top-0 left-0 rounded-none border-0 bg-white/90 px-2 py-1 font-medium text-[10px] text-blue-900 uppercase backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs dark:bg-blue-900/90 dark:text-blue-50 z-10"
                      >
                        #{article.category}
                      </p>
                    </div>
                    <div className="px-4 pb-6 sm:px-6 sm:pb-8">
                      <h3 className="mb-3 font-medium text-lg text-gray-900 tracking-tight sm:mb-3 sm:text-xl md:text-2xl dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                        {article.title}
                      </h3>
                      <p className="mb-6 text-gray-600 text-sm leading-relaxed sm:mb-8 dark:text-gray-400 line-clamp-3">
                        {article.description}
                      </p>
                      
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                          className="group/link relative flex items-center overflow-hidden font-semibold text-gray-900 text-xs transition-colors hover:text-blue-700 sm:text-sm dark:text-gray-100 dark:hover:text-blue-300"
                          href={article.readMoreLink}
                        >
                          <span className="mr-3 overflow-hidden rounded-none border border-blue-100 p-2.5 transition-all duration-300 ease-in group-hover/link:bg-blue-600 group-hover/link:text-white sm:p-3 dark:border-blue-900/60 dark:group-hover/link:bg-blue-500 dark:group-hover/link:text-black">
                            <ArrowRight className="h-3 w-3 translate-x-0 opacity-100 transition-all duration-500 ease-in group-hover/link:translate-x-8 group-hover/link:opacity-0 sm:h-4 sm:w-4" />
                            <ArrowRight className="absolute top-1/2 -left-4 h-4 w-4 -translate-y-1/2 transition-all duration-500 ease-in-out group-hover/link:left-2 sm:-left-5 sm:h-4 sm:w-4 sm:group-hover/link:left-3" />
                          </span>
                          Read more
                        </Link>
                        <span className="flex items-center gap-2 text-[10px] text-gray-400 sm:gap-3 sm:text-xs dark:text-blue-400/60">
                          {article.publishDate}
                          <span className="w-8 border-blue-200 border-t sm:w-12 dark:border-blue-800/80" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;