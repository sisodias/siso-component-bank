import { cn } from "@/lib/utils";
import { useState } from "react";
import { Play } from "lucide-react"
export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
           <div className="relative max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-100 group">
              <img 
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=675&fit=crop" 
                alt="Video Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-black fill-black ml-1" />
                </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-white font-medium">Cinematic Drone Shot</p>
                  <p className="text-white/70 text-sm">Generated in 12 seconds</p>
                </div>
              </div>

                <div className="absolute right-8 bottom-8   backdrop-blur-md p-4 rounded-2xl border border-white/20 ">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                        </div>
                      ))}
                    </div>
                  
                  <p className="text-white/70 font-medium">Used by 10k+ creators</p>
                  </div>
            </div>
    </div>
  );
};
