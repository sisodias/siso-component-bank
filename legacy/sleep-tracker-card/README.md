# SleepTrackerCard

## What it is
A health/wellness card displaying sleep data with an animated bar graph showing sleep stages (Awake, REM, Core, Deep), quality metrics, and a legend.

## What it's used for
- Health dashboard widgets
- Sleep tracking apps
- Wearable data visualizations
- Wellness/ fitness UIs

## Props
| Prop | Type | Description |
|------|------|-------------|
| data | SleepData | Sleep metrics and graph data |
| icons | object | Icons for sleep, moon, sun, arrowUp |
| className | string | Additional classes |

## SleepData shape
| Field | Type | Description |
|-------|------|-------------|
| timeSlept | string | Total sleep time (e.g. "5:44") |
| quality | number | Sleep quality percentage (0-100) |
| changePercent | number | % change from previous night |
| startTime | string | Bedtime (e.g. "01:42") |
| endTime | string | Wake time (e.g. "07:26") |
| stages | Record<SleepStage, string> | Duration per stage |
| graphData | SleepGraphSegment[] | Bar graph data |

## SleepGraphSegment
| Field | Type | Description |
|-------|------|-------------|
| stage | Awake \| REM \| Core \| Deep | Sleep stage type |
| duration | number | Flex-grow proportion |
| height | number | Bar height percentage (0-100) |

## Notes
- Uses shadcn `bg-card`, `text-card-foreground`, `bg-muted/50`, `text-muted-foreground` design tokens
- Bar animations use framer-motion spring with staggered children
- Icons are passed as props for full customization
- Stage colors: Awake=orange, REM=sky, Core=blue, Deep=indigo

## Source
21st.dev