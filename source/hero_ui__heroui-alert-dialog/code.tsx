"use client"

// HeroUI v3 AlertDialog — real package wrapper. Styles ship via @heroui/styles
// (BEM CSS); importing them here makes Vite bundle the dialog/backdrop styles.
// Requires `@heroui/react` + `@heroui/styles` in the consuming app.
import "@heroui/styles/css"
import { AlertDialog } from "@heroui/react"

export { AlertDialog }
export default AlertDialog
