"use client";

import React from "react";
import { 
  cn, 
  calculateAnimationDuration, 
  getCarSizeClasses,
  type CarAnimationData 
} from "@/lib/utils";

/**
 * ============================================
 * MAIN COMPONENT: AnimatedCar
 * ============================================
 */

interface AnimatedCarProps {
  data: CarAnimationData;
  className?: string;
  onSpeedChange?: (speed: number) => void;
  onPauseToggle?: () => void;
}

export const AnimatedCar: React.FC<AnimatedCarProps> = ({
  data,
  className,
  onSpeedChange,
  onPauseToggle,
}) => {
  // Calculate animation durations based on speed
  const roadSpeed = calculateAnimationDuration(20, data.speed);
  const cloudSpeed = calculateAnimationDuration(60, data.speed);
  const scenerySpeed = calculateAnimationDuration(30, data.speed);
  const birdSpeed = calculateAnimationDuration(40, data.speed);

  // Pause state management
  const [isPaused, setIsPaused] = React.useState(false);
  
  const handleMouseEnter = () => {
    if (data.features.pauseOnHover) {
      setIsPaused(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (data.features.pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full h-screen overflow-hidden",
        "bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200",
        "dark:from-slate-900 dark:via-slate-800 dark:to-slate-700",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sun */}
      {data.features.showSun && <Sun />}

      {/* Clouds */}
      {data.features.showClouds && (
        <CloudContainer 
          clouds={data.scenery.clouds}
          cloudSpeed={cloudSpeed}
          isPaused={isPaused}
        />
      )}
      
      {/* Birds */}
      {data.features.showBirds && (
        <BirdContainer
          birds={data.scenery.birds}
          birdSpeed={birdSpeed}
          isPaused={isPaused}
        />
      )}

      {/* Mountains/Hills Background */}
      {data.features.showScenery && <Mountains />}

      {/* Trees/Scenery */}
      {data.features.showScenery && (
        <Scenery 
          trees={data.scenery.trees}
          animationDuration={scenerySpeed}
          isPaused={isPaused}
        />
      )}

      {/* Road */}
      {data.features.showRoad && (
        <Road 
          animationDuration={roadSpeed}
          isPaused={isPaused}
        />
      )}

      {/* Car */}
      <Car 
        color={data.car.color}
        size={data.car.size}
        isPaused={isPaused}
      />

      {/* Controls */}
      {data.controls?.showSpeedControl && (
        <SpeedControl
          speed={data.speed}
          pauseOnHover={data.features.pauseOnHover}
          position={data.controls.position}
          onSpeedChange={onSpeedChange}
          onPauseToggle={onPauseToggle}
          showPauseToggle={data.controls.showPauseToggle}
        />
      )}
    </div>
  );
};

/**
 * ============================================
 * SUB-COMPONENT: Sun
 * ============================================
 */
const Sun: React.FC = () => (
  <div className="absolute top-10 right-20 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 dark:bg-yellow-600 rounded-full shadow-lg">
    <div className="absolute inset-2 bg-yellow-300 dark:bg-yellow-500 rounded-full" />
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: CloudContainer
 * ============================================
 */
interface CloudContainerProps {
  clouds: CarAnimationData['scenery']['clouds'];
  cloudSpeed: number;
  isPaused: boolean;
}

const CloudContainer: React.FC<CloudContainerProps> = ({ clouds, cloudSpeed, isPaused }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {clouds.map((cloud) => (
      <Cloud
        key={cloud.id}
        size={cloud.size}
        top={cloud.top}
        animationDuration={cloudSpeed * cloud.speedMultiplier}
        isPaused={isPaused}
        delay={cloud.delay}
      />
    ))}
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: Cloud
 * ============================================
 */
interface CloudProps {
  size: "small" | "medium" | "large";
  top: string;
  animationDuration: number;
  isPaused: boolean;
  delay: number;
}

const Cloud: React.FC<CloudProps> = ({ size, top, animationDuration, isPaused, delay }) => {
  const sizeClasses = {
    small: "w-16 h-8 sm:w-20 sm:h-10",
    medium: "w-24 h-12 sm:w-28 sm:h-14",
    large: "w-32 h-14 sm:w-36 sm:h-16",
  };

  return (
    <div
      className={cn(
        "absolute",
        sizeClasses[size]
      )}
      style={{
        top,
        right: '-10rem',
        animation: `cloud-move ${animationDuration}s linear infinite`,
        animationPlayState: isPaused ? "paused" : "running",
        animationDelay: `${delay}s`,
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-white dark:bg-gray-300 rounded-full opacity-90" />
        <div className="absolute -top-2 left-4 w-8 sm:w-12 h-8 sm:h-12 bg-white dark:bg-gray-300 rounded-full opacity-90" />
        <div className="absolute -top-1 right-4 w-6 sm:w-10 h-6 sm:h-10 bg-white dark:bg-gray-300 rounded-full opacity-90" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 sm:w-14 h-8 sm:h-12 bg-white dark:bg-gray-300 rounded-full opacity-90" />
      </div>
    </div>
  );
};

/**
 * ============================================
 * SUB-COMPONENT: BirdContainer
 * ============================================
 */
interface BirdContainerProps {
  birds: CarAnimationData['scenery']['birds'];
  birdSpeed: number;
  isPaused: boolean;
}

const BirdContainer: React.FC<BirdContainerProps> = ({ birds, birdSpeed, isPaused }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {birds.map((bird) => (
      <Bird
        key={bird.id}
        emoji={bird.emoji}
        top={bird.top}
        size={bird.size}
        animationDuration={birdSpeed * bird.speedMultiplier}
        isPaused={isPaused}
        delay={bird.delay}
      />
    ))}
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: Bird
 * ============================================
 */
interface BirdProps {
  emoji: string;
  top: string;
  size: string;
  animationDuration: number;
  isPaused: boolean;
  delay: number;
}

const Bird: React.FC<BirdProps> = ({ emoji, top, size, animationDuration, isPaused, delay }) => (
  <div
    className="absolute"
    style={{
      top,
      right: '-5rem',
      animation: `bird-fly ${animationDuration}s linear infinite`,
      animationPlayState: isPaused ? "paused" : "running",
      animationDelay: `${delay}s`,
    }}
  >
    <div className="relative animate-bird-flap">
      <span className={cn("text-gray-700 dark:text-gray-300", size)}>{emoji}</span>
    </div>
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: Mountains
 * ============================================
 */
const Mountains: React.FC = () => (
  <div className="absolute bottom-36 w-full h-64 pointer-events-none">
    <div className="absolute bottom-0 left-0 w-full h-48 bg-green-600/30 dark:bg-green-900/30 rounded-t-full transform -translate-x-1/4" />
    <div className="absolute bottom-0 right-0 w-full h-56 bg-green-500/30 dark:bg-green-800/30 rounded-t-full transform translate-x-1/4" />
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: Scenery
 * ============================================
 */
interface SceneryProps {
  trees: CarAnimationData['scenery']['trees'];
  animationDuration: number;
  isPaused: boolean;
}

const Scenery: React.FC<SceneryProps> = ({ trees, animationDuration, isPaused }) => {
  const TreeComponent: React.FC<{ tree: typeof trees[0] }> = ({ tree }) => {
    const treeStyles = {
      pine: "bg-green-600 dark:bg-green-800 rounded-t-full",
      oak: "bg-green-700 dark:bg-green-900 rounded-t-full",
      palm: "bg-green-500 dark:bg-green-700 rounded-t-full",
    };
    
    return (
      <div className="relative flex-shrink-0">
        <div className={cn(`w-16 ${tree.height}`, treeStyles[tree.type], tree.color)} />
        <div className="w-4 h-8 bg-amber-800 dark:bg-amber-900 mx-auto" />
      </div>
    );
  };

  return (
    <div className="absolute bottom-36 w-full h-32 overflow-hidden">
      <div 
        className="absolute bottom-0 flex gap-16 items-end"
        style={{
          animation: `scroll-left ${animationDuration}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
          width: '200%',
        }}
      >
        {/* Repeat pattern for seamless loop */}
        {[...Array(8)].map((_, i) => (
          <React.Fragment key={i}>
            {trees.map((tree) => (
              <TreeComponent key={`${i}-${tree.id}`} tree={tree} />
            ))}
            {/* Building */}
            <div className="w-24 h-32 bg-gray-600 dark:bg-gray-800 relative flex-shrink-0">
              <div className="absolute inset-2 grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, j) => (
                  <div key={j} className="bg-yellow-300/50 dark:bg-yellow-400/30" />
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/**
 * ============================================
 * SUB-COMPONENT: Road
 * ============================================
 */
interface RoadProps {
  animationDuration: number;
  isPaused: boolean;
}

const Road: React.FC<RoadProps> = ({ animationDuration, isPaused }) => (
  <div className="absolute bottom-0 w-full h-28 sm:h-36 bg-gray-800 dark:bg-gray-900 perspective-1000">
    <div className="absolute top-0 w-full h-2 bg-yellow-400 dark:bg-yellow-500" />
    <div className="absolute bottom-0 w-full h-2 bg-white dark:bg-gray-300" />
    
    <div className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 overflow-hidden">
      <div 
        className="flex gap-8"
        style={{
          animation: `scroll-left ${animationDuration}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
          width: '200%',
        }}
      >
        {[...Array(2)].map((_, setIndex) => (
          <div key={setIndex} className="flex gap-8">
            {[...Array(20)].map((_, i) => (
              <div
                key={`${setIndex}-${i}`}
                className="w-16 h-2 bg-white dark:bg-gray-300 flex-shrink-0"
              />
            ))}
          </div>
        ))}
      </div>
    </div>

    <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-gray-900 dark:from-black to-transparent opacity-30" />
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: Car
 * ============================================
 */
interface CarProps {
  color: string;
  size: "small" | "medium" | "large";
  isPaused: boolean;
}

const Car: React.FC<CarProps> = ({ color, size, isPaused }) => {
  const sizeClasses = getCarSizeClasses(size);
  
  return (
    <div className={cn(
      "absolute bottom-16 sm:bottom-20 left-1/3 -translate-x-1/2",
      sizeClasses.container
    )}>
      {/* Car Shadow */}
      <div className={cn(
        "absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 bg-black/30 dark:bg-black/50 rounded-full blur-md",
        sizeClasses.shadow
      )} />
      
      {/* Car Body */}
      <div 
        className={cn(
          "relative w-full h-full rounded-t-2xl sm:rounded-t-3xl rounded-b-lg",
          color,
          !isPaused && "animate-car-bounce"
        )}
      >
        {/* Car Cabin */}
        <div className={cn(
          "absolute rounded-t-2xl sm:rounded-t-3xl",
          sizeClasses.cabin,
          color
        )}>
          <div className="absolute top-1 right-1 w-10 sm:w-14 md:w-16 h-6 sm:h-8 md:h-9 bg-cyan-400/60 dark:bg-cyan-500/40 rounded-t-xl sm:rounded-t-2xl rounded-br-lg transform skew-x-12" />
          <div className="absolute top-1 left-1 w-8 sm:w-12 md:w-14 h-6 sm:h-8 md:h-9 bg-cyan-400/60 dark:bg-cyan-500/40 rounded-t-xl sm:rounded-t-2xl rounded-bl-lg transform -skew-x-6" />
        </div>

        {/* Wheels */}
        <Wheel 
          position={cn("absolute -bottom-3 sm:-bottom-4 md:-bottom-5", sizeClasses.wheelPosition.back)}
          size={sizeClasses.wheel}
          isPaused={isPaused}
        />
        <Wheel 
          position={cn("absolute -bottom-3 sm:-bottom-4 md:-bottom-5", sizeClasses.wheelPosition.front)}
          size={sizeClasses.wheel}
          isPaused={isPaused}
        />

        {/* Lights */}
        <div className="absolute right-0.5 sm:right-1 top-4 sm:top-5 md:top-6 w-2 sm:w-3 md:w-4 h-2 sm:h-3 bg-yellow-300 dark:bg-yellow-400 rounded-l-full shadow-lg shadow-yellow-300/50 dark:shadow-yellow-400/50" />
        <div className="absolute left-0.5 sm:left-1 top-4 sm:top-5 md:top-6 w-2 sm:w-3 h-2 sm:h-3 bg-red-500 dark:bg-red-600 rounded-r-full" />
      </div>
    </div>
  );
};

/**
 * ============================================
 * SUB-COMPONENT: Wheel
 * ============================================
 */
interface WheelProps {
  position: string;
  size: string;
  isPaused: boolean;
}

const Wheel: React.FC<WheelProps> = ({ position, size, isPaused }) => (
  <div className={cn(
    "bg-gray-900 dark:bg-gray-950 rounded-full border-2 border-gray-700 dark:border-gray-800",
    size,
    position,
    !isPaused && "animate-spin-fast"
  )}>
    <div className="absolute inset-1 sm:inset-2 bg-gray-600 dark:bg-gray-700 rounded-full">
      <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gray-400 dark:bg-gray-500 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-0.5 h-full bg-gray-400 dark:bg-gray-500 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gray-400 dark:bg-gray-500 -translate-x-1/2 -translate-y-1/2 rotate-45" />
      <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gray-400 dark:bg-gray-500 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
    </div>
    <div className="absolute top-1/2 left-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-gray-800 dark:bg-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2" />
  </div>
);

/**
 * ============================================
 * SUB-COMPONENT: SpeedControl
 * ============================================
 */
interface SpeedControlProps {
  speed: number;
  pauseOnHover: boolean;
  position?: string;
  onSpeedChange?: (speed: number) => void;
  onPauseToggle?: () => void;
  showPauseToggle?: boolean;
}

const SpeedControl: React.FC<SpeedControlProps> = ({
  speed,
  pauseOnHover,
  position = "top-left",
  onSpeedChange,
  onPauseToggle,
  showPauseToggle = true,
}) => {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  return (
    <div 
      className={cn(
        "absolute bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 rounded-lg shadow-lg z-50",
        positionClasses[position as keyof typeof positionClasses]
      )}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Speed: {speed}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => onSpeedChange?.(Number(e.target.value))}
            className="w-32"
          />
        </div>
        
        {showPauseToggle && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pauseOnHover"
              checked={pauseOnHover}
              onChange={onPauseToggle}
              className="rounded"
            />
            <label htmlFor="pauseOnHover" className="text-sm text-gray-700 dark:text-gray-300">
              Pause on hover
            </label>
          </div>
        )}
      </div>
    </div>
  );
};