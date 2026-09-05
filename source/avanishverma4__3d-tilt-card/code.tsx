import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

export default function TiltCard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [imageUrl, setImageUrl] = useState('https://plus.unsplash.com/premium_photo-1759345157520-66920771f7b1?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = ((y - centerY) / centerY) * -15;
    const tiltY = ((x - centerX) / centerX) * 15;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const shadowX = tilt.y * 0.5;
  const shadowY = tilt.x * 0.5;
  const shadowBlur = 40 + Math.abs(tilt.x + tilt.y) * 0.5;

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-zinc-950 p-8 relative overflow-hidden">
      {/* Orthogonal Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="relative z-10">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-80 h-96 cursor-pointer overflow-hidden transition-all duration-200 ease-out border-2 border-slate-700 rounded-lg bg-white shadow-sm"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
            boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.5)`,
          }}
        >
          <div className="p-0 h-full relative group">
            <img
              src={imageUrl}
              alt="Card"
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <label
              htmlFor="image-upload"
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
            >
              <Upload className="w-5 h-5 text-slate-900" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white font-bold text-xl mb-1">3D Tilt Card</h3>
              <p className="text-white/80 text-sm">Hover to interact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
