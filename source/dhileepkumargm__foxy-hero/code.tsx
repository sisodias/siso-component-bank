import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FoxyHeroProps {
  logo?: {
    icon?: React.ReactNode;
    text: string;
  };
  navigation?: Array<{
    label: string;
    isActive?: boolean;
    onClick?: () => void;
  }>;
  headerCta?: {
    label: string;
    onClick: () => void;
  };
  title: string;
  subtitle: string;
  ctaButtons?: {
    primary: {
      label: string;
      onClick: () => void;
    };
    secondary: {
      label: string;
      onClick: () => void;
    };
  };
  dashboardImage?: string;
  className?: string;
  children?: React.ReactNode;
}

export function FoxyHero({
  logo = { text: "Foxy" },
  navigation = [
    { label: "Home", isActive: true },
    { label: "Features" },
    { label: "Pricing" },
    { label: "Blogs" },
    { label: "Contact" },
  ],
  headerCta,
  title,
  subtitle,
  ctaButtons,
  dashboardImage,
  className,
  children,
}: FoxyHeroProps) {
  // Generate star particles
  const starParticles = Array.from({ length: 13 }, (_, i) => ({
    id: i,
    left: [966, 959, 998, 1006, 1018, 953, 941, 901, 841, 864, 908, 926, 957][i],
    top: [17, 49, 105, 61, 149, 168, 223, 250, 208, 153, 151, 93, 86][i],
  }));

  // Generate horizontal star particles
  const horizontalStars = Array.from({ length: 13 }, (_, i) => ({
    id: i,
    left: [473, 527, 623, 548, 699, 731, 826, 872, 800, 706, 702, 603, 591][i],
    top: [544, 551, 512, 504, 492, 557, 569, 609, 669, 646, 602, 584, 553][i],
  }));

  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex flex-col items-center overflow-hidden",
        className
      )}
      style={{ background: "#0C0414" }}
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Grid/Mask */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <rect
            width="100%"
            height="100%"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1.4155"
          />
        </svg>
      </div>

      {/* Purple Ambient Light - Large */}
      <motion.div
        className="absolute"
        style={{
          width: "1151px",
          height: "1024px",
          left: "119px",
          top: "0px",
          background: "rgba(50, 0, 86, 0.6)",
          filter: "blur(250px)",
          borderRadius: "50%",
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Top Light Effect Group */}
      <div
        className="absolute"
        style={{
          width: "451.95px",
          height: "476.87px",
          left: "754px",
          top: "-132px",
        }}
      >
        {/* Light Beams */}
        <motion.div
          className="absolute"
          style={{
            width: "204px",
            height: "348.5px",
            left: "46px",
            top: "47px",
            background: "linear-gradient(180deg, #C069FF 0%, rgba(192, 105, 255, 0) 100%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(10.5px)",
            transform: "rotate(13.39deg)",
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute"
          style={{
            width: "204px",
            height: "348.5px",
            left: "137.95px",
            top: "62.98px",
            background: "linear-gradient(180deg, #C069FF 0%, rgba(192, 105, 255, 0) 100%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(10.5px)",
            transform: "rotate(13.33deg)",
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute"
          style={{
            width: "204px",
            height: "348.5px",
            left: "122px",
            top: "86px",
            background: "linear-gradient(180deg, #C069FF 0%, rgba(192, 105, 255, 0) 100%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(10.5px)",
            transform: "rotate(6.01deg)",
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Purple Glow Ellipse */}
        <motion.div
          className="absolute"
          style={{
            width: "264.72px",
            height: "397.88px",
            left: "0px",
            top: "0px",
            background: "rgba(192, 105, 255, 0.5)",
            filter: "blur(125px)",
            transform: "rotate(37.4deg)",
            borderRadius: "50%",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small Center Glow */}
        <div
          className="absolute"
          style={{
            width: "100px",
            height: "100px",
            left: "175px",
            top: "206px",
            background: "#D9D9D9",
            filter: "blur(75px)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Star Particles - Vertical Group */}
      {starParticles.map((star, index) => (
        <motion.div
          key={`star-v-${star.id}`}
          className="absolute"
          style={{
            width: "2px",
            height: "2px",
            left: `${star.left}px`,
            top: `${star.top}px`,
            background:
              index >= 6
                ? "linear-gradient(180deg, #C069FF 0%, rgba(192, 105, 255, 0) 100%)"
                : "linear-gradient(180deg, rgba(192, 105, 255, 0.5) 0%, rgba(192, 105, 255, 0) 100%)",
            borderRadius: "50%",
            boxShadow: "0 0 4px rgba(192, 105, 255, 0.8)",
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-row justify-center items-center px-4"
        style={{
          width: "min(1196px, 95vw)",
          gap: "clamp(20px, 10vw, 217px)",
          marginTop: "28px",
        }}
      >
        {/* Logo */}
        <div className="flex flex-row justify-center items-center" style={{ gap: "7px" }}>
          {logo.icon}
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: "24px",
              lineHeight: "29px",
              color: "#FFFFFF",
              filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
            }}
          >
            {logo.text}
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex flex-row items-center" style={{ gap: "28px" }} aria-label="Main navigation">
          {navigation.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="transition-opacity hover:opacity-100"
              style={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "24px",
                lineHeight: "29px",
                color: item.isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
                opacity: item.isActive ? 1 : 0.5,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Header CTA */}
        {headerCta && (
          <button
            onClick={headerCta.onClick}
            className="flex flex-row justify-center items-center transition-all hover:scale-105"
            style={{
              padding: "6px 16px",
              width: "160px",
              height: "41px",
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.2) 100%), #551A94",
              borderRadius: "100px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "29px",
              color: "#FFFFFF",
            }}
          >
            {headerCta.label}
          </button>
        )}
      </motion.header>

      {/* Center Content */}
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          {children}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 flex flex-col items-center px-4"
          style={{
            width: "min(810px, 90vw)",
            gap: "41px",
            marginTop: "145px",
          }}
        >
          {/* Title and Subtitle */}
          <div className="flex flex-col items-center" style={{ width: "100%", gap: "0px" }}>
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center"
              style={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: "1.2",
                background: "linear-gradient(91.84deg, #231233 -12.23%, #F4DFFF 66.73%, #231233 119.29%), #F4DFFF",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-center"
              style={{
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "clamp(16px, 2vw, 20px)",
                lineHeight: "1.2",
                background: "linear-gradient(91.3deg, #231233 -10.75%, #F4DFFF 13.44%, #F4DFFF 96.07%, #231233 103.03%), #F4DFFF",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginTop: "10px",
              }}
            >
              {subtitle}
            </motion.p>
          </div>

          {/* CTA Buttons */}
          {ctaButtons && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-row items-center"
              style={{ gap: "34px" }}
            >
              <button
                onClick={ctaButtons.primary.onClick}
                className="flex flex-row justify-center items-center transition-all hover:scale-105"
                style={{
                  padding: "6px 16px",
                  width: "160px",
                  height: "41px",
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.2) 100%), #551A94",
                  borderRadius: "100px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "24px",
                  lineHeight: "29px",
                  color: "#FFFFFF",
                }}
              >
                {ctaButtons.primary.label}
              </button>
              <button
                onClick={ctaButtons.secondary.onClick}
                className="flex flex-row justify-center items-center transition-all hover:scale-105"
                style={{
                  padding: "6px 16px",
                  width: "250px",
                  height: "41px",
                  borderRadius: "100px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "24px",
                  lineHeight: "29px",
                  color: "#FFFFFF",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {ctaButtons.secondary.label}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Dashboard Section with Light Effects */}
      {dashboardImage && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="relative z-10"
          style={{
            width: "min(1100px, 90vw)",
            height: "auto",
            marginTop: "clamp(100px, 15vh, 280px)",
          }}
        >
          {/* Bottom Grid Mask */}
          <svg
            width="100%"
            height="auto"
            style={{
              position: "absolute",
              top: "-150px",
              left: "-200px",
              width: "calc(100% + 400px)",
              height: "auto",
              pointerEvents: "none",
            }}
          >
            <rect
              width="100%"
              height="100%"
              fill="none"
              stroke="rgba(255, 255, 255, 0.47)"
              strokeWidth="1.4155"
            />
          </svg>

          {/* Purple Glow Effects Behind Dashboard */}
          <div className="absolute" style={{ left: "50%", transform: "translateX(-50%)", top: "-56px", width: "836px" }}>
            <motion.div
              className="absolute"
              style={{
                width: "828px",
                height: "76px",
                left: "4px",
                top: "0px",
                background: "rgba(192, 105, 255, 0.5)",
                mixBlendMode: "plus-lighter",
                filter: "blur(70px)",
                borderRadius: "50%",
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute"
              style={{
                width: "794px",
                height: "76px",
                left: "14px",
                top: "56px",
                background: "rgba(192, 105, 255, 0.5)",
                mixBlendMode: "plus-lighter",
                filter: "blur(70px)",
                borderRadius: "50%",
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute"
              style={{
                width: "812px",
                height: "28px",
                left: "0px",
                top: "56px",
                background: "#C069FF",
                filter: "blur(20px)",
                borderRadius: "50%",
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          {/* Horizontal Star Particles */}
          {horizontalStars.map((star, index) => (
            <motion.div
              key={`star-h-${star.id}`}
              className="absolute"
              style={{
                width: "2px",
                height: "3.43px",
                left: `${star.left - 400}px`,
                top: `${star.top - 480}px`,
                background:
                  index >= 6
                    ? "linear-gradient(180deg, #C069FF 0%, rgba(192, 105, 255, 0) 100%)"
                    : "linear-gradient(180deg, rgba(192, 105, 255, 0.5) 0%, rgba(192, 105, 255, 0) 100%)",
                transform: "rotate(-90deg)",
                borderRadius: "50%",
                boxShadow: "0 0 4px rgba(192, 105, 255, 0.8)",
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 2.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Bottom Reflection */}
          <div
            className="absolute"
            style={{
              width: "688px",
              height: "73.79px",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "-20px",
              background: "#D9D9D9",
              filter: "blur(70px)",
              borderRadius: "50%",
            }}
          />

          {/* Dashboard Image */}
          <div
            className="relative"
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "1100 / 783",
              borderRadius: "20px",
              overflow: "hidden",
              background: "linear-gradient(0deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12)), #1a1a2e",
            }}
          >
            <img
              src={dashboardImage}
              alt="Dashboard Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Multi-Brand Slider */}
      {!dashboardImage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="relative z-10 w-full overflow-hidden"
          style={{
            marginTop: "clamp(80px, 12vh, 150px)",
            paddingBottom: "80px",
          }}
        >
          {/* Brand Slider Container */}
          <div className="relative w-full">
            {/* Gradient Overlays */}
            <div
              className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
              style={{
                width: "200px",
                background: "linear-gradient(90deg, #0C0414 0%, rgba(12, 4, 20, 0) 100%)",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
              style={{
                width: "200px",
                background: "linear-gradient(270deg, #0C0414 0%, rgba(12, 4, 20, 0) 100%)",
              }}
            />

            {/* Scrolling Brands */}
            <motion.div
              className="flex items-center"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              style={{
                gap: "80px",
                paddingLeft: "80px",
              }}
            >
              {/* Duplicate the brands array for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {/* Brand 1 - Ethereum */}
                  <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "180px", height: "80px" }}>
                    <svg width="120" height="60" viewBox="0 0 256 417" fill="none">
                      <path d="M127.961 0L125.507 8.17L125.507 285.168L127.961 287.618L255.922 212.32L127.961 0Z" fill="#F4DFFF" fillOpacity="0.6"/>
                      <path d="M127.96 0L0 212.32L127.96 287.618V154.158V0Z" fill="#F4DFFF" fillOpacity="0.4"/>
                    </svg>
                  </div>

                  {/* Brand 2 - Bitcoin */}
                  <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "180px", height: "80px" }}>
                    <svg width="100" height="100" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="#F4DFFF" fillOpacity="0.2"/>
                      <path d="M21.5 15.5C21.5 14.5 20.8 13.8 20 13.5C20.5 13 20.8 12.3 20.5 11.5C20.2 10.3 19 9.8 17.8 10.2L17.5 8.5H16L16.3 10.2C15.9 10.3 15.5 10.4 15.1 10.5L14.8 8.5H13.3L13.6 10.2C13.3 10.3 12.9 10.4 12.6 10.5L10.5 11L11 12.5C11 12.5 12 12.2 12 12.3C12.5 12.2 12.8 12.5 12.9 12.9L13.5 16.5L13.6 19.5C13.6 19.8 13.5 20.2 13 20.3C13.1 20.3 12 20.6 12 20.6L11.5 22.2L13.5 21.7C13.9 21.6 14.2 21.5 14.6 21.4L14.9 23.2H16.4L16.1 21.4C16.5 21.3 16.9 21.2 17.3 21.1L17.6 22.9H19.1L18.8 21.1C20.3 20.8 21.5 19.8 21.5 18.2C21.6 17 21 16.2 20 15.8C20.8 15.5 21.4 14.8 21.5 13.9V15.5ZM18.5 18.5C18.5 19.5 16.5 19.8 15.5 20L15.2 17C16.2 16.8 18.5 16.5 18.5 18.5ZM17.5 13C17.5 14 15.8 14.2 15 14.4L14.7 11.9C15.5 11.7 17.5 11.4 17.5 13Z" fill="#F4DFFF" fillOpacity="0.8"/>
                    </svg>
                  </div>

                  {/* Brand 3 - Binance */}
                  <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "180px", height: "80px" }}>
                    <svg width="100" height="100" viewBox="0 0 126 126" fill="none">
                      <path d="M38.171 53.203L62.998 28.376L87.826 53.203L101.648 39.381L62.998 0.731L24.348 39.381L38.171 53.203Z" fill="#F4DFFF" fillOpacity="0.6"/>
                      <path d="M0.85 62.997L14.672 49.175L28.494 62.997L14.672 76.819L0.85 62.997Z" fill="#F4DFFF" fillOpacity="0.5"/>
                      <path d="M38.171 72.791L62.998 97.618L87.826 72.791L101.648 86.614L62.998 125.264L24.348 86.614L38.171 72.791Z" fill="#F4DFFF" fillOpacity="0.6"/>
                      <path d="M97.502 62.997L111.324 49.175L125.146 62.997L111.324 76.819L97.502 62.997Z" fill="#F4DFFF" fillOpacity="0.5"/>
                    </svg>
                  </div>

                  {/* Brand 4 - Solana */}
                  <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "180px", height: "80px" }}>
                    <svg width="120" height="40" viewBox="0 0 397 311" fill="none">
                      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="#F4DFFF" fillOpacity="0.4"/>
                      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="#F4DFFF" fillOpacity="0.7"/>
                      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="#F4DFFF" fillOpacity="0.5"/>
                    </svg>
                  </div>

                  {/* Brand 5 - Cardano */}
                  <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "180px", height: "80px" }}>
                    <svg width="100" height="100" viewBox="0 0 2000 2000" fill="none">
                      <circle cx="1000" cy="1000" r="900" fill="none" stroke="#F4DFFF" strokeWidth="100" strokeOpacity="0.3"/>
                      <circle cx="1000" cy="1000" r="200" fill="#F4DFFF" fillOpacity="0.6"/>
                      <circle cx="600" cy="800" r="120" fill="#F4DFFF" fillOpacity="0.4"/>
                      <circle cx="1400" cy="800" r="120" fill="#F4DFFF" fillOpacity="0.4"/>
                      <circle cx="600" cy="1200" r="120" fill="#F4DFFF" fillOpacity="0.4"/>
                      <circle cx="1400" cy="1200" r="120" fill="#F4DFFF" fillOpacity="0.4"/>
                    </svg>
                  </div>

                  {/* Brand 6 - Polygon */}
                  <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "180px", height: "80px" }}>
                    <svg width="100" height="80" viewBox="0 0 38 33" fill="none">
                      <path d="M29 10.2c-.7-.4-1.6-.4-2.4 0L21 13.5l-3.8 2.1-5.5 3.3c-.7.4-1.6.4-2.4 0L5 16.3c-.7-.4-1.2-1.2-1.2-2.1v-4c0-.8.4-1.6 1.2-2.1l4.3-2.5c.7-.4 1.6-.4 2.4 0L16 8.2c.7.4 1.2 1.2 1.2 2.1v3.3l3.8-2.2V8c0-.8-.4-1.6-1.2-2.1l-8-4.7c-.7-.4-1.6-.4-2.4 0L1.2 5.9C.4 6.3 0 7.1 0 8v9.4c0 .8.4 1.6 1.2 2.1l8.1 4.7c.7.4 1.6.4 2.4 0l5.5-3.2 3.8-2.2 5.5-3.2c.7-.4 1.6-.4 2.4 0l4.3 2.5c.7.4 1.2 1.2 1.2 2.1v4c0 .8-.4 1.6-1.2 2.1L29 28.8c-.7.4-1.6.4-2.4 0l-4.3-2.5c-.7-.4-1.2-1.2-1.2-2.1V21l-3.8 2.2v3.3c0 .8.4 1.6 1.2 2.1l8.1 4.7c.7.4 1.6.4 2.4 0l8.1-4.7c.7-.4 1.2-1.2 1.2-2.1V17c0-.8-.4-1.6-1.2-2.1L29 10.2z" fill="#F4DFFF" fillOpacity="0.6"/>
                    </svg>
                  </div>

                  {/* Brand 7 - Avalanche */}
                  <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "180px", height: "80px" }}>
                    <svg width="100" height="100" viewBox="0 0 256 256" fill="none">
                      <circle cx="128" cy="128" r="128" fill="#F4DFFF" fillOpacity="0.15"/>
                      <path d="M145 128L128 100L111 128H145Z" fill="#F4DFFF" fillOpacity="0.7"/>
                      <path d="M100 150L128 100L156 150H100Z" fill="#F4DFFF" fillOpacity="0.5"/>
                      <path d="M85 170L128 100L171 170H85Z" fill="#F4DFFF" fillOpacity="0.3"/>
                    </svg>
                  </div>

                  {/* Brand 8 - Chainlink */}
                  <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "180px", height: "80px" }}>
                    <svg width="100" height="100" viewBox="0 0 32 32" fill="none">
                      <path d="M16 6L9 10v8l7 4 7-4v-8l-7-4zm0 3l4 2.3v4.4L16 18l-4-2.3v-4.4L16 9z" fill="#F4DFFF" fillOpacity="0.6"/>
                      <path d="M16 2L6 8v16l10 6 10-6V8l-10-6zm7 20.5l-7 4.2-7-4.2V9.5l7-4.2 7 4.2v13z" fill="#F4DFFF" fillOpacity="0.4"/>
                    </svg>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* "Trusted by" Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-center mt-12"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              color: "rgba(244, 223, 255, 0.5)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Trusted by Leading Crypto Platforms
          </motion.p>
        </motion.div>
      )}
    </section>
  );
}
