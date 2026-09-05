"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Users, Flame, MessageCircle, ArrowUpRight } from "lucide-react";

const FORUMS = [
{
  name: "HextaUI Community Forum",
  url: "https://hextaui.com",
  icon: Users,
},
{
  name: "Discord Server",
  url: "https://discord.gg/hG4dkbMcZf",
  icon: MessageCircle,
},
{ name: "User Group: Power Users", url: "#", icon: Users },
];

const TRENDING_TOPICS = [
{ title: "How to customize themes?", replies: 12, url: "#" },
{ title: "Showcase your HextaUI project!", replies: 8, url: "#" },
{ title: "Best practices for performance", replies: 5, url: "#" },
];

const LEADERBOARD = [
{
  name: "Alex Kim",
  avatar: "https://api.dicebear.com/9.x/glass/svg?seed=Alex",
  points: 120,
},
{
  name: "Priya Singh",
  avatar: "https://api.dicebear.com/9.x/glass/svg?seed=Priya",
  points: 98,
},
{
  name: "Jordan Lee",
  avatar: "https://api.dicebear.com/9.x/glass/svg?seed=Jordan",
  points: 85,
},
];

export default function CommunitySupportBlock() {
const [askText, setAskText] = useState("");
const [submitted, setSubmitted] = useState(false);

function handleAsk() {
  setSubmitted(true);
  setTimeout(() => {
    setAskText("");
    setSubmitted(false);
  }, 2000);
}

return (
  <Card className="w-full max-w-2xl mx-auto">
    <CardContent className="p-0 md:p-6 flex flex-col gap-8">
      {/* Ask the Community CTA */}
      <Card className="bg-primary/5 border border-primary/20 rounded-card mb-2 md:p-4 p-2">
        <CardContent className="flex flex-col gap-2 p-0">
          <span className="font-semibold text-lg flex items-center gap-2 text-primary">
            <MessageCircle className="w-5 h-5" /> Ask the Community
          </span>
          <div className="flex gap-2">
            <Input
              placeholder="Type your question..."
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              disabled={submitted}
              className="flex-1"
            />
            <Button
              onClick={handleAsk}
              disabled={!askText.trim() || submitted}
              loading={submitted}
            >
              Ask
            </Button>
          </div>
          {submitted && (
            <span className="text-green-600 text-sm mt-1">
              Your question was posted to the community!
            </span>
          )}
        </CardContent>
      </Card>

      {/* Forums */}
      <div>
        <span className="font-semibold text-base mb-2 block">
          Community Forums & Groups
        </span>
        <div className="flex flex-wrap gap-3">
          {FORUMS.map((forum) => (
            <a
              key={forum.name}
              href={forum.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-card border border-muted-foreground/10 bg-background hover:bg-accent transition min-w-[180px]"
            >
              <forum.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{forum.name}</span>
              <ArrowUpRight className="w-3 h-3 ml-1 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>

      {/* Trending & Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-accent rounded-card md:p-4 p-2">
          <CardContent className="flex flex-col gap-2 p-0">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-semibold">Trending Topics</span>
            </div>
            <div className="flex flex-col gap-2">
              {TRENDING_TOPICS.map((topic) => (
                <a
                  key={topic.title}
                  href={topic.url}
                  className="flex items-center gap-2 px-2 py-1 rounded-ele hover:bg-primary/10 transition text-sm"
                >
                  <span className="font-medium">{topic.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {topic.replies} replies
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent rounded-card md:p-4 p-2">
          <CardContent className="flex flex-col gap-2 p-0">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-semibold">Top Contributors</span>
            </div>
            <div className="flex flex-col gap-2">
              {LEADERBOARD.map((user, i) => (
                <div
                  key={user.name}
                  className="flex items-center gap-2 px-2 py-1 rounded text-sm"
                >
                  <span className="font-bold text-muted-foreground">
                    #{i + 1}
                  </span>
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                  <span className="ml-auto text-xs text-primary font-semibold">
                    {user.points} pts
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>
);
}