import { buildComponentTitle } from "./multi-demo-support-e2e-20260604-001-utils/build-component-title"
import { componentScore } from "./multi-demo-support-e2e-20260604-001-utils/component-score"
import { sharedBadgeText } from "./multi-demo-support-e2e-20260604-001-utils/shared-badge-text"
import "./multi-demo-support-e2e-20260604-001-utils/multi-card.css"

export interface MultiDemoCardProps {
  label?: string
  count?: number
}

export default function MultiDemoCard({
  label = "Component",
  count = 7,
}: MultiDemoCardProps) {
  const title = buildComponentTitle(label)
  const score = componentScore(count)

  return (
    <section className="multi-demo-card">
      <span className="multi-demo-card__eyebrow">{sharedBadgeText("core")}</span>
      <h2>{title}</h2>
      <p>score: {score}</p>
    </section>
  )
}
