import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ReminderSchedulerProps {
  isRepeating: boolean;
  toggleRepeating: () => void;
  repeatInterval: string;
  setRepeatInterval: (interval: string) => void;
  daysOfWeek: string[];
}

const ReminderScheduler = ({
  isRepeating,
  toggleRepeating,
  repeatInterval,
  setRepeatInterval,
  daysOfWeek,
}) => {
  const selectedDays = isRepeating ? new Set(["Th", "Fr", "Su"]) : new Set(["Mo", "We", "Sa"]);
  
  return (
    <div className="mx-auto max-w-sm rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
      {/* Toggle Switch */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xl text-black">Is repeating</span>
        <Switch toggle={toggleRepeating} value={isRepeating} />
      </div>

      {/* Repeat Interval Dropdown */}
      <div
        className={`mb-4 flex justify-between transition-opacity duration-500 ease-in-out ${!isRepeating ? "opacity-40" : ""}`}
      >
        <label className="mt-5 text-slate-800">Repeat</label>
        <select
          disabled={!isRepeating}
          value={repeatInterval}
          onChange={(e) => setRepeatInterval(e.target.value)}
          className="focus:ring-border-gray-400 mt-2 block w-[70%] rounded-lg border border-gray-300 bg-white px-3 py-3 font-bold text-black shadow-sm focus:border-gray-100 focus:outline-none"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      {/* Day Selection */}
      <div className="flex items-center rounded-2xl bg-gray-100 p-4">
        <div className="grid grid-cols-7 justify-around gap-2">
          {daysOfWeek.map((day) => (
            <SwapText
              key={day}
              check={selectedDays.has(day)}
              initialText={day}
              finalText={day}
              supportsHover={false}
              initialTextClassName="w-[37px] h-[37px] item-center text-center opacity-50 text-sm text-black rounded-lg p-2"
              finalTextClassName="w-[37px] h-[37px] item-center text-center text-sm text-black bg-white rounded-lg p-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Switch = ({ toggle, value }) => {
  return (
    <label className="inline-flex cursor-pointer items-center">
      <input checked={value} type="checkbox" className="peer sr-only" onChange={toggle} />
      <div className="rtl:peer-checked:after:-translate-x-[unset] peer relative h-8 w-[53px] rounded-full bg-gray-200 transition-colors duration-500 after:absolute after:start-[5px] after:top-[4px] after:h-6 after:w-6 after:rounded-full after:border after:border-white after:bg-white after:transition-all after:duration-300 after:content-[''] peer-checked:bg-[#2eed24] peer-checked:after:translate-x-[19px] peer-checked:after:border-white"></div>
    </label>
  );
};

const SwapText = ({
  initialText,
  finalText,
  className = "",
  supportsHover = true,
  textClassName = "",
  initialTextClassName = "",
  finalTextClassName = "",
  disableClick = false,
  check = false,
  ...props
}) => {
  const [active, setActive] = useState(!check);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setActive((current) => !current);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [check]);
  
  const longWord = finalText.length > initialText.length ? finalText : null;
  
  return (
    <div {...props} className={`relative overflow-hidden ${className}`}>
      <div
        className={`group cursor-pointer select-none text-3xl font-bold ${textClassName}`}
        onClick={() => !disableClick && setActive((current) => !current)}
      >
        <motion.span
          className={`block flex flex-col ${initialTextClassName}`}
          animate={{
            y: active ? "-100%" : "0%"
          }}
          transition={{
            duration: 1,
            ease: [0.405, 0, 0.025, 1]
          }}
          whileHover={supportsHover ? { y: "-100%" } : {}}
        >
          {initialText}
          {Boolean(longWord?.length) && <span className="invisible h-0">{longWord}</span>}
        </motion.span>
        <motion.span
          className={`block absolute top-full ${finalTextClassName}`}
          animate={{
            y: active ? "-100%" : "0%"
          }}
          transition={{
            duration: 1,
            ease: [0.405, 0, 0.025, 1]
          }}
          whileHover={supportsHover ? { y: "-100%" } : {}}
        >
          {finalText}
        </motion.span>
      </div>
    </div>
  );
};

// Demo wrapper
export function Component() {
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatInterval, setRepeatInterval] = useState("Daily");
  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <ReminderScheduler
        isRepeating={isRepeating}
        toggleRepeating={() => setIsRepeating(!isRepeating)}
        repeatInterval={repeatInterval}
        setRepeatInterval={setRepeatInterval}
        daysOfWeek={daysOfWeek}
      />
    </div>
  );
}