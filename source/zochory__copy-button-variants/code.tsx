import { useState } from "react";

// Placeholder icons
const CopyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const Component = () => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Cross Fade Animation Example</h1>
      <button
        onClick={handleClick}
        style={{
          padding: "1rem 2rem",
          fontSize: "1rem",
          background: "#3f3f46",
          color: "white",
          border: "none",
          borderRadius: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          margin: "2rem auto"
        }}
      >
<div
            style={{
              position: "relative",
              width: "24px",
              height: "24px",
              display: "inline-block"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                opacity: copied ? 0 : 1,
                transform: copied ? "scale(0.6)" : "scale(1)",
                transition: "opacity 150ms, transform 150ms"
              }}
            >
              <CopyIcon />
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                opacity: copied ? 1 : 0,
                transform: copied ? "scale(1)" : "scale(0.6)",
                transition: "opacity 400ms 150ms, transform 400ms 150ms"
              }}
            >
              <CheckIcon />
            </div>          </div>        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};