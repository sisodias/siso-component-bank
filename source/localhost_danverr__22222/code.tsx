import { cn } from "@/lib/utils";
import { useState } from "react";
import p5 from "p5";
import moment from "moment";

export const Component = () => {
  const [count, setCount] = useState(0);;
  p5;

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
      <h1 className="text-2xl font-bold mb-2">{moment().format('MMMM Do YYYY, h:mm:ss a')}</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button onClick={() => setCount((prev) => prev - 1)}>-</button>
        <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      </div>
    </div>
  );
};
