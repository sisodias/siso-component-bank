import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Copy, Check, Download } from 'lucide-react';

/**
 * Custom UI Components
 * Recreating shadcn/ui components with premium styling
 */

// Button Component
const Button = React.forwardRef(({ className = '', children, variant = 'default', size = 'default', ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-light tracking-wide uppercase transition-all disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-white text-black hover:bg-gray-200",
    outline: "bg-transparent border border-white/30 text-white hover:border-white/60 hover:bg-white/5",
    ghost: "bg-transparent hover:bg-white/10 text-white",
  };
  
  const sizes = {
    default: "h-11 px-6 text-xs rounded-sm",
    sm: "h-8 px-4 text-xs rounded-sm",
    lg: "h-12 px-8 text-sm rounded-sm",
    icon: "h-12 w-12 rounded-sm",
  };
  
  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

// Label Component
const Label = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={`text-xs tracking-widest uppercase text-white ${className}`}
      {...props}
    >
      {children}
    </label>
  );
});

// Input Component
const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`flex h-12 w-full rounded-sm border border-white/20 bg-black px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});

// Slider Component
const Slider = React.forwardRef(({ className = '', value = [0], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  const handleChange = (e) => {
    const newValue = [parseFloat(e.target.value)];
    onValueChange?.(newValue);
  };
  
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="slider-input w-full h-1 bg-white/20 rounded-sm appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, white 0%, white ${((value[0] - min) / (max - min)) * 100}%, rgba(255,255,255,0.2) ${((value[0] - min) / (max - min)) * 100}%, rgba(255,255,255,0.2) 100%)`
        }}
        {...props}
      />
    </div>
  );
});

/**
 * GradientGenerator Component
 * 
 * A comprehensive gradient creation tool with support for:
 * - Linear, Radial, and Conic gradients
 * - Multiple color stops with position control
 * - Angle/position customization
 * - Noise overlay effect
 * - CSS export and preview download
 */
