"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "./card";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import {
Paperclip,
CheckCircle,
Loader2,
PhoneCall,
User,
Mail,
} from "lucide-react";

const TOPICS = [
"General Inquiry",
"Account Issue",
"Billing",
"Technical Support",
"Feedback/Suggestion",
];

const FAQS = [
{
  question: "How do I reset my password?",
  answer:
    "Go to the Sign In page and click on 'Forgot password?' to reset your password.",
},
{
  question: "How do I update my billing info?",
  answer:
    "Navigate to Billing Settings in your account to update payment details.",
},
{
  question: "How do I contact support?",
  answer: "You can use this form or the live chat widget to reach our team.",
},
{
  question: "How do I change my email address?",
  answer: "Go to your profile settings and update your email address.",
},
];

function getRelatedFaqs(query: string) {
if (!query.trim()) return [];
return FAQS.filter(
  (faq) =>
    faq.question.toLowerCase().includes(query.toLowerCase()) ||
    faq.answer.toLowerCase().includes(query.toLowerCase())
).slice(0, 2);
}

const ContactSupportBlock = () => {
const [step, setStep] = useState(1);
const [topic, setTopic] = useState("");
const [message, setMessage] = useState("");
const [file, setFile] = useState<File | null>(null);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [submitting, setSubmitting] = useState(false);
const [ticket, setTicket] = useState<string | null>(null);
const [error, setError] = useState("");

const relatedFaqs = getRelatedFaqs(message);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setFile(e.target.files[0]);
  }
};

const handleNext = () => {
  setError("");
  if (step === 1 && !topic) {
    setError("Please select a topic.");
    return;
  }
  if (step === 2 && !message.trim()) {
    setError("Please describe your issue.");
    return;
  }
  if (step === 4 && (!name.trim() || !email.trim())) {
    setError("Please enter your name and email.");
    return;
  }
  setStep(step + 1);
};

const handlePrev = () => {
  setError("");
  setStep(step - 1);
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setTimeout(() => {
    setTicket(`#${Math.floor(10000 + Math.random() * 90000)}`);
    setSubmitting(false);
    setStep(5);
  }, 1200);
};

if (step === 5 && ticket) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
        <div className="text-green-600 font-semibold text-lg">
          Request Submitted!
        </div>
        <div className="text-muted-foreground text-center">
          Your support ticket <span className="font-bold">{ticket}</span> has
          been received.
          <br />
          Our team will get back to you soon.
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button
            variant="outline"
            onClick={() => {
              setStep(1);
              setTicket(null);
              setTopic("");
              setMessage("");
              setFile(null);
              setName("");
              setEmail("");
            }}
          >
            Submit another request
          </Button>
          <Button variant="ghost">Check status</Button>
        </div>
      </CardContent>
    </Card>
  );
}

return (
  <Card className="w-full max-w-md mx-auto flex flex-col gap-6 ">
    <CardTitle className="flex items-center gap-4">
      <PhoneCall /> Contact Support
    </CardTitle>
    <CardContent className="flex flex-col gap-4 ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <label className="font-medium">What can we help you with?</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <Button
                  className="grow"
                  key={t}
                  type="button"
                  variant={topic === t ? "default" : "outline"}
                  onClick={() => setTopic(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-3">
            <label className="font-medium">Describe your issue</label>
            <Textarea
              placeholder="Please provide details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            {relatedFaqs.length > 0 && (
              <div className="bg-accent rounded flex flex-col gap-1 p-3">
                <div className="font-semibold text-xs text-muted-foreground">
                  Related FAQs:
                </div>
                <ul className="list-disc pl-4 flex flex-col gap-1">
                  {relatedFaqs.map((faq, i) => (
                    <li key={i} className="text-xs text-muted-foreground">
                      {faq.question}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col gap-3">
            <label className="font-medium">Attach a file (optional)</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById("file-upload")?.click()
                }
              >
                <Paperclip className="h-4 w-4 mr-1" />{" "}
                {file ? file.name : "Choose file"}
              </Button>
              {file && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setFile(null)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="flex flex-col gap-3">
            <label className="font-medium">How should we contact you?</label>
            <Input
              leftIcon={<User />}
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              leftIcon={<Mail />}
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2">
          {step > 1 && step < 5 && (
            <Button type="button" variant="ghost" onClick={handlePrev}>
              Back
            </Button>
          )}
          {step < 4 && (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          )}
          {step === 4 && (
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </div>
      </form>
    </CardContent>
  </Card>
);
}

export default ContactSupportBlock;