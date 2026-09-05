"use client";
import React, { useState, useEffect, useRef } from 'react';

interface ShowcaseOption {
  text: string;
  imageUrl: string;
}
interface Padding {
  top?: string;
  bottom?: string;
  leftRight?: string;
}
interface SliderHeroSectionProps {
  title: string;
  showcaseOptions: ShowcaseOption[];
  activeOptionColor?: string;
  textColor?: string;
  imageChangeInterval?: number;
  imageTransitionDuration?: number;
  desktopFontSize?: string;
  mobileFontSize?: string;
  desktopShowcaseFontSize?: string;
  mobileShowcaseFontSize?: string;
  desktopVersionBottomThreshold?: number;
  darkenImages?: number;
  desktopPadding?: Padding;
  mobilePadding?: Padding;
  height?: string;
  isBoldFont?: boolean;
  borderRadius?: string;
  onOptionClick?: (index: number) => void;
  onOptionHover?: (index: number) => void;
  desktopTitleAlign?: string;
  mobileTitleAlign?: string;
  desktopShowcaseAlign?: string;
  mobileShowcaseAlign?: string;
}

const isRTLCheck = (text: string): boolean => {
  return /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);
};

export const SliderHeroSection: React.FC<SliderHeroSectionProps> = ({
  title,
  showcaseOptions,
  activeOptionColor = '#00a6fb',
  textColor = '#ffffff',
  imageChangeInterval = 4000,
  imageTransitionDuration = 0.76,
  desktopFontSize = '62px',
  mobileFontSize = '33px',
  desktopShowcaseFontSize = '36px',
  mobileShowcaseFontSize = '25px',
  desktopVersionBottomThreshold = 768,
  darkenImages = 0.5,
  desktopPadding = { top: '62px', bottom: '67px', leftRight: '24px' },
  mobilePadding = { top: '39px', bottom: '39px', leftRight: '10px' },
  height = '100vh',
  isBoldFont = true,
  borderRadius = 'none',
  onOptionClick,
  onOptionHover,
  desktopTitleAlign = 'left',
  mobileTitleAlign = 'center',
  desktopShowcaseAlign = 'left',
  mobileShowcaseAlign = 'center',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setIsMobileView(containerRef.current.offsetWidth < desktopVersionBottomThreshold);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [desktopVersionBottomThreshold]);

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % showcaseOptions.length);
      }, imageChangeInterval);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, imageChangeInterval, showcaseOptions.length]);

  const handleOptionClick = (index: number) => {
    setActiveIndex(index);
    onOptionClick?.(index);
  };

  const handleOptionHover = (index: number) => {
    setActiveIndex(index);
    setIsHovered(true);
    onOptionHover?.(index);
  };

  const handleOptionLeave = () => {
    setIsHovered(false);
  };

  // Dynamic paddings
  const padding = isMobileView
    ? `${mobilePadding.top} ${mobilePadding.leftRight} ${mobilePadding.bottom}`
    : `${desktopPadding.top} ${desktopPadding.leftRight} ${desktopPadding.bottom}`;

  // Dynamic align
  const titleAlign = isMobileView ? mobileTitleAlign : desktopTitleAlign;
  const showcaseAlign = isMobileView ? mobileShowcaseAlign : desktopShowcaseAlign;

  // RTL
  const isTitleRTL = isRTLCheck(title);
  const isShowcaseRTL = isRTLCheck(showcaseOptions[0]?.text || "");

  return (
    <div
      ref={containerRef}
      className="slider-hero-section"
      style={{
        height,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        padding,
        borderRadius,
        boxSizing: "border-box",
      }}
    >
      {/* Background Images */}
      <div className="slider-hero-bg-images">
        {showcaseOptions.map((option, index) => (
          <div
            key={index}
            className={`slider-hero-bg-image${index === activeIndex ? " active" : ""}`}
            style={{
              backgroundImage: `url(${option.imageUrl})`,
              borderRadius,
              transition: `opacity ${imageTransitionDuration}s`,
            }}
          />
        ))}
      </div>
      {/* Overlay */}
      <div
        className="slider-hero-bg-overlay"
        style={{
          backgroundColor:
            darkenImages >= 0
              ? `rgba(0, 0, 0, ${darkenImages})`
              : `rgba(255, 255, 255, ${Math.abs(darkenImages)})`,
          borderRadius,
        }}
      />
      {/* Content */}
      <div className="slider-hero-content">
        <h1
          className="slider-hero-title"
          style={{
            fontSize: isMobileView ? mobileFontSize : desktopFontSize,
            textAlign: titleAlign as any,
            margin: 0,
            fontWeight: isBoldFont ? "bold" : "normal",
            color: textColor,
            direction: isTitleRTL ? "rtl" : "ltr",
          }}
        >
          {title}
        </h1>
        <div
          className="slider-hero-showcase"
          style={{
            direction: isShowcaseRTL ? "rtl" : "ltr",
            alignItems: showcaseAlign as any,
            alignSelf: showcaseAlign as any,
          }}
        >
          {showcaseOptions.map((option, index) => (
            <div
              key={index}
              className={`slider-hero-showcase-option${index === activeIndex ? " active" : ""}`}
              onClick={() => handleOptionClick(index)}
              onMouseEnter={() => handleOptionHover(index)}
              onMouseLeave={handleOptionLeave}
              style={{
                fontSize: isMobileView ? mobileShowcaseFontSize : desktopShowcaseFontSize,
                fontWeight: isBoldFont ? "bold" : "normal",
                textAlign: showcaseAlign as any,
                direction: isRTLCheck(option.text) ? "rtl" : "ltr",
                color: index === activeIndex ? activeOptionColor : textColor,
                cursor: "pointer",
              }}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>
      {/* Styles */}
      <style jsx>{`
        .slider-hero-section {
          box-sizing: border-box;
        }
        .slider-hero-bg-images {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: 0;
        }
        .slider-hero-bg-image {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          pointer-events: none;
        }
        .slider-hero-bg-image.active {
          opacity: 1;
          pointer-events: auto;
        }
        .slider-hero-bg-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 1;
        }
        .slider-hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .slider-hero-title {
          margin-bottom: 2.5rem;
          margin-top: 0;
        }
        .slider-hero-showcase {
          display: inline-flex;
          flex-direction: column;
          gap: 1.2em;
        }
        .slider-hero-showcase-option {
          transition: color 0.3s;
        }
        @media (max-width: 700px) {
          .slider-hero-title {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
