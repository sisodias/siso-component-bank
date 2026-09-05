"use client"

import { useState, useRef } from "react"
import { UserPlus2Icon, CheckCircleIcon, Link2Icon } from "lucide-react"

import { Button } from "./button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./dialog"
import { Input } from "./input"
import { Label } from "./label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

export default function TeamInviteDialog() {
  const [members, setMembers] = useState([{ email: "", role: "Member" }])
  const [copied, setCopied] = useState(false)
  const linkRef = useRef<HTMLInputElement>(null)

  const addMember = () => setMembers([...members, { email: "", role: "Member" }])

  const updateMember = (index: number, key: "email" | "role", value: string) => {
    const updated = [...members]
    updated[index][key] = value
    setMembers(updated)
  }

  const copyInviteLink = () => {
    if (linkRef.current) {
      navigator.clipboard.writeText(linkRef.current.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus2Icon size={18} /> Invite Team
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-xl p-6 space-y-3">
        <DialogHeader className="text-center space-y-1">
          <DialogTitle>Invite Your Team</DialogTitle>
          <DialogDescription>Quickly add team members and assign their roles.</DialogDescription>
        </DialogHeader>

        {/* Member Input Cards */}
        <div className="space-y-3">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border rounded-lg p-3 shadow-sm hover:shadow-md transition"
            >
              <Input
                placeholder="example@company.com"
                value={member.email}
                onChange={(e) => updateMember(idx, "email", e.target.value)}
                className="flex-1"
              />
              <Select value={member.role} onValueChange={(val) => updateMember(idx, "role", val)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}

          <Button variant="link" onClick={addMember} className="px-0 text-sm">
            + Add another member
          </Button>
        </div>

        {/* Send Invites */}
        <Button className="w-full">Send Invites</Button>

        <hr className="my-4 border-t" />

        {/* Magic Link */}
        <div className="space-y-2">
          <Label htmlFor="team-link">Invite via Link</Label>
          <div className="relative">
            <Input
              id="team-link"
              ref={linkRef}
              value="https://teamapp.com/invite/xyz123"
              readOnly
              className="pr-10"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={copyInviteLink}
                    className="absolute inset-y-0 end-0 flex items-center justify-center w-10 text-gray-500 hover:text-gray-700"
                    disabled={copied}
                  >
                    {copied ? <CheckCircleIcon size={16} className="text-green-500" /> : <Link2Icon size={16} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">Copy invite link</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
