import React from 'react';

// This component encapsulates the entire frosted image hover effect.
// It manages its own state for hover interactions and contains all the specific JSX and inline styles.

export const FrostedImageEffect = () => {
    // Defines the grid density for the hover effect. Higher numbers are more detailed but less performant.
    const hoverAreas = 30;
    const imageUrl = "https://www.hdwallpapers.in/download/frozen_ice_cube_with_leaf_in_sunrise_background_hd_ice_cube-HD.jpg";

    const containerStyle = {
        '--max-a': hoverAreas,
        maxWidth: '40rem',
        position: 'relative',
        display: 'flex',
        borderRadius: '1em',
        overflow: 'hidden',
        filter: 'url(#❄️)', // Applies the main SVG filter for the frosted glass look
    };

    const imageStyle = {
        width: '100%',
        filter: 'url(#pack-upper)', // Applies an SVG filter to prepare the image for the effect
    };

    const hoverAreaStyle = {
        position: 'absolute',
        '--p': '1em',
        inset: 'calc(var(--p) * -1)',
        padding: 'var(--p)',
        zIndex: 999,
        display: 'grid',
        gridTemplateColumns: `repeat(${hoverAreas}, 1fr)`,
        background: 'black',
        mixBlendMode: 'plus-lighter',
        // This complex filter chain is the core of the "reveal" effect
        filter: 'blur(19px) brightness(5) contrast(80) invert(1) blur(5px) url("#gray-pack-2b") url("#pack-lower")',
        cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='120' viewport='0 0 100 100' style='fill:white;font-size:80px; opacity: .8;'><text y='50%'>❄️</text></svg>") 45 35, auto`,
    };

    // A sub-component for the individual dots in the hover grid.
    // Using state here allows for the fade-out transition when the mouse leaves.
    const HoverDot = () => {
        const [isHovered, setIsHovered] = React.useState(false);
        const style = {
            background: 'white',
            opacity: isHovered ? 1 : 0,
            transition: `opacity ${isHovered ? '0s' : '5s'}`, // Instant reveal, slow fade
            borderRadius: '50%',
            transform: 'scale(2)',
        };
        return <i style={style} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} />;
    };

    return (
        <div style={containerStyle}>
            <img src={imageUrl} alt="A leaf frozen inside an ice cube with sunrise in the background" style={imageStyle} />
            <aside className="hover-area" style={hoverAreaStyle}>
                {Array.from({ length: hoverAreas * hoverAreas }).map((_, index) => (
                    <HoverDot key={index} />
                ))}
            </aside>
        </div>
    );
};

