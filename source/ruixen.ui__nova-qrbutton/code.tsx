import React, { useState } from "react";
import { QrCode } from "lucide-react";

const NeonQrButton = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Soft pastel circular button */}
      <button
        aria-label="Show QR code"
        className="
          relative rounded-full w-12 h-12
          bg-white bg-opacity-90
          border-2 border-indigo-300
          shadow-[0_0_10px_3px_rgba(129,140,248,0.5)]
          flex items-center justify-center
          text-indigo-500
          hover:text-indigo-400
          transition-colors duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2
          cursor-pointer
          select-none
        "
      >
        <QrCode size={24} strokeWidth={2} />
      </button>

      {/* Light pastel popover card */}
      <div
        className={`
          absolute left-1/2 top-full mt-3
          w-52 h-52
          -translate-x-1/2
          rounded-2xl
          bg-gradient-to-tr from-indigo-100 via-pink-100 to-purple-100
          bg-opacity-90
          border border-indigo-200
          shadow-[0_0_25px_5px_rgba(129,140,248,0.4)]
          flex items-center justify-center
          transform origin-top
          transition-all duration-300 ease-in-out
          ${hovered ? "opacity-100 scale-100 visible" : "opacity-0 scale-75 invisible pointer-events-none"}
        `}
      >
        <div className="bg-white bg-opacity-80 rounded-xl p-6 flex items-center justify-center">
          <QrCode size={128} strokeWidth={2} className="text-indigo-500" />
        </div>
      </div>
    </div>
  );
};

NeonQrButton.displayName = "NeonQrButton";

export { NeonQrButton };
