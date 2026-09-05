"use client";

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';

// A utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// A reusable Star Rating component for better componentization and accessibility
const StarRating = ({ rating, reviewCount }) => (
    <div role="img" aria-label={`${rating} out of 5 stars`} className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
            <Star 
                key={i} 
                className={cn(
                    "h-4 w-4",
                    i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                )} 
            />
        ))}
        <span className="text-xs text-slate-500 ml-2">({reviewCount} reviews)</span>
    </div>
);


// The main Product Card component, now accepting props for reusability
const InteractiveProductCard = ({ product }) => {
    // --- 3D Tilt Effect Logic ---
    // Create motion values to track mouse position
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Create spring animations for smooth transitions
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30, bounce: 0.2 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30, bounce: 0.2 });

    // Transform mouse position into 3D rotation
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Handle mouse movement over the card
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        // Calculate mouse position percentage relative to the card center
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        // Update motion values
        x.set(xPct);
        y.set(yPct);
    };

    // Reset mouse position when the mouse leaves the card
    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative w-full max-w-xs h-[480px] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900"
        >
            <div 
                style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
                className="absolute inset-5 flex flex-col justify-between p-6 rounded-lg bg-gray-950/80 backdrop-blur-md border border-slate-700"
            >
                {/* Product Image with 3D effect */}
                <motion.div 
                    style={{ transform: "translateZ(50px)" }}
                    className="relative h-48"
                >
                    <img 
                        src={product.imageUrl} 
                        alt={product.altText}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x200/111827/ffffff?text=Image+Error'; }}
                    />
                </motion.div>

                {/* Product Info with 3D effect */}
                <div style={{ transform: "translateZ(40px)" }}>
                    <h2 className="text-2xl font-bold text-white">{product.title}</h2>
                    <p className="text-sm text-slate-400 mb-2">{product.category}</p>
                    <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                </div>

                {/* Price and Add to Cart button with 3D effect */}
                <div 
                    style={{ transform: "translateZ(30px)" }}
                    className="flex items-center justify-between"
                >
                    <p className="text-3xl font-bold text-white">${product.price.toFixed(2)}</p>
                    <motion.button 
                        aria-label="Add to cart"
                        initial={{ scale: 0, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-indigo-600 text-white p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        <ShoppingCart className="h-6 w-6" />
                    </motion.button>
                </div>
            </div>
             {/* Interactive Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: useTransform(
                        [mouseXSpring, mouseYSpring],
                        ([px, py]) => `radial-gradient(400px circle at ${px * 175 + 175}px ${py * 225 + 225}px, rgba(139, 92, 246, 0.2), transparent 80%)`
                    ),
                }}
            />
        </motion.div>
    );
};

export default InteractiveProductCard;