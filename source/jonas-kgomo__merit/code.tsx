import { cn } from "@/lib/utils";
import { Brain, Trophy, ArrowRight } from "lucide-react";

export const Component = () => {
  return (
    <div>
      {/* MAIN CALLOUT CONTAINER */}
      <div >

        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#181715] via-[#252320] to-[#181715]" />

        {/* GRID OVERLAY */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        {/* HEADER STATUS */}
        <div className="absolute top-12 left-8 z-20">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-xl px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-sm text-white/80">
              Merit Sprint Live • AI Simulation Active
            </span>
          </div>
        </div>

       

        {/* HERO CONTENT */}
        <div className="absolute  inset-0 flex flex-col items-center justify-center text-center px-10">
 <h1 className=" font-serif text-7xl py-12   ">Merit</h1>
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cc785c]/30 bg-[#cc785c]/10 px-4 py-2 text-sm text-[#f4c9b8]">
              <Brain className="h-4 w-4" />
              AI-Managed Work Simulation
            </div>
          </div>

          <h1 className="max-w-4xl font-light font-serif text-6xl lg:text-7xl leading-[0.95] tracking-[-0.04em] text-white">
            Proof of Work.
            <br />
            Not Proof of Presentation.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/65">
            Candidates enter simulated companies where AI project managers assign real tasks,
            observe collaboration, and generate verifiable performance data.
          </p>
        </div>

      

    
        

        {/* CTA */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <button className="group flex items-center gap-2 rounded-full bg-[#cc785c] px-6 py-3 text-white transition-colors hover:bg-[#b76a50]">
            <Trophy className="h-4 w-4" />
            View Proof of Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
};