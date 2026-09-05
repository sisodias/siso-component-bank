import React from "react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

export interface ComponentProps {
  /** Background illustration image */
  heroImage?: string;
  /** Intro headline prefix */
  headlinePrefix?: string;
  /** Highlighted word in headline */
  headlineAccent?: string;
  /** Supporting paragraph */
  subText?: string;
  /** Primary button label */
  primaryLabel?: string;
  /** Secondary button label */
  secondaryLabel?: string;
  /** Secondary button icon color */
  secondaryIconColor?: string;
  /** Navigation links */
  navLinks?: NavLink[];
  /** Action link label (auth etc.) */
  authLabel?: string;
  /** CTA in nav */
  navCtaLabel?: string;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  heroImage = "https://cdn.rareblocks.xyz/collection/celebration/images/hero/2/hero-img.png",
  headlinePrefix = "Build amazing things together with",
  headlineAccent = "TeamFlow",
  subText = "Transform how your team collaborates. Organize projects, share ideas, and achieve goals faster than ever before.",
  primaryLabel = "Get started",
  secondaryLabel = "View demo",
  secondaryIconColor = "#F97316",
  navLinks = [
    { label: "About", href: "#" },
    { label: "Services", href: "#" },
    { label: "Support", href: "#" },
    { label: "Plans", href: "#" },
  ],
  authLabel = "Sign in",
  navCtaLabel = "Get started",
  className,
}) => {
  return (
    <div className={cn("bg-gradient-to-b from-green-50 to-green-100", className)}>
      {/* Navigation */}
      <header className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex-shrink-0 focus:outline-none" title="Home">
            <div className="text-2xl font-bold text-black">TeamFlow</div>
          </a>

          {/* Mobile toggle placeholder */}
          <button
            type="button"
            className="inline-flex p-1 text-black border border-black rounded-md transition-colors duration-200 lg:hidden hover:bg-gray-100 focus:bg-gray-100"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop menu */}
          <nav className="hidden ml-auto lg:flex lg:items-center lg:space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base font-semibold text-black transition-colors duration-200 hover:text-opacity-80"
              >
                {link.label}
              </a>
            ))}
            <div className="w-px h-5 bg-black/20" />
            <a href="#" className="text-base font-semibold text-black transition-colors duration-200 hover:text-opacity-80">
              {authLabel}
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-black border-2 border-black rounded transition-colors duration-200 hover:bg-black hover:text-white focus:bg-black focus:text-white"
            >
              {navCtaLabel}
            </a>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold text-black sm:text-6xl lg:text-7xl">
                {headlinePrefix}
                <div className="relative inline-flex">
                  <span className="absolute inset-x-0 bottom-0 border-b-[30px] border-[#4ADE80]" />
                  <span className="relative text-4xl font-bold text-black sm:text-6xl lg:text-7xl">
                    {headlineAccent}.
                  </span>
                </div>
              </h1>
              <p className="mt-8 text-base text-black sm:text-xl">{subText}</p>
              <div className="mt-10 sm:flex sm:items-center sm:space-x-8">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white bg-orange-500 rounded transition-colors duration-200 hover:bg-orange-600 focus:bg-orange-600"
                  role="button"
                >
                  {primaryLabel}
                </a>
                <a
                  href="#"
                  className="inline-flex items-center mt-6 text-base font-semibold transition-opacity duration-200 sm:mt-0 hover:opacity-80"
                >
                  <svg
                    className="w-10 h-10 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      fill={secondaryIconColor}
                      stroke={secondaryIconColor}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {secondaryLabel}
                </a>
              </div>
            </div>
            <div>
              <img src={heroImage} alt="Collaboration" className="w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 