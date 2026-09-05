"use client"

import type React from "react"

interface MagicButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export function MagicButton({ children, href, onClick, className = "" }: MagicButtonProps) {
  const styles = `
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap");

    .magic-button {
      position: relative;
      display: inline-block;
      padding: 16px 32px;
      color: #ffffff;
      font-size: 1.2rem;
      font-weight: 600;
      font-family: "Inter", sans-serif;
      text-decoration: none;
      border: none;
      border-radius: 12px;
      background: transparent;
      cursor: pointer;
      overflow: hidden;
      z-index: 1;
      transition: color 0.3s ease;
      box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3), 0 8px 25px rgba(65, 105, 225, 0.2), 0 12px 35px rgba(0, 255, 255, 0.1);
    }

    @media (prefers-color-scheme: light) {
      .magic-button {
        box-shadow: 0 4px 15px rgba(138, 43, 226, 0.4), 0 8px 25px rgba(65, 105, 225, 0.3), 0 12px 35px rgba(0, 255, 255, 0.2);
      }
    }

    .magic-button::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(
        transparent,
        #8a2be2,
        #4169e1,
        #00ffff,
        #7fff00,
        #ffd700,
        #ff4500,
        #dc143c,
        transparent 70%
      );
      transform-origin: center center;
      transform: translate(-50%, -50%);
      animation: rotate 5s linear infinite;
      z-index: -2;
    }

    .magic-button::after {
      content: "";
      position: absolute;
      inset: 3px;
      background: white;
      border-radius: 10px;
      z-index: -1;
    }

    @media (prefers-color-scheme: dark) {
      .magic-button::after {
        background: black;
      }
    }

    .magic-button:hover {
      color: #c8c8c8;
      box-shadow: 0 6px 20px rgba(138, 43, 226, 0.4), 0 12px 35px rgba(65, 105, 225, 0.3), 0 18px 50px rgba(0, 255, 255, 0.2);
    }

    @media (prefers-color-scheme: light) {
      .magic-button:hover {
        box-shadow: 0 6px 20px rgba(138, 43, 226, 0.5), 0 12px 35px rgba(65, 105, 225, 0.4), 0 18px 50px rgba(0, 255, 255, 0.3);
      }
    }

    .magic-button:hover::before {
      animation-duration: 2s;
    }

    @keyframes rotate {
      from {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }
  `

  const baseClasses = `magic-button ${className}`

  if (href) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <a href={href} className={baseClasses}>
          {children}
        </a>
      </>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <button onClick={onClick} className={baseClasses}>
        {children}
      </button>
    </>
  )
}
