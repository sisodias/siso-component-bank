"use client";

import React from "react";
import { MessageSquareDotIcon } from "lucide-react";
import { GiExitDoor } from "react-icons/gi";
import { PlusIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type GroupCardProps = {
  name: string;
  email: string;
  avatar?: string;
  purpose: string;
  onChat?: () => void;
  onExit?: () => void;
};

export function GroupCard({
  name,
  email,
  avatar,
  purpose,
  onChat,
  onExit,
}: GroupCardProps) {
 const positions = [
    "top-0 -left-3",
    "top-0 -right-3",
    "bottom-0 -left-3",
    "bottom-0 -right-3",
  ];
  return (
    <article className="max-w-md relative flex flex-col gap-3 border-dashed border rounded-none p-3">
        <div className="min-h-full w-full bg-transparent absolute top-0 left-0">
      {/* Diagonal Fade Grid Background - Top Left */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
        linear-gradient(to right, var(--muted) 1px, transparent 1px),
        linear-gradient(to bottom, var(--muted) 1px, transparent 1px)
      `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
        }}
      />
      {/* Your Content/Components */}
    </div>
    <div className="absolute -z-10 inset-0">
      {positions.map((pos, index) => (
        <section key={index} className={`absolute ${pos}`}>
          <PlusIcon/>
        </section>
      ))}
    </div>
      {/* Sender Section */}
      <section className="flex backdrop-blur-xs items-center gap-3">
        <img
          src={
            avatar ??
            "https://media.istockphoto.com/id/1457353108/photo/computer-hacker.jpg?s=612x612&w=0&k=20&c=h40R0Kikw8QAFIAM5Bz8Ixygeycoqhnkvai1ENJEIYQ="
          }
          alt={`${name} profile picture`}
          className="size-16 rounded-full border border-primary/20 border-dashed object-cover"
          loading="lazy"
        />

        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-semibold capitalize line-clamp-1">
            {name} invited you
          </h3>
          <Separator className="my-1 opacity-40" />
          <p className="text-[0.65rem] font-mono text-muted-foreground uppercase line-clamp-1">
            {email}
          </p>
        </div>
      </section>

      <Separator />

      {/* Invitation Message */}
      <section className="backdrop-blur-xs space-y-2">
        <h4 className="text-sm font-medium">Group Invitation</h4>
        <Separator />
        <p className="text-xs font-mono text-muted-foreground line-clamp-3">
          {purpose}
        </p>
      </section>

      <Separator />

      {/* Actions */}
      <div className="flex justify-center gap-2 pt-2">
        <Button 
        className="rounded-none"
        onClick={onChat} aria-label="Join group and open chat">
          <MessageSquareDotIcon className="mr-1 size-4" />
          Join & Chat
        </Button>

        <Button
          variant="outline"
          className="border-dashed rounded-none"
          onClick={onExit}
          aria-label="Decline group invitation"
        >
          <GiExitDoor className="mr-1 size-4" />
          Decline
        </Button>
      </div>
    </article>
  );
}
