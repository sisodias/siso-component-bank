# ScreenTimeCard

## What it is
A screen time dashboard card with animated bar graph showing usage over time, total hours display, and top apps list.

## What it's used for
- Device usage dashboards
- Screen time tracking apps
- Productivity monitoring
- Wellness/health dashboards

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| totalHours | number | Yes | Total hours of screen time |
| totalMinutes | number | Yes | Additional minutes |
| barData | number[] | Yes | Array of usage values for bar chart |
| timeLabels | string[] | No | X-axis labels (default: ["5 AM", "11 AM", "5 PM"]) |
| topApps | AppUsage[] | Yes | List of top apps with icon, name, duration |
| className | string | No | Additional CSS classes |

### AppUsage interface
| Property | Type | Description |
|----------|------|-------------|
| icon | React.ReactNode | App icon component |
| name | string | App name |
| duration | string | Usage duration string (e.g., "10h 1m") |
| color | string | Optional color for the app |

## Source
21st.dev

## Tags
screen-time, dashboard, bar-chart, animation, stats, health, wellness

## Dependencies
- framer-motion
- lucide-react (for demo icons)
