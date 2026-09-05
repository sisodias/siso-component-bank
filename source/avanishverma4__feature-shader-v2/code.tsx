
import React, { useState, useCallback } from 'react';
import { Warp } from "@paper-design/shaders-react";
import { 
  Star, 
  Zap, 
  Cpu, 
  Palette, 
  Smartphone, 
  Layers, 
  RefreshCw
} from "lucide-react";

// --- Constants & Types ---

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PALETTES = [
  ["hsl(280, 100%, 30%)", "hsl(320, 100%, 60%)", "hsl(340, 90%, 40%)", "hsl(300, 100%, 70%)"],
  ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
  ["hsl(120, 100%, 25%)", "hsl(140, 100%, 60%)", "hsl(100, 90%, 30%)", "hsl(130, 100%, 70%)"],
  ["hsl(30, 100%, 35%)", "hsl(50, 100%, 65%)", "hsl(40, 90%, 40%)", "hsl(45, 100%, 75%)"],
  ["hsl(250, 100%, 30%)", "hsl(270, 100%, 65%)", "hsl(260, 90%, 35%)", "hsl(265, 100%, 70%)"],
  ["hsl(330, 100%, 30%)", "hsl(350, 100%, 60%)", "hsl(340, 90%, 35%)", "hsl(345, 100%, 75%)"],
  ["hsl(180, 100%, 20%)", "hsl(220, 100%, 50%)", "hsl(260, 80%, 40%)", "hsl(200, 100%, 80%)"],
  ["hsl(0, 100%, 25%)", "hsl(20, 100%, 55%)", "hsl(45, 90%, 45%)", "hsl(10, 100%, 75%)"],
];

const SHADER_CONFIGS = [
  // Fix: replaced "dots" with "stripes" as it is a valid Warp shape
  { proportion: 0.3, softness: 0.8, distortion: 0.15, swirl: 0.6, swirlIterations: 8, shape: "stripes" as const, shapeScale: 0.05 },
  { proportion: 0.4, softness: 1.2, distortion: 0.2, swirl: 0.9, swirlIterations: 12, shape: "stripes" as const, shapeScale: 0.18 },
  { proportion: 0.35, softness: 0.9, distortion: 0.18, swirl: 0.7, swirlIterations: 10, shape: "checks" as const, shapeScale: 0.22 },
  { proportion: 0.45, softness: 1.1, distortion: 0.22, swirl: 0.8, swirlIterations: 15, shape: "edge" as const, shapeScale: 0.03 },
  // Fix: replaced "dots" with "checks" as it is a valid Warp shape
  { proportion: 0.38, softness: 0.95, distortion: 0.16, swirl: 0.85, swirlIterations: 11, shape: "checks" as const, shapeScale: 0.4 },
  { proportion: 0.42, softness: 1.0, distortion: 0.19, swirl: 0.75, swirlIterations: 9, shape: "stripes" as const, shapeScale: 0.06 },
];

// --- Sub-Components ---

const FeatureCard: React.FC<{ 
  feature: Feature; 
  index: number; 
  paletteOffset: number;
  onShuffle: () => void;
}> = ({ feature, index, paletteOffset, onShuffle }) => {
  const shaderConfig = SHADER_CONFIGS[index % SHADER_CONFIGS.length];
  const colors = PALETTES[(index + paletteOffset) % PALETTES.length];
  
  return (
    <div 
      role="listitem"
      tabIndex={0}
      onClick={onShuffle}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onShuffle()}
      className="relative h-[22rem] group cursor-pointer transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-indigo-500"
    >
      {/* Background Shader */}
      <div aria-hidden="true" className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl transition-transform duration-700 ease-in-out group-hover:scale-[1.05]">
        <Warp
          style={{ height: "100%", width: "100%" }}
          {...shaderConfig}
          scale={1}
          rotation={0}
          speed={0.8}
          colors={colors}
        />
      </div>

      {/* Glassmorphism Content Overlay */}
      <div className="relative z-10 p-8 rounded-3xl h-full flex flex-col bg-zinc-950/80 backdrop-blur-[4px] border border-white/10 transition-all duration-500 group-hover:bg-zinc-950/70">
        <div className="mb-6 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-110 group-hover:animate-pulse">
          {feature.icon}
        </div>

        <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">
          {feature.title}
        </h3>

        <p className="leading-relaxed flex-grow text-zinc-200/90 font-medium">
          {feature.description}
        </p>

        <div className="mt-6 flex items-center text-sm font-bold text-white/80 group-hover:text-white transition-colors">
          <span className="mr-2">Click to shuffle colors</span>
          <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

// --- Main Components ---

const App: React.FC = () => {
  const [paletteOffsets, setPaletteOffsets] = useState<number[]>(new Array(6).fill(0));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const shuffleCard = (index: number) => {
    setPaletteOffsets(prev => {
      const next = [...prev];
      next[index] = (next[index] + 1) % PALETTES.length;
      return next;
    });
  };

  const shuffleAll = useCallback(() => {
    setIsRefreshing(true);
    setPaletteOffsets(prev => prev.map(offset => (offset + 1) % PALETTES.length));
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  const features: Feature[] = [
    { title: "Elegant Design", description: "Beautiful shader effects that enhance your content. Perfect for modern web experiences.", icon: <Star className="w-8 h-8 text-white" /> },
    { title: "High Performance", description: "Optimized WebGL shaders that run smoothly on all devices while maintaining stunning visual quality.", icon: <Zap className="w-8 h-8 text-white" /> },
    { title: "Easy Integration", description: "Simple React components that can be dropped into any project with minimal configuration.", icon: <Cpu className="w-8 h-8 text-white" /> },
    { title: "Customizable", description: "Extensive customization options to match your brand colors and visual style perfectly.", icon: <Palette className="w-8 h-8 text-white" /> },
    { title: "Responsive", description: "Fully responsive design that looks great on desktop, tablet, and mobile devices of all sizes.", icon: <Smartphone className="w-8 h-8 text-white" /> },
    { title: "Modern Tech", description: "Built with the latest web technologies including WebGL and React for reliability.", icon: <Layers className="w-8 h-8 text-white" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-500">
      {/* Toolbar */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={shuffleAll}
          aria-label="Shuffle all card colors"
          className="p-3 rounded-full bg-zinc-800 shadow-xl border border-zinc-700 hover:scale-110 active:scale-95 transition-all group"
        >
          <RefreshCw className={`w-5 h-5 text-indigo-400 transition-transform duration-500 ${isRefreshing ? 'rotate-180' : 'group-hover:rotate-45'}`} />
        </button>
      </div>

      <main className="flex-grow">
        <section 
          id="features"
          aria-labelledby="features-heading"
          className="py-24 px-4 bg-zinc-950 min-h-screen flex flex-col justify-center transition-colors duration-500"
        >
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 id="features-heading" className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
                Powerful Features
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                Experience the magic of dynamic shaders. Click any card or the shuffle button above to morph the visual atmosphere.
              </p>
            </div>

            <div role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  feature={feature}
                  index={index}
                  paletteOffset={paletteOffsets[index]}
                  onShuffle={() => shuffleCard(index)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;