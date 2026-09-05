"use client"

import { useState } from "react"
import { CheckCircleIcon, PlusCircleIcon } from "lucide-react"

import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./dialog"
import { Input } from "./input"

export default function DailyTrackerDialog() {
  const [tasks, setTasks] = useState([
    { text: "Morning meditation", done: false },
    { text: "Read 20 pages", done: false },
    { text: "Exercise", done: false },
  ])
  const [newTask, setNewTask] = useState("")

  const toggleTask = (index: number) => {
    const updated = [...tasks]
    updated[index].done = !updated[index].done
    setTasks(updated)
  }

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, done: false }])
      setNewTask("")
    }
  }

  const completedCount = tasks.filter((t) => t.done).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Daily Tracker</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md !rounded-xl p-6">
        <DialogHeader className="text-center mb-4">
          <DialogTitle>Daily Productivity Tracker</DialogTitle>
          <DialogDescription>
            Track your tasks and see your daily progress.
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground">
            Completed {completedCount} of {tasks.length} tasks
          </p>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => toggleTask(idx)}
            >
              <CheckCircleIcon
                size={20}
                className={task.done ? "text-green-500" : "text-gray-400"}
              />
              <span className={task.done ? "line-through text-gray-500" : ""}>
                {task.text}
              </span>
            </div>
          ))}
        </div>

        {/* Add Task */}
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="New task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button onClick={addTask} className="px-4">
            <PlusCircleIcon size={20} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
