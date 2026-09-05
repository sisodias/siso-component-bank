import React, { useState } from 'react'

// --- Helper Components & Data ---

// Placeholder for lucide-react Star icon
const Star = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

// Placeholder for lucide-react Users2 icon
const Users2 = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 19a6 6 0 0 0-12 0" />
    <circle cx="8" cy="10" r="4" />
    <path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8" />
  </svg>
)

// Placeholder for lucide-react TrendingUp icon
const TrendingUp = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

// Data for the highlight cards
const highlights = [
  {
    icon: Star,
    title: 'TITLE-1',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore',
    borderColor: '#f89763',
  },
  {
    icon: Users2,
    title: 'TITLE-2',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore',
    borderColor: '#f89763',
  },
  {
    icon: TrendingUp,
    title: 'TITLE-3',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore',
    borderColor: '#f89763',
  },
]

// --- CSS Styles Component ---
// This component injects the CSS into the document head.
const ComponentStyles = () => (
  <style>
    {`
      /* Collapsed title default: vertical, rotated on desktop */
      .collapsed-title {
        transform: rotate(-180deg);
        writing-mode: vertical-rl;
      }

      /* Make collapsed title horizontal on mobile (≤768px) */
      @media (max-width: 768px) {
        .collapsed-title {
          transform: none;
          writing-mode: horizontal-tb;
          white-space: normal;
        }
      }

      /* Show only one card per row + decrease card height on XS screens (<500px) */
      @media (max-width: 500px) {
        .theory-card {
          flex: 1 1 100% !important;
          max-width: 100% !important;
          height: 250px !important; /* Decreased height for mobile */
        }
      }
    `}
  </style>
)

// --- Main Component ---
// This is now a named export to resolve the import error.
export function Component() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [clickedIndex, setClickedIndex] = useState(null)

  const isActive = (index) => hoveredIndex === index || clickedIndex === index

  return (
    <section
      style={{
        padding: '2rem 1rem',
        fontFamily: 'sans-serif',
        backgroundColor: '#f9fafb',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'stretch',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '12px',
        }}
      >
        {highlights.map((item, index) => {
          const Icon = item.icon
          const active = isActive(index)

          return (
            <div
              className="theory-card"
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() =>
                setClickedIndex((prev) => (prev === index ? null : index))
              }
              style={{
                flex: '1 1 100px',
                minWidth: '140px',
                maxWidth: active ? '360px' : '160px',
                height: active ? 'auto' : '300px',
                border: `3px solid ${item.borderColor}`,
                backgroundColor: 'white',
                borderRadius: '16px',
                transition: 'all 0.4s ease-in-out',
                boxSizing: 'border-box',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                cursor: 'pointer',
              }}
            >
              {active ? (
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      background: item.borderColor,
                      borderRadius: '50%',
                      padding: '0.75rem',
                      display: 'inline-block',
                      marginBottom: '1rem',
                    }}
                  >
                    <Icon size={28} color="white" />
                  </div>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem',
                      color: '#111',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: '#444',
                      fontSize: '0.95rem',
                      lineHeight: '1.4',
                      padding: '0 0.5rem',
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ) : (
                <span
                  className="collapsed-title"
                  style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: item.borderColor,
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  {item.title}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// --- App Wrapper ---
// This makes the component easy to render and test in the preview environment.
export default function App() {
  return (
    <>
      <ComponentStyles />
      <Component />
    </>
  )
}
