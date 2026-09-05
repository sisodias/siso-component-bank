"use client";
import { useEffect } from "react";
import "../../index.css";
import gsap from "gsap";

// Declare a general timeline to use in all the animation functions.

const tl = gsap.timeline();

// Preloader Animation
export const preLoaderAnim = () => {
  tl.to(".texts-container", {
    duration: 0,
    opacity: 1,
    ease: "Power3.easeOut",
  })
    .from(".texts-container span", {
      duration: 1.5,
      delay: 1,
      y: 70,
      skewY: 10,
      stagger: 0.4,
      ease: "Power3.easeOut",
    })
    .to(".texts-container span", {
      duration: 1,
      y: 70,
      skewY: -20,
      stagger: 0.2,
      ease: "Power3.easeOut",
    })
    .to("body", {
      duration: 0.01,
      css: { overflowY: "scroll" },
      ease: "power3.inOut",
    })
    .from(".sub", {
      duration: 1,
      opacity: 0,
      y: 80,
      ease: "expo.easeOut",
    })
    .to(
      ".preloader",
      {
        duration: 1.5,
        height: "0vh",
        ease: "Power3.easeOut",
        onComplete: mobileLanding(),
      },
      "-=2"
    )
    .to(".preloader", {
      duration: 0,
      css: { display: "none" },
    });
};

export const mobileLanding = () => {
  window.innerWidth < 763 &&
    tl.from(".landing__main2", {
      duration: 1,
      delay: 0,
      opacity: 0,
      y: 80,
      ease: "expo.easeOut",
    });
};


export const Component = () => {
  useEffect(() => {
    preLoaderAnim();
  }, []);

  return (
    <div className="preloader gap-[5px] overflow-hidden text-[14px] sm:gap-[10px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
      <div className="texts-container w-500 flex h-60 items-center justify-center gap-[5px] overflow-hidden text-[14px] font-extrabold text-[#e4ded7] opacity-0 sm:gap-[10px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
        <span>Developer,</span>
        <span>Designer,</span>
        <span>Driller.</span>
        <div className="sub hidden"></div>
      </div>
    </div>
  );
};

