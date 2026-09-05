import { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const blur1Ref = useRef<HTMLDivElement>(null);
  const blur2Ref = useRef<HTMLDivElement>(null);
  const blur3Ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const blurElements = [blur1Ref.current, blur2Ref.current, blur3Ref.current].filter(Boolean);
    
    // Random value generators
    const randomX = (direction = 1) => (Math.random() * 800 - 400) * direction;
    const randomY = (direction = 1) => (Math.random() * 400 - 200) * direction;
    const randomTime = () => Math.random() * 6 + 6;
    const randomTime2 = () => Math.random() * 1 + 5;
    const randomAngle = (direction = 1) => (Math.random() * 180 - 30) * direction;
    
    // Initial positions
    blurElements.forEach((blur) => {
      if (blur) {
        blur.style.transform = `translate(${randomX(-1)}px, ${randomX(1)}px) rotate(${randomAngle(-1)}deg)`;
      }
    });
    
    // Animation functions
    const rotate = (target: HTMLElement, direction: number) => {
      const duration = randomTime2() * 1000;
      const angle = randomAngle(direction);
      
      const startTime = performance.now();
      const startAngle = parseFloat(target.style.transform.split('rotate(')[1]?.split('deg')[0] || '0');
      
      const animateRotation = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Simple easing function (sine ease in-out)
        const easing = -(Math.cos(Math.PI * progress) - 1) / 2;
        
        const currentAngle = startAngle + (angle - startAngle) * easing;
        
        // Extract existing translate values
        const transform = target.style.transform;
        const translateMatch = transform.match(/translate\((.*?),(.*?)\)/);
        const translateX = translateMatch ? translateMatch[1] : '0px';
        const translateY = translateMatch ? translateMatch[2] : '0px';
        
        target.style.transform = `translate(${translateX}, ${translateY}) rotate(${currentAngle}deg)`;
        
        if (progress < 1) {
          requestAnimationFrame(animateRotation);
        } else {
          // Continue with opposite direction
          setTimeout(() => rotate(target, direction * -1), 0);
        }
      };
      
      requestAnimationFrame(animateRotation);
    };
    
    const moveX = (target: HTMLElement, direction: number) => {
      const duration = randomTime() * 1000;
      const targetX = randomX(direction);
      
      const startTime = performance.now();
      const transform = target.style.transform;
      const translateMatch = transform.match(/translate\((.*?),(.*?)\)/);
      const startX = parseFloat(translateMatch ? translateMatch[1] : '0');
      const currentY = translateMatch ? translateMatch[2] : '0px';
      
      const animateX = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Simple easing function (sine ease in-out)
        const easing = -(Math.cos(Math.PI * progress) - 1) / 2;
        
        const currentX = startX + (targetX - startX) * easing;
        
        // Extract existing rotation
        const rotateMatch = transform.match(/rotate\((.*?)deg\)/);
        const rotation = rotateMatch ? rotateMatch[1] : '0';
        
        target.style.transform = `translate(${currentX}px, ${currentY}) rotate(${rotation}deg)`;
        
        if (progress < 1) {
          requestAnimationFrame(animateX);
        } else {
          // Continue with opposite direction
          setTimeout(() => moveX(target, direction * -1), 0);
        }
      };
      
      requestAnimationFrame(animateX);
    };
    
    const moveY = (target: HTMLElement, direction: number) => {
      const duration = randomTime() * 1000;
      const targetY = randomY(direction);
      
      const startTime = performance.now();
      const transform = target.style.transform;
      const translateMatch = transform.match(/translate\((.*?),(.*?)\)/);
      const currentX = translateMatch ? translateMatch[1] : '0px';
      const startY = parseFloat(translateMatch ? translateMatch[2] : '0');
      
      const animateY = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Simple easing function (sine ease in-out)
        const easing = -(Math.cos(Math.PI * progress) - 1) / 2;
        
        const currentY = startY + (targetY - startY) * easing;
        
        // Extract existing rotation
        const rotateMatch = transform.match(/rotate\((.*?)deg\)/);
        const rotation = rotateMatch ? rotateMatch[1] : '0';
        
        target.style.transform = `translate(${currentX}, ${currentY}px) rotate(${rotation}deg)`;
        
        if (progress < 1) {
          requestAnimationFrame(animateY);
        } else {
          // Continue with opposite direction
          setTimeout(() => moveY(target, direction * -1), 0);
        }
      };
      
      requestAnimationFrame(animateY);
    };
    
    // Start animations for each blur element
    blurElements.forEach((blur) => {
      if (blur) {
        moveX(blur, 1);
        moveY(blur, -1);
        rotate(blur, 1);
      }
    });
    
    return () => {
      // Cleanup would go here if needed
    };
  }, []);
  
  return (
    <section className="wrapper">
      <div ref={blur1Ref} className="blur"></div>
      <div ref={blur2Ref} className="blur"></div>
      <div ref={blur3Ref} className="blur"></div>
    </section>
  );
};

export {AnimatedBackground}