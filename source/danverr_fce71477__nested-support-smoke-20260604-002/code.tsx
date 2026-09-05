import React from "react"
import "./nested-support-smoke-20260604-002-utils/panel.css"
import { buildPanelTitle, sharedPanelLabel } from "./nested-support-smoke-20260604-002-utils/index"
import { scorePanel } from "./nested-support-smoke-20260604-002-utils/score"
import metrics from "./nested-support-smoke-20260604-002-utils/metrics.json"

export interface NestedPanelProps {
  title: string
  amount: number
}

export default function NestedPanel({ title, amount }: NestedPanelProps) {
  const score = scorePanel(amount, metrics.factor)

  return (
    <section className="nested-smoke-panel" data-smoke-score={score}>
      <div className="nested-smoke-kicker">{sharedPanelLabel("component")}</div>
      <h3>{buildPanelTitle(title)}</h3>
      <strong>{score}</strong>
    </section>
  )
}
