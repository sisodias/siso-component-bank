import { useState, useCallback, useRef, useEffect } from "react"

/**
 * Preview data for UI/UX design tools
 * Replace with your actual data structure
 */
const previewData = {
  figma: {
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=560&h=320&fit=crop",
    title: "Figma",
    subtitle: "Collaborative interface design tool",
  },
  sketch: {
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=560&h=320&fit=crop",
    title: "Sketch",
    subtitle: "Vector design toolkit for Mac",
  },
  adobe: {
    image: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=560&h=320&fit=crop",
    title: "Adobe XD",
    subtitle: "Design, prototype, and share experiences",
  },
}

/**
 * HoverLink Component
 * 
 * A text link that triggers preview on hover
 * 
 * @param previewKey - Key to identify which preview data to show
 * @param children - Text content of the link
 * @param onHoverStart - Callback when hover starts
 * @param onHoverMove - Callback when mouse moves during hover
 * @param onHoverEnd - Callback when hover ends
 */
const HoverLink = ({
  previewKey,
  children,
  onHoverStart,
  onHoverMove,
  onHoverEnd,
}: {
  previewKey: string
  children: React.ReactNode
  onHoverStart: (key: string, e: React.MouseEvent) => void
  onHoverMove: (e: React.MouseEvent) => void
  onHoverEnd: () => void
}) => {
  return (
    <span
      className="hover-link"
      onMouseEnter={(e) => onHoverStart(previewKey, e)}
      onMouseMove={onHoverMove}
      onMouseLeave={onHoverEnd}
    >
      {children}
    </span>
  )
}

/**
 * PreviewCard Component
 * 
 * Displays a floating card with image and text preview
 * 
 * @param data - Preview data containing image, title, and subtitle
 * @param position - X and Y coordinates for card position
 * @param isVisible - Whether the card should be visible
 * @param cardRef - React ref for the card element
 */