// This component contains all the complex SVG filter definitions.
// It renders nothing visible itself but provides the filters used by the main component.
export const SVGFilters = () => (
    <svg style={{ position: 'absolute', pointerEvents: 'none', opacity: 0, height: 0, width: 0 }}
        viewBox="0 0 1 1" colorInterpolationFilters="sRGB">
        <defs>
            <filter id="❄️" primitiveUnits="userSpaceOnUse" x="0%" y="0%" width="120%" height="120%">
                <feComponentTransfer result="SourceBackground" in="SourceGraphic">
                    <feFuncR type="discrete" tableValues="0.000 0.016 0.032 0.048 0.063 0.079 0.095 0.111 0.127 0.143 0.159 0.175 0.190 0.206 0.222 0.238 0.254 0.270 0.286 0.302 0.317 0.333 0.349 0.365 0.381 0.397 0.413 0.429 0.444 0.460 0.476 0.492 0.508 0.524 0.540 0.556 0.571 0.587 0.603 0.619 0.635 0.651 0.667 0.683 0.698 0.714 0.730 0.746 0.762 0.778 0.794 0.810 0.825 0.841 0.857 0.873 0.889 0.905 0.921 0.937 0.952 0.968 0.984 1.000"></feFuncR>
                    <feFuncG type="discrete" tableValues="0.000 0.016 0.032 0.048 0.063 0.079 0.095 0.111 0.127 0.143 0.159 0.175 0.190 0.206 0.222 0.238 0.254 0.270 0.286 0.302 0.317 0.333 0.349 0.365 0.381 0.397 0.413 0.429 0.444 0.460 0.476 0.492 0.508 0.524 0.540 0.556 0.571 0.587 0.603 0.619 0.635 0.651 0.667 0.683 0.698 0.714 0.730 0.746 0.762 0.778 0.794 0.810 0.825 0.841 0.857 0.873 0.889 0.905 0.921 0.937 0.952 0.968 0.984 1.000"></feFuncG>
                    <feFuncB type="discrete" tableValues="0.000 0.016 0.032 0.048 0.063 0.079 0.095 0.111 0.127 0.143 0.159 0.175 0.190 0.206 0.222 0.238 0.254 0.270 0.286 0.302 0.317 0.333 0.349 0.365 0.381 0.397 0.413 0.429 0.444 0.460 0.476 0.492 0.508 0.524 0.540 0.556 0.571 0.587 0.603 0.619 0.635 0.651 0.667 0.683 0.698 0.714 0.730 0.746 0.762 0.778 0.794 0.810 0.825 0.841 0.857 0.873 0.889 0.905 0.921 0.937 0.952 0.968 0.984 1.000"></feFuncB>
                </feComponentTransfer>
                <feBlend result="blend-0" in="SourceBackground" in2="none"></feBlend>
                <feGaussianBlur result="gaussian-blur-6" in="blend-0" stdDeviation="10"></feGaussianBlur>
                <feTurbulence result="turbulence-0" baseFrequency="0.420" type="fractalNoise" />
                <feDisplacementMap result="displacement-map-0" in="gaussian-blur-6" in2="turbulence-0" scale="150" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
                <feComponentTransfer result="SourceMask" in="SourceGraphic">
                    <feFuncR type="discrete" tableValues="0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000"></feFuncR>
                    <feFuncG type="discrete" tableValues="0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000"></feFuncG>
                    <feFuncB type="discrete" tableValues="0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000 0.000 0.333 0.667 1.000"></feFuncB>
                </feComponentTransfer>
                <feBlend result="SourceMask"></feBlend>
                <feColorMatrix result="color-matrix-0" in="SourceMask" values="0.761905 0.190476 0.047619 0 0 0.761905 0.190476 0.047619 0 0 0.761905 0.190476 0.047619 0 0 0 0 0 1 0"></feColorMatrix>
                <feColorMatrix result="color-matrix-1" in="color-matrix-0" type="luminanceToAlpha"></feColorMatrix>
                <feGaussianBlur result="gaussian-blur-0" in="color-matrix-1" stdDeviation="0"></feGaussianBlur>
                <feComposite result="composite-1" in="displacement-map-0" in2="gaussian-blur-0" operator="in"></feComposite>
                <feMerge result="merge-0">
                    <feMergeNode in="blend-0"></feMergeNode>
                    <feMergeNode in="composite-1"></feMergeNode>
                </feMerge>
            </filter>
            <filter id="gray-unpack-2b">
                <feColorMatrix id="unpackMatrix" in="SourceGraphic" result="unpackedGray" type="matrix" values="0.761905 0.190476 0.047619 0 0 0.761905 0.190476 0.047619 0 0 0.761905 0.190476 0.047619 0 0 0 0 0 1 0" />
            </filter>
            <filter id="gray-pack-2b">
                <feComponentTransfer id="feComponentTransfer-1" result="packed" in="SourceGraphic">
                    <feFuncR id="feFuncR-1" type="discrete" tableValues="0 0.3333 0.6667 1"></feFuncR>
                    <feFuncG id="feFuncG-1" type="discrete" tableValues="0 0.3333 0.6667 1 0 0.3333 0.6667 1 0 0.3333 0.667 1 0 0.3333 0.667 1" />
                    <feFuncB id="feFuncB-1" type="discrete" tableValues="0 0.3333 0.6667 1 0 0.3333 0.6667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1 0 0.3333 0.667 1"></feFuncB>
                    <feFuncA type="identity"></feFuncA>
                </feComponentTransfer>
            </filter>
            <filter id="pack-lower">
                <feColorMatrix type="matrix" id="pack-lower-matrix" values="0.011764705882352941 0 0 0 0 0 0.011764705882352941 0 0 0 0 0 0.011764705882352941 0 0 0 0 0 1 0"></feColorMatrix>
            </filter>
            <filter id="pack-upper">
                <feColorMatrix type="matrix" id="pack-upper-quantize" result="quantized" values="0.24705882352941178 0 0 0 0 0 0.24705882352941178 0 0 0 0 0 0.24705882352941178 0 0 0 0 0 1 0" in="SourceGraphic"></feColorMatrix>
                <feComposite in="quantized" operator="over" result="composited" in2="quantized"></feComposite>
                <feColorMatrix in="composited" type="matrix" id="pack-upper-shift" values="4 0 0 0 0 0 4 0 0 0 0 0 4 0 0 0 0 0 1 0" result="color-matrix-0"></feColorMatrix>
            </filter>
        </defs>
    </svg>
);

