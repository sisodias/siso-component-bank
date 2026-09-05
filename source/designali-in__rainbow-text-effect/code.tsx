"use client"

import { useEffect, useState } from "react"

interface RainbowTextEffectProps {
  text?: string
  className?: string
  fontSize?: string
}

export function RainbowTextEffect({ fontSize = 20, text = "design", className = "" }: RainbowTextEffectProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 400)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const desktopTextShadow = `
    2px 10px #FFD20E, 2px 12px #000, 
    4px 20px #E5BC08, 4px 22px #000, 
    6px 30px #EC8401, 6px 32px #000, 
    8px 40px #E65C04, 8px 42px #000, 
    10px 50px #E52E06, 10px 52px #000, 
    12px 60px #DE006B, 12px 62px #000, 
    14px 70px #CA039E, 14px 72px #000, 
    16px 80px #A203CB, 16px 82px #000, 
    18px 90px #6D01C9, 18px 92px #000, 
    20px 100px #22008F, 20px 102px #000,
    22px 110px #062F9A, 22px 112px #000,
    24px 120px #0045AC, 24px 122px #000,
    26px 130px #007DB2, 26px 132px #000, 
    28px 140px #00B8D9, 28px 142px #000
  `

  const mobileStyles = {
    textShadow: "none",
    background: "linear-gradient(to bottom, #FFD20E, #EC8401, #E65C04)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    lineHeight: "130%",
  }

  const desktopStyles = {
    color: "white",
    WebkitTextStroke: "1px #000",
    textStroke: "1px #000",
    textShadow: desktopTextShadow,
    lineHeight: "100%",
  }

  const baseStyles = {
    fontFamily: "'Open Sans', sans-serif",
    fontStyle: "italic" as const,
    fontSize: `${fontSize}vw`,
    fontWeight: 600,
    textTransform: "lowercase" as const,
    wordBreak: "break-all" as const,
    margin: 0,
    padding: 0,
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@1,600&display=swap" rel="stylesheet" />
      <div
        style={{
          textAlign: "center",
          fontFamily: "'Open Sans', sans-serif",
        }}
        className={className}
      >
        <p
          style={{
            ...baseStyles,
            ...(isMobile ? mobileStyles : desktopStyles),
          }}
        >
          {text}
        </p>
      </div>
    </>
  )
}
