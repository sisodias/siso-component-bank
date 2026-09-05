import React from "react";
import clsx from "clsx";

interface KbdProps {
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  ctrl?: boolean;
  small?: boolean;
  children?: React.ReactNode;
}

export const Kbd = ({ meta, shift, alt, ctrl, small, children }: KbdProps) => {
  return (
    <kbd className={clsx(
      "bg-background-100 text-gray-1000 border border-gray-alpha-400 inline-block text-center ml-1 leading-[1.7em] rounded font-sans space-x-1",
      small ? "text-[.75rem] min-h-5 min-w-5 px-1" : "text-[.875rem] min-w-6 min-h-6 px-1.5"
    )}>
      {meta && <span className="min-w-[1em] inline-block">⌘</span>}
      {shift && <span className="min-w-[1em] inline-block">⇧</span>}
      {alt && <span className="min-w-[1em] inline-block">⌥</span>}
      {ctrl && <span className="min-w-[1em] inline-block">⌃</span>}
      {children && <span className="min-w-[1em] inline-block">{children}</span>}
    </kbd>
  );
};