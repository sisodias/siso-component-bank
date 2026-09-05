// --- Pure UI Component ---
// Этот компонент остается неизменным. Он уже чист, переиспользуем
// и не зависит от какой-либо внешней среды.

import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useState, startTransition } from "react";

/**
 * ZoomImageUI - это "глупый" компонент, который отображает изображение
 * и увеличивает его при наведении курсора.
 * Вся конфигурация (масштаб, цвета, изображение) передается через props.
 */
export function ZoomImageUI({
    image = { 
        src: "https://framerusercontent.com/images/70D908ZnP0cnDre3T7DlePO12M.jpeg", 
        alt: "3D Gradient Waves" 
    },
    zoomScale = 2.5,
    transition = { duration: 0.1, ease: "easeInOut" },
    backgroundColor = "#FFFFFF",
    borderRadius = 8,
    style,
}) {
    const [isHovered, setIsHovered] = useState(false);

    const zoomInStyle = { scale: zoomScale };
    const zoomOutStyle = { scale: 1 };

    const updateTransformOrigin = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const childElement = e.currentTarget.firstChild;
        if (childElement) {
            childElement.style.transformOrigin = `${x}px ${y}px`;
        }
    };
    
    const handleMouseEnter = () => startTransition(() => setIsHovered(true));
    const handleMouseLeave = () => startTransition(() => setIsHovered(false));

    return (
        <motion.div
            style={{
                ...style,
                overflow: "hidden",
                position: "relative",
                backgroundColor,
                borderRadius,
                width: "100%",
                height: "100%",
            }}
            onMouseMove={updateTransformOrigin}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                animate={isHovered ? zoomInStyle : zoomOutStyle}
                transition={transition}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={image.src}
                    alt={image.alt}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </motion.div>
        </motion.div>
    );
}