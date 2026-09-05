# PixelGrid

## What it is
A full-viewport canvas animation of a living pixel grid — pixels randomly flicker, light up, fade, and die in staggered cycles creating an ambient matrix-like effect.

## What it's used for
- Full-screen background effects
- Ambient website backgrounds
- Hero section visual overlays
- AI/tech-themed loading screens

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| bgColor | string | transparent | Background fill color |
| pixelColor | string | #0000ff | Pixel color (hex) |
| pixelSize | number | 3 | Pixel width/height in px |
| pixelSpacing | number | 3 | Gap between pixels in px |
| glow | boolean | false | Enable shadowBlur glow effect |
| pixelDeathFade | number | 10 | Frames for fade-out |
| pixelBornFade | number | 50 | Frames for fade-in |
| pixelMaxLife | number | 500 | Max frames a lit pixel lives |
| pixelMinLife | number | 250 | Min frames a lit pixel lives |
| pixelMaxOffLife | number | 500 | Max frames a dark pixel stays off |
| pixelMinOffLife | number | 200 | Min frames a dark pixel stays off |
| numPixelsX | number | 10 | (unused, dynamic from viewport) |
| numPixelsY | number | 10 | (unused, dynamic from viewport) |

## Notes
- Full-viewport fixed canvas, ignores parent container sizing
- Responsive: recalculates pixel grid on window resize
- Uses `requestAnimationFrame` render loop
- `isAppeared` state is set after init but not used in rendering

## Source
21st.dev