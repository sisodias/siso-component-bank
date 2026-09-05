import { scoreFor } from "./support-graph-e2e-202606041003-utils/score"
import { palette } from "./support-graph-e2e-202606041003-utils/palette"
import "./support-graph-e2e-202606041003-utils/badge.css"

export default function FancyDependencyBadge({ name = "Nested Support", value = 5 }: { name?: string; value?: number }) {
  const result = scoreFor(name, value)

  return (
    <div className="support-e2e-badge" style={{ color: palette.ink, backgroundColor: palette.paper, borderRadius: 12, padding: 16, display: "inline-flex", gap: 10, alignItems: "center" }}>
      <strong>{result.label}</strong>
      <span data-testid="support-score">score: {result.score}</span>
    </div>
  )
}
