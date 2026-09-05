import { Button } from "./button"

export default function HttpShadcnButtonSmoke() {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <span className="text-sm font-medium">HTTP registry dependency</span>
      <Button type="button">Shadcn button</Button>
    </div>
  )
}
