import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
<a class="brutalist-button" href="/">
  <div class="claude-logo">
    <span class="starburst">✷</span>
    <span class="claude-text">Claude</span>
  </div>
  <div class="button-text">
    <span>Powered by</span>
    <span>Anthropic</span>
  </div>
</a>

  );
};
