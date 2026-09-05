import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RefreshCw } from "lucide-react";

// NOTE: The following is a placeholder for the original Button component.
// In a real app, you would use your existing UI library.
const Button = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Seeded pseudo-random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

interface ImageData {
  src: string;
  alt: string;
  id: string;
}

interface ScatterPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface ImageStackProps {
  images?: ImageData[];
  maxRotation?: number;
  scatterRadius?: number;
  seed?: number;
  className?: string;
  onReshuffle?: () => void;
}

interface ImageStackRef {
  reshuffle: () => void;
}

// Framer Motion variants for container and cards
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0, // No initial pause, start staggering immediately
      staggerChildren: 1.5, // Reverted to the original 1.5-second stagger
    },
  },
};

const cardVariants = {
  hidden: (custom: { zIndex: number }) => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    zIndex: custom.zIndex,
  }),
  visible: (custom: {
    position: ScatterPosition;
    zIndex: number;
    springConfig: any;
  }) => ({
    x: custom.position.x,
    y: custom.position.y,
    rotate: custom.position.rotation,
    scale: custom.position.scale,
    zIndex: custom.zIndex,
    transition: custom.springConfig,
  }),
};

const ImageStack = React.forwardRef<ImageStackRef, ImageStackProps>(
  (
    {
      images = [
        {
          id: "1",
          src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
          alt: "Mountain landscape",
        },
        {
          id: "2",
          src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=800&fit=crop",
          alt: "Forest path",
        },
        {
          id: "3",
          src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=800&fit=crop",
          alt: "Ocean waves",
        },
        {
          id: "4",
          src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=800&fit=crop",
          alt: "Desert dunes",
        },
        {
          id: "5",
          src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=800&fit=crop",
          alt: "City skyline",
        },
      ],
      maxRotation = 15,
      scatterRadius = 40, // Reduced radius for a tighter stack
      seed = 12345,
      className = "",
      onReshuffle,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [imagesLoaded, setImagesLoaded] = React.useState(false);
    const [scatterPositions, setScatterPositions] = React.useState<
      ScatterPosition[]
    >([]);
    const [currentSeed, setCurrentSeed] = React.useState(seed);
    const [loadedImages, setLoadedImages] = React.useState<Set<string>>(
      new Set()
    );

    const containerRef = React.useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Generate scatter positions to the left of the center
    const generateScatterPositions = React.useCallback(
      (seedValue: number) => {
        const rng = new SeededRandom(seedValue);
        return images.map(() => ({
          x: rng.range(-280, -240), // Keep original positioning
          y: rng.range(-scatterRadius, scatterRadius),
          rotation: rng.range(-maxRotation, maxRotation),
          scale: rng.range(0.95, 1.05),
        }));
      },
      [images, scatterRadius, maxRotation]
    );

    // Preload images
    React.useEffect(() => {
      const preloadImages = async () => {
        const loadPromises = images.map((image) => {
          return new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              setLoadedImages((prev) => new Set(prev).add(image.id));
              resolve(image.id);
            };
            img.onerror = () => {
              console.warn(`Failed to load image: ${image.id}`);
              reject(new Error(`Failed to load image: ${image.id}`));
            };
            img.src = image.src;
          });
        });

        try {
          await Promise.all(loadPromises);
          setImagesLoaded(true);
        } catch (error) {
          console.error("Error preloading images:", error);
          setImagesLoaded(true); // Continue anyway
        }
      };

      preloadImages();
    }, [images]);

    // Generate initial positions
    React.useEffect(() => {
      setScatterPositions(generateScatterPositions(currentSeed));
    }, [currentSeed, generateScatterPositions]);

    // Intersection observer
    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && imagesLoaded) {
            setIsVisible(true);
          }
        },
        { threshold: 0.3 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, [imagesLoaded]);

    // Reshuffle function
    const reshuffle = React.useCallback(() => {
      const newSeed = Math.floor(Math.random() * 1000000);
      setCurrentSeed(newSeed);
      setIsVisible(false);

      setTimeout(() => {
        setIsVisible(true);
      }, 100);

      onReshuffle?.();
    }, [onReshuffle]);

    // Expose reshuffle via ref
    React.useImperativeHandle(
      ref,
      () => ({
        reshuffle,
      }),
      [reshuffle]
    );

    const springConfig = prefersReducedMotion
      ? { type: "tween", duration: 0.3 }
      : { type: "spring", stiffness: 100, damping: 20 };

    return (
      <div
        className={`relative w-full h-[900px] flex items-center justify-center overflow-hidden ${className}`}
      >
        <motion.div
          ref={containerRef}
          className="relative w-full h-full min-w-[1400px]" // Ensure minimum width for the canvas
          style={{ perspective: "1000px" }}
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500">Loading images...</div>
            </div>
          )}

          {images.map((image, index) => {
            const position = scatterPositions[index];
            if (!position) return null;

            return (
              <motion.div
                key={`${image.id}-${currentSeed}`}
                className="absolute"
                variants={cardVariants}
                custom={{
                  position: position,
                  zIndex: images.length - index,
                  springConfig: springConfig,
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  // Adjusted centering for wider cards (w-80 -> 320px / 2 = 160px)
                  // (h-96 -> 384px + padding + text -> ~450px / 2 = 225px)
                  marginLeft: "-160px",
                  marginTop: "-225px",
                }}
              >
                <div className="bg-white p-6 shadow-xl border rounded-sm">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-80 h-96 object-cover rounded-sm" // Much wider and taller cards
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='384'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280'%3EImage not found%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="mt-3 text-base text-gray-600 text-center font-medium">
                    {image.alt}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }
);
ImageStack.displayName = "ImageStack";

// Example usage component
const ImageStackDemo = () => {
  const sampleImages: ImageData[] = [
    {
      id: "mountain",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
      alt: "Mountain landscape",
    },
    {
      id: "forest",
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=800&fit=crop",
      alt: "Forest path",
    },
    {
      id: "ocean",
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=800&fit=crop",
      alt: "Ocean waves",
    },
    {
      id: "desert",
      src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=800&fit=crop",
      alt: "Desert dunes",
    },
    {
      id: "city",
      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=800&fit=crop",
      alt: "City skyline",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full">
        <ImageStack images={sampleImages} />
      </div>
    </div>
  );
};

export default ImageStackDemo;