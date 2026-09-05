"use client"

// HeroUI v3 Accordion — the real package. Styles ship via @heroui/styles (BEM CSS);
// importing it here gets it bundled so the component renders fully styled in light
// and dark. Compound parts via dot notation: Accordion.Item / .Heading / .Trigger /
// .Indicator / .Panel / .Body. The blue accent is set in src/index.css.
// Requires `@heroui/react` + `@heroui/styles` in your app.
import "@heroui/styles/css"
import { Accordion } from "@heroui/react"

export { Accordion }
export default Accordion
