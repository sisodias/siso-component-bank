import * as React from "react";
import { motion } from "framer-motion";

export function InteractiveTiltCard({
    image = { src: "https://framerusercontent.com/images/YnBYRlxvxFzRXG9rOYVJdkGBg.jpg", alt: "Blue flower" },
    tiltFactor = 15,
    perspective = 1000,
    borderRadius = 12,
    backgroundColor = "#FFFFFF",
    shadowColor = "rgba(0, 0, 0, 0.2)",
    shadowIntensity = 0.5,
    transitionDuration = 0.2,
    hoverScale = 1.05,
    glareEffect = true,
    glareIntensity = 0.5,
    glareSize = 80,
}) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [tiltValues, setTiltValues] = React.useState({ x: 0, y: 0 });
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const cardRef = React.useRef(null);

    const handleMouseMove = React.useCallback(
        (e) => {
            if (!cardRef.current || !isHovered) return;
            const rect = cardRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
            setMousePosition({ x, y });
            const tiltX = -(y / 50) * tiltFactor;
            const tiltY = (x / 50) * tiltFactor;
            setTiltValues({ x: tiltX, y: tiltY });
        },
        [isHovered, tiltFactor]
    );

    const handleMouseEnter = React.useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = React.useCallback(() => {
        setIsHovered(false);
        setTiltValues({ x: 0, y: 0 });
    }, []);

    const glareX = mousePosition.x / 2 + 50;
    const glareY = mousePosition.y / 2 + 50;

    return (
        <motion.div ref={cardRef} style={{ position: "relative", width: "100%", height: "100%", perspective: `${perspective}px`, transformStyle: "preserve-3d", cursor: "pointer" }} animate={{ scale: isHovered ? hoverScale : 1 }} transition={{ duration: transitionDuration, ease: "easeOut" }} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <motion.div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: `${borderRadius}px`, overflow: "hidden", backgroundColor, transformStyle: "preserve-3d" }} animate={{ rotateX: tiltValues.x, rotateY: tiltValues.y, boxShadow: isHovered ? `0 25px 50px -12px rgba(0, 0, 0, ${shadowIntensity})` : `0 10px 30px -10px ${shadowColor}` }} transition={{ duration: transitionDuration, ease: "easeOut" }}>
                <img src={image.src} alt={image.alt} style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative", zIndex: 1 }}/>
                {glareEffect && (<motion.div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareIntensity}) 0%, rgba(255, 255, 255, 0) ${glareSize}%)`, pointerEvents: "none" }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: transitionDuration }}/>)}
            </motion.div>
        </motion.div>
    );
}