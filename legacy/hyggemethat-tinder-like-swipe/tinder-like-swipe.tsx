// File: ./SwipeableCardStack.jsx
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SwipeableCardStack({
    images = [],
    borderRadius = 16,
    showInnerShadows = true,
    greenShadowColor = "rgba(45, 150, 45, 0.75)",
    redShadowColor = "rgba(224, 83, 83, 0.75)",
    innerStrokeColor = "rgba(0, 0, 0, 0.1)",
    shadowSize = "0 8px 20px",
    shadowBlur = "rgba(0, 0, 0, 0.3)",
    rightIcon = null,
    leftIcon = null,
}) {
    const [cards, setCards] = React.useState([...images]);
    const [dragDirections, setDragDirections] = React.useState({});
    const swipeThreshold = 100;

    React.useEffect(() => {
        if (images.length > 0 && cards.length === 0) {
            const timer = setTimeout(() => {
                setCards([...images]);
                setDragDirections({});
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [cards.length, images]);

    React.useEffect(() => { setCards([...images]); }, [images]);

    const handleDrag = (event, info, index) => {
        setDragDirections((prev) => ({ ...prev, [index]: info.offset.x > 0 ? "right" : "left" }));
    };

    const handleDragEnd = (event, info, index) => {
        if (Math.abs(info.offset.x) > swipeThreshold) {
            handleSwipe(index, dragDirections[index]);
        } else {
            setDragDirections((prev) => ({ ...prev, [index]: null }));
        }
    };

    const handleSwipe = (index, direction) => {
        setDragDirections((prev) => ({ ...prev, [index]: direction }));
        setTimeout(() => {
            setCards((prevCards) => prevCards.filter((_, i) => i !== index));
        }, 300);
    };
    
    // ... (остальной код компонента без изменений)
    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <AnimatePresence>
                {cards.map((image, index) => {
                    const isTopCard = index === cards.length - 1;
                    const direction = dragDirections[index];
                    return (
                        <motion.div
                            key={image + index}
                            drag={isTopCard ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.5}
                            onDrag={(e, i) => handleDrag(e, i, index)}
                            onDragEnd={(e, i) => handleDragEnd(e, i, index)}
                            custom={{ direction }}
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: isTopCard ? 1 : 0.95, y: isTopCard ? 0 : -20, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
                            exit="exit"
                            variants={{ exit: (custom) => ({ x: (custom?.direction || "left") === "right" ? 300 : -300, rotate: (custom?.direction || "left") === "right" ? 20 : -20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }) }}
                            style={{ position: "absolute", width: "100%", height: "100%", backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius, boxShadow: `inset 0 0 0 1px ${innerStrokeColor}, ${shadowSize} ${shadowBlur}`, cursor: isTopCard ? "grab" : "default" }}
                        >
                            {isTopCard && showInnerShadows && (
                                <>
                                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius, pointerEvents: "none", boxShadow: direction === "right" ? `inset 0px -80px 60px ${greenShadowColor}` : direction === "left" ? `inset 0px -80px 60px ${redShadowColor}` : "none", transition: "box-shadow 0.2s ease-out" }}/>
                                    {direction && (rightIcon || leftIcon) && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 1 }}><img src={direction === "right" ? rightIcon : leftIcon} alt="" style={{ width: "80px", height: "80px", objectFit: "contain" }}/></div>}
                                </>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}