export default function GradientGenerator() {
  // Gradient type: 'linear', 'radial', or 'conic'
  const [gradientType, setGradientType] = useState('linear');
  
  // Color stops: array of {color: string, position: number (0-100)}
  const [colorStops, setColorStops] = useState([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 }
  ]);
  
  // Gradient angle (for linear) or position (for radial/conic)
  const [angle, setAngle] = useState(135);
  const [radialPosition, setRadialPosition] = useState({ x: 50, y: 50 });
  
  // Noise effect settings
  const [noiseEnabled, setNoiseEnabled] = useState(false);
  const [noiseOpacity, setNoiseOpacity] = useState(0.1);
  
  // UI state
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  /**
   * Generates the CSS gradient string based on current settings
   * @returns {string} CSS gradient value
   */
  const generateGradientCSS = () => {
    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stops})`;
      case 'radial':
        return `radial-gradient(circle at ${radialPosition.x}% ${radialPosition.y}%, ${stops})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg at ${radialPosition.x}% ${radialPosition.y}%, ${stops})`;
      default:
        return '';
    }
  };

  /**
   * Generates noise texture on canvas using Perlin-like noise simulation
   */
  useEffect(() => {
    if (!canvasRef.current || !noiseEnabled) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Generate random noise pattern
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;     // R
      data[i + 1] = noise; // G
      data[i + 2] = noise; // B
      data[i + 3] = 255 * noiseOpacity; // A
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, [noiseEnabled, noiseOpacity]);

  /**
   * Adds a new color stop at 50% position
   */
  const addColorStop = () => {
    setColorStops([...colorStops, { color: '#ffffff', position: 50 }]);
  };

  /**
   * Removes a color stop by index
   * @param {number} index - Index of color stop to remove
   */
  const removeColorStop = (index) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((_, i) => i !== index));
    }
  };

  /**
   * Updates a specific color stop
   * @param {number} index - Index of color stop
   * @param {string} field - 'color' or 'position'
   * @param {any} value - New value
   */
  const updateColorStop = (index, field, value) => {
    const updated = [...colorStops];
    updated[index][field] = value;
    setColorStops(updated);
  };

  /**
   * Copies the gradient CSS to clipboard
   */
  const copyToClipboard = () => {
    const css = `background: ${generateGradientCSS()};`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Downloads the gradient as a PNG image
   */
  const downloadGradient = () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1920;
    tempCanvas.height = 1080;
    const ctx = tempCanvas.getContext('2d');
    
    // Create gradient on temp canvas
    let gradient;
    switch (gradientType) {
      case 'linear':
        const angleRad = (angle - 90) * Math.PI / 180;
        const x1 = tempCanvas.width / 2 + Math.cos(angleRad) * tempCanvas.width;
        const y1 = tempCanvas.height / 2 + Math.sin(angleRad) * tempCanvas.height;
        const x2 = tempCanvas.width / 2 - Math.cos(angleRad) * tempCanvas.width;
        const y2 = tempCanvas.height / 2 - Math.sin(angleRad) * tempCanvas.height;
        gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        break;
      case 'radial':
        gradient = ctx.createRadialGradient(
          tempCanvas.width * radialPosition.x / 100,
          tempCanvas.height * radialPosition.y / 100,
          0,
          tempCanvas.width * radialPosition.x / 100,
          tempCanvas.height * radialPosition.y / 100,
          Math.max(tempCanvas.width, tempCanvas.height)
        );
        break;
      case 'conic':
        gradient = ctx.createConicGradient(
          angle * Math.PI / 180,
          tempCanvas.width * radialPosition.x / 100,
          tempCanvas.height * radialPosition.y / 100
        );
        break;
    }
    
    colorStops.forEach(stop => {
      gradient.addColorStop(stop.position / 100, stop.color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Add noise if enabled
    if (noiseEnabled) {
      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = tempCanvas.width;
      noiseCanvas.height = tempCanvas.height;
      const noiseCtx = noiseCanvas.getContext('2d');
      const imageData = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise;
        data[i + 1] = noise;
        data[i + 2] = noise;
        data[i + 3] = 255 * noiseOpacity;
      }
      
      noiseCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(noiseCanvas, 0, 0);
    }
    
    tempCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gradient.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const gradientStyle = {
    background: generateGradientCSS()
  };

  return (
    <div className="w-full min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-light tracking-wider text-white mb-3 uppercase">Gradient Generator</h1>
          <div className="w-16 h-px bg-white mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm tracking-wide uppercase">Create Luxurious Gradients</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative h-96 overflow-hidden shadow-2xl border border-white/10">
              <div style={gradientStyle} className="absolute inset-0" />
              {noiseEnabled && (
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={copyToClipboard}
                className="flex-1"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied' : 'Copy CSS'}
              </Button>
              <Button
                onClick={downloadGradient}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {/* CSS Output */}
            <div className="bg-black rounded-sm p-6 border border-white/20">
              <code className="text-sm text-white/80 break-all font-mono">
                background: {generateGradientCSS()};
              </code>
            </div>
          </motion.div>

          {/* Controls Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black rounded-sm p-8 border border-white/20 space-y-8"
          >
            {/* Gradient Type Selector */}
            <div>
              <Label className="mb-4 block">Gradient Type</Label>
              <div className="grid grid-cols-3 gap-3">
                {['linear', 'radial', 'conic'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={`py-3 px-4 rounded-sm font-light tracking-wider uppercase text-xs transition-all ${
                      gradientType === type
                        ? 'bg-white text-black'
                        : 'bg-transparent border border-white/30 text-white hover:border-white/60'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle/Position Control */}
            {gradientType === 'linear' ? (
              <div>
                <Label className="mb-4 block">Angle: {angle}°</Label>
                <Slider
                  value={[angle]}
                  onValueChange={(val) => setAngle(val[0])}
                  min={0}
                  max={360}
                  step={1}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="mb-4 block">Position X: {radialPosition.x}%</Label>
                  <Slider
                    value={[radialPosition.x]}
                    onValueChange={(val) => setRadialPosition({ ...radialPosition, x: val[0] })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label className="mb-4 block">Position Y: {radialPosition.y}%</Label>
                  <Slider
                    value={[radialPosition.y]}
                    onValueChange={(val) => setRadialPosition({ ...radialPosition, y: val[0] })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                {gradientType === 'conic' && (
                  <div>
                    <Label className="mb-4 block">Rotation: {angle}°</Label>
                    <Slider
                      value={[angle]}
                      onValueChange={(val) => setAngle(val[0])}
                      min={0}
                      max={360}
                      step={1}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Color Stops */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Color Stops</Label>
                <Button
                  onClick={addColorStop}
                  size="sm"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {colorStops.map((stop, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/5 rounded-sm p-4 space-y-3 border border-white/10"
                    >
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                          className="w-12 h-12 rounded-sm cursor-pointer border border-white/20 bg-black"
                        />
                        <Input
                          type="text"
                          value={stop.color}
                          onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                          className="flex-1 font-mono"
                        />
                        {colorStops.length > 2 && (
                          <Button
                            onClick={() => removeColorStop(index)}
                            variant="outline"
                            size="icon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Label className="text-white/70 whitespace-nowrap">
                          {stop.position}%
                        </Label>
                        <Slider
                          value={[stop.position]}
                          onValueChange={(val) => updateColorStop(index, 'position', val[0])}
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Noise Controls */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex items-center justify-between mb-4">
                <Label>Noise Effect</Label>
                <button
                  onClick={() => setNoiseEnabled(!noiseEnabled)}
                  className={`relative w-14 h-7 rounded-sm transition-colors border ${
                    noiseEnabled ? 'bg-white border-white' : 'bg-transparent border-white/30'
                  }`}
                >
                  <motion.div
                    animate={{ x: noiseEnabled ? 28 : 2 }}
                    className={`absolute top-1 w-5 h-5 rounded-sm transition-colors ${
                      noiseEnabled ? 'bg-black' : 'bg-white'
                    }`}
                  />
                </button>
              </div>

              {noiseEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <Label className="text-white/70 mb-3 block">
                    Opacity: {Math.round(noiseOpacity * 100)}%
                  </Label>
                  <Slider
                    value={[noiseOpacity]}
                    onValueChange={(val) => setNoiseOpacity(val[0])}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      <style>{`
        .slider-input::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: white;
          cursor: pointer;
          border-radius: 2px;
        }
        
        .slider-input::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: white;
          cursor: pointer;
          border: none;
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}