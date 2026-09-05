import React, { useEffect, useMemo, useRef, useState } from "react";

const initialItems = [
  { id: 1, text: "Review Calendar PR (React/TS)", done: false },
  { id: 2, text: "Implement authentication in the email provider", done: true },
  { id: 3, text: "Refactor components in the Tauri/React 19 app", done: false },
  { id: 4, text: "Test image downloads in Novon", done: false },
  { id: 5, text: "Organize CSS and layouts", done: true },
  { id: 6, text: "Draft the apps roadmap", done: false },
];

const CONFETTI_COLORS = ["#10b981", "#f59e0b", "#6366f1", "#ef4444", "#06b6d4"];

export function TodoCard() {
  const [items, setItems] = useState(initialItems);
  const [dateInfo, setDateInfo] = useState({ date: "", time: "" });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setDateInfo({ date, time });
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleItem = (id: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const resetList = () => setItems(initialItems);

  const allDone = useMemo(() => items.length > 0 && items.every((i) => i.done), [items]);

  const [celebrating, setCelebrating] = useState(false);
  const wasAllDoneRef = useRef(false);

  useEffect(() => {
    if (allDone && !wasAllDoneRef.current) {
      setCelebrating(true);
      wasAllDoneRef.current = true;
      const t = setTimeout(() => setCelebrating(false), 4000);
      return () => clearTimeout(t);
    }
    if (!allDone) {
      wasAllDoneRef.current = false;
      setCelebrating(false);
    }
  }, [allDone]);

  const Header = (
    <div
      className={`flex items-center justify-between px-4 py-3 ${
        allDone
          ? "bg-gradient-to-b from-emerald-400 to-emerald-300"
          : "bg-gradient-to-b from-yellow-300 to-yellow-200"
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-sm font-semibold text-gray-900">{dateInfo.date}</span>
        <span className="bg-black/10 text-gray-800 text-xs font-medium px-2 py-1 rounded-md">
          {dateInfo.time}
        </span>
      </div>

      {allDone ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">All done!</span>
          <button
            onClick={resetList}
            className="text-gray-900 font-semibold text-xs px-2 py-1 rounded-md bg-white/60 hover:bg-white/80 transition"
          >
            Reset
          </button>
        </div>
      ) : (
        <button className="text-gray-900 font-semibold text-sm hover:text-gray-700">Done</button>
      )}
    </div>
  );

  return (
    <div
      className={`w-[380px] rounded-2xl shadow-lg border overflow-hidden bg-white transition-all duration-500 ${
        allDone ? "border-emerald-200 ring-2 ring-emerald-200 scale-[1.01]" : "border-slate-100"
      }`}
    >
      {Header}

      <div
        className={`relative p-5 ${
          allDone
            ? "bg-[radial-gradient(circle,rgba(16,185,129,0.08)_1px,transparent_1px)]"
            : "bg-[radial-gradient(circle,rgba(0,0,0,0.06)_1px,transparent_1px)]"
        } [background-size:10px_10px]`}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {allDone ? "You crushed it today" : "Things to do today"}
        </h3>

        {!allDone && (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className={`flex items-center gap-3 px-2 py-1 rounded-lg transition ${
                  item.done ? "bg-slate-100" : ""
                }`}
              >
                <label className="relative inline-flex items-center justify-center w-6 h-6">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleItem(item.id)}
                    className="peer appearance-none absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-md border transition-all duration-200 ease-out transform ${
                      item.done
                        ? "bg-gray-900 border-gray-900 scale-95"
                        : "border-gray-300 bg-white scale-100"
                    }`}
                  >
                    <svg
                      className={`w-3 h-3 text-white transition-opacity duration-200 ${
                        item.done ? "opacity-100" : "opacity-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 12 9"
                    >
                      <path d="M1 4.2L4 7L11 1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </label>

                <span
                  className={`text-sm transition-all duration-200 ${
                    item.done ? "font-semibold text-gray-900 translate-x-[2px]" : "text-gray-900"
                  }`}
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        )}

        {allDone && (
          <div className="relative">
            <p className="mt-1 text-sm text-gray-700 font-medium">Take a breather and celebrate!</p>
            {celebrating && <ConfettiOverlay />}
          </div>
        )}

        {!allDone && (
          <p className="mt-4 text-sm text-gray-700 font-medium">Keep up the great work today!</p>
        )}
      </div>
    </div>
  );
}

function ConfettiOverlay() {
  const pieces = Array.from({ length: 36 });
  return (
    <>
      <style>
        {`
        @keyframes confetti-fall {
          0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(80vh) rotate(720deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .confetti-piece { animation: none !important; }
        }
      `}
      </style>
      <div className="pointer-events-none fixed inset-0">
        {pieces.map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 0.5;
          const duration = 2.5 + Math.random() * 1.2;
          const size = 6 + Math.random() * 6;
          const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
          return (
            <span
              key={i}
              className="confetti-piece absolute rounded-sm"
              style={{
                left: `${left}%`,
                top: "-10px",
                width: `${size}px`,
                height: `${size * 0.4}px`,
                backgroundColor: color,
                transform: "translateY(0)",
                animation: `confetti-fall ${duration}s ease-in forwards`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
