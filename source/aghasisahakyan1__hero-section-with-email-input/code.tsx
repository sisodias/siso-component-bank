import React, { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Users, Mail, ArrowUpRight, Clock, Tag } from "lucide-react";

interface NavLink { label: string; href: string; }
interface Thumb { img: string; title: string; description: string; tag: string; readTime: string; }

export interface ComponentProps {
  navLinks?: NavLink[];
  headerCtaLabel?: string;
  headerCtaHref?: string;
  titleParts?: { text: string; shape1?: string; shape2?: string };
  subtitle?: string;
  emailPlaceholder?: string;
  emailButtonLabel?: string;
  shapes?: { shape1: string; shape2: string };
  thumbnails?: Thumb[];
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  navLinks = [
    { label: "Projects", href: "#" },
    { label: "Learn", href: "#" },
    { label: "Contact", href: "#" },
  ],
  headerCtaLabel = "Get Updates",
  headerCtaHref = "#",
  titleParts = { 
    text: "Build and share amazing projects with", 
    shape1: "https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/4/shape-1.svg", 
    shape2: "https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/4/shape-2.svg" 
  },
  subtitle = "Join our community of innovators and entrepreneurs. Get the latest insights, tutorials, and resources delivered straight to your inbox.",
  emailPlaceholder = "Your email address",
  emailButtonLabel = "Join now",
  shapes = {
    shape1: "https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/4/shape-1.svg",
    shape2: "https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/4/shape-2.svg",
  },
  thumbnails = [
    {
      img: "https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/4/thumbnail-1.png",
      title: "Getting started with project management",
      description: "Essential tips and strategies for organizing your projects efficiently and keeping your team aligned on goals.",
      tag: "Management",
      readTime: "7 min read",
    },
    {
      img: "https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/4/thumbnail-2.png",
      title: "Effective team collaboration strategies",
      description: "Best practices for remote teamwork that help maintain productivity and build stronger working relationships.",
      tag: "Teamwork",
      readTime: "5 min read",
    },
    {
      img: "https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/4/thumbnail-3.png",
      title: "Digital tools for entrepreneurs",
      description: "A comprehensive guide to the latest software and platforms that can accelerate your business growth.",
      tag: "Business",
      readTime: "6 min read",
    },
  ],
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <div className={cn("min-h-screen", className)}>
      {/* Header */}
      <header className="sticky top-0 py-3 sm:py-4 lg:py-5 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg p-1 -m-1 transition-all duration-200">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 select-none">ProjectFlow</span>
            </a>

            {/* Mobile menu button */}
            <button 
              className="text-gray-900 lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg p-2 -m-2 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:items-center lg:ml-12 xl:ml-16 lg:mr-auto lg:space-x-8 xl:space-x-10">
              {navLinks.map((lnk) => (
                <a 
                  key={lnk.label} 
                  href={lnk.href} 
                  className="text-sm xl:text-base font-medium text-gray-900 transition-all duration-200 hover:text-indigo-600 focus:text-indigo-600 focus:outline-none relative py-2 px-1 rounded-md hover:bg-gray-50/80"
                >
                  {lnk.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <a 
                href={headerCtaHref} 
                className="inline-flex items-center justify-center px-4 xl:px-6 py-2 xl:py-2.5 text-sm xl:text-base font-semibold text-white bg-indigo-600 rounded-lg transition-all duration-200 hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <Mail className="w-4 h-4 mr-2" />
                {headerCtaLabel}
              </a>
            </div>
          </nav>

          {/* Mobile navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden pt-4 pb-6 border-t border-gray-100 mt-4 animate-in slide-in-from-top-1 duration-200">
              <div className="grid gap-y-4">
                {navLinks.map((lnk) => (
                  <a 
                    key={lnk.label} 
                    href={lnk.href} 
                    className="text-base font-medium text-gray-900 transition-all duration-200 hover:text-indigo-600 focus:text-indigo-600 focus:outline-none py-3 px-4 -mx-4 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {lnk.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-100">
                  <a 
                    href={headerCtaHref} 
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-indigo-600 rounded-lg transition-all duration-200 hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl active:scale-95"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {headerCtaLabel}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero section */}
      <section className="relative bg-white overflow-hidden">
        
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
              
              {/* Left column - Content */}
              <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                  <span className="block">
                    {titleParts.text}
                    {titleParts.shape1 && (
                      <img 
                        src={titleParts.shape1} 
                        alt="" 
                        className="inline w-auto h-6 sm:h-8 lg:h-10 xl:h-12 2xl:h-14 ml-2 opacity-80 align-middle" 
                      />
                    )}
                  </span>
                  <span className="block mt-2 lg:mt-3 xl:mt-4">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      sharing knowledge
                    </span>
                    {titleParts.shape2 && (
                      <img 
                        src={titleParts.shape2} 
                        alt="" 
                        className="inline w-auto h-6 sm:h-8 lg:h-10 xl:h-11 2xl:h-13 ml-2 opacity-80 align-middle" 
                      />
                    )}
                  </span>
                </h1>
                
                <p className="mt-4 sm:mt-6 lg:mt-8 text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed text-gray-700 max-w-2xl">
                  {subtitle}
                </p>
                
                <p className="mt-6 lg:mt-8 text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                  Stay updated with the latest tips and resources
                </p>

                {/* Email signup form */}
                <div className="mt-6 lg:mt-8">
                  <form className="relative" onSubmit={handleSubmit}>
                    <div className="absolute opacity-20 inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-lg pointer-events-none scale-105" />
                    <div className="relative bg-white rounded-lg shadow-lg p-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={emailPlaceholder}
                            required
                            className="block w-full px-4 py-3 sm:py-3.5 text-base font-medium text-gray-900 placeholder-gray-500 bg-transparent border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 font-semibold text-white bg-indigo-600 rounded-lg transition-all duration-200 hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group whitespace-nowrap"
                        >
                          <span className="text-sm sm:text-base">{emailButtonLabel}</span>
                          <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </div>
                  </form>

                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                    Join 8,500+ professionals • Cancel anytime
                  </p>
                </div>
              </div>

              {/* Right column - Article carousel */}
              <div className="mt-8 lg:mt-0">
                <div className="relative">
                  {/* Gradient overlays for carousel edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                  
                  <div className="flex overflow-x-auto gap-4 sm:gap-6 snap-x snap-mandatory scroll-smooth scrollbar-hide pb-4">
                    {thumbnails.map((article, idx) => (
                      <article 
                        key={idx} 
                        className="snap-start snap-always shrink-0 first:ml-4 last:mr-4 w-64 sm:w-72 md:w-80 lg:w-72 xl:w-80"
                      >
                        <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group h-full flex flex-col">
                          <a href="#" className="block relative overflow-hidden aspect-[16/10] shrink-0">
                            <img 
                              src={article.img} 
                              alt={article.title} 
                              className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </a>
                          
                          <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col">
                            <div className="flex items-center gap-3 mb-3 sm:mb-4">
                              <div className="flex items-center px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                                <Tag className="w-3 h-3 mr-1" />
                                {article.tag}
                              </div>
                              <div className="flex items-center text-gray-500 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {article.readTime}
                              </div>
                            </div>
                            
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200 mb-3 leading-snug">
                              {article.title}
                            </h3>
                            
                            <p className="text-sm sm:text-base leading-relaxed text-gray-600 line-clamp-3 flex-1 mb-4">
                              {article.description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                              <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200">
                                Read article
                              </span>
                              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 