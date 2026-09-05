"use client"

import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { motion, AnimatePresence } from "framer-motion"

interface ConfettiParticle {
  id: number
  x: number
  y: number
  rotate: number
  color: string
}

const colors = ["#facc15", "#22c55e", "#3b82f6", "#f472b6", "#f97316"]

export default function GamifiedLoginCard() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const [particles, setParticles] = React.useState<ConfettiParticle[]>([])

  const handleLogin = () => {
    // Only allow login if both fields have input
    if (!email || !password) return

    // Trigger confetti
    const newParticles: ConfettiParticle[] = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      rotate: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setParticles(newParticles)
    setSuccess(true)

    // Reset confetti after 1s
    setTimeout(() => setParticles([]), 1000)
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

      {/* Confetti */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: p.color }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: p.rotate }}
            animate={{
              x: (Math.random() - 0.5) * 150,
              y: -Math.random() * 200,
              scale: 0,
              opacity: 0,
              rotate: p.rotate + Math.random() * 360,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          {success ? "Welcome!" : "Sign In"}
        </h2>

        <div className="flex flex-col gap-4 mt-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>

        <Button
          className="w-full mt-4 hover:scale-110 transition-transform duration-200"
          onClick={handleLogin}
        >
          {success ? "Logged In!" : "Login"}
        </Button>

        {!success && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-300 mt-2">
            Don’t have an account?{" "}
            <a href="#" className="text-purple-500 hover:underline">Sign up</a>
          </p>
        )}
      </motion.div>
    </div>
  )
}
