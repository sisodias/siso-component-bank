import { useState } from "react";
import Link from "next/link";
import { cn } from "../_utils/cn";

type MenuItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
};

type ComponentProps = {
  menuItems: MenuItem[];
  iconColor?: string;
  backgroundColor?: string;
  animationDuration?: number;
  togglerSize?: number;
};

const MenuToggler = ({
  isOpen,
  onChange,
  backgroundColor,
  iconColor,
  animationDuration,
  togglerSize,
  iconSize,
}: {
  isOpen: boolean;
  onChange: () => void;
  backgroundColor: string;
  iconColor: string;
  animationDuration: number;
  togglerSize: number;
  iconSize: number;
}) => {
  const lineHeight = iconSize * 0.1;
  const lineWidth = iconSize * 0.8;
  const lineSpacing = iconSize * 0.25;

  return (
    <>
      <input
        id="menu-toggler"
        type="checkbox"
        checked={isOpen}
        onChange={onChange}
        className="absolute inset-0 z-10 m-auto cursor-pointer opacity-0"
        style={{ width: togglerSize, height: togglerSize }}
      />
      <label
        htmlFor="menu-toggler"
        className="absolute inset-0 z-20 m-auto flex cursor-pointer items-center justify-center rounded-full transition-all"
        style={{
          backgroundColor,
          color: iconColor,
          transitionDuration: `${animationDuration}ms`,
          width: togglerSize,
          height: togglerSize,
        }}
      >
        <span
          className="relative flex flex-col items-center justify-center"
          style={{ width: iconSize, height: iconSize }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(`absolute bg-current transition-all`, {
                "opacity-0": isOpen && i === 0,
                "rotate-45": isOpen && i === 1,
                "-rotate-45": isOpen && i === 2,
              })}
              style={{
                transitionDuration: `${animationDuration}ms`,
                width: lineWidth,
                height: lineHeight,
                top: isOpen
                  ? `calc(50% - ${lineHeight / 2}px)`
                  : `calc(50% + ${(i - 1) * lineSpacing}px - ${lineHeight / 2}px)`,
              }}
            />
          ))}
        </span>
      </label>
    </>
  );
};

const MenuItem = ({
  item,
  index,
  isOpen,
  iconColor,
  backgroundColor,
  animationDuration,
  itemCount,
  itemSize,
  iconSize,
}: {
  item: MenuItem;
  index: number;
  isOpen: boolean;
  iconColor: string;
  backgroundColor: string;
  animationDuration: number;
  itemCount: number;
  itemSize: number;
  iconSize: number;
}) => {
  const Icon = item.icon;
  return (
    <li
      className={cn(`absolute inset-0 m-auto transition-all`, { "opacity-100": isOpen, "opacity-0": !isOpen })}
      style={{
        width: itemSize,
        height: itemSize,
        transform: isOpen
          ? `rotate(${(360 / itemCount) * index}deg) translateX(-${itemSize + 30}px)`
          : "none",
        transitionDuration: `${animationDuration}ms`,
      }}
    >
      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(`flex h-full w-full items-center justify-center rounded-full opacity-60 transition-all duration-100 group hover:scale-125 hover:opacity-100`, {
          "pointer-events-auto": isOpen,
          "pointer-events-none": !isOpen,
        })}
        style={{
          backgroundColor,
          color: iconColor,
          transform: `rotate(-${(360 / itemCount) * index}deg)`,
          transitionDuration: `${animationDuration}ms`,
        }}
      >
        <Icon
          className="transition-transform duration-200 group-hover:scale-125"
          style={{ width: iconSize, height: iconSize }}
        />
      </Link>
    </li>
  );
};

export const Component = ({
  menuItems,
  iconColor = "white",
  backgroundColor = "rgba(255, 255, 255, 0.2)",
  animationDuration = 500,
  togglerSize = 40,
}: ComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = menuItems.length;
  const itemSize = togglerSize * 2;
  const iconSize = Math.max(24, Math.floor(togglerSize * 0.6));

  return (
    <nav className="relative min-h-64" style={{ width: togglerSize * 3, height: togglerSize * 3 }}>
      <MenuToggler
        isOpen={isOpen}
        onChange={() => setIsOpen(!isOpen)}
        backgroundColor={backgroundColor}
        iconColor={iconColor}
        animationDuration={animationDuration}
        togglerSize={togglerSize}
        iconSize={iconSize}
      />
      <ul className="absolute inset-0 m-0 h-full w-full list-none p-0">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            index={index}
            isOpen={isOpen}
            iconColor={iconColor}
            backgroundColor={backgroundColor}
            animationDuration={animationDuration}
            itemCount={itemCount}
            itemSize={itemSize}
            iconSize={iconSize}
          />
        ))}
      </ul>
    </nav>
  );
};