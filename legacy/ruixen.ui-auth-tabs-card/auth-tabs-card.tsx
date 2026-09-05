"use client"

import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa"

export default function AuthTabsCard() {
  const [activeTab, setActiveTab] = React.useState<"sign-in" | "sign-up">("sign-in")

  const toggleTab = () => {
    setActiveTab((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"))
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Triggers */}
          <TabsList className="mb-6">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In */}
          <TabsContent value="sign-in">
            <div className="flex flex-col gap-4">

              {/* Social Login */}
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <FaGoogle /> Sign in with Google
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <FaGithub /> Sign in with GitHub
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <FaLinkedin /> Sign in with LinkedIn
                </Button>
              </div>

              <div className="flex items-center justify-center my-2 text-gray-400 dark:text-gray-300">or</div>

              {/* Email & Password */}
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" type="email" placeholder="you@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input id="signin-password" type="password" placeholder="********" className="mt-1" />
              </div>
              <Button className="mt-4 w-full">Sign In</Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-300 mt-2">
                Don’t have an account?{" "}
                <span
                  className="font-medium text-blue-500 cursor-pointer hover:underline"
                  onClick={toggleTab}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </TabsContent>

          {/* Sign Up */}
          <TabsContent value="sign-up">
            <div className="flex flex-col gap-4">

              <div>
                <Label htmlFor="signup-name">Name</Label>
                <Input id="signup-name" type="text" placeholder="Your Name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="you@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" placeholder="********" className="mt-1" />
              </div>
              <Button className="mt-4 w-full">Sign Up</Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-300 mt-2">
                Already have an account?{" "}
                <span
                  className="font-medium text-blue-500 cursor-pointer hover:underline"
                  onClick={toggleTab}
                >
                  Sign In
                </span>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
