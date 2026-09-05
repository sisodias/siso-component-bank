import { cn } from "@/lib/utils";
import React from "react";

export const SampleCard: React.FC = () => {
  return (
    <div className="container">
      <div className="card">
        <p className="innerText">SAMPLE TEXT</p>
        <p className="innerText"></p>
        <p className="desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id
          dictum augue, id viverra.
        </p>
      </div>
    </div>
  );
};

// Usage example:
// import { SampleCard } from "./SampleCard";
// export default function App() {
//   return <SampleCard />;
// }
