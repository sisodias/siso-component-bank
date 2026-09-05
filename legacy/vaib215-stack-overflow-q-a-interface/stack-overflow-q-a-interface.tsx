"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from "./button";
import { Card, CardContent, CardHeader } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Textarea } from "./textarea";
import { Separator } from "./separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  ChevronUp,
  ChevronDown,
  Check,
  Bookmark,
  Flag,
  Share2,
  Eye,
  Edit,
  Calendar,
  Trophy,
  FileText,
  Code,
  Bold,
  Italic,
  Link,
  List,
  Quote,
  Hash,
  Image as ImageIcon
} from 'lucide-react';

// Type Definitions
type VoteType = 'up' | 'down' | null;

interface Author {
  name: string;
  reputation: number;
  badges: { gold: number; silver: number; bronze: number };
  avatar?: string | null;
}

export interface QuestionType {
  id: number | string;
  title: string;
  content: string;
  author: Author;
  tags: string[];
  votes: number;
  views: number;
  timestamp: string;
  bookmarked: boolean;
  userVote: VoteType;
}

export interface AnswerType {
  id: number | string;
  content: string;
  author: Author;
  votes: number;
  timestamp: string;
  isAccepted: boolean;
  userVote: VoteType;
}

// Sub-component: MarkdownRenderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const [html, setHtml] = useState('');

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  useEffect(() => {
    if (!content) {
      setHtml('');
      return;
    }

    const renderMarkdown = async () => {
      try {
        // Load marked if not available
        if (!window.marked) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js';
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const renderer = new window.marked.Renderer();
        
        renderer.code = (code: string, language: string) => {
          const validLang = language && language.match(/^[a-zA-Z0-9_+-]*$/);
          const langClass = validLang ? `language-${language}` : 'language-text';
          return `<pre class="bg-slate-900 text-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto border mb-4"><code class="text-sm font-mono ${langClass}">${escapeHtml(code)}</code></pre>`;
        };
        
        renderer.codespan = (code: string) => 
          `<code class="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">${escapeHtml(code)}</code>`;
        
        renderer.heading = (text: string, level: number) => 
          `<h${level} class="text-xl font-semibold mt-6 mb-4">${text}</h${level}>`;
        
        renderer.blockquote = (quote: string) => 
          `<blockquote class="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30 pl-4 py-2 my-4 italic">${quote}</blockquote>`;
        
        renderer.list = (body: string, ordered: boolean) => 
          `<${ordered ? 'ol' : 'ul'} class="${ordered ? 'list-decimal' : 'list-disc'} list-inside space-y-1 my-4 ml-4">${body}</${ordered ? 'ol' : 'ul'}>`;
        
        renderer.link = (href: string, title: string, text: string) => 
          `<a href="${href}" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
        
        renderer.paragraph = (text: string) => 
          `<p class="mb-4 leading-relaxed">${text}</p>`;

        window.marked.setOptions({ 
          renderer, 
          breaks: true, 
          gfm: true,
          headerIds: false,
          mangle: false
        });

        // Handle both sync and async returns from marked.parse
        const result = window.marked.parse(content);
        const parsedHtml = await Promise.resolve(result);
        
        // Ensure we only set string values
        if (typeof parsedHtml === 'string') {
          setHtml(parsedHtml);
        } else {
          console.warn('Markdown parsing returned non-string result:', parsedHtml);
          setHtml(`<p class="mb-4 leading-relaxed">${escapeHtml(content)}</p>`);
        }
      } catch (error) {
        console.error('Error rendering markdown:', error);
        setHtml(`<p class="mb-4 leading-relaxed">${escapeHtml(content)}</p>`);
      }
    };

    renderMarkdown();
  }, [content]);

  return (
    <div 
      className="prose prose-sm dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent" 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};
// Sub-component: MarkdownEditor
const MarkdownEditor: React.FC<{ value: string; onChange: (value: string) => void; placeholder: string; }> = ({ value, onChange, placeholder }) => {
  const [activeTab, setActiveTab] = useState("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = useCallback((before: string, after = '', newLine = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);
    let insertText = before + selectedText + after;
    if (newLine && selectionStart > 0 && value[selectionStart - 1] !== '\n') {
      insertText = '\n' + insertText;
    }
    const newValue = value.substring(0, selectionStart) + insertText + value.substring(selectionEnd);
    onChange(newValue);
    setTimeout(() => {
      textarea.focus();
      const newPos = selectionStart + before.length + (newLine && selectionStart > 0 && value[selectionStart - 1] !== '\n' ? 1 : 0);
      textarea.setSelectionRange(newPos, newPos + selectedText.length);
    }, 10);
  }, [value, onChange]);

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'Bold (Ctrl+B)' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'Italic (Ctrl+I)' },
    { icon: Code, action: () => insertMarkdown('`', '`'), title: 'Inline Code' },
    { icon: Hash, action: () => insertMarkdown('\n## ', '', true), title: 'Heading' },
    { icon: Quote, action: () => insertMarkdown('\n> ', '', true), title: 'Quote' },
    { icon: List, action: () => insertMarkdown('\n- ', '', true), title: 'Bullet List' },
    { icon: Link, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
    { icon: ImageIcon, action: () => insertMarkdown('![alt text](', ')'), title: 'Image' },
    { icon: FileText, action: () => insertMarkdown('\n```javascript\n', '\n```\n', true), title: 'Code Block' },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="write" className="text-xs"><Edit className="h-3 w-3 mr-1" />Write</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs"><FileText className="h-3 w-3 mr-1" />Preview</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-1 flex-wrap">
            {toolbarButtons.map((btn, i) => <Button key={i} variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={btn.action} title={btn.title} type="button"><btn.icon className="h-3 w-3" /></Button>)}
          </div>
        </div>
        <TabsContent value="write" className="mt-0">
          <Textarea ref={textareaRef} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-h-[250px] border-0 rounded-none resize-none focus-visible:ring-0 font-mono text-sm" />
        </TabsContent>
        <TabsContent value="preview" className="mt-0">
          <div className="p-4 min-h-[250px] bg-background">
            {value ? <MarkdownRenderer content={value} /> : <div className="text-muted-foreground italic text-sm flex items-center justify-center h-32">Nothing to preview.</div>}
          </div>
        </TabsContent>
      </Tabs>
      <div className="border-t bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Markdown supported</span>
          <span>{value.length} characters</span>
        </div>
      </div>
    </div>
  );
};

// Sub-component: VoteButtons
const VoteButtons: React.FC<{ votes: number; userVote: VoteType; onVote: (voteType: 'up' | 'down') => void; size?: 'default' | 'large' }> = ({ votes, userVote, onVote, size = "default" }) => {
  const buttonSize = size === "large" ? "default" : "sm";
  const iconSize = size === "large" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex flex-col items-center space-y-2">
      <Button variant="ghost" size={buttonSize} className={`p-2 ${userVote === 'up' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'hover:bg-muted'}`} onClick={() => onVote('up')}><ChevronUp className={iconSize} /></Button>
      <span className={`font-bold text-lg ${userVote === 'up' ? 'text-orange-600 dark:text-orange-400' : userVote === 'down' ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'}`}>{votes + (userVote === 'up' ? 1 : userVote === 'down' ? -1 : 0)}</span>
      <Button variant="ghost" size={buttonSize} className={`p-2 ${userVote === 'down' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-muted'}`} onClick={() => onVote('down')}><ChevronDown className={iconSize} /></Button>
    </div>
  );
};

// Sub-component: UserInfo
const UserInfo: React.FC<{ author: Author; timestamp: string; postType?: "question" | "answer" }> = ({ author, timestamp, postType = "question" }) => (
  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
    <Avatar className="h-8 w-8"><AvatarImage src={author.avatar || `https://api.dicebear.com/8.x/lorelei/svg?seed=${author.name}`} /><AvatarFallback className="bg-primary/10 text-xs">{author.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-muted-foreground mb-1">{postType === "question" ? "asked" : "answered"} {timestamp}</div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium text-sm hover:text-primary cursor-pointer">{author.name}</span>
        <span className="text-sm font-bold text-muted-foreground">{author.reputation.toLocaleString()}</span>
        {author.badges.gold > 0 && <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><span className="text-xs">{author.badges.gold}</span></div>}
        {author.badges.silver > 0 && <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-400"></div><span className="text-xs">{author.badges.silver}</span></div>}
        {author.badges.bronze > 0 && <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-600"></div><span className="text-xs">{author.badges.bronze}</span></div>}
      </div>
    </div>
  </div>
);

// Main Component: QAPage
export const QAPage: React.FC<{ initialQuestion: QuestionType; initialAnswers: AnswerType[] }> = ({ initialQuestion, initialAnswers }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answers, setAnswers] = useState(initialAnswers);
  const [newAnswer, setNewAnswer] = useState('');

  const handleQuestionVote = (voteType: 'up' | 'down') => setQuestion(q => ({ ...q, userVote: q.userVote === voteType ? null : voteType }));
  const handleAnswerVote = (id: number | string, voteType: 'up' | 'down') => setAnswers(ans => ans.map(a => a.id === id ? { ...a, userVote: a.userVote === voteType ? null : voteType } : a));
  const handleAcceptAnswer = (id: number | string) => setAnswers(ans => ans.map(a => ({ ...a, isAccepted: a.id === id ? !a.isAccepted : false })));
  
  const handleSubmitAnswer = () => {
    if (newAnswer.trim()) {
      const answer: AnswerType = {
        id: Date.now(),
        content: newAnswer,
        author: { name: "currentuser", reputation: 234, badges: { gold: 0, silver: 0, bronze: 2 } },
        votes: 0,
        timestamp: "just now",
        isAccepted: false,
        userVote: null
      };
      setAnswers(prev => [...prev, answer]);
      setNewAnswer('');
    }
  };

  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted !== b.isAccepted) return a.isAccepted ? -1 : 1;
    return (b.votes + (b.userVote === 'up' ? 1 : -1)) - (a.votes + (a.userVote === 'up' ? 1 : -1));
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-4 leading-tight">{question.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />Asked {question.timestamp}</div>
          <div className="flex items-center gap-1"><Eye className="h-4 w-4" />Viewed {question.views.toLocaleString()} times</div>
        </div>
        <div className="flex flex-wrap gap-2">{question.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}</div>
      </header>

      <Card className="mb-8">
        <CardContent className="p-6 flex gap-6">
          <div className="flex flex-col items-center space-y-4">
            <VoteButtons votes={question.votes} userVote={question.userVote} onVote={handleQuestionVote} size="large" />
            <Button variant="ghost" size="sm" className={`p-2 ${question.bookmarked ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 'hover:bg-muted'}`} onClick={() => setQuestion(q => ({...q, bookmarked: !q.bookmarked}))}><Bookmark className="h-4 w-4" /></Button>
          </div>
          <div className="flex-1 min-w-0">
            <MarkdownRenderer content={question.content} />
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs"><Share2 className="h-3 w-3 mr-1" />Share</Button>
                <Button variant="ghost" size="sm" className="text-xs"><Edit className="h-3 w-3 mr-1" />Edit</Button>
                <Button variant="ghost" size="sm" className="text-xs"><Flag className="h-3 w-3 mr-1" />Flag</Button>
              </div>
              <UserInfo author={question.author} timestamp={question.timestamp} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{answers.length} Answer{answers.length !== 1 && 's'}</h2>
      </div>

      <div className="mb-8">
        {sortedAnswers.map((answer, index) => (
          <div key={answer.id}>
            <Card className={`mb-6 ${answer.isAccepted ? 'ring-2 ring-green-200 dark:ring-green-800' : ''}`}>
              <CardContent className="p-6 flex gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <VoteButtons votes={answer.votes} userVote={answer.userVote} onVote={(type) => handleAnswerVote(answer.id, type)} size="large" />
                  <Button variant="ghost" size="sm" className={`p-2 ${answer.isAccepted ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'hover:bg-muted'}`} onClick={() => handleAcceptAnswer(answer.id)}><Check className="h-5 w-5" /></Button>
                  {answer.isAccepted && <div className="text-center"><Trophy className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto mb-1" /><span className="text-xs text-green-600 dark:text-green-400 font-medium">Accepted</span></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <MarkdownRenderer content={answer.content} />
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-xs"><Share2 className="h-3 w-3 mr-1" />Share</Button>
                      <Button variant="ghost" size="sm" className="text-xs"><Edit className="h-3 w-3 mr-1" />Edit</Button>
                      <Button variant="ghost" size="sm" className="text-xs"><Flag className="h-3 w-3 mr-1" />Flag</Button>
                    </div>
                    <UserInfo author={answer.author} timestamp={answer.timestamp} postType="answer" />
                  </div>
                </div>
              </CardContent>
            </Card>
            {index < sortedAnswers.length - 1 && <Separator className="mb-6" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader><h3 className="text-lg font-semibold">Your Answer</h3></CardHeader>
        <CardContent className="space-y-4">
          <MarkdownEditor value={newAnswer} onChange={setNewAnswer} placeholder="Write your answer here..." />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Thanks for contributing an answer!</p>
            <div className="flex gap-2">
              <Button onClick={handleSubmitAnswer} disabled={!newAnswer.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">Post Your Answer</Button>
              <Button variant="outline" onClick={() => setNewAnswer('')} disabled={!newAnswer}>Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};