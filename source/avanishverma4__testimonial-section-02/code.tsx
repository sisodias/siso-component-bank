import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';

// ==========================================
// --- TYPES ---
// ==========================================

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

// ==========================================
// --- DATA ---
// ==========================================

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 1,
    name: "Elena Rodriguez",
    role: "Product Designer",
    company: "CreativeFlow",
    content: "The image analysis is startlingly accurate. It picked up details in my wireframe sketches that I didn't even explicitly label. A game changer for digitizing workflows.",
    avatar: "https://picsum.photos/100/100?random=1"
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Accessibility Lead",
    company: "WebForAll",
    content: "We use this tool to generate alt-text for thousands of legacy images. The semantic understanding of 'context' is what sets Gemini apart from other models.",
    avatar: "https://picsum.photos/100/100?random=2"
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Content Strategist",
    company: "BuzzMedia",
    content: "I uploaded a photo of a messy desk, and it not only identified the items but described the 'chaotic creative' vibe perfectly. Absolutely love the personality.",
    avatar: "https://picsum.photos/100/100?random=3"
  },
  {
    id: 4,
    name: "Dr. Aris Thorne",
    role: "Data Scientist",
    company: "Nexus AI",
    content: "The 3 Pro Preview model is incredibly fast for the depth of reasoning it provides. Integrating this into our pipeline was seamless.",
    avatar: "https://picsum.photos/100/100?random=4"
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "Frontend Dev",
    company: "StartUp Inc",
    content: "Finally, an API that understands UI screenshots! It can distinguish between a button and a badge. This saves me hours of documentation time.",
    avatar: "https://picsum.photos/100/100?random=5"
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Art Director",
    company: "Vivid Studios",
    content: "The nuance in color description is unmatched. It doesn't just say 'blue', it says 'cerulean with a hint of teal'. Essential for our moodboarding process.",
    avatar: "https://picsum.photos/100/100?random=6"
  }
];

// ==========================================
// --- COMPONENTS ---
// ==========================================

const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => {
  return (
    <motion.div 
      // Using Intersection Observer via framer-motion to trigger animations when entering/leaving viewport
      initial={{ opacity: 0.3, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, margin: "-10% 0px -10% 0px" }} // Trigger fade out before completely leaving
      transition={{ duration: 0.5 }}
      className="w-[350px] md:w-[450px] p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl hover:bg-neutral-900/90 transition-colors duration-500 ease-out flex-shrink-0 group hover:-translate-y-3 hover:shadow-[0_20px_50px_-12px_rgba(234,179,8,0.25)] hover:border-yellow-500/40 relative z-10 hover:z-20"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="p-3 rounded-2xl bg-yellow-500/5 group-hover:bg-yellow-500/20 transition-all duration-500 border border-yellow-500/10 group-hover:border-yellow-500/30">
            <Quote className="w-6 h-6 text-yellow-500/80 group-hover:text-yellow-400 transition-colors" />
        </div>
        <div className="flex gap-1 bg-black/40 p-2 rounded-full backdrop-blur-sm border border-white/5 group-hover:border-yellow-500/20 transition-colors">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3.5 h-3.5 text-yellow-600 fill-yellow-600 group-hover:text-yellow-400 group-hover:fill-yellow-400 transition-colors drop-shadow-sm" />
          ))}
        </div>
      </div>
      
      <p className="text-neutral-400 group-hover:text-neutral-200 transition-colors mb-8 leading-relaxed text-lg font-light tracking-wide">
        "{item.content}"
      </p>
      
      <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto group-hover:border-white/10 transition-colors">
        <div className="relative">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/5 ring-2 ring-transparent group-hover:ring-yellow-500/40 transition-all duration-500 group-hover:scale-105">
            <img src={item.avatar} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-1 border-2 border-black shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/50 transition-shadow">
             <Sparkles className="w-3 h-3 text-black fill-black/20" />
          </div>
        </div>
        <div>
          <h4 className="text-neutral-200 group-hover:text-white font-semibold text-lg tracking-tight transition-colors">{item.name}</h4>
          <p className="text-sm text-neutral-600 font-medium group-hover:text-neutral-500 transition-colors">{item.role} <span className="text-neutral-700 mx-1">•</span> <span className="text-yellow-500/80 group-hover:text-yellow-400 transition-colors">{item.company}</span></p>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// --- MAIN APP ---
// ==========================================

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-20 overflow-hidden relative selection:bg-yellow-500/30 selection:text-yellow-200 font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-yellow-600/5 rounded-full blur-[120px] mix-blend-screen opacity-40 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[100px] mix-blend-screen opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col h-full justify-center">
        
        {/* Header Section */}
        <div className="flex justify-center mb-24 w-full">
            <div className="relative p-12 md:p-16 rounded-[3rem] bg-neutral-900/30 border border-yellow-500/10 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(234,179,8,0.1)] max-w-5xl mx-auto text-center overflow-hidden">
                {/* Inner Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[3rem]" />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default hover:border-yellow-500/30 group relative z-10"
                >
                    <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                    </span>
                    <span className="text-sm text-neutral-400 group-hover:text-yellow-200 transition-colors font-medium tracking-wide uppercase text-[10px]">Trusted by 10,000+ Teams</span>
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight relative z-10"
                >
                    Loved by <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-600 animate-gradient-x drop-shadow-sm">Innovators</span>
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed relative z-10"
                >
                    Discover how visionary creators and developers are transforming their workflows with our Gemini-powered insights.
                </motion.p>
            </div>
        </div>

        {/* Infinite Moving Cards Container */}
        <div className="relative w-full [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div className="flex gap-8 w-max animate-infinite-scroll hover:pause-animation py-8 px-4">
                {[...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA].map((item, index) => (
                  <TestimonialCard key={`${item.id}-${index}`} item={item} />
                ))}
            </div>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style>{`
        .animate-infinite-scroll {
          animation: scroll 80s linear infinite;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default App;