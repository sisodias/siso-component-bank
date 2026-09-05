import React from "react";

const LoaderGrid: React.FC = () => {
  return (
    <div className="relative w-[2.5em] h-[2.5em] rotate-[165deg]">
      <span className="beforeEl" />
      <span className="afterEl" />
    </div>
  );
};

export default LoaderGrid;
