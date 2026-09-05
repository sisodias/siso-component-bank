# OrbitingSkills

## What it is
An animated orbital skills showcase component with icons orbiting a central code element in two concentric rings.

## What it's used for
- Portfolio skill displays
- Tech stack visualizations
- Animated about sections
- Developer landing pages

## Props
This component is self-contained with no external props. Skills are configured internally via `skillsConfig`.

## Configuration
Skills are configured in the `skillsConfig` array:
- `id` - unique identifier
- `orbitRadius` - distance from center (100 for inner, 180 for outer)
- `size` - icon size in pixels
- `speed` - rotation speed (positive = clockwise, negative = counter-clockwise)
- `iconType` - one of: html, css, javascript, react, node, tailwind
- `phaseShift` - starting angle offset
- `glowColor` - 'cyan' (inner) or 'purple' (outer)
- `label` - tooltip text

## Source
21st.dev

## Tags
animation, skills, orbital, tech, portfolio, svg-icons, framer-motion-free

## Dependencies
None (pure React with CSS animations, no external animation library)
