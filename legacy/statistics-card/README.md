# StatisticsCard

## What it is
A statistics showcase section with animated bar charts comparing values against competitors. Features spring animations, candy-stripe background patterns, and tooltips.

## What it's used for
- Landing page stats sections
- Competitive comparison displays
- Product feature highlights
- Conversion metrics showcases

## Props
Exports `Stats` — self-contained section component with no external props.

### BarChart subcomponent props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | — | Percentage value for the bar |
| label | string | — | Label below the bar |
| className | string | "" | Additional CSS classes |
| showToolTip | boolean | false | Show tooltip with "conversions" label |
| delay | number | 0 | Animation delay in seconds |

## Source
21st.dev

## Tags
statistics, bar-chart, animation, landing-page, comparison, metrics, framer-motion

## Dependencies
- lucide-react
- framer-motion
- @number-flow/react
