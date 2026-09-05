import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <>

  <svg style={{ position: "absolute", width: 0, height: 0 }}>
    <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq">
      <feColorMatrix
        values="1 0 0 0 0 
      0 1 0 0 0 
      0 0 1 0 0 
      0 0 0 9 0"
      />
    </filter>
    <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq2">
      <feColorMatrix
        values="1 0 0 0 0 
      0 1 0 0 0 
      0 0 1 0 0 
      0 0 0 3 0"
      />
    </filter>
    <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq3">
      <feColorMatrix
        values="1 0 0 0.2 0 
      0 1 0 0.2 0 
      0 0 1 0.2 0 
      0 0 0 2 0"
      />
    </filter>
  </svg>
  <button className="real-button" />
  <div className="backdrop" />
  <div className="button-container">
    <div className="spin spin-blur" />
    <div className="spin spin-intense" />
    <div className="backdrop" />
    <div className="button-border">
      <div className="spin spin-inside" />
      <div className="button">Button</div>
    </div>
  </div>
</>

  );
};
