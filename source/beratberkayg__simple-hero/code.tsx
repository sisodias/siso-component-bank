"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Component = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 w-full">
      {/* Rotating Gradient Background */}
      <div className="absolute inset-0">
        <div className="rotating-gradient-container">
          <div className="rotating-gradient-layer-1"></div>
          <div className="rotating-gradient-layer-2"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-8 py-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto mt-16">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-x animate-fade-in-up">
            Build Interfaces Smarter
          </h1>
          <p className="mt-6 mb-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed animate-fade-in-up animation-delay-200">
            UI CAT provides elegant, responsive, and production-ready components 
            designed with <span className="font-semibold">Tailwind CSS</span>.  
            Create modern interfaces faster, without compromising quality.
          </p>
          <Button className="px-8 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all animate-fade-in-up animation-delay-400">
            <a
              href="https://uicat.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Components
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-14 mb-10 max-w-3xl mx-auto">
          {[
            { number: 23, label: "UI Components" },
            { number: 13, label: "Ready Blocks" },
            { number: 5, label: "Full Templates" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center transition-transform hover:scale-105 hover:shadow-md animate-fade-in-up"
              style={{ animationDelay: `${idx * 200}ms` }}
            >
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {item.number}
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 tracking-wide">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Image Preview */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-white/20 dark:bg-gray-800/20 shadow-2xl backdrop-blur-lg transition-all">
            <Image
              src="https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg"
              alt="UI CAT Preview"
              width={1200}
              height={700}
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
