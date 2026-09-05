
"use client";

import { cn } from "../_utils/cn";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronUpIcon,
  CommandIcon,
  DotIcon,
  GlobeIcon,
  LayoutPanelLeft,
  MicIcon,
  MoonIcon,
  OptionIcon,
  PauseIcon,
  SearchIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SunDimIcon,
  SunIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeIcon,
} from "lucide-react";
import React, { useState, useCallback, memo } from "react";
import { motion } from "motion/react";

const iconSize = 12;

// Extract types
type CustomKeyType = "FingerPrintKey" | "ArrowKeys";

interface IconKeyboardKeyProps {
  icon: string | React.ReactNode;
  text?: string | React.ReactNode;
  className?: string;
  isSingleKey?: boolean;
  custom?: CustomKeyType;
  index?: number;
  rowIndex?: number;
  isHovered?: boolean;
  isLastRow?: boolean;
  keySize?: number;
  transparentKey?: boolean;
  glowColor?: string;
  highlight: {
    startRow: number;
    startIndex: number;
    text: string[];
  }[];
}

interface GlowingKeyboardSvgProps {
  isAlwaysActive?: boolean;
  transparentKey?: boolean;
  keySize?: number;
  glowColor?: string;
  highlight: {
    startRow: number;
    startIndex: number;
    text: string[];
  }[];
}

type KeyRowDataProps = Omit<IconKeyboardKeyProps, "highlight">;

