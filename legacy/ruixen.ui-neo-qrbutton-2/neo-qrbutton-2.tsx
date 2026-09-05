import React, { useState } from "react";
import { QrCode } from "lucide-react";

const ButtonRuixenQR = () => {
    const [showPopover, setShowPopover] = useState(false);

    return (
        <div
            className="relative inline-flex border -space-x-px divide-x divide-primary-foreground/30 rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse"
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
        >
            <button className="rounded-none shadow-none font-medium first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 px-4">
                Scan QR
            </button>

            <button
                className="rounded-none shadow-none font-medium first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 p-2"
                aria-label="QR code"
            >
                <QrCode size={16} strokeWidth={2} aria-hidden="true" />
            </button>

            <div
                className={`
                    absolute top-full left-1/2 z-20 mt-2 w-48 -translate-x-1/2 rounded-lg
                    bg-gradient-to-tr from-purple-300 via-pink-200 to-indigo-300
                    bg-opacity-20 backdrop-blur-sm border border-white border-opacity-20
                    shadow-lg shadow-purple-200/40
                    flex items-center justify-center p-4
                    transition-opacity transition-transform duration-300 ease-in-out
                    ${showPopover ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"}
                `}
                style={{ minHeight: "160px", minWidth: "160px" }}
            >
                <QrCode size={96} strokeWidth={2} className="text-black" aria-hidden="true" />
            </div>
        </div>
    );
};

ButtonRuixenQR.displayName = "ButtonRuixenQR";

export { ButtonRuixenQR };