const PreviewCard = ({
  data,
  position,
  isVisible,
  cardRef,
}: {
  data: (typeof previewData)[keyof typeof previewData] | null
  position: { x: number; y: number }
  isVisible: boolean
  cardRef: React.RefObject<HTMLDivElement | null>
}) => {
  if (!data) return null

  return (
    <div
      ref={cardRef}
      className={`preview-card ${isVisible ? "visible" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="preview-card-inner">
        <img
          src={data.image}
          alt={data.title}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          className="preview-card-image"
        />
        <div className="preview-card-title">{data.title}</div>
        <div className="preview-card-subtitle">{data.subtitle}</div>
      </div>
    </div>
  )
}

/**
 * HoverPreview Component
 * 
 * Main component that displays text content with hoverable links
 * that show preview cards on hover. Features:
 * - Orthogonal grid background with subtle opacity
 * - Space Grotesk font for modern typography
 * - Rainbow gradient hover effect on links
 * - Smooth preview card animations
 * - Responsive positioning
 * 
 * Usage:
 * ```tsx
 * // Copy this entire component to your project
 * // No imports needed - it's self-contained
 * 
 * export default function Page() {
 *   return <HoverPreview />
 * }
 * ```
 * 
 * Customization:
 * - Edit `previewData` object to change content
 * - Modify CSS variables in styles for colors/spacing
 * - Adjust grid size in background-size property
 * - Change rainbow gradient colors in .hover-link::after
 */
export default function HoverPreview() {
  const [activePreview, setActivePreview] = useState<(typeof previewData)[keyof typeof previewData] | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Preload all images on component mount for better performance
  useEffect(() => {
    Object.entries(previewData).forEach(([, data]) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = data.image
    })
  }, [])

  /**
   * Updates the position of the preview card based on mouse position
   * Includes boundary checks to keep card within viewport
   */
  const updatePosition = useCallback((e: React.MouseEvent | MouseEvent) => {
    const cardWidth = 300
    const cardHeight = 250
    const offsetY = 20

    let x = e.clientX - cardWidth / 2
    let y = e.clientY - cardHeight - offsetY

    // Keep card within horizontal bounds
    if (x + cardWidth > window.innerWidth - 20) {
      x = window.innerWidth - cardWidth - 20
    }
    if (x < 20) {
      x = 20
    }

    // If card would go above viewport, position below cursor instead
    if (y < 20) {
      y = e.clientY + offsetY
    }

    setPosition({ x, y })
  }, [])

  /**
   * Handles the start of hover interaction
   */
  const handleHoverStart = useCallback(
    (key: string, e: React.MouseEvent) => {
      setActivePreview(previewData[key as keyof typeof previewData])
      setIsVisible(true)
      updatePosition(e)
    },
    [updatePosition],
  )

  /**
   * Handles mouse movement during hover
   */
  const handleHoverMove = useCallback(
    (e: React.MouseEvent) => {
      if (isVisible) {
        updatePosition(e)
      }
    },
    [isVisible, updatePosition],
  )

  /**
   * Handles the end of hover interaction
   */
  const handleHoverEnd = useCallback(() => {
    setIsVisible(false)
  }, [])

  return (
    <>
      <style>{`
        /* Import Space Grotesk font */
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');
        
        /* Main container styles */
        .hover-preview-container {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          font-family: 'Space Grotesk', sans-serif;
          overflow-x: hidden;
          position: relative;
        }
        
        /* Orthogonal grid background */
        .grid-background {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        /* Noise texture overlay */
        .noise-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          opacity: 0.03;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        
        /* Ambient glow effect */
        .ambient-glow {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: -1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 8s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.5; 
            transform: translate(-50%, -50%) scale(1); 
          }
          50% { 
            opacity: 0.8; 
            transform: translate(-50%, -50%) scale(1.1); 
          }
        }
        
        /* Content container */
        .content-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 900px;
        }
        
        /* Text block styles */
        .text-block {
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          line-height: 1.6;
          color: #71717a;
          font-weight: 400;
          letter-spacing: -0.02em;
        }
        
        .text-block p {
          margin-bottom: 1.5em;
          opacity: 0;
        }
        
        /* Fade up animations for paragraphs */
        .text-block p:nth-child(1) {
          animation: fadeUp 0.8s ease forwards 0.2s;
        }
        
        .text-block p:nth-child(2) {
          animation: fadeUp 0.8s ease forwards 0.4s;
        }
        
        .text-block p:nth-child(3) {
          animation: fadeUp 0.8s ease forwards 0.6s;
        }
        
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Hover link styles with rainbow gradient */
        .hover-link {
          color: #ffffff;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          display: inline-block;
          transition: color 0.3s ease;
        }
        
        .hover-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            #ef4444,  /* red */
            #eab308,  /* yellow */
            #22c55e,  /* green */
            #3b82f6,  /* blue */
            #a855f7   /* purple */
          );
          transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .hover-link:hover::after {
          width: 100%;
        }
        
        /* Preview card styles */
        .preview-card {
          position: fixed;
          pointer-events: none;
          z-index: 1000;
          opacity: 0;
          transform: translateY(10px) scale(0.95);
          transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform, opacity;
        }
        
        .preview-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        
        .preview-card-inner {
          background: rgba(26, 26, 26, 0.9);
          border-radius: 16px;
          padding: 8px;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 0 60px rgba(239, 68, 68, 0.1);
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        
        .preview-card-image {
          width: 288px;
          height: auto;
          border-radius: 12px;
          display: block;
        }
        
        .preview-card-title {
          padding: 12px 8px 8px;
          font-size: 0.875rem;
          color: #ffffff;
          font-weight: 600;
        }
        
        .preview-card-subtitle {
          padding: 0 8px 8px;
          font-size: 0.75rem;
          color: #71717a;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .hover-preview-container {
            padding: 20px;
          }
          
          .text-block {
            font-size: clamp(1.25rem, 5vw, 1.75rem);
          }
          
          .preview-card-image {
            width: 240px;
          }
        }
      `}</style>
      
      <div className="hover-preview-container">
        {/* Orthogonal Grid Background */}
        <div className="grid-background" />
        
        {/* Noise Texture Overlay */}
        <div className="noise-overlay" />

        {/* Ambient Glow Effect */}
        <div className="ambient-glow" />

        {/* Content Container */}
        <div className="content-container">
          <div className="text-block">
            <p>
              Explore{" "}
              <HoverLink
                previewKey="figma"
                onHoverStart={handleHoverStart}
                onHoverMove={handleHoverMove}
                onHoverEnd={handleHoverEnd}
              >
                Figma
              </HoverLink>{" "}
              for collaborative interface design and real-time prototyping.
            </p>

            <p>
              For Mac-native design try{" "}
              <HoverLink
                previewKey="sketch"
                onHoverStart={handleHoverStart}
                onHoverMove={handleHoverMove}
                onHoverEnd={handleHoverEnd}
              >
                Sketch
              </HoverLink>{" "}
              or create complete experiences with{" "}
              <HoverLink
                previewKey="adobe"
                onHoverStart={handleHoverStart}
                onHoverMove={handleHoverMove}
                onHoverEnd={handleHoverEnd}
              >
                Adobe XD
              </HoverLink>
              .
            </p>
          </div>
        </div>

        {/* Preview Card */}
        <PreviewCard data={activePreview} position={position} isVisible={isVisible} cardRef={cardRef} />
      </div>
    </>
  )
}