const GlowingKeyboard = memo(
  ({
    isAlwaysActive = false,
    transparentKey = true,
    keySize = 40,
    glowColor = "#f43f5d",
    highlight,
  }: GlowingKeyboardSvgProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="card-color flex w-[700px] flex-col gap-2 rounded-md p-2"
      >
        {keysData.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="flex flex-row gap-2">
              {row.map((item, index) => {
                if (item.custom === "FingerPrintKey") {
                  return (
                    <FingerPrintKey
                      key={index}
                      index={index}
                      rowIndex={rowIndex}
                      keySize={keySize}
                      transparentKey={transparentKey}
                    />
                  );
                }

                if (item.custom === "ArrowKeys") {
                  return (
                    <ArrowKeys
                      key={index}
                      index={index}
                      rowIndex={rowIndex}
                      highlight={highlight}
                    />
                  );
                }

                return (
                  <IconKeyboardKey
                    key={index}
                    index={index}
                    rowIndex={rowIndex}
                    text={item.text}
                    icon={item.icon}
                    className={item.className}
                    isSingleKey={item.isSingleKey}
                    isHovered={isAlwaysActive ? true : isHovered}
                    isLastRow={rowIndex === keysData.length - 1}
                    keySize={keySize}
                    transparentKey={transparentKey}
                    glowColor={glowColor}
                    highlight={highlight}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
);

GlowingKeyboard.displayName = "GlowingKeyboard";

const IconKeyboardKey = memo(
  ({
    icon,
    text,
    className,
    isSingleKey,
    index = 0,
    rowIndex = 0,
    isHovered,
    isLastRow,
    keySize,
    transparentKey,
    glowColor,
    highlight,
  }: IconKeyboardKeyProps) => {
    const data = getKeyData(highlight, index, text, isHovered, rowIndex);

    return (
      <motion.div
        variants={{
          initial: { borderColor: "#212121" },
          animate: {
            borderColor: ["#212121", "#383838", "#212121"],
          },
        }}
        initial="initial"
        animate="animate"
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          delay: index * 0.1 + rowIndex * 0.12,
        }}
        style={{
          width: `${keySize}px`,
          height: `${keySize}px`,
          minWidth: `${keySize}px`,
          flexBasis: `${keySize}px`,
          color: data.shouldGlow ? `${glowColor}50` : "#212121",
        }}
        className={cn(
          className,
          data.shouldGlow
            ? "animate-[6000ms] glowing-key"
            : "hover:!border-white/20",
          "shadow-[inset_0px_0px_15px_rgba(0,0,0,0.2)] group relative flex select-none flex-col items-center justify-center gap-1.5 rounded-md border border-x-[1px] border-b-[0.1px] border-t-[1.5px] border-border/80 px-2 duration-200 first:items-start last:items-end active:!scale-[0.98]",
          transparentKey ? "bg-transparent" : "bg-[#121214]"
        )}
      >
        {!isSingleKey && (
          <div className="mt-0.5 h-[10px] w-[10px] text-center text-xs font-light text-muted-foreground/70 duration-200 group-hover:text-muted-foreground">
            {icon}
          </div>
        )}
        <div
          style={{
            color: data.shouldGlow ? glowColor : "",
          }}
          className={cn(
            isLastRow && "!text-[8px]",
            isSingleKey ? "text-sm" : "text-xs",
            data.shouldGlow &&
              "animate-[6000ms] drop-shadow-[2px_2px_8px_#f43f5d] blur-in",
            "text-center text-muted-foreground/70 duration-200 group-hover:text-white/60"
          )}
        >
          {data.text}
        </div>
      </motion.div>
    );
  }
);

IconKeyboardKey.displayName = "IconKeyboardKey";

const getKeyData = (
  highlight: {
    startRow: number;
    startIndex: number;
    text: string[];
  }[],
  index: number,
  text?: string | null | React.ReactNode,
  isHovered?: boolean,
  rowIndex?: number
) => {
  const isText = typeof text === "string";
  const modifiedKeysData = {
    text,
    shouldGlow: false,
  };

  for (const element of highlight) {
    if (element.text[index - element.startIndex] === "") {
      continue;
    }

    if (
      isText &&
      isHovered &&
      rowIndex === element.startRow &&
      index >= element.startIndex &&
      index <= element.startIndex + element.text.length - 1
    ) {
      modifiedKeysData.shouldGlow = true;
      modifiedKeysData.text = element.text[index - element.startIndex];
      break;
    }
  }

  return modifiedKeysData;
};

const FingerPrintKey = memo(
  ({
    index,
    rowIndex,
    keySize,
    transparentKey,
  }: {
    index: number;
    rowIndex: number;
    keySize: number;
    transparentKey: boolean;
  }) => {
    return (
      <motion.div
        variants={{
          initial: { borderColor: "#212121" },
          animate: {
            borderColor: ["#212121", "#383838", "#212121"],
          },
        }}
        initial="initial"
        animate="animate"
        transition={{
          duration: 0.6,
          ease: "easeInOut",
          delay: index * 0.1 + rowIndex * 0.12,
        }}
        style={{
          width: `${keySize}px`,
          height: `${keySize}px`,
          minWidth: `${keySize}px`,
        }}
        className={cn(
          "shadow-[inset_0px_0px_15px_rgba(0,0,0,0.2)] group relative flex flex-col items-center justify-center gap-1.5 rounded-md border border-x-[1px] border-b-[0.1px] border-t-[1.5px] border-border/80 duration-200 hover:border-white/20",
          transparentKey ? "bg-transparent" : "bg-[#121214]"
        )}
      >
        <div className="shadow-[inset_0px_0px_2px_rgba(0,0,0,0.6)] h-8 w-8 rounded-full bg-muted/20 duration-200 group-hover:bg-muted/35" />
      </motion.div>
    );
  }
);

FingerPrintKey.displayName = "FingerPrintKey";

const ArrowKeys = memo(
  ({
    index,
    rowIndex,
    highlight,
  }: {
    index: number;
    rowIndex: number;
    highlight: {
      startRow: number;
      startIndex: number;
      text: string[];
    }[];
  }) => {
    return (
      <div className="flex flex-row gap-2">
        <IconKeyboardKey
          index={index}
          rowIndex={rowIndex}
          isSingleKey
          className="!h-1/2 translate-y-5 !items-center"
          icon={null}
          text={<ArrowLeftIcon size={iconSize} />}
          highlight={highlight}
        />
        <div className="flex h-10 flex-col">
          <IconKeyboardKey
            isSingleKey
            index={index}
            rowIndex={rowIndex}
            className="!h-1/2 !items-center !rounded-b-none"
            icon={null}
            text={<ArrowUpIcon size={iconSize} />}
            highlight={highlight}
          />
          <IconKeyboardKey
            isSingleKey
            index={index}
            rowIndex={rowIndex}
            className="!h-1/2 !items-center !rounded-t-none"
            icon={null}
            text={<ArrowDownIcon size={iconSize} />}
            highlight={highlight}
          />
        </div>
        <IconKeyboardKey
          isSingleKey
          index={index}
          rowIndex={rowIndex}
          className="!h-1/2 translate-y-5 !items-center"
          icon={null}
          text={<ArrowRightIcon size={iconSize} />}
          highlight={highlight}
        />
      </div>
    );
  }
);

ArrowKeys.displayName = "ArrowKeys";

export { GlowingKeyboard };

const firstRowData: KeyRowDataProps[] = [
  {
    icon: null,
    text: "esc",
    className: "!basis-full",
  },
  {
    icon: <SunDimIcon size={iconSize} />,
    text: "F1",
  },
  {
    icon: <SunIcon size={iconSize} />,
    text: "F2",
  },
  {
    icon: <LayoutPanelLeft size={iconSize} />,
    text: "F3",
  },
  {
    icon: <SearchIcon size={iconSize} />,
    text: "F4",
  },
  {
    icon: <MicIcon size={iconSize} />,
    text: "F5",
  },
  {
    icon: <MoonIcon size={iconSize} />,
    text: "F6",
  },
  {
    icon: <SkipBackIcon size={iconSize} />,
    text: "F7",
  },
  {
    icon: <PauseIcon size={iconSize} />,
    text: "F8",
  },
  {
    icon: <SkipForwardIcon size={iconSize} />,
    text: "F9",
  },
  {
    icon: <VolumeIcon size={iconSize} />,
    text: "F10",
  },
  {
    icon: <Volume1Icon size={iconSize} />,
    text: "F11",
  },
  {
    icon: <Volume2Icon size={iconSize} />,
    text: "F12",
  },
  {
    custom: "FingerPrintKey",
    icon: null,
  },
];

const secondRowData: KeyRowDataProps[] = [
  {
    icon: "~",
    text: "`",
    className: "first:!items-center",
  },
  {
    icon: "!",
    text: "1",
  },
  {
    icon: "@",
    text: "2",
  },
  {
    icon: "#",
    text: "3",
  },
  {
    icon: "$",
    text: "4",
  },
  {
    icon: "%",
    text: "5",
  },
  {
    icon: "^",
    text: "6",
  },
  {
    icon: "&",
    text: "7",
  },
  {
    icon: "*",
    text: "8",
  },
  {
    icon: "(",
    text: "9",
  },
  {
    icon: ")",
    text: "0",
  },
  {
    icon: "_",
    text: "-",
  },
  {
    icon: "+",
    text: "=",
  },
  {
    icon: null,
    text: "delete",
    className: "!basis-full",
  },
];

const thirdRowData: KeyRowDataProps[] = [
  {
    icon: null,
    text: "tab",
    className: "!basis-full",
  },
  {
    icon: "q",
    text: "Q",
    isSingleKey: true,
  },
  {
    icon: "w",
    text: "W",
    isSingleKey: true,
  },
  {
    icon: "e",
    text: "E",
    isSingleKey: true,
  },
  {
    icon: "r",
    text: "R",
    isSingleKey: true,
  },
  {
    icon: "t",
    text: "T",
    isSingleKey: true,
  },
  {
    icon: "y",
    text: "Y",
    isSingleKey: true,
  },
  {
    icon: "u",
    text: "U",
    isSingleKey: true,
  },
  {
    icon: "i",
    text: "I",
    isSingleKey: true,
  },
  {
    icon: "o",
    text: "O",
    isSingleKey: true,
  },
  {
    icon: "p",
    text: "P",
    isSingleKey: true,
  },
  {
    icon: "{",
    text: "[",
  },
  {
    icon: "}",
    text: "]",
  },
  {
    icon: "|",
    text: "/",
    className: "last:!items-center",
  },
];

const fourthRowData: KeyRowDataProps[] = [
  {
    icon: <DotIcon size={iconSize + 3} className="-ml-1.5 -mt-0.5" />,
    text: "caps lock",
    className: "!basis-full",
  },
  {
    icon: "a",
    text: "A",
    isSingleKey: true,
  },
  {
    icon: "s",
    text: "S",
    isSingleKey: true,
  },
  {
    icon: "d",
    text: "D",
    isSingleKey: true,
  },
  {
    icon: "f",
    text: "F",
    isSingleKey: true,
  },
  {
    icon: "g",
    text: "G",
    isSingleKey: true,
  },
  {
    icon: "h",
    text: "H",
    isSingleKey: true,
  },
  {
    icon: "j",
    text: "J",
    isSingleKey: true,
  },
  {
    icon: "k",
    text: "K",
    isSingleKey: true,
  },
  {
    icon: "l",
    text: "L",
    isSingleKey: true,
  },
  {
    icon: ":",
    text: ";",
  },
  {
    icon: '"',
    text: "'",
  },
  {
    icon: null,
    text: "return",
    className: "!basis-full",
  },
];

const fifthRowData: KeyRowDataProps[] = [
  {
    icon: null,
    text: "shift",
    className: "!basis-full",
  },
  {
    icon: "z",
    text: "Z",
    isSingleKey: true,
  },
  {
    icon: "x",
    text: "X",
    isSingleKey: true,
  },
  {
    icon: "c",
    text: "C",
    isSingleKey: true,
  },
  {
    icon: "v",
    text: "V",
    isSingleKey: true,
  },
  {
    icon: "b",
    text: "B",
    isSingleKey: true,
  },
  {
    icon: "n",
    text: "N",
    isSingleKey: true,
  },
  {
    icon: "m",
    text: "M",
    isSingleKey: true,
  },
  {
    icon: "<",
    text: ",",
  },
  {
    icon: ">",
    text: ".",
  },
  {
    icon: "?",
    text: "/",
  },
  {
    icon: null,
    text: "shift",
    className: "!basis-full",
  },
];

const sixthRowData: KeyRowDataProps[] = [
  {
    icon: "fn",
    text: <GlobeIcon size={iconSize} />,
  },
  {
    icon: <ChevronUpIcon size={iconSize} />,
    text: "control",
    className: "!items-end",
  },
  {
    icon: <OptionIcon size={iconSize} />,
    text: "option",
    className: "!items-end",
  },
  {
    icon: <CommandIcon size={iconSize} />,
    text: "command",
    className: "!items-end !basis-20",
  },
  {
    icon: null,
    text: "",
    className: "!basis-80",
  },
  {
    icon: <CommandIcon size={iconSize} />,
    text: "command",
    className: "!items-start !basis-20",
  },
  {
    icon: <OptionIcon size={iconSize} />,
    text: "option",
    className: "!items-start",
  },
  {
    icon: null,
    custom: "ArrowKeys",
  },
];

const keysData = [
  firstRowData,
  secondRowData,
  thirdRowData,
  fourthRowData,
  fifthRowData,
  sixthRowData,
];

