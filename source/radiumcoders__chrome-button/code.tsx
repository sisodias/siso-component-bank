import { ReactNode } from "react";
import LiquidChrome from "@/components/ui/liquid-chrome";

function ChromeButton({ children }: { children: ReactNode }) {
  return (
    <button className="relative py-4 px-6 rounded-full border-neutral-900 border-2 bg-neutral-950 overflow-hidden group text-white active:scale-95 transition-all duration-75 shadow-lg">
      <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
        <LiquidChrome
          baseColor={[
            0.0392156862745098, 0.0392156862745098, 0.0392156862745098,
          ]}
          speed={2}
          amplitude={0.1}
          interactive={false}
        />
      </div>
      <span className="relative z-10 mix-blend-difference">{children}</span>
    </button>
  );
}

export default ChromeButton;
