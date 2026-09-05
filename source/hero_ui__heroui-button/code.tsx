"use client"

// HeroUI v3 Button — the real package. Styles ship via @heroui/styles (BEM CSS);
// importing it here gets it bundled so the component renders fully styled in
// light and dark. The blue accent is set in src/index.css (package default is
// neutral). Requires `@heroui/react` + `@heroui/styles` in your app.
import "@heroui/styles/css"
import { Button } from "@heroui/react"

export { Button }
export default Button
