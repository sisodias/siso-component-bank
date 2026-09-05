# DonutChart

## What it is
An animated SVG donut chart with staggered segment animations, hover highlighting with drop-shadow, and a configurable center content slot.

## What it's used for
- Data visualization dashboards
- Analytics breakdowns
- Category distribution charts

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `DonutChartSegment[]` | required | Array of `{value, color, label}` |
| `totalValue` | `number` | auto | Override total for percentage calc |
| `size` | `number` | `200` | SVG dimensions in px |
| `strokeWidth` | `number` | `20` | Ring thickness in px |
| `animationDuration` | `number` | `1` | Seconds for draw animation |
| `animationDelayPerSegment` | `number` | `0.05` | Delay increment per segment |
| `highlightOnHover` | `boolean` | `true` | Enable hover glow + scale |
| `centerContent` | `ReactNode` | — | Content rendered inside the ring |
| `onSegmentHover` | `(segment) => void` | — | Callback when segment is hovered |

## Source
21st.dev

## Tags
chart, donut, svg, animation, data-visualization, hover

## Dependencies
- `framer-motion`
- `card` (shadcn/ui — included in this library)
