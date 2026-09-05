"use client"

import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { cn } from "../_utils/cn"
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa"

export default function SocialAuthCard() {
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 border rounded-lg shadow-md overflow-hidden p-6 flex flex-col gap-6">
      
      {/* Social Login Buttons */}
      <div className="flex flex-col gap-4">
        <Button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white">
          <FaGoogle /> Continue with Google
        </Button>
        <Button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white">
          <FaGithub /> Continue with GitHub
        </Button>
        <Button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <FaLinkedin /> Continue with LinkedIn
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 text-gray-400 dark:text-gray-300 text-sm">
        <span className="flex-1 border-t border-gray-300 dark:border-gray-600"></span>
        <span>or</span>
        <span className="flex-1 border-t border-gray-300 dark:border-gray-600"></span>
      </div>

      {/* Traditional Login Form */}
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="********" className="mt-1" />
        </div>
        <Button className="w-full mt-2">Login</Button>
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-300">
        Don’t have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
      </p>
    </div>
  )
}
