// src/components/ui/component.tsx

import React, { useState } from 'react';
import { ParentSize } from '@visx/responsive';
import { cn } from "../_utils/cn";

const Lines = ({ width, height }: { width: number; height: number }) => {
  if (width < 10 || height < 10) return null;

  const numLines = 8;
  const pointsPerLine = 25;
  const verticalSpreadFactor = 1.8;
  const jaggedness = (height / numLines) / 2.5; 
  const linesData = Array.from({ length: numLines }).map((_, lineIndex) => {
    const baseY = (height / (numLines + 1)) * (lineIndex + 1);
    let pathString = `M 0 ${baseY + (Math.random() - 0.5) * jaggedness * 0.5}`; 
    for (let i = 1; i <= pointsPerLine; i++) {
      const x = (width / pointsPerLine) * i;
      const y = baseY + (Math.random() - 0.5) * jaggedness * verticalSpreadFactor;
      pathString += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    return pathString;
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect width={width} height={height} fill="#000000" />
      {linesData.map((d, i) => (
        <path key={i} d={d} stroke="white" strokeWidth="1.5" fill="none" />
      ))}
    </svg>
  );
};


const Nav = () => {
  return (
    <ul className="responsive-nav-list">
      <li style={{ marginBottom: '0.5rem' }}><span role="img" aria-label="robot" style={{ fontSize: '2.5rem' }}>🤖</span></li>
      <li>Home</li>
      <li>Profile</li>
      <li>Favorites</li>
      <li>Settings</li>
    </ul>
  );
};

export interface ComponentProps {
  width: number;
  height: number;
  initialShowSidebar?: boolean;
}

export const Component: React.FC<ComponentProps> = ({
  width,
  height,
  initialShowSidebar = true,
}) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(initialShowSidebar);

  if (width < 20 || height < 20) return null;

  const injectedStyles = `
    .responsive-layout-container {
      display: flex;
      background-color: #ffffff;
    }
    .responsive-layout-nav {
      display: flex;
      flex: 0 0 220px;
      padding: 1.5rem;
      background-color: #fff;
      transition: flex-basis 0.3s ease-in-out, min-width 0.3s ease-in-out, opacity 0.3s ease-in-out, padding 0.3s ease-in-out, border 0.3s ease-in-out;
      overflow: hidden;
    }
    .responsive-layout-nav.hidden {
        flex-basis: 0px !important;
        min-width: 0px !important;
        padding: 0rem !important;
        opacity: 0 !important;
        border-right: none !important; 
    }
    .responsive-nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      width: 100%;
    }
    .responsive-nav-list li {
      padding: 0.6rem 0;
      cursor: pointer;
      font-size: 1.6rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #000000;
    }
    .responsive-layout-content {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      padding: 1rem;
      background-color: #fff;
      border-left: 1px solid #eeeeee;
    }
    .responsive-layout-controls {
      margin-bottom: 0.5rem; /* Reduced margin */
      text-align: left; /* Align button to left */
    }
    .responsive-layout-toggle-button {
      padding: 0.25rem 0.75rem;
      font-size: 0.8rem;
      background-color: #f0f0f0;
      color: black;
      border: 1px solid #cccccc;
      border-radius: 0.25rem;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .responsive-layout-toggle-button:hover {
      background-color: #e0e0e0;
    }
    .responsive-layout-graph-area {
      display: flex;
      flex: 1;
      overflow: hidden;
      background: #000000;
    }
    .responsive-graph-container-class {
        width: 100%;
        height: 100%;
    }
  `;

  return (
    <>
      <style>{injectedStyles}</style>
      <div className="responsive-layout-container" style={{ width, height }}>
        <div className={cn("responsive-layout-nav", !showSidebar && "hidden")}>
          {showSidebar && <Nav />}
        </div>
        <div className="responsive-layout-content">
          <div className="responsive-layout-controls">
            <button
              className="responsive-layout-toggle-button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setShowSidebar(!showSidebar);
              }}
            >
              toggle nav
            </button>
          </div>
          <div className="responsive-layout-graph-area">
            <ParentSize className="responsive-graph-container-class" debounceTime={10}>
              {({ width: visWidth, height: visHeight }) => (
                <Lines width={visWidth} height={visHeight} />
              )}
            </ParentSize>
          </div>
        </div>
      </div>
    </>
  );
};