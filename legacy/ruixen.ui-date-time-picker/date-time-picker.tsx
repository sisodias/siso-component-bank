"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { cn } from "../_utils/cn"

export default function DateTimePicker() {
  const [date, setDate] = React.useState<Date>()
  const [hour, setHour] = React.useState("12")
  const [minute, setMinute] = React.useState("00")
  const [ampm, setAmpm] = React.useState("AM")

  // Final combined DateTime
  const selectedDateTime = React.useMemo(() => {
    if (!date) return null
    const d = new Date(date)
    let h = parseInt(hour)
    if (ampm === "PM" && h < 12) h += 12
    if (ampm === "AM" && h === 12) h = 0
    d.setHours(h, parseInt(minute), 0, 0)
    return d
  }, [date, hour, minute, ampm])

  return (
    <div className="flex flex-col gap-4">
      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[250px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-fit">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      {/* Time Picker */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Select value={hour} onValueChange={setHour}>
          <SelectTrigger className="w-[62px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => {
              const h = i + 1
              return (
                <SelectItem key={h} value={h.toString().padStart(2, "0")}>
                  {h.toString().padStart(2, "0")}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <span>:</span>

        <Select value={minute} onValueChange={setMinute}>
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["00", "15", "30", "45"].map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={ampm} onValueChange={setAmpm}>
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Result */}
      <p className="text-sm text-muted-foreground">
        Selected:{" "}
        {selectedDateTime
          ? format(selectedDateTime, "PPP p")
          : "No date & time selected"}
      </p>
    </div>
  )
}
