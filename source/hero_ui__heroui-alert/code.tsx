"use client"

// HeroUI v3 Alert — the real package. Styles ship via @heroui/styles (BEM CSS);
// importing them here gets the alert, status variants, and compound parts fully
// styled in the published preview. Compound parts: Alert.Indicator / .Content /
// .Title / .Description. The blue accent is set in src/index.css.
// Requires `@heroui/react` + `@heroui/styles` in your app.
import "@heroui/styles/css"
import { Alert } from "@heroui/react"

export { Alert }
export default Alert
