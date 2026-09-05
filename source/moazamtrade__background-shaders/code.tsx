import { Warp } from "@paper-design/shaders-react"

export default function Wrapper() {
  return (
    <div className= "relative min-h-screen" >
    <div className="fixed inset-0 -z-10" >
      <Warp
          style={ { width: "100%", height: "100%" } }
  proportion = { 0.45}
  softness = { 1}
  distortion = { 0.25}
  swirl = { 0.8}
  swirlIterations = { 10}
  shape = "checks"
  shapeScale = { 0.1}
  scale = { 1}
  rotation = { 0}
  speed = { 1}
  colors = { ["hsl(203, 100%, 62%)", "hsl(255, 100%, 72%)", "hsl(158, 99%, 59%)", "hsl(264, 100%, 61%)"]}
    />
    </div>
    < div className = "absolute left-8 top-1/2 -translate-y-1/2 z-10" >
      </div>
      < div className = "relative z-10 p-8" >
        </div>
        < /div>
  )
}
