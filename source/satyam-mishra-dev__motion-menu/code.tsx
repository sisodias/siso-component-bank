import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface MenuItemData {
  link: string;
  text: string;
  image: string;
}

interface MenuItemProps extends MenuItemData {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  isFirst: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isFirst,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): "top" | "bottom" => {
    const topEdgeDist =
      Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist =
      Math.pow(mouseX - width / 2, 2) +
      Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent =
        marqueeInnerRef.current.querySelector(
          ".marquee-part"
        ) as HTMLElement;
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed =
        Math.ceil(viewportWidth / contentWidth) + 2;

      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);

    return () =>
      window.removeEventListener("resize", calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent =
        marqueeInnerRef.current.querySelector(
          ".marquee-part"
        ) as HTMLElement;

      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) animationRef.current.kill();

      animationRef.current = gsap.to(
        marqueeInnerRef.current,
        {
          x: -contentWidth,
          duration: speed,
          ease: "none",
          repeat: -1,
        }
      );
    };

    const timer = setTimeout(setupMarquee, 50);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) animationRef.current.kill();
    };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = (
    ev: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    gsap
      .timeline({ defaults: animationDefaults })
      .set(
        marqueeRef.current,
        { y: edge === "top" ? "-101%" : "101%" },
        0
      )
      .set(
        marqueeInnerRef.current,
        { y: edge === "top" ? "101%" : "-101%" },
        0
      )
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0);
  };

  const handleMouseLeave = (
    ev: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    gsap
      .timeline({ defaults: animationDefaults })
      .to(
        marqueeRef.current,
        { y: edge === "top" ? "-101%" : "101%" },
        0
      )
      .to(
        marqueeInnerRef.current,
        { y: edge === "top" ? "101%" : "-101%" },
        0
      );
  };

  return (
    <div
      ref={itemRef}
      className="flex-1 relative overflow-hidden text-center"
      style={{
        borderTop: isFirst ? "none" : `1px solid ${borderColor}`,
      }}
    >
      <a
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-[4vh]"
        style={{ color: textColor }}
      >
        {text}
      </a>

      <div
        ref={marqueeRef}
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%]"
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div ref={marqueeInnerRef} className="h-full w-fit flex">
          {[...Array(repetitions)].map((_, idx) => (
            <div
              key={idx}
              className="marquee-part flex items-center flex-shrink-0"
              style={{ color: marqueeTextColor }}
            >
              <span className="whitespace-nowrap uppercase font-normal text-[4vh] leading-[1] px-[1vw]">
                {text}
              </span>
              <div
                className="w-[200px] h-[7vh] my-[2em] mx-[2vw] py-[1em] rounded-[50px] bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ✅ MAIN EXPORT (your required format)
export const Component = () => {
  const items: MenuItemData[] = [
    {
      text: "Home",
      link: "#",
      image: "https://picsum.photos/300/200",
    },
    {
      text: "About",
      link: "#",
      image: "https://picsum.photos/300/201",
    },
    {
      text: "Work",
      link: "#",
      image: "https://picsum.photos/300/202",
    },
  ];

  return (
    <div
      className={cn("w-full h-screen overflow-hidden")}
      style={{ backgroundColor: "#060010" }}
    >
      <nav className="flex flex-col h-full">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={15}
            textColor="#fff"
            marqueeBgColor="#fff"
            marqueeTextColor="#060010"
            borderColor="#fff"
            isFirst={idx === 0}
          />
        ))}
      </nav>
    </div>
  );
};