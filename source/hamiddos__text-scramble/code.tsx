// components/ui/component.tsx
import { useEffect, useState } from "react";

const chars = "!<>-_\\/[]{}—=+*^?#________";

export const Component = () => {
  const [output, setOutput] = useState("");
  const target = "Unbreakable UI";

  useEffect(() => {
    let frame = 0;
    const len = target.length;
    const timer = setInterval(() => {
      setOutput((prev) =>
        target
          .split("")
          .map((ch, i) =>
            i < frame ? ch : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("")
      );
      frame += 1;
      if (frame > len) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen grid place-content-center bg-background text-foreground">
      <h1 className="text-5xl font-black font-mono">{output}</h1>
    </div>
  );
};