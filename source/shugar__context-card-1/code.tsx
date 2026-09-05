import React, { useMemo } from "react";
import { Tooltip } from "react-tooltip";

interface ContextCardTriggerProps {
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

const ContextCardTrigger = ({
  content,
  side = "top",
  children
}: ContextCardTriggerProps) => {
  const id = useMemo(() => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }, []);

  return (
    <div>
      <style>
        {`
          :root {
            --context-card-border: #ebebeb
          }
          .dark {
            --context-card-border: #2e2e2e
          }
        `}
      </style>
      <div id={id} className="font-sans">{children}</div>
      <Tooltip
        anchorSelect={`#${id}`}
        place={side}
        opacity={1}
        border={"1px solid var(--context-card-border)"}
        className={`!font-sans !text-center !text-base !rounded-lg !bg-background-100 !text-gray-1000`}
      >
        {content}
      </Tooltip>
    </div>
  );
};

export const ContextCard = {
  Trigger: ContextCardTrigger
};
