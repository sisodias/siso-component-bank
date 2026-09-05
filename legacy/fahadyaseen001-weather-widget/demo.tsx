"use client"
import { WeatherWidget } from "./weather-widget"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <WeatherWidget />
    </div>
  )
}
