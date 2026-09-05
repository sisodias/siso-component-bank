"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export const Component = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="relative z-10 py-4 md:py-6">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="#"
                aria-label="Homepage"
                className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                {/* Replace with your own logo */}
                <Image src="/next.svg" alt="Logo" width={112} height={32} />
              </a>
            </div>

            {/* Mobile toggle */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
                className="text-gray-900"
              >
                {expanded ? (
                  <svg
                    className="w-7 h-7"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:justify-center md:space-x-10 md:absolute md:inset-y-0 md:left-1/2 md:-translate-x-1/2 lg:space-x-16">
              {[
                { label: "Solutions", href: "#" },
                { label: "Plans", href: "#" },
                { label: "Help", href: "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-base font-medium text-gray-900 transition-all duration-200 rounded hover:text-opacity-50 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex">
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Start free trial
              </a>
            </div>
          </div>

          {/* Mobile navigation */}
          {expanded && (
            <nav>
              <div className="px-1 py-8">
                <div className="grid gap-y-7">
                  {[
                    { label: "Solutions", href: "#" },
                    { label: "Plans", href: "#" },
                    { label: "Help", href: "#" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                    >
                      {item.label}
                    </a>
                  ))}

                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    Start free trial
                  </a>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-12 sm:py-16 lg:pb-40">
        {/* Decorative background pattern */}
        <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none select-none">
          <Image
            src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/background-pattern.png"
            alt="Decorative pattern"
            width={800}
            height={800}
            className="w-full h-auto origin-bottom-right transform scale-150 lg:w-auto lg:mx-auto lg:object-cover lg:scale-75"
          />
        </div>

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-4 lg:items-center lg:grid-cols-2 xl:grid-cols-2">
            {/* Copy */}
            <div className="text-center xl:col-span-1 lg:text-left md:px-16 lg:px-0 xl:pr-20">
              <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
                A coding workspace that helps you craft pristine programs.
              </h1>
              <p className="mt-2 text-lg text-gray-600 sm:mt-6">
                Build, refactor, and ship code faster with real-time feedback and an interface designed for focus.
              </p>

              <a
                href="#"
                className="inline-flex px-8 py-4 mt-8 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded sm:mt-10 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Give it a spin
              </a>

              {/* Testimonial */}
              <div className="mt-8 sm:mt-16">
                <div className="flex items-center justify-center lg:justify-start">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      className="w-5 h-5 text-[#FDB241]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="mt-6">
                  <p className="text-lg font-bold text-gray-900">
                    The most intuitive editor I&#39;ve worked with!
                  </p>
                  <p className="mt-3 text-base leading-7 text-gray-600">
                    "I cut my development time in half thanks to this tool. The live preview and smart auto-complete are a game changer."
                  </p>
                </blockquote>

                <div className="flex items-center justify-center mt-3 lg:justify-start">
                  <Image
                    src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/avatar-female.png"
                    alt="User avatar"
                    width={24}
                    height={24}
                    className="flex-shrink-0 object-cover w-6 h-6 overflow-hidden rounded-full"
                  />
                  <p className="ml-2 text-base font-bold text-gray-900">Alex Rivera</p>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="xl:col-span-1">
              <Image
                src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/illustration.png"
                alt="Product illustration"
                width={600}
                height={550}
                className="w-full mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
