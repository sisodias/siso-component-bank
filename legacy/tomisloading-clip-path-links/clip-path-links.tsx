import React from "react";
import {
  SiGoogle,
  SiTiktok,
  SiSpotify,
} from "react-icons/si";
import { FaDiscord } from "react-icons/fa";
import {
  Github,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Code,
} from "lucide-react";
import { useAnimate } from "framer-motion";

export const ClipPathLinks = () => {
  return (
    <div className="divide-y border divide-border border-border">
      <div className="grid grid-cols-2 divide-x divide-border">
        <LinkBox Icon={SiGoogle} href="https://mail.google.com/mail/u/0/?fs=1&to=kamalkamalesh316@gmail.com&tf=cm" />
        <LinkBox Icon={Github} href="https://github.com/kamaleshsa" />
      </div>
      <div className="grid grid-cols-4 divide-x divide-border">
        <LinkBox Icon={Twitter} href="https://x.com/Kamales71036733" />
        <LinkBox Icon={Linkedin} href="https://www.linkedin.com/in/kamaleshsa" />
        <LinkBox Icon={Instagram} href="https://www.instagram.com/k.a.m.a_l?igsh=ZmRzbXF6NTBwOXIw" />
        <LinkBox Icon={Facebook} href="https://www.facebook.com/share/16Zgo4MK6M/" />
      </div>
      <div className="grid grid-cols-3 divide-x divide-border">
        <LinkBox Icon={FaDiscord} href="https://discord.com/users/1367756111725334599" />
        <LinkBox
          href="https://21st.dev/kamaleshsa"
          className="h-6 w-auto object-contain"
          imgSrc="https://media.licdn.com/dms/image/v2/D4E0BAQH3Jqtih4t7-A/company-logo_200_200/B4EZY_fSK1HUAM-/0/1744821888382/21st_dev_logo?e=2147483647&v=beta&t=8hoDRfmpNQR3aqnKWef5U0bW9Mg2GCbgwvgeQ5MKaKU"
        />
        <LinkBox
          href="https://kamaleshsaportfolio.netlify.app/"
          className="h-8 w-auto object-contain"
          imgSrc="https://i.ibb.co/q36kg6qT/fotor-2025052503615.png"
        />
      </div>
    </div>
  );
};

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

const LinkBox = ({ Icon, href, imgSrc, className }) => {
  const [scope, animate] = useAnimate();

  const getNearestSide = (e) => {
    const box = e.target.getBoundingClientRect();

    const proximityToLeft = {
      proximity: Math.abs(box.left - e.clientX),
      side: "left",
    };
    const proximityToRight = {
      proximity: Math.abs(box.right - e.clientX),
      side: "right",
    };
    const proximityToTop = {
      proximity: Math.abs(box.top - e.clientY),
      side: "top",
    };
    const proximityToBottom = {
      proximity: Math.abs(box.bottom - e.clientY),
      side: "bottom",
    };

    const sortedProximity = [
      proximityToLeft,
      proximityToRight,
      proximityToTop,
      proximityToBottom,
    ].sort((a, b) => a.proximity - b.proximity);

    return sortedProximity[0].side;
  };

  const handleMouseEnter = (e) => {
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: ENTRANCE_KEYFRAMES[side],
    });
  };

  const handleMouseLeave = (e) => {
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: EXIT_KEYFRAMES[side],
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative grid h-20 w-full place-content-center sm:h-28 md:h-36 text-foreground bg-background"
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="custom icon"
          className={className ?? "max-h-10 sm:max-h-16 md:max-h-20 object-contain"}
        />
      ) : (
        <Icon className="text-xl sm:text-3xl md:text-4xl" />
      )}

      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 grid place-content-center bg-primary text-primary-foreground transition-colors duration-300"
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="custom icon hover"
            className={className ?? "max-h-10 sm:max-h-16 md:max-h-20 object-contain"}
          />
        ) : (
          <Icon className="text-xl sm:text-3xl md:text-4xl" />
        )}
      </div>
    </a>
  );
};
