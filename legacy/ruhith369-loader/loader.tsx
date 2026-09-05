import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* rotation happens here, not on the positioning wrapper */}
      <div className="w-[200px] h-[200px] m-auto filter animate-[rotate-move_2s_ease-in-out_infinite]">
        <div className="dot dot-1 absolute w-[70px] h-[70px] rounded-full bg-[#ffc400] top-0 bottom-0 left-0 right-0 m-auto" />
        <div className="dot dot-2 absolute w-[70px] h-[70px] rounded-full bg-[#0051ff] top-0 bottom-0 left-0 right-0 m-auto" />
        <div className="dot dot-3 absolute w-[70px] h-[70px] rounded-full bg-[#ff1717] top-0 bottom-0 left-0 right-0 m-auto" />

        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="hidden">
          <defs>
            <filter id="goo">
              <feGaussianBlur result="blur" stdDeviation={10} in="SourceGraphic" />
              <feColorMatrix
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
                mode="matrix"
                in="blur"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Loader;
