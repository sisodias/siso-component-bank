"use client";

import { Button } from "@/components/ui/button";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

import { useState } from "react";
import { Globe, Lightbulb, Mic, Paperclip, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const BasicAIChatInput = () => {
const [input, setInput] = useState("");
const [model, setModel] = useState("gpt-3.5-turbo");

const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setInput(e.target.value);
};

const handleModelChange = (value: string) => {
  setModel(value);
};

const handleSubmit = () => {
  // Handle the submission logic here
  console.log("Submitted:", { input, model });
  setInput(""); // Clear input after submission
};

return (
  <div className="flex items-center flex-col gap-2 max-w-2xl w-full">
    <div className="flex items-center justify-end max-sm:justify-center w-full">
      <Select onValueChange={handleModelChange} value={model}>
        <SelectTrigger className="w-35 font-medium" variant={"ghost"}>
          <SelectValue placeholder="Select Model" />
        </SelectTrigger>
        <SelectContent className="text-sm">
          <SelectItem value="claude-sonnet-4-preview">
            Claude Sonnet 4 (Preview)
          </SelectItem>
          <SelectItem value="claude-sonnet-3.7">Claude Sonnet 3.7</SelectItem>
          <SelectItem value="claude-sonnet-3.5">Claude Sonnet 3.5</SelectItem>
          <SelectItem value="gemini-2.5-pro-preview">
            Gemini 2.5 pro (Preview)
          </SelectItem>
          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          <SelectItem value="gpt-4">GPT-4</SelectItem>
          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
          <SelectItem value="gpt-o4-mini">o4-mini (Preview)</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Card className="w-full rounded-card">
      <CardContent>
        <div className="w-full">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="flex-grow border-none ring-0 outline-none shadow-none focus:border-none focus:ring-0 focus:outline-none focus:shadow-none hover:border-none hover:ring-0 hover:outline-none hover:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none bg-transparent"
          />
        </div>

        <div className="w-full flex items-center justify-between gap-2 ">
          <div className="flex items-center justify-center gap-2">
            <Button variant={"ghost"} size={"icon"} className="rounded-md">
              <Paperclip />
            </Button>
            <Toggle className="h-9 w-9">
              <Lightbulb className="size-4 shrink-0"/>
            </Toggle>
            <Toggle variant={"ghost"} className="font-normal flex gap-1.5 items-center text-sm">
              <Globe className="size-4 shrink-0" /> <span className="max-sm:hidden">Search</span>
            </Toggle>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Toggle  variant="outline" className="h-10 w-10 rounded-ele" aria-label="Toggle italic">
              <Mic className="size-4 shrink-0"/>
            </Toggle>

            <Button onClick={handleSubmit} size={"icon"} className="rounded-md">
              <Send />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
}

export default BasicAIChatInput;