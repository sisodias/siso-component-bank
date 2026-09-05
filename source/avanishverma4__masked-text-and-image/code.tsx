import React, { useState } from 'react';

export default function ImageMaskedText() {
  const [text, setText] = useState('AMAZING');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200');
  const [fontSize, setFontSize] = useState(120);
  const [fontWeight, setFontWeight] = useState(900);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [textAlign, setTextAlign] = useState('center');
  const [fitMode, setFitMode] = useState('cover');
  const [customScale, setCustomScale] = useState(100);
  const [textColor, setTextColor] = useState('#000000');

  const getBackgroundStyle = () => {
    const baseStyle = {
      backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };

    if (fitMode === 'cover') {
      return { ...baseStyle, backgroundSize: 'cover' };
    } else if (fitMode === 'contain') {
      return { ...baseStyle, backgroundSize: 'contain' };
    } else if (fitMode === 'percent') {
      return { ...baseStyle, backgroundSize: `${customScale}%` };
    }

    return baseStyle;
  };

  const textStyle = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: lineHeight,
    textAlign: textAlign,
    color: textColor,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: imageUrl ? 'transparent' : textColor,
    ...getBackgroundStyle(),
  };

  return (
    <div 
      className="w-full min-h-screen bg-black p-8"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Image Masked Text</h1>
          <p className="text-gray-400">Creates text with an image mask effect for striking typography</p>
        </div>

        {/* Preview Area */}
        <div 
          className="rounded-xl p-12 mb-8 min-h-[400px] flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)'
          }}
        >
          <div 
            style={textStyle}
            className="font-black uppercase select-none"
          >
            {text}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Controls */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Text Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Text Content</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Font Weight: {fontWeight}
                </label>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="100"
                  value={fontWeight}
                  onChange={(e) => setFontWeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Letter Spacing: {letterSpacing}px
                </label>
                <input
                  type="range"
                  min="-10"
                  max="30"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Line Height: {lineHeight}
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="2"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Text Align</label>
                <div className="flex gap-2">
                  {['left', 'center', 'right'].map((align) => (
                    <button
                      key={align}
                      onClick={() => setTextAlign(align)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        textAlign === align
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fallback Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Image Controls */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Image Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image Fit Mode</label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'cover', label: 'Cover', desc: 'Image scales to cover entire text' },
                    { value: 'contain', label: 'Contain', desc: 'Image fits within text bounds' },
                    { value: 'percent', label: 'Custom %', desc: 'Custom scaling percentage' }
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setFitMode(mode.value)}
                      className={`px-4 py-3 rounded-lg text-left transition-colors ${
                        fitMode === mode.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium">{mode.label}</div>
                      <div className="text-sm opacity-75">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {fitMode === 'percent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Scale: {customScale}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={customScale}
                    onChange={(e) => setCustomScale(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Try these sample images:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
                    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1200',
                    'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200'
                  ].map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setImageUrl(url)}
                      className="h-16 rounded-lg overflow-hidden border-2 border-gray-600 hover:border-blue-500 transition-colors"
                      style={{
                        backgroundImage: `url(${url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}