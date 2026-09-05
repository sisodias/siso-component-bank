"use client"

import { Timer } from "@ark-ui/react/timer"

export const Basic = () => (
  <div className="flex justify-center w-full items-center min-h-screen">
    <Timer.Root
      targetMs={60 * 60 * 1000} // 1 hour
      className="p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center border"
    >
      {/* Timer Display (Hours : Minutes : Seconds only) */}
      <Timer.Area className="flex items-center gap-3 text-2xl font-mono font-bold text-gray-800">
        <Timer.Item type="hours" className="px-3 py-1 rounded-md bg-gray-100 shadow-sm" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="minutes" className="px-3 py-1 rounded-md bg-gray-100 shadow-sm" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="seconds" className="px-3 py-1 rounded-md bg-gray-100 shadow-sm" />
      </Timer.Area>

      {/* Controls */}
      <Timer.Control className="flex gap-3 mt-4">
        <Timer.ActionTrigger
          action="start"
          className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium shadow hover:bg-green-600 transition"
        >
          ▶ Start
        </Timer.ActionTrigger>
        <Timer.ActionTrigger
          action="pause"
          className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium shadow hover:bg-red-600 transition"
        >
          ⏸ Pause
        </Timer.ActionTrigger>
        <Timer.ActionTrigger
          action="resume"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium shadow hover:bg-blue-600 transition"
        >
          ⏵ Resume
        </Timer.ActionTrigger>
      </Timer.Control>
    </Timer.Root>
  </div>
)
