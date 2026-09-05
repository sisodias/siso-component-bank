import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";

export default function Preloader() {
 const loaderRef = useRef<HTMLDivElement>(null);
 const textRef = useRef<HTMLDivElement>(null);
 const [loaded, setLoaded] = useState(false);

 useLayoutEffect(() => {
   let animationFrame: number;

   const checkReady = () => {
     if (document.readyState === "complete") {
       setLoaded(true);
     } else {
       animationFrame = requestAnimationFrame(checkReady);
     }
   };

   checkReady();

   return () => cancelAnimationFrame(animationFrame);
 }, []);

 useLayoutEffect(() => {
   if (loaded && loaderRef.current && textRef.current) {
     const tl = gsap.timeline({
       defaults: { ease: "power2.inOut" },
       onComplete: () => {
         gsap.set(loaderRef.current, {
           pointerEvents: "none",
           display: "none",
         });
       },
     });

     tl.to(textRef.current, { scale: 5, opacity: 0, duration: 0.8 });
     tl.to(
       loaderRef.current,
       {
         y: "-105%",
         borderBottomLeftRadius: "50% 20%",
         borderBottomRightRadius: "50% 20%",
         duration: 1,
       },
       "<"
     );
   }
 }, [loaded]);

 return (
   <div
     ref={loaderRef}
     className="fixed inset-0 z-50 flex items-center justify-center bg-black shadow-2xl"
     style={{
       transform: "translateY(0%)",
       borderBottomLeftRadius: "0%",
       borderBottomRightRadius: "0%",
     }}>
     <div
       ref={textRef}
       className="text-white text-3xl font-sans animate-pulse">
       Getting Ready..
     </div>
   </div>
 );
}

