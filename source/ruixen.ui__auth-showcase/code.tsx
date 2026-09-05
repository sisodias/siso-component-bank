"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Copy, Check, ArrowUpRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

/* -------------------- CODE CARD -------------------- */
interface CodeCardProps {
  code: string;
  language: string;
  filename: string;
}

function CodeCard({ code, language, filename }: CodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Copy failed");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border shadow-lg bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 text-sm border-b border-zinc-800">
        <span className="font-mono text-zinc-300">{filename}</span>
        <Button
          onClick={handleCopy}
          size="sm"
          variant="secondary"
          className="gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      {/* Code Body */}
      <ScrollArea className="h-[320px]">
        <pre className="m-0 p-4 text-sm leading-relaxed font-mono">
          <code>{code}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}

/* -------------------- CODE SNIPPETS -------------------- */
const codeSnippets = [
  {
    language: "javascript",
    filename: "auth-setup.js",
    code: `// Node.js authentication with JWT
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function login(req, res) {
  const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
}`,
  },
  {
    language: "python",
    filename: "auth_setup.py",
    code: `# Python auth using Flask + JWT
from flask import Flask, request, jsonify
import jwt, datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecret'

@app.route('/login', methods=['POST'])
def login():
    token = jwt.encode({'user': request.json.get('email'),
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                        app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token})`,
  },
  {
    language: "go",
    filename: "auth_setup.go",
    code: `package main

import (
    "github.com/golang-jwt/jwt/v4"
    "time"
    "fmt"
)

func main() {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "email": "user@example.com",
        "exp":   time.Now().Add(time.Hour).Unix(),
    })
    tokenString, _ := token.SignedString([]byte("supersecret"))
    fmt.Println(tokenString)
}`,
  },
  {
    language: "ruby",
    filename: "auth_setup.rb",
    code: `# Ruby authentication with JWT
require 'jwt'

payload = { user_id: 1, exp: 1.hour.from_now.to_i }
token = JWT.encode(payload, 'supersecret', 'HS256')
puts token`,
  },
];

/* -------------------- MAIN SHOWCASE -------------------- */
export function AuthShowcase() {
  const [selectedLang, setSelectedLang] = useState("javascript");

  return (
    <section className="relative py-20">
      <div className="container grid gap-12 lg:grid-cols-2">
        {/* LEFT: Text Section */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">
              Secure Auth
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Robust <span className="text-primary">Authentication</span> Made Simple
          </h2>
          <p className="text-muted-foreground text-lg">
            Implement JWT, OAuth, and bcrypt authentication with minimal effort.
            Secure your users in seconds with pre-built code templates.
          </p>
          <Button
            size="lg"
            className="group w-fit bg-primary px-6 py-3 text-lg font-medium text-white shadow-md hover:shadow-xl"
          >
            Get Started
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* RIGHT: Code Section */}
        <div className="flex flex-col gap-4">
          <Tabs
            defaultValue="javascript"
            onValueChange={setSelectedLang}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 rounded-md border bg-muted/30 p-1">
              {["javascript", "python", "go", "ruby"].map((lang) => (
                <TabsTrigger
                  key={lang}
                  value={lang}
                  className="rounded-sm data-[state=active]:bg-primary data-[state=active]:text-white transition"
                >
                  {lang[0].toUpperCase() + lang.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {codeSnippets
            .filter((snip) => snip.language === selectedLang)
            .map((snip) => (
              <CodeCard
                key={snip.language}
                code={snip.code}
                language={snip.language}
                filename={snip.filename}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
