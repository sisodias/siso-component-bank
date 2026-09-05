"use client";

type Color = { bg: string; ring: string };

const colors: Color[] = [
  { bg: "bg-[#2563EB]", ring: "ring-[#2563EB]" },
  { bg: "bg-[#8B5CF6]", ring: "ring-[#8B5CF6]" },
  { bg: "bg-[#DB2777]", ring: "ring-[#DB2777]" },
  { bg: "bg-[#475569]", ring: "ring-[#475569]" },
  { bg: "bg-[#EA580C]", ring: "ring-[#EA580C]" },
];

export default function ColorPicker() {
  return (
    <div className="max-w-md mx-auto px-4">
      <h2 className="text-gray-800 font-medium">Pick your favorite color</h2>

      <ul className="mt-4 flex items-center flex-wrap gap-4">
        {colors.map((item, idx) => {
          const id = `color-${idx}`;
          return (
            <li key={idx} className="flex-none">
              <label htmlFor={id} className="block relative w-8 h-8">
                <input
                  id={id}
                  type="radio"
                  name="color"
                  defaultChecked={idx === 1}
                  className="sr-only peer"
                  aria-label={`Choose ${item.bg}`}
                />

                {/* Color dot */}
                <span
                  className={`inline-flex justify-center items-center w-full h-full rounded-full peer-checked:ring ring-offset-2 cursor-pointer duration-150 ${item.bg} ${item.ring}`}
                />

                {/* Check icon (shown when selected) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-white absolute inset-0 m-auto z-0 pointer-events-none hidden peer-checked:block duration-150"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
