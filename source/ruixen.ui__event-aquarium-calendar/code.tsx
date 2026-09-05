"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

type Event = {
  id: number
  title: string
  date: Date
}

export function EventAquariumCalendar() {
  const [events, setEvents] = React.useState<Event[]>([])
  const [title, setTitle] = React.useState("")
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [displayMonth, setDisplayMonth] = React.useState(selectedDate.getMonth())
  const [displayYear, setDisplayYear] = React.useState(selectedDate.getFullYear())

  const addEvent = () => {
    if (!title || !selectedDate) return
    setEvents([...events, { id: Date.now(), title, date: selectedDate }])
    setTitle("")
  }

  const deleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id))
  }

  // Generate bubble positions (circular for simplicity)
  const bubbleCount = 30
  const radius = 150
  const center = 200

  const getBubblePosition = (index: number) => {
    const angle = (index / bubbleCount) * 2 * Math.PI
    const r = radius * (0.7 + Math.random() * 0.3) // randomize distance
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const eventsForBubble = (index: number) => {
    return events.filter(
      ev =>
        ev.date.getDate() % bubbleCount === index &&
        ev.date.getMonth() === displayMonth &&
        ev.date.getFullYear() === displayYear
    )
  }

  // Filter events for selected month/year
  const currentMonthEvents = events.filter(
    ev => ev.date.getMonth() === displayMonth && ev.date.getFullYear() === displayYear
  )

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Add Event Form */}
      <Card className="p-2">
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            {/* Event Title */}
            <div className="flex-1 min-w-[200px]">
              <Label>Event Title</Label>
              <Input
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Date Picker */}
            <div className="flex flex-col">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="mt-1 w-[160px]">
                    {selectedDate ? selectedDate.toDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Add Button */}
            <div className="mt-5">
              <Button onClick={addEvent}>Add Event</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Month/Year Selector */}
      <div className="flex items-center gap-4">
        <Select value={displayMonth.toString()} onValueChange={val => setDisplayMonth(parseInt(val))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {monthNames.map((m, i) => (
              <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={displayYear.toString()} onValueChange={val => setDisplayYear(parseInt(val))}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => displayYear - 5 + i).map(y => (
              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aquarium */}
      <div className="relative w-[420px] h-[420px] bg-gray-200 dark:bg-black border dark:border-white rounded-lg overflow-hidden">
        {[...Array(bubbleCount)].map((_, i) => {
          const { x, y } = getBubblePosition(i)
          const bubbleEvents = eventsForBubble(i)
          return (
            <Popover key={i}>
              <PopoverTrigger asChild>
                <div
                  className={`absolute w-10 h-10 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                    bubbleEvents.length > 0
                      ? "bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse"
                      : "bg-white/60 dark:bg-gray-800 border-gray-400 dark:border-white"
                  }`}
                  style={{
                    left: x,
                    top: y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {bubbleEvents.length > 0 && <span className="text-xs font-bold text-black dark:text-white">🐟</span>}
                </div>
              </PopoverTrigger>
              {bubbleEvents.length > 0 && (
                <PopoverContent className="w-48">
                  <div className="flex flex-col gap-2 text-sm">
                    {bubbleEvents.map(ev => (
                      <div
                        key={ev.id}
                        className="flex justify-between items-center gap-2"
                      >
                        <span>{ev.title}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteEvent(ev.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              )}
            </Popover>
          )
        })}
      </div>

      {/* Monthly Overview */}
      <Card className="p-4">
        <CardContent>
          <h3 className="font-semibold mb-2">Events in {monthNames[displayMonth]} {displayYear}</h3>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {currentMonthEvents.length === 0 && <span className="text-sm text-gray-500 dark:text-gray-400">No events</span>}
            {currentMonthEvents.map(ev => (
              <div key={ev.id} className="flex justify-between items-center p-2 rounded-md bg-gray-300 dark:bg-gray-800">
                <span>{ev.title}</span>
                <span className="text-xs">{ev.date.toDateString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
