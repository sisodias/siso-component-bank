"use client"

import * as React from "react"
import { Card, CardContent } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { Trash2 } from "lucide-react"
import { cn } from "../_utils/cn"

type Event = {
  id: number
  title: string
  date: Date
  priority: number // 1 = high, 2 = medium, 3 = low
}

export function PriorityPyramidCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [events, setEvents] = React.useState<Event[]>([])
  const [title, setTitle] = React.useState("")
  const [priority, setPriority] = React.useState("2")
  const [viewRange, setViewRange] = React.useState("1") // 1 = month, 3 = 3 months, etc.

  const addEvent = () => {
    if (!title || !date) return
    const newEvent: Event = {
      id: Date.now(),
      title,
      date,
      priority: parseInt(priority),
    }
    setEvents([...events, newEvent])
    setTitle("")
    setPriority("2")
  }

  const deleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id))
  }

  // Helper: get end date based on view range
  const getEndDate = () => {
    if (!date) return new Date()
    if (viewRange === "all") return new Date(3000, 0, 1) // far future
    const months = parseInt(viewRange)
    const d = new Date(date.getFullYear(), date.getMonth(), 1)
    d.setMonth(d.getMonth() + months)
    return d
  }

  // Filter events for selected range
  const filteredEvents = events.filter(e => {
    if (!date) return true
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = getEndDate()
    return e.date >= start && e.date < end
  })

  // Group events by day
  const groupedDays = Array.from(
    new Set(filteredEvents.map(e => e.date.toDateString()))
  )

  const eventsByDate = (d: Date) => {
    return filteredEvents
      .filter(e => e.date.toDateString() === d.toDateString())
      .sort((a, b) => a.priority - b.priority)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Event Form */}
      <Card className="p-4">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Event Title</Label>
            <Input
              placeholder="Enter event title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            {/* Date Picker */}
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    {date ? date.toDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">High</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Overview */}
            <div className="flex flex-col gap-2">
              <Label>Overview</Label>
              <Select value={viewRange} onValueChange={setViewRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="all">All Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={addEvent}>Add Event</Button>
        </CardContent>
      </Card>

      {/* Pyramid View */}
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
        {groupedDays.length === 0 && (
          <p className="text-muted-foreground text-center">
            No events in this range.
          </p>
        )}

        {groupedDays.map((day, idx) => {
          const dayEvents = eventsByDate(new Date(day))
          return (
            <Card key={idx} className="p-2">
              <CardContent className="space-y-2">
                <h3 className="font-semibold">{day}</h3>
                <div className="flex flex-col items-center gap-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        "flex items-center justify-between rounded-md px-3 py-1 border shadow-sm",
                        "bg-card text-card-foreground"
                      )}
                      style={{
                        width: `${120 + (3 - event.priority) * 40}px`,
                      }}
                    >
                      <span className="truncate">{event.title}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-muted h-6 w-6"
                        onClick={() => deleteEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
