# Awards

## What it is
A multi-variant awards component with 6 styles: stamp, award (laurel wreath), certificate, badge, sticker, and id-card.

## What it's used for
- Achievement displays
- Certificates and badges
- Gamification UI
- Recognition components

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `stamp \| award \| certificate \| badge \| sticker \| id-card` | `badge` | Visual style |
| `title` | `string` | required | Main title text |
| `subtitle` | `string` | — | Secondary text |
| `description` | `string` | — | Description (id-card variant) |
| `date` | `string` | — | Date text |
| `recipient` | `string` | — | Recipient name |
| `level` | `bronze \| silver \| gold \| platinum` | `gold` | Medal level (award variant) |
| `className` | `string` | — | Additional CSS classes |
| `showIcon` | `boolean` | `true` | Show star icon (stamp variant) |

## Source
21st.dev

## Tags
award, badge, certificate, achievement, gamification, medal

## Dependencies
- `lucide-react`
