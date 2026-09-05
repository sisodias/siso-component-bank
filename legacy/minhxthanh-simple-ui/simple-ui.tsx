import React from 'react';
import { AIInputWithSearch } from "./ai-input-with-search";
import { BlurFade } from "./blur-fade"
import Image from 'next/image';
import { cn } from "../_utils/cn";
import { DotPattern } from "./dot-pattern";



// Demo images with 2:3 aspect ratio
const cardData = [
  { title: 'Brand Visual',   imageSrc: 'https://picsum.photos/768/1344?random=1' },
  { title: 'Sketch Style',          imageSrc: 'https://picsum.photos/768/1344?random=2' },
  { title: 'Fake Realism',          imageSrc: 'https://picsum.photos/768/1344?random=3' },
  { title: 'Fashion Poster',        imageSrc: 'https://picsum.photos/768/1344?random=4' },
  { title: 'Food Promotion Poster', imageSrc: 'https://picsum.photos/768/1344?random=5' },
];

export default function HomePage() {
  // Determine greeting based on current hour
  const hour = new Date().getHours();
  let timeOfDay;
  if (hour < 12) timeOfDay = 'Morning';
  else if (hour < 18) timeOfDay = 'Afternoon';
  else timeOfDay = 'Evening';

  return (
    <div className="min-h-screen bg-white dark:bg-background p-8">
    <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
      {/* Header */}
      <header className="text-center mb-12">
      <BlurFade delay={0.25} inView>
        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
          {`Good ${timeOfDay}, Leon`}
        </h2>
      </BlurFade>
      <div className="opacity-0">hidden</div>
      <BlurFade delay={0.25 * 2} inView>
        <span className="animate-fade-in font-[Outfit] text-[16px] font-normal text-[#737880] sm:text-[20px]">
          Ready to turn your ideas into art?
        </span>
      </BlurFade>
      </header>

      {/* Input Box */}
      <div className="max-w-2xl mx-auto mb-16">
        <AIInputWithSearch 
          onSubmit={(value, withSearch) => {
            console.log('Message:', value);
            console.log('Search enabled:', withSearch);
          }}
          onFileSelect={(file) => {
            console.log('Selected file:', file);
          }}
        />
      </div>

      {/* Created With Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Created With Art</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cardData.map((card) => (
            <div key={card.title} className="relative group rounded-xl overflow-hidden cursor-pointer">
            <div className="w-full h-[300px] object-cover rounded-2xl overflow-hidden">
              <img
                src={card.imageSrc}
                alt={card.title}
                className="w-full h-[300px] object-cover rounded-2xl group-hover:scale-110 duration-300 transition-all"
              />
              </div>
              <div className="absolute left-0 right-0 top-0 m-4 flex h-[30px] w-[29px] items-center justify-start gap-1 overflow-hidden rounded-full bg-[rgba(51,51,51,0.8)] transition-all duration-300 group-hover:w-[72px]">
              <Image width={28} height={28} src="https://www.lovart.ai/assets/play-s.svg" />
              <span className="text-[rgba(255,255,255,0.8)] sm:text-[14px] sm:font-[700]">View</span>
            </div>
              <p className="text-center mt-2 font-medium  pb-4">{card.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
