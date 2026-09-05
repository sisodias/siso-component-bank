import { RegistryAlpha } from "./registry-alpha"
import { RegistryBeta } from "./registry-beta"
import { BadgeCheck } from "lucide-react"

import badgeUrl from "./e2e-registry-deps-20260608-1612-utils/badge.svg"
import { formatLabel } from "./e2e-registry-deps-20260608-1612-utils/format"
import { getMetricRows } from "./e2e-registry-deps-20260608-1612-utils/metrics"
import { tokenClassName } from "./e2e-registry-deps-20260608-1612-utils/tokens"
import "./e2e-registry-deps-20260608-1612-utils/e2e-complex-card.css"

export interface E2eComplexCardProps {
  title?: string
}

export default function E2eComplexCard({
  title = "Registry dependency e2e",
}: E2eComplexCardProps) {
  const rows = getMetricRows()

  return (
    <section className="e2e-complex-card">
      <div className="e2e-complex-card__header">
        <img src={badgeUrl} alt="" className="e2e-complex-card__badge" />
        <div>
          <p className={tokenClassName("eyebrow")}>unlisted publish check</p>
          <h2>{formatLabel(title)}</h2>
        </div>
        <BadgeCheck aria-hidden className="e2e-complex-card__icon" />
      </div>
      <div className="e2e-complex-card__registry">
        <RegistryAlpha label="direct registry dep A" />
        <RegistryBeta label="direct registry dep B" />
      </div>
      <dl className="e2e-complex-card__metrics">
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
