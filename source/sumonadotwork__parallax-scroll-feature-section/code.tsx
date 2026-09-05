'use client'

import { useRef } from "react"
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
    // Array of section data
    const sections = [
        {
            id: 1,
            title: "Feature 1",
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab maxime sequi, pariatur illum, adipisci ullam optio quod tempora necessitatibus consectetur eaque deleniti id totam possimus unde dolorum inventore incidunt. Ea.",
            imageUrl: 'https://cdn.cosmos.so/6c4a7829-d16a-4a58-9ab9-93fbb3bacb9e.?format=jpeg',
            reverse: false
        },
        {
            id: 2,
            title: "Feature 2",
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab maxime sequi, pariatur illum, adipisci ullam optio quod tempora necessitatibus consectetur eaque deleniti id totam possimus unde dolorum inventore incidunt. Ea.",
            imageUrl: 'https://cdn.cosmos.so/f827788c-038d-4257-8167-759e819f846d?format=jpeg',
            reverse: true
        },
        {
            id: 3,
            title: "Feature 3",
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab maxime sequi, pariatur illum, adipisci ullam optio quod tempora necessitatibus consectetur eaque deleniti id totam possimus unde dolorum inventore incidunt. Ea.",
            imageUrl: 'https://cdn.cosmos.so/20351bef-4a9c-4dcc-81d8-e59c84058944?format=jpeg',
            reverse: false
        }
    ]

    // Create refs and animations for each section
    const sectionRefs = sections.map(() => useRef(null));
    
    const scrollYProgress = sections.map((_, index) => {
        return useScroll({
            target: sectionRefs[index],
            offset: ["start end", "center start"]
        }).scrollYProgress;
    });

    // Create animations for each section
    const opacityContents = scrollYProgress.map(progress => 
        useTransform(progress, [0, 0.7], [0, 1])
    );
    
    const clipProgresses = scrollYProgress.map(progress => 
        useTransform(progress, [0, 0.7], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])
    );
    
    const translateContents = scrollYProgress.map(progress => 
        useTransform(progress, [0, 1], [-50, 0])
    );

  return (
    <div>
      <div className='min-h-screen w-screen flex flex-col items-center justify-center'>
        <h1 className='text-6xl max-w-2xl text-center'>PARALLAX SCROLL FEATURE SECTION</h1>
        <p className='mt-20 flex items-center gap-1.5 text-sm'>SCROLL <ArrowDown size={15} /></p>
      </div>
      {/* <ScrollSection /> */}
       <div className="flex flex-col md:px-0 px-10">
            {sections.map((section, index) => (
                <div 
                    key={section.id}
                    ref={sectionRefs[index]} 
                    className={`h-screen flex items-center justify-center md:gap-40 gap-20 ${section.reverse ? 'flex-row-reverse' : ''}`}
                >
                    <motion.div style={{ y: translateContents[index] }}>
                        <div className="text-6xl max-w-sm">{section.title}</div>
                        <motion.p 
                            style={{ y: translateContents[index] }} 
                            className="text-white/70 max-w-sm mt-10"
                        >
                            {section.description}
                        </motion.p>
                    </motion.div>
                    <motion.div 
                        style={{ 
                            opacity: opacityContents[index],
                            clipPath: clipProgresses[index],
                        }}
                        className="relative"
                    >
                        <img 
                            src={section.imageUrl} 
                            className="size-80 object-cover" 
                            alt={`Section ${section.id}` }
                        />
                    </motion.div>
                </div>
            ))}
        </div>
      <div>

      </div>
       <div className='min-h-screen w-screen flex flex-col items-center justify-center'>
        <h1 className='text-8xl'>The End</h1>
      </div>
    </div>
  );
};
