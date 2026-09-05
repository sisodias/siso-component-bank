"use client";

import { useState } from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Star, Smile, Frown, ThumbsUp, ThumbsDown } from "lucide-react";

const FEEDBACK_TYPES = [
{ type: "star", icon: Star, label: "Star Rating" },
{ type: "emoji", icon: Smile, label: "Emoji" },
{ type: "thumbs", icon: ThumbsUp, label: "Thumbs Up/Down" },
];

const UserFeedbackBlock = () => {
const [feedbackType, setFeedbackType] = useState("star");
const [rating, setRating] = useState(0);
const [emoji, setEmoji] = useState("");
const [thumb, setThumb] = useState("");
const [comment, setComment] = useState("");
const [submitted, setSubmitted] = useState(false);

function handleSubmit() {
  setSubmitted(true);
  setTimeout(() => {
    setFeedbackType("star");
    setRating(0);
    setEmoji("");
    setThumb("");
    setComment("");
    setSubmitted(false);
  }, 2000);
}

return (
  <Card className="w-full max-w-md mx-auto p-2 md:p-4">
    <CardContent className="p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-lg">
          How was your help/support experience?
        </span>
        <div className="flex gap-2">
          {FEEDBACK_TYPES.map((ft) => (
            <Button
              key={ft.type}
              size="icon"
              variant={feedbackType === ft.type ? "secondary" : "ghost"}
              onClick={() => setFeedbackType(ft.type)}
              aria-label={ft.label}
            >
              <ft.icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      </div>
      {!submitted ? (
        <div className="flex flex-col gap-4">
          {feedbackType === "star" && (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`text-yellow-400 ${
                    n <= rating ? "" : "opacity-30"
                  }`}
                  onClick={() => setRating(n)}
                  aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                >
                  <Star
                    className="w-6 h-6"
                    fill={n <= rating ? "#facc15" : "none"}
                  />
                </button>
              ))}
            </div>
          )}
          {feedbackType === "emoji" && (
            <div className="flex gap-2">
              {[
                { e: "😊", label: "Happy" },
                { e: "😐", label: "Neutral" },
                { e: "😞", label: "Unhappy" },
              ].map((em) => (
                <button
                  key={em.e}
                  className={`text-2xl ${
                    emoji === em.e ? "ring-2 ring-primary rounded-full" : ""
                  }`}
                  onClick={() => setEmoji(em.e)}
                  aria-label={em.label}
                >
                  {em.e}
                </button>
              ))}
            </div>
          )}
          {feedbackType === "thumbs" && (
            <div className="flex gap-2">
              <button
                className={`p-2 rounded-full border ${
                  thumb === "up"
                    ? "bg-green-100 border-green-400"
                    : "border-muted-foreground/20"
                }`}
                onClick={() => setThumb("up")}
                aria-label="Thumbs up"
              >
                <ThumbsUp className="w-5 h-5 text-green-600" />
              </button>
              <button
                className={`p-2 rounded-full border ${
                  thumb === "down"
                    ? "bg-red-100 border-red-400"
                    : "border-muted-foreground/20"
                }`}
                onClick={() => setThumb("down")}
                aria-label="Thumbs down"
              >
                <ThumbsDown className="w-5 h-5 text-red-600" />
              </button>
            </div>
          )}
          <Textarea
            placeholder="Additional comments (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
          />
          <Button
            onClick={handleSubmit}
            disabled={
              (feedbackType === "star" && rating === 0) ||
              (feedbackType === "emoji" && !emoji) ||
              (feedbackType === "thumbs" && !thumb)
            }
            className="self-end"
          >
            Submit Feedback
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <span className="text-green-600 font-semibold">
            Thank you for your feedback!
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);
}

export default UserFeedbackBlock;