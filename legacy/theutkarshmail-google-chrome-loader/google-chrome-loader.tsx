import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    
<aside class="loader-chrome">
  <div class="circle-blue-center"></div>
  <div class="yellow-right"></div>
  <div class="green-left"></div>
</aside>

  );
};
