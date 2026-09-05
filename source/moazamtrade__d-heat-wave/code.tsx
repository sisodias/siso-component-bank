import { Heatmap } from "@paper-design/shaders-react"

export default function DHeatWave() {
  return (
    <Heatmap
      colors={["#11206a", "#1f3ba2", "#2f63e7", "#6bd7ff", "#ffe679", "#ff991e", "#ff4c00"]}
      colorBack="#00000000"
      speed={1}
      contour={0.5}
      angle={0}
      noise={0}
      innerGlow={0.5}
      outerGlow={0.5}
      scale={0.75}
      image="https://workers.paper.design/file-assets/01K4PDB7KC8P1Z6GJK4P4SD56R/01K4QNFN3Y3JYR25H4DQC0BZWV.png"
      frame={0}
      style={{
        backgroundColor: "#000000",
        borderRadius: "12px",
        height: "516px",
        width: "516px",
      }}
    />
  )
}