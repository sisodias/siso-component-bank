"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

export default function LoginCard() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden border">

      {/* Login Card */}
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-xl shadow-lg z-10 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Sign In</h2>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" className="mt-1" />
          </div>
        </div>

        <Button className="w-full mt-2">Login</Button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-300">
          Don’t have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  )
}
