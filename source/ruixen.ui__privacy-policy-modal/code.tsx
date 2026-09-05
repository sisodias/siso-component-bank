"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

const privacySections = [
  {
    title: "Information Collection",
    content:
      "We collect data to improve your experience, including usage patterns and preferences.",
  },
  {
    title: "Use of Data",
    content:
      "Your data helps us provide better services and personalized recommendations.",
  },
  {
    title: "Third-Party Sharing",
    content:
      "We do not sell your information. We may share anonymized data with partners for analytics.",
  },
  {
    title: "Cookies & Tracking",
    content:
      "Cookies are used to enhance site functionality and analyze trends.",
  },
  {
    title: "Security Measures",
    content:
      "We protect your data using encryption and secure storage.",
  },
  {
    title: "User Rights",
    content:
      "You can request access, correction, or deletion of your personal data anytime.",
  },
  {
    title: "Policy Updates",
    content:
      "Changes to this policy will be communicated on the website. Continued use implies consent.",
  },
]

export default function PrivacyPolicyModal() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const content = contentRef.current
    if (!content) return
    const progress = Math.min(
      1,
      content.scrollTop / (content.scrollHeight - content.clientHeight)
    )
    setScrollProgress(progress)
  }

  return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">View Privacy Policy</Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col p-0 sm:max-h-[80vh] sm:max-w-md gap-0 !rounded-2xl">
          <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">Privacy Policy</DialogTitle>
          </DialogHeader>

          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="overflow-y-auto p-4 flex-1 space-y-4"
            style={{ maxHeight: "60vh" }}
          >
            {privacySections.map((section, idx) => (
              <div key={idx}>
                <p className="font-medium">{section.title}</p>
                <p className="text-sm text-gray-500">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Scroll progress bar */}
          <div
            className="h-1 bg-blue-500 transition-all duration-200 rounded-3xl"
            style={{ width: `${scrollProgress * 100}%` }}
          />

          <DialogFooter className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-2xl">Decline</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button disabled={scrollProgress < 1} className="rounded-2xl">Accept</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
