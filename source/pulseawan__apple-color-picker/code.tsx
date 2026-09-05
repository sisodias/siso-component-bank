"use client";
import React, { useState, useEffect, useRef } from 'react';

// --- ICONS (No external packages needed) ---
const PipetteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;

// --- UTILS ---
// REMOVED 'export' keyword from helpers to prevent the docgen sandbox from crashing
function hexToRgb(hex: string) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) { r = parseInt(hex[1]+hex[1],16); g = parseInt(hex[2]+hex[2],16); b = parseInt(hex[3]+hex[3],16); } 
    else if (hex.length === 7) { r = parseInt(hex.slice(1,3),16); g = parseInt(hex.slice(3,5),16); b = parseInt(hex.slice(5,7),16); }
    return { r, g, b };
}

function rgbToHex({ r, g, b }: {r:number,g:number,b:number}) {
    return "#" + [r, g, b].map(x => { const h = Math.round(x).toString(16); return h.length === 1 ? "0"+h : h; }).join("");
}

function rgbToHsv({ r, g, b }: {r:number,g:number,b:number}) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max !== min) {
        switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToRgb({ h, s, v }: {h:number,s:number,v:number}) {
    let r = 0, g = 0, b = 0; h /= 360; s /= 100; v /= 100;
    const i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    switch (i % 6) { case 0: r=v; g=t; b=p; break; case 1: r=q; g=v; b=p; break; case 2: r=p; g=v; b=t; break; case 3: r=p; g=q; b=v; break; case 4: r=t; g=p; b=v; break; case 5: r=v; g=p; b=q; break; }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

const APPLE_GRID_COLORS = [ '#FFFFFF', '#EBEBEB', '#D6D6D6', '#C2C2C2', '#ADADAD', '#999999', '#858585', '#707070', '#5C5C5C', '#474747', '#333333', '#000000', '#003366', '#336699', '#3366CC', '#003399', '#000099', '#0000CC', '#000066', '#333366', '#663399', '#660099', '#330066', '#330033', '#006699', '#0099CC', '#0066CC', '#0033CC', '#0000FF', '#3333FF', '#333399', '#6633CC', '#9933CC', '#9900CC', '#6600CC', '#660066', '#0099CC', '#00CCFF', '#0099FF', '#0066FF', '#3366FF', '#6666FF', '#6666CC', '#9966CC', '#CC66FF', '#CC33FF', '#9900FF', '#990099', '#33CCCC', '#66FFFF', '#33CCFF', '#3399FF', '#6699FF', '#9999FF', '#9999CC', '#CC99FF', '#FF99FF', '#FF66FF', '#CC00FF', '#CC00CC', '#66CCCC', '#99FFFF', '#66CCFF', '#6699FF', '#99CCFF', '#CCCCFF', '#CC99CC', '#FFCCFF', '#FF99FF', '#FF66FF', '#FF33FF', '#FF00FF', '#99CCCC', '#CCFFFF', '#99CCFF', '#9999FF', '#CCCCFF', '#FFFFFF', '#FFCCFF', '#FF99FF', '#FF66FF', '#FF00FF', '#CC00CC', '#990099', '#CCFFCC', '#FFFFCC', '#FFFF99', '#FFFF66', '#FFFF33', '#FFFF00', '#FFCC00', '#FF9900', '#FF6600', '#FF3300', '#FF0000', '#CC0000', '#99FF99', '#CCFF99', '#CCCC66', '#CCCC33', '#CCCC00', '#CC9900', '#CC6600', '#CC3300', '#CC0000', '#990000', '#660000', '#330000', '#66FF66', '#99FF66', '#99CC66', '#99CC33', '#999900', '#996600', '#993300', '#990000', '#660000', '#330000', '#000000', '#000000', '#33FF33', '#66FF33', '#66CC33', '#669933', '#666600', '#663300', '#660000', '#330000', '#000000', '#000000', '#000000', '#000000', '#00FF00', '#33FF00', '#33CC00', '#339900', '#336600', '#333300', '#330000', '#000000', '#000000', '#000000', '#000000', '#000000' ];

// --- COMPONENTS ---
const SegmentedControl = ({ options, selected, onChange }: any) => (
    <div className="relative flex items-center bg-[#E3E3E8] rounded-[9px] p-[2px] mb-4">
        {options.map((option: string) => {
            const isSelected = selected === option;
            return (
                <button key={option} onClick={() => onChange(option)} className={`relative flex-1 z-10 py-1 text-[13px] font-medium transition-all duration-200 ${isSelected ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                    {isSelected && <div className="absolute inset-0 bg-white rounded-[7px] shadow-sm" style={{ zIndex: -1 }} />}
                    {option}
                </button>
            );
        })}
    </div>
);

const ColorGrid = ({ selectedHex, onChange }: any) => (
    <div className="grid grid-cols-12 gap-[1px] bg-gray-200 p-[1px] rounded-lg overflow-hidden h-[200px]">
        {APPLE_GRID_COLORS.map((color, idx) => {
            const isSelected = selectedHex.toUpperCase() === color.toUpperCase();
            return (
                <button key={idx} className="relative w-full h-full hover:z-10 focus:outline-none" style={{ backgroundColor: color }} onClick={() => onChange(color)}>
                    {isSelected && <div className="absolute inset-0 border-2 border-white mix-blend-difference z-20 pointer-events-none" />}
                </button>
            );
        })}
    </div>
);

const SpectrumPicker = ({ hsv, onChange }: any) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = (e: any) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        let y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        onChange({ h: x * 360, s: 100 - (y * 100), v: 100 });
    };

    useEffect(() => {
        const handleUp = () => setIsDragging(false);
        const handleGlobalMove = (e: any) => { if (isDragging) handleMove(e); };
        if (isDragging) { window.addEventListener('mousemove', handleGlobalMove); window.addEventListener('mouseup', handleUp); }
        return () => { window.removeEventListener('mousemove', handleGlobalMove); window.removeEventListener('mouseup', handleUp); };
    }, [isDragging]);

    return (
        <div ref={containerRef} className="relative w-full h-[200px] rounded-xl overflow-hidden cursor-crosshair shadow-inner" style={{ background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #FFF, transparent), linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)` }} onMouseDown={(e) => { setIsDragging(true); handleMove(e); }}>
            <div className="absolute w-4 h-4 -ml-2 -mt-2 border-2 border-white rounded-full shadow-md pointer-events-none transition-transform duration-75" style={{ left: `${(hsv.h / 360) * 100}%`, top: `${100 - hsv.s}%`, backgroundColor: rgbToHex(hsvToRgb(hsv)) }} />
        </div>
    );
};

const SliderPicker = ({ rgb, hex, onChangeRGB, onChangeHex }: any) => {
    const handleSliderChange = (color: string, value: number) => onChangeRGB({ ...rgb, [color]: value });
    const SliderRow = ({ label, colorKey, value, bgGradient }: any) => (
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 text-xs font-semibold text-gray-500 uppercase">{label}</div>
            <div className="flex-1 relative h-6 rounded-full shadow-inner" style={{ background: bgGradient }}>
                <input type="range" min="0" max="255" value={value} onChange={(e) => handleSliderChange(colorKey, parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="absolute top-1/2 -mt-2.5 w-5 h-5 bg-white rounded-full shadow-md border border-gray-200 pointer-events-none" style={{ left: `calc(${(value / 255) * 100}% - 10px)` }}>
                    <div className="absolute inset-1 rounded-full bg-black/10" />
                </div>
            </div>
            <input type="number" value={value} onChange={(e) => handleSliderChange(colorKey, Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))} className="w-12 h-6 px-1 text-xs text-center border border-gray-200 rounded bg-white focus:outline-none" />
        </div>
    );
    return (
        <div className="py-2 h-[200px] flex flex-col justify-between">
            <SliderRow label="Red" colorKey="r" value={rgb.r} bgGradient={`linear-gradient(to right, #000000, #FF0000)`} />
            <SliderRow label="Green" colorKey="g" value={rgb.g} bgGradient={`linear-gradient(to right, #000000, #00FF00)`} />
            <SliderRow label="Blue" colorKey="b" value={rgb.b} bgGradient={`linear-gradient(to right, #000000, #0000FF)`} />
            <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer">Hex Color #</span>
                <input type="text" value={hex.replace('#', '')} onChange={(e) => { const val = e.target.value; if (/^[0-9A-Fa-f]{0,6}$/.test(val)) onChangeHex('#' + val); }} className="w-20 px-2 py-1 text-sm font-medium text-right border border-gray-200 rounded uppercase" />
            </div>
        </div>
    );
};

const OpacitySlider = ({ opacity, hex, onChange }: any) => (
    <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Opacity</div>
        <div className="flex items-center gap-4">
            <div className="flex-1 relative h-6 rounded-full shadow-inner bg-white overflow-hidden" style={{ backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%)`, backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 0, 4px -4px, 0px 4px' }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to right, transparent, ${hex})` }} />
                <input type="range" min="0" max="100" value={opacity} onChange={(e) => onChange(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="absolute top-1/2 -mt-2.5 w-5 h-5 bg-white rounded-full shadow-md border border-gray-200 pointer-events-none z-0" style={{ left: `calc(${opacity}% - 10px)` }}>
                    <div className="absolute inset-1 rounded-full" style={{ backgroundColor: hex, opacity: opacity / 100 }} />
                </div>
            </div>
            <input type="text" value={`${opacity}%`} onChange={(e) => { const val = parseInt(e.target.value.replace('%', '')); if (!isNaN(val)) onChange(Math.max(0, Math.min(100, val))); }} className="w-14 px-2 py-1 text-sm font-medium text-center border border-gray-200 rounded" />
        </div>
    </div>
);

const RecentColors = ({ recentColors, currentColor, onSelect, onAdd }: any) => (
    <div className="mt-4 border-t border-gray-200 pt-4 flex gap-4">
        <div className="w-12 h-12 rounded-lg shadow-inner border border-gray-200" style={{ backgroundColor: currentColor }} />
        <div className="flex-1 grid grid-cols-6 gap-2 place-content-start">
            {recentColors.map((color: string, idx: number) => (
                <button key={idx} onClick={() => onSelect(color)} className="w-6 h-6 rounded-full shadow-sm border border-gray-200 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
            ))}
            {recentColors.length < 12 && (
                <button onClick={onAdd} className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-500">
                    <PlusIcon />
                </button>
            )}
        </div>
    </div>
);

// ONLY THIS COMPONENT SHOULD BE EXPORTED
export const Component = ({ isOpen, onClose, initialColor = '#007AFF', onChange }: any) => {
    const [activeTab, setActiveTab] = useState('Grid');
    const [hex, setHex] = useState(initialColor);
    const [rgb, setRgb] = useState(hexToRgb(initialColor));
    const [hsv, setHsv] = useState(rgbToHsv(hexToRgb(initialColor)));
    const [opacity, setOpacity] = useState(100);
    const [recentColors, setRecentColors] = useState(['#000000', '#FFFFFF', '#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55']);

    const handleHexChange = (newHex: string) => { setHex(newHex); setRgb(hexToRgb(newHex)); setHsv(rgbToHsv(hexToRgb(newHex))); if (onChange) onChange(newHex); };
    const handleRgbChange = (newRgb: any) => { setRgb(newRgb); setHex(rgbToHex(newRgb)); setHsv(rgbToHsv(newRgb)); if (onChange) onChange(rgbToHex(newRgb)); };
    const handleHsvChange = (newHsv: any) => { setHsv(newHsv); setRgb(hsvToRgb(newHsv)); setHex(rgbToHex(hsvToRgb(newHsv))); if (onChange) onChange(rgbToHex(hsvToRgb(newHsv))); };
    const handleAddRecent = () => { if (!recentColors.includes(hex)) setRecentColors(prev => [hex, ...prev].slice(0, 12)); };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />
            <div className="pointer-events-auto relative w-[280px] bg-[#F5F5F7]/95 backdrop-blur-xl border border-white/20 rounded-[24px] shadow-2xl overflow-hidden p-4 select-none animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                    <button className="p-1.5 rounded-full hover:bg-black/5 transition-colors text-blue-500"><PipetteIcon /></button>
                    <h2 className="text-[15px] font-semibold text-black">Colors</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/5 transition-colors text-gray-500"><XIcon /></button>
                </div>
                <SegmentedControl options={['Grid', 'Spectrum', 'Slider']} selected={activeTab} onChange={setActiveTab} />
                <div className="h-[200px]">
                    {activeTab === 'Grid' && <ColorGrid selectedHex={hex} onChange={handleHexChange} />}
                    {activeTab === 'Spectrum' && <SpectrumPicker hsv={hsv} onChange={handleHsvChange} />}
                    {activeTab === 'Slider' && <SliderPicker rgb={rgb} hex={hex} onChangeRGB={handleRgbChange} onChangeHex={handleHexChange} />}
                </div>
                <OpacitySlider opacity={opacity} hex={hex} onChange={setOpacity} />
                <RecentColors recentColors={recentColors} currentColor={hex} onSelect={handleHexChange} onAdd={handleAddRecent} />
            </div>
        </div>
    );
};
