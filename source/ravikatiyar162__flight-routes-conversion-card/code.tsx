import React from 'react';
import { motion } from 'framer-motion';

// Note: This component uses Tailwind CSS for styling.
// Ensure Tailwind is installed and configured in your project for the styles to apply.
// You can follow the official Tailwind CSS guide for React projects.

// --- Airplane SVG Icon Component ---
// A reusable SVG component for the airplane icon.
const AirplaneIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="transform rotate-90" // Rotated to point forward
    >
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
);

// --- Flight Progress Card Component ---
// This is the main card component that displays the flight information.
// It's designed to be responsive and automatically adapt to light/dark mode via Tailwind's `dark:` variants.
const FlightProgressCard = ({
    from = 'DOH',
    to = 'KOC',
    departureTime = '12.45',
    arrivalTime = '7.00',
    progress = 0.65, // Default progress to match the image
}) => {
    // Clamping progress to be between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress)) * 100;

    // Animation properties for Framer Motion
    const animationProps = {
        transition: { duration: 2.5, ease: "easeInOut" },
    };

    return (
        <div className="
            w-full max-w-md mx-auto
            flex items-center justify-between gap-4
            bg-white dark:bg-[#1c1c1e]
            border border-gray-200 dark:border-gray-700
            rounded-2xl
            p-6 sm:p-8
            shadow-lg
            font-sans
            transition-colors duration-300
        ">
            {/* Departure Information */}
            <div className="text-center flex-shrink-0">
                <p className="text-2xl sm:text-3xl font-medium text-gray-800 dark:text-gray-100">{from}</p>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{departureTime}</p>
            </div>

            {/* Progress Bar and Airplane */}
            <div className="relative flex-grow h-6 flex items-center">
                {/* Track for the progress bar */}
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

                {/* Filled portion of the progress bar with stripes */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[#e58f44]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 8px)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${clampedProgress}%` }}
                    {...animationProps}
                />

                {/* Animated Airplane Icon */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 text-black dark:text-white"
                    initial={{ left: '0%' }}
                    animate={{ left: `${clampedProgress}%` }}
                    {...animationProps}
                >
                    <div className="relative -translate-x-1/2">
                        <AirplaneIcon />
                    </div>
                </motion.div>
            </div>

            {/* Arrival Information */}
            <div className="text-center flex-shrink-0">
                <p className="text-2xl sm:text-3xl font-medium text-gray-800 dark:text-gray-100">{to}</p>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{arrivalTime}</p>
            </div>
        </div>
    );
};

// --- Main App Component ---
// This component renders the FlightProgressCard in the center of the page.
// The body/background colors should be handled in your global CSS file (e.g., index.css).
function App() {
    return (
        <div className="min-h-screen bg-gray-100 w-full dark:bg-black flex items-center justify-center p-4 transition-colors duration-300">
            <FlightProgressCard />
        </div>
    );
}

export default App;
