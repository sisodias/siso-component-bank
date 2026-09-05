"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

// simple utility like shadcn's `cn`
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

type ChipItem = {
  label: string;
  avatar?: string;   // image url
  initial?: string;  // fallback letter
  color?: "blue" | "green" | "gray";
  variant?: "filled" | "outlined";
};

interface AvatarChipsProps {
  chips: ChipItem[];
  className?: string;
  onChipClick?: (chip: ChipItem) => void;
}

const colorClasses: Record<
  string,
  { filled: string; outlined: string }
> = {
  blue: {
    filled: "!bg-blue-100 !text-blue-800 dark:!bg-blue-900 dark:!text-blue-100",
    outlined:
      "!border !border-blue-300 !text-blue-700 dark:!border-blue-600 dark:!text-blue-200",
  },
  green: {
    filled: "!bg-green-100 !text-green-800 dark:!bg-green-900 dark:!text-green-100",
    outlined:
      "!border !border-green-300 !text-green-700 dark:!border-green-600 dark:!text-green-200",
  },
  gray: {
    filled: "!bg-gray-100 !text-gray-800 dark:!bg-gray-800 dark:!text-gray-100",
    outlined:
      "!border !border-gray-300 !text-gray-700 dark:!border-gray-600 dark:!text-gray-200",
  },
};

function AvatarChips({ chips, className, onChipClick }: AvatarChipsProps) {
  return (
    <div
      className={cn(
        "flex w-full mx-auto items-center justify-between p-4 bg-white dark:bg-gray-900",
        className
      )}
    >
      <Stack direction="row" spacing={2}>
        {chips.map((chip, index) => (
          <Chip
            key={index}
            avatar={
              chip.avatar ? (
                <Avatar alt={chip.label} src={chip.avatar} />
              ) : (
                <Avatar>{chip.initial || chip.label.charAt(0)}</Avatar>
              )
            }
            label={chip.label}
            variant={chip.variant === "outlined" ? "outlined" : "filled"}
            onClick={() => onChipClick?.(chip)}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium transition-colors cursor-pointer",
              chip.color
                ? colorClasses[chip.color][chip.variant || "filled"]
                : ""
            )}
          />
        ))}
      </Stack>
    </div>
  );
}


export function AvatarChipsDemo() {
  const users = [
    { label: "Mathew", initial: "M", color: "blue" },
    {
      label: "Natacha",
      avatar: "/static/images/avatar/1.jpg",
      color: "gray",
      variant: "outlined",
    },
    {
      label: "Sophie",
      avatar: "/static/images/avatar/2.jpg",
      color: "green",
    },
  ];

  return (
    <div><AvatarChips
      chips={users}
      onChipClick={(chip) => alert(`Clicked on ${chip.label}`)}
    /></div>
  );
}
