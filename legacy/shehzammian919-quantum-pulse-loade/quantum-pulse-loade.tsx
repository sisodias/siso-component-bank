import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="generating-loader-wrapper">
      <div className="generating-loader-text">
        <span className="generating-loader-letter">G</span>
        <span className="generating-loader-letter">e</span>
        <span className="generating-loader-letter">n</span>
        <span className="generating-loader-letter">e</span>
        <span className="generating-loader-letter">r</span>
        <span className="generating-loader-letter">a</span>
        <span className="generating-loader-letter">t</span>
        <span className="generating-loader-letter">i</span>
        <span className="generating-loader-letter">n</span>
        <span className="generating-loader-letter">g</span>
      </div>
      <div className="generating-loader-bar"></div>
    </div>
  );
};
