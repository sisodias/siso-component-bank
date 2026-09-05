import React from 'react';

const RealismButton = ({text}) => {
  return (
    <button className="group relative p-[2px] rounded-[16px] text-[1.4rem] border-none cursor-pointer bg-[radial-gradient(circle_80px_at_80%_-10%,_#ffffff,_#181b1b)] transition-all">
      {/* Glow behind button */}
      <div className="absolute top-0 right-0 w-[65%] h-[60%] rounded-[120px] shadow-[0_0_20px_#ffffff38] group-hover:shadow-[0_0_40px_#ffffff60] transition-all duration-300 ease-out -z-10" />

      {/* Bottom-left green blob */}
      <div className="absolute bottom-0 left-0 w-[50px] h-[50%] rounded-[17px] transition-all duration-300 ease-out 
        bg-[radial-gradient(circle_60px_at_0%_100%,_#3fff75,_#00ff8050,_transparent)] 
        shadow-[-2px_9px_40px_#00ff2d40] 
        group-hover:w-[90px] group-hover:shadow-[-4px_1px_45px_#00ff2d60]" />

      {/* Inner content */}
      <div className="relative px-[25px] py-[14px] group-hover:scale-110 rounded-[14px] text-white bg-[radial-gradient(circle_80px_at_80%_-50%,_#777777,_#0f1111)] z-10 transition-all duration-300">
        {text}

        {/* Inner glow layer */}
        <div className="absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_60px_at_0%_100%,_#00e1ff1a,_#0000ff11,_transparent)] z-[-1]" />
      </div>
    </button>
  );
};

export default RealismButton;

