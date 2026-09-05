import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Code2, Download, Star } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

interface Avatar {
  src: string;
  alt?: string;
}

export interface ComponentProps {
  /** Pattern background image on right */
  patternImg?: string;
  /** Navigation links */
  navLinks?: NavLink[];
  /** Auth link label */
  authLabel?: string;
  /** CTA label in header */
  headerCta?: string;
  /** Main heading */
  heading?: string;
  /** Sub heading join line, supports <count> placeholder */
  joinLineTemplate?: string;
  /** Developer count number */
  devCount?: string;
  /** Avatar images list */
  avatars?: Avatar[];
  /** Primary CTA button */
  primaryLabel?: string;
  primaryHref?: string;
  /** Secondary CTA */
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Hero illustration image */
  heroImg?: string;
  /** Additional container classes */
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  patternImg = "https://d33wubrfki0l68.cloudfront.net/1e0fc04f38f5896d10ff66824a62e466839567f8/699b5/images/hero/3/background-pattern.png",
  navLinks = [
    { label: "Reviews", href: "#" },
    { label: "Analytics", href: "#" },
    { label: "Tools", href: "#" },
  ],
  authLabel = "Sign in",
  headerCta = "Start free trial",
  heading = "Transform your code review process",
  joinLineTemplate = "Join <count> developers who trust CodeReview Pro",
  devCount = "8200+",
  avatars = [
    { src: "https://d33wubrfki0l68.cloudfront.net/3bfa6da479d6b9188c58f2d9a8d33350290ee2ef/301f1/images/hero/3/avatar-male.png", alt: "Developer 1" },
    { src: "https://d33wubrfki0l68.cloudfront.net/b52fa09a115db3a80ceb2d52c275fadbf84cf8fc/7fd8a/images/hero/3/avatar-female-1.png", alt: "Developer 2" },
    { src: "https://d33wubrfki0l68.cloudfront.net/8a2efb13f103a5ae2909e244380d73087a9c2fc4/31ed6/images/hero/3/avatar-female-2.png", alt: "Developer 3" },
  ],
  primaryLabel = "Start reviewing",
  primaryHref = "#",
  secondaryLabel = "Download Desktop App",
  secondaryHref = "#",
  heroImg = "https://d33wubrfki0l68.cloudfront.net/29c501c64b21014b3f2e225abe02fe31fd8f3a5c/f866d/images/hero/3/illustration.png",
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const joinLine = joinLineTemplate.replace("<count>", devCount);

  return (
    <div className={cn("relative bg-gray-50 min-h-screen", className)}>
      {/* Pattern background on right */}
      <div className="absolute w-full bottom-0 right-0 overflow-hidden lg:inset-y-0 pointer-events-none select-none opacity-30">
        <img src={patternImg} alt="" className="h-full w-auto object-cover" />
      </div>

      {/* Header */}
      <header className="relative py-4 md:py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" title="Home" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-lg">
              <Code2 className="w-8 h-8 text-gray-900" />
              <span className="text-xl font-bold text-gray-900 lg:text-2xl">CodeReview Pro</span>
            </a>

            {/* Mobile menu button */}
            <button 
              type="button" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-lg p-2" 
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex lg:ml-16 lg:items-center lg:space-x-10">
              <div className="flex items-center space-x-12">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-base font-medium text-gray-900 transition-colors duration-200 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="w-px h-5 bg-gray-300" />
              <a 
                href="#" 
                className="text-base font-medium text-gray-900 transition-colors duration-200 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
              >
                {authLabel}
              </a>
              <a
                href="#"
                className="px-5 py-2.5 text-base font-semibold text-white bg-gray-900 border border-gray-900 rounded-lg transition-all duration-200 hover:bg-gray-800 hover:border-gray-800 focus:bg-gray-800 focus:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                {headerCta}
              </a>
            </nav>
          </div>

          {/* Mobile navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-base font-medium text-gray-900 transition-colors duration-200 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <hr className="border-gray-200" />
                <a 
                  href="#" 
                  className="block text-base font-medium text-gray-900 transition-colors duration-200 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {authLabel}
                </a>
                <a
                  href="#"
                  className="block w-full text-center px-5 py-2.5 text-base font-semibold text-white bg-gray-900 border border-gray-900 rounded-lg transition-all duration-200 hover:bg-gray-800 hover:border-gray-800 focus:bg-gray-800 focus:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {headerCta}
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero section */}
      <section className="relative py-12 sm:py-16 lg:pt-20 lg:pb-36">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-12 lg:items-center lg:grid-cols-2 lg:gap-x-8 xl:grid-cols-5">
            {/* Text column */}
            <div className="text-center xl:col-span-2 lg:text-left lg:pr-8">
              <div className="max-w-xl mx-auto lg:max-w-none">
                <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl">
                  {heading}
                </h1>
                
                {/* Social proof section */}
                <div className="mt-8 lg:mt-12">
                  <div className="flex items-center justify-center lg:justify-start space-x-2">
                    <div className="flex -space-x-2">
                      {avatars.map((avatar, idx) => (
                        <img
                          key={idx}
                          src={avatar.src}
                          alt={avatar.alt || `Developer ${idx + 1}`}
                          className="inline-block w-12 h-12 rounded-full ring-2 ring-white shadow-lg"
                        />
                      ))}
                    </div>
                    <div className="flex items-center ml-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-lg text-gray-700 font-medium text-center lg:text-left">
                    {joinLine}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start sm:space-x-6 space-y-4 sm:space-y-0">
                  <a
                    href={primaryHref}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gray-900 rounded-lg transition-all duration-200 hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                    role="button"
                  >
                    {primaryLabel}
                  </a>
                  <a
                    href={secondaryHref}
                    className="inline-flex items-center justify-center px-6 py-4 text-lg font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:bg-gray-50 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 shadow-sm hover:shadow-md"
                    role="button"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {secondaryLabel}
                  </a>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="xl:col-span-3">
              <div className="relative">
                <img 
                  src={heroImg} 
                  alt="Code review platform interface showing collaborative features" 
                  className="w-full h-auto mx-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 