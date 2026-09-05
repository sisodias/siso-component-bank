// component.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export interface PasswordConfirmInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  passwordToMatch: string;
  value: string;
  onChange: (value: string) => void;
  inputPlaceholder?: string;
}

const PasswordConfirmInput = React.forwardRef<
  HTMLDivElement,
  PasswordConfirmInputProps
>(
  (
    {
      passwordToMatch,
      value,
      onChange,
      inputPlaceholder = "Confirm Password",
      className,
      ...props
    },
    ref
  ) => {
    const [shake, setShake] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        value.length >= passwordToMatch.length &&
        e.target.value.length > value.length
      ) {
        setShake(true);
      } else {
        onChange(e.target.value);
      }
    };

    useEffect(() => {
      if (shake) {
        const timer = setTimeout(() => setShake(false), 500);
        return () => clearTimeout(timer);
      }
    }, [shake]);

    const getLetterStatus = (letter: string, index: number) => {
      if (!value[index]) return "";
      return value[index] === letter ? "bg-green-500/20" : "bg-red-500/20";
    };

    const passwordsMatch = passwordToMatch === value;

    const bounceAnimation = {
      x: shake ? [-10, 10, -10, 10, 0] : 0,
      transition: { duration: 0.5 },
    };

    const matchAnimation = {
      scale: passwordsMatch ? [1, 1.05, 1] : 1,
      transition: { duration: 0.3 },
    };

    const borderAnimation = {
      borderColor: passwordsMatch
        ? "rgb(16 185 129)"
        : "rgb(226 232 240)",
      transition: { duration: 0.3 },
    };

    return (
      <div
        ref={ref}
        className={`flex w-full flex-col items-start justify-center text-slate-900 ${className}`}
        {...props}
      >
        <span className="text-sm font-semibold">→ {passwordToMatch}</span>
        <motion.div
          className="mb-3 mt-1 h-[52px] w-full rounded-xl border-2 border-slate-200 bg-white px-2 py-2"
          animate={{ ...bounceAnimation, ...matchAnimation, ...borderAnimation }}
        >
          <div className="relative h-full w-fit overflow-hidden rounded-lg">
            <div className="z-10 flex h-full items-center justify-center bg-transparent px-0 py-1 tracking-[0.15em]">
              {passwordToMatch.split("").map((_, index) => (
                <div
                  key={index}
                  className="flex h-full w-4 shrink-0 items-center justify-center"
                >
                  <span className="size-[5px] rounded-full bg-black"></span>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 z-0 flex h-full w-full items-center justify-start">
              {passwordToMatch.split("").map((letter, index) => (
                <motion.div
                  key={index}
                  className={`ease absolute h-full w-4 transition-all duration-300 ${getLetterStatus(
                    letter,
                    index
                  )}`}
                  style={{
                    left: `${index * 16}px`,
                    scaleX: value[index] ? 1 : 0,
                    transformOrigin: "left",
                  }}
                ></motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="h-[52px] w-full overflow-hidden rounded-xl"
          animate={matchAnimation}
        >
          <motion.input
            className="h-full w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-3 tracking-[0.4em] text-slate-900 outline-none placeholder:tracking-normal placeholder:text-slate-400 focus:border-slate-900"
            type="password"
            placeholder={inputPlaceholder}
            value={value}
            onChange={handleInputChange}
            animate={borderAnimation}
          />
        </motion.div>
      </div>
    );
  }
);

PasswordConfirmInput.displayName = "PasswordConfirmInput";

export default PasswordConfirmInput;