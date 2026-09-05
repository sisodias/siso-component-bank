import React, { useEffect, useRef, ReactNode } from 'react';

type BentoProps = {
  className?: string;
  children: ReactNode;
};

const BentoItem = ({ className, children }: BentoProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const MAX_ROTATION = 10;

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * MAX_ROTATION;
      const rotateX = (-(y - centerY) / centerY) * MAX_ROTATION;
      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05,1.05,1.05)`;
    };

    const handleMouseLeave = () => {
      item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    };

    item.addEventListener('mousemove', handleMouseMove);
    item.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      item.removeEventListener('mousemove', handleMouseMove);
      item.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={itemRef} className={`bento-item ${className || ''}`}>
      {children}
    </div>
  );
};

export const Component = () => {
  return (
            <div className="aurora-container aurora-bento-scoped">
                <div className="w-full max-w-6xl z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 text-center mb-4">Creative Services</h1>
                    <p className="text-center text-lg text-gray-400 mb-10">Innovative solutions for the modern web.</p>

                    <div className="bento-grid">
                        <BentoItem className="col-span-2 row-span-2 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Branding & Identity</h2>
                                <p className="mt-2 text-gray-300">We build memorable brands that connect with your audience and stand the test of time.</p>
                            </div>
                            <div className="mt-4 h-48 bg-black/20 rounded-lg flex items-center justify-center text-gray-400 border border-white/10">
                                [Visual Identity Showcase]
                            </div>
                        </BentoItem>

                        <BentoItem>
                            <h2 className="text-xl font-bold text-white">Web Design</h2>
                            <p className="mt-2 text-gray-300 text-sm">Crafting intuitive and beautiful user experiences for the web.</p>
                        </BentoItem>

                        <BentoItem>
                            <h2 className="text-xl font-bold text-white">Mobile Apps</h2>
                            <p className="mt-2 text-gray-300 text-sm">From concept to launch, we develop native and hybrid mobile applications.</p>
                        </BentoItem>

                        <BentoItem className="row-span-2 col-span-full-mobile">
                            <h2 className="text-xl font-bold text-white">Our Philosophy</h2>
                            <p className="mt-2 text-gray-300 text-sm">We believe in a collaborative process, where transparency and communication lead to outstanding results. Your success is our mission.</p>
                        </BentoItem>

                        <BentoItem className="col-span-2">
                            <h2 className="text-xl font-bold text-white">SEO & Marketing</h2>
                            <p className="mt-2 text-gray-300 text-sm">Drive organic traffic and grow your online presence with data-driven strategies.</p>
                        </BentoItem>
                    </div>
                </div>
            </div>
  );
};
