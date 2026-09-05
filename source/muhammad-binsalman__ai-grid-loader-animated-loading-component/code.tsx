import React from 'react';

const AIGridLoader = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-stone-950 to-black flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-3 rotate-45">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 bg-purple-500 shadow-lg shadow-cyan-400/30 rounded-sm cube-${index + 1}`}
          />
        ))}
      </div> 
      <h1 className="text-lg font-bold mt-12 tracking-tight">Let The AI Cook...</h1>
      <style jsx>{`
        .grid {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        @keyframes cubeScale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        .cube-1 { animation: cubeScale 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.2s; transform: scale(0); opacity: 0; }
        .cube-2 { animation: cubeScale 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.4s; transform: scale(0); opacity: 0; }
        .cube-3 { animation: cubeScale 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s; transform: scale(0); opacity: 0; }
        .cube-4 { animation: cubeScale 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.8s; transform: scale(0); opacity: 0; }
        .cube-5 { animation: cubeScale 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.0s; transform: scale(0); opacity: 0; }
        .cube-6 { animation: cubeScale 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.2s; transform: scale(0); opacity: 0; }
        .cube-7 { animation: cubeScale 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.4s; transform: scale(0); opacity: 0; }
        .cube-8 { animation: cubeScale 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.6s; transform: scale(0); opacity: 0; }
        .cube-9 { animation: cubeScale 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.8s; transform: scale(0); opacity: 0; }
      `}</style>
    </div>
  );
};

export default AIGridLoader;