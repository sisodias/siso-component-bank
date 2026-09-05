import React from 'react';
import { Power } from 'lucide-react';

export function Button3D() {
  return (
    <div className="absolute flex items-center justify-center scale-100" 
         style={{ 
           transformStyle: 'preserve-3d', 
           perspective: '100px' 
         }}>
      <div className="absolute z-10 bg-black h-16 w-20 rounded-lg flex items-center justify-center pb-3 shadow-white"
           style={{ 
             transform: 'rotateX(13deg)',
             boxShadow: '0px 1px 1px 1px white'
           }}>
        <button 
          className="absolute z-20 cursor-pointer border-none border-b-2 border-white bg-gray-300 h-16 w-18 rounded-lg transition-all duration-75 text-black text-xl font-medium active:translate-y-1"
          style={{ 
            transform: 'rotateX(13deg)',
            boxShadow: '0px 4px 0px 0.2px rgb(116, 116, 116)',
            color: 'rgba(0, 0, 0, 0.7)',
            fontSize: '22px',
            fontWeight: '500',
            width: '70px',
            height: '60px'
          }}
          onMouseDown={(e) => {
            e.target.style.boxShadow = '0px 4px 0px 0.2px rgba(116, 116, 116, 0)';
            e.target.style.transform = 'translateY(4.5px)';
          }}
          onMouseUp={(e) => {
            e.target.style.boxShadow = '0px 4px 0px 0.2px rgb(116, 116, 116)';
            e.target.style.transform = 'rotateX(13deg)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0px 4px 0px 0.2px rgb(116, 116, 116)';
            e.target.style.transform = 'rotateX(13deg)';
          }}
        >
          <Power className="mx-auto pr-[1px]" />
        </button>
      </div>
    </div>
  );
}