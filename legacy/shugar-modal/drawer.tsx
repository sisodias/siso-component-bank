import React, { useRef } from "react";
import clsx from "clsx";
import { useClickOutside } from "./use-click-outside";
import { Material } from "./material-1";

interface DrawerProps {
  height?: number;
  onDismiss: () => void;
  show: boolean;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ height, onDismiss, show, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onDismiss);

  return (
    <>
      <div className={clsx(
        "fixed top-0 left-0 w-full h-full bg-overlay z-[99999] duration-300",
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
      </div>
      <Material
        type="menu"
        className={clsx(
          "fixed bottom-0 left-0 w-full max-h-full overflow-y-auto hide-scrollbar bg-background-100 shadow-lg transition-transform duration-300 z-[999999] rounded-t-lg rounded-b-none",
          show ? "translate-y-0" : "translate-y-full"
        )}
        style={{ height }}
        ref={ref}
      >
        <div>{children}</div>
      </Material>
    </>
  );
};
