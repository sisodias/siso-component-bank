"use client"

// slot-text — dependency-free text-roll animation (https://textmotion.dev).
// Each character sits in its own clipped cell and slides to its new glyph with a
// springy overshoot. Pure CSS transforms, GPU-composited.
//
// Install: npm i slot-text
import "slot-text/style.css"
import { SlotText } from "slot-text/react"

export { SlotText }
export type { SlotTextProps } from "slot-text/react"
export default SlotText
