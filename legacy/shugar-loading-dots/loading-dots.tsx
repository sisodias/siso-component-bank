import React from "react";

interface LoadingDotsProps {
  size?: number;
  children?: React.ReactNode;
}

const dots = [
  { animationDelay: "0s" },
  { animationDelay: "0.2s", marginLeft: 1 },
  { animationDelay: "0.4s", marginLeft: 1 },
]

export const LoadingDots = ({ size = 2, children }: LoadingDotsProps) => {
  return (
    <span className="inline-flex items-center">
      {children && <div className="mr-3">{children}</div>}
      {dots.map((dot) => (
        <span
          className="bg-gray-900 inline-block rounded-[50%] animate-loading"
          style={{ height: size, width: size, ...dot }}
        />
      ))}
    </span>
  );
};