# PredictionMarketCard

## What it is
A live prediction/betting card with countdown timer, YES/NO voting bars, bank totals, and a slide-up betting confirmation overlay.

## What it's used for
- Sports betting UIs
- Prediction markets
- Live polling with wagering

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `question` | `string` | — | Market question text |
| `teamLogo` | `string` | — | Team/choice logo URL |
| `teamName` | `string` | — | Team/choice name |
| `initialTimeInSeconds` | `number` | `60` | Countdown timer in seconds |
| `totalBank` | `number` | — | Total pool amount |
| `yesBank` | `number` | — | YES side pool |
| `noBank` | `number` | — | NO side pool |
| `initialYesVotes` | `number` | — | Initial YES vote % |
| `initialNoVotes` | `number` | — | Initial NO vote % |
| `yesPlayers` | `number` | — | Number of YES bettors |
| `noPlayers` | `number` | — | Number of NO bettors |
| `onBetYes` | `() => void` | — | Callback when YES is bet |
| `onBetNo` | `() => void` | — | Callback when NO is bet |
| `enableAnimations` | `boolean` | `true` | Toggle framer-motion animations |

## Source
21st.dev

## Tags
betting, prediction, market, timer, voting, live, sports

## Dependencies
- `lucide-react`
- `framer-motion`
- `badge`, `avatar`, `button`, `separator` (shadcn/ui — included in this library)
