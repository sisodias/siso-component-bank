"use client";

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// A utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Generative Art Canvas Component
const GenerativeArtCanvas = ({ isHovered }) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let lines = [];
        const numLines = 30;

        class Line {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.speed = Math.random() * 0.5 + 0.1;
                this.angle = Math.random() * Math.PI * 2;
                this.length = Math.random() * 20 + 5;
            }
            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
                ctx.strokeStyle = `rgba(168, 85, 247, ${Math.random() * 0.3 + 0.1})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        const init = () => {
            lines = [];
            for (let i = 0; i < numLines; i++) {
                lines.push(new Line());
            }
        };

        const animate = () => {
            if (isHovered) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                lines.forEach(line => {
                    line.update();
                    line.draw();
                });
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        
        canvas.width = 400;
        canvas.height = 400;
        init();
        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />;
};


// Gallery Card Component with 3D tilt effect
const GalleryCard = ({ item, index }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };
    
    const cardVariants = {
        offscreen: { y: 50, opacity: 0 },
        onscreen: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4, duration: 0.8, delay: index * 0.1 } }
    };

    return (
        <motion.div
            key={item.title}
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative h-80 w-full rounded-xl bg-slate-900 border border-slate-800"
        >
            <div 
                style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
                className="absolute inset-4 flex flex-col justify-end p-6 rounded-lg overflow-hidden"
            >
                <img 
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/000000/ffffff?text=Error'; }}
                />
                <GenerativeArtCanvas isHovered={isHovered} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <div className="relative z-10">
                    <motion.h3 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="text-xl font-bold text-white mb-1"
                    >
                        {item.title}
                    </motion.h3>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.05 }}
                        className="text-sm text-slate-400"
                    >
                        {item.category}
                    </motion.p>
                </div>
                <div className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight />
                </div>
            </div>
        </motion.div>
    );
};


// The main Gallery component
const GenerativeArtGallery = () => {
    const galleryItems = [
        { title: "Project Cygnus", category: "Web Development", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=400&auto=format&fit=crop" },
        { title: "Project Orion", category: "UI/UX Design", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=400&auto=format&fit=crop" },
        { title: "Project Lyra", category: "Branding", image: "https://images.unsplash.com/photo-1522120691812-dcdfb625f397?q=80&w=400&auto=format&fit=crop" },
        { title: "Project Draco", category: "Mobile App", image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=400&auto=format&fit=crop" },
        { title: "Project Vela", category: "Data Visualization", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop" },
        { title: "Project Pavo", category: "AI Integration", image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=400&auto=format&fit=crop" },
    ];

    return (
        <div className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center mb-16">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
                    className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 text-white"
                >
                    Our Creations
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
                    className="text-lg text-slate-400 max-w-2xl"
                >
                    A curated selection of our finest work, where innovation meets elegant design.
                </motion.p>
            </div>

            {/* Gallery Grid */}
            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {galleryItems.map((item, index) => (
                    <GalleryCard key={item.title} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default GenerativeArtGallery;