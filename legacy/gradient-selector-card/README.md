# GradientSelectorCard

## What it is
An interactive funding/milestone selector with gradient-filled progress circles, animated connecting lines, orbital dot rings on the selected item, and a radial gradient glow that follows the selection.

## What it's used for
- Funding tier selectors
- Milestone/progress steppers
- Pricing level selectors
- Interactive infographics

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | GradientOption[] | defaultOptions | Array of gradient options (min 3) |
| defaultSelected | string | - | ID of default selected option |
| onSelectionChange | (option, index) => void | - | Callback when selection changes |
| className | string | - | Additional classes |

## GradientOption shape
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| label | string | Display text (e.g. "$100K") |
| value | string | Numeric value as string |
| color | string | Primary hex color |
| gradientFrom | string | Gradient start color |
| gradientTo | string | Gradient end color |

## Notes
- Minimum 3 options enforced (falls back to defaults if fewer)
- Orbital dots only appear on the currently selected circle
- Connecting lines fill with gradient as you progress past each step
- Radial glow dynamically positioned based on selected circle's location
- Uses `@/lib/utils` for `cn` function

## Source
21st.dev