import React from 'react';


interface PandaLoaderProps {
  className?: string;
  scale?: number;
}

export const PandaLoader: React.FC<PandaLoaderProps> = ({ 
  className = "",
  scale = 0.75
}) => {
  return (
    <div 
      className={`panda-loader relative z-10 w-56 h-40 ${className}`}
      style={{ transform: `scale(${scale})` }}
    >
      <div className="panda w-full h-30 relative z-10">
        <div className="panda-head w-30 h-28 absolute bottom-0 right-0 z-30 rounded-full">
          <div className="panda-ear absolute top-0 left-0 w-8 h-8 rounded-full overflow-hidden z-30">
            <div className="panda-ear-inner absolute bottom-0 left-2 w-full h-4 rounded-full transform -rotate-45"></div>
          </div>
          <div className="panda-ear panda-ear-right absolute top-0 left-20 w-8 h-8 rounded-full overflow-hidden z-30">
            <div className="panda-ear-inner absolute bottom-0 left-2 w-full h-4 rounded-full transform rotate-45"></div>
          </div>
          <div className="panda-mouth absolute bottom-0 left-10 w-14 h-8 rounded-full flex justify-around items-center p-2">
            <div className="panda-lips w-1 h-3 rounded-full transform -rotate-45"></div>
            <div className="panda-lips w-1 h-3 rounded-full transform rotate-45"></div>
          </div>
          <div className="panda-eye absolute bottom-14 left-6 w-8 h-2 rounded-full transform rotate-45"></div>
          <div className="panda-eye panda-eye-right absolute bottom-14 left-22 w-7 h-2 rounded-full transform -rotate-45"></div>
          <div className="panda-eye-patch absolute bottom-12 left-4 w-10 h-6 rounded-full transform rotate-12"></div>
          <div className="panda-eye-patch panda-eye-patch-right absolute bottom-12 left-18 w-10 h-6 rounded-full transform -rotate-12"></div>
        </div>
        <div className="panda-leg absolute bottom-0 left-0 w-24 h-20 z-20 rounded-3xl"></div>
        <div className="panda-leg2 absolute bottom-0 left-13 w-7 h-12 z-20 rounded-xl"></div>
        <div className="panda-leg2 panda-leg2-front absolute bottom-0 left-2 w-5 h-8 z-20 rounded-xl"></div>
        <div className="panda-body w-4/5 h-full relative z-10 rounded-full"></div>
      </div>
      <div className="loader w-full h-10 relative z-10 overflow-hidden">
        <div className="loader-line w-200 h-2 border-t-2 border-dashed"></div>
      </div>
    </div>
  );
};