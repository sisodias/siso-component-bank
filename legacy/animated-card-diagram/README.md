# AnimatedCardDiagram

## What it is
A multi-layered animated card with an SVG donut chart visual, floating tech badges, and smooth hover-triggered transitions across 4 layers.

## What it's used for
- Project/feature showcase cards
- Data visualization cards
- Interactive pricing or stats cards
- Animated landing page sections

## Exports
- `AnimatedCard` — base card wrapper
- `CardBody` — content section with title/description
- `CardTitle` — card heading
- `CardDescription` — card subtitle
- `CardVisual` — visual section container
- `Visual2` — animated donut chart visual with hover layers
- `cn` — utility function (clsx + tailwind-merge)

## Props
| Component | Prop | Type | Default | Description |
|-----------|------|------|---------|-------------|
| Visual2 | mainColor | string | #8b5cf6 | Primary accent color |
| Visual2 | secondaryColor | string | #fbbf24 | Secondary accent color |
| Visual2 | gridColor | string | #80808015 | Grid overlay color |

## Notes
- Hover triggers: chart progress animation, label reveal, gradient fade, badge spread
- Uses `group/animated-card` Tailwind group modifier for coordinated hover states
- Includes `cn` utility — can be removed if your project already has `@/lib/utils`
- Dependencies: `clsx`, `tailwind-merge`

## Source
21st.dev