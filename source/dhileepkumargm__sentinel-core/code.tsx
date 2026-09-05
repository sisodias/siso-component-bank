import React, { useRef, useEffect } from 'react';

const CyberneticEye = () => {
    const irisRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (!irisRef.current) return;

            const iris = irisRef.current;
            const eyeball = iris.parentElement;
            const rect = eyeball.getBoundingClientRect();
            
            const eyeX = rect.left + rect.width / 2;
            const eyeY = rect.top + rect.height / 2;

            const deltaX = event.clientX - eyeX;
            const deltaY = event.clientY - eyeY;
            
            const maxTravel = rect.width / 4;
            
            const angle = Math.atan2(deltaY, deltaX);
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxTravel);
            
            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;

            iris.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="eye-container">
            <div className="eyelid top"></div>
            <div className="eyeball">
                <div className="iris" ref={irisRef}>
                    <div className="pupil">
                        <div className="scan-line"></div>
                    </div>
                </div>
            </div>
            <div className="eyelid bottom"></div>
            <div className="details">
                 <div className="circuit c1"></div>
                 <div className="circuit c2"></div>
            </div>
        </div>
    );
};

export default CyberneticEye;