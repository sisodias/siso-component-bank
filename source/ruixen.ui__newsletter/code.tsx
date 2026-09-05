"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubscribe = () => {
    if (!email) return
    console.log("Subscribed with:", email)
    // Add your API call here
  }

  return (
    <Card className="w-full max-w-md mx-auto rounded-xl shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Subscribe to our newsletter.
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Nostrud amet eu ullamco nisi aute in ad minim nostrud adipisicing velit quis. 
          Duis tempor incididunt dolore.
        </p>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 dark:bg-slate-800 dark:text-gray-100"
          />
          <Button onClick={handleSubscribe} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Subscribe
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
