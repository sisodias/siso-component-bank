"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  MoreHorizontal,
  Reply,
  Award,
  Share,
} from 'lucide-react';

// Define the type for a single comment
export interface CommentType {
  id: number | string;
  author: string;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  replies: CommentType[];
}

// Props for the internal Comment component
interface CommentProps {
  comment: CommentType;
  depth?: number;
  onReply: (parentId: number | string, content: string) => void;
  isOp?: boolean;
}

// Internal recursive component to render each comment and its replies
const Comment: React.FC<CommentProps> = ({ comment, depth = 0, onReply, isOp = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleVote = (voteType: 'up' | 'down') => {
    setUserVote(userVote === voteType ? null : voteType);
  };

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split('').slice(0, 2).join('').toUpperCase();
  };
  
  const netScore = comment.upvotes - comment.downvotes + (userVote === 'up' ? 1 : userVote === 'down' ? -1 : 0);

  return (
    <div className={`${depth > 0 ? 'ml-4 md:ml-6 border-muted pl-4 md:pl-6' : 'border-transparent'} border-l-2`}>
      <Card className="mb-4 transition-colors hover:bg-muted/30">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${comment.author}`} />
              <AvatarFallback className="text-xs bg-primary/10">
                {getInitials(comment.author)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{comment.author}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                {isOp && <Badge variant="secondary" className="text-xs">OP</Badge>}
              </div>
              
              <div className="text-sm leading-relaxed mb-3">{comment.content}</div>
              
              <div className="flex flex-wrap items-center gap-1">
                {/* Vote buttons */}
                <div className="flex items-center bg-muted rounded-full p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 rounded-full ${userVote === 'up' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : ''}`}
                    onClick={() => handleVote('up')}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <span className={`px-2 text-xs font-medium min-w-[24px] text-center ${userVote === 'up' ? 'text-orange-600 dark:text-orange-400' : userVote === 'down' ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                    {netScore}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 rounded-full ${userVote === 'down' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}`}
                    onClick={() => handleVote('down')}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Action buttons */}
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setShowReplyBox(!showReplyBox)}>
                  <Reply className="h-3 w-3 mr-1" /> Reply
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs"><Award className="h-3 w-3 mr-1" /> Award</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs"><Share className="h-3 w-3 mr-1" /> Share</Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-3 w-3" /></Button>

                {/* Collapse toggle */}
                {comment.replies && comment.replies.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs md:ml-auto" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? 'Collapse' : `Expand (${comment.replies.length})`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        {showReplyBox && (
          <CardContent className="pt-0">
            <div className="flex gap-3">
              <Avatar className="h-7 w-7 mt-1">
                <AvatarFallback className="text-xs bg-primary/10">YU</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="What are your thoughts?"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px] text-sm resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleReplySubmit} disabled={!replyText.trim()}>Comment</Button>
                  <Button size="sm" variant="outline" onClick={() => { setShowReplyBox(false); setReplyText(''); }}>Cancel</Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Nested replies */}
      {isExpanded && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};


// Main exported component
export const CommentThread: React.FC<{ initialComments: CommentType[] }> = ({ initialComments }) => {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleReply = (parentId: number | string, content: string) => {
    const newReply: CommentType = {
      id: Date.now(),
      author: "currentuser",
      content: content,
      timestamp: "now",
      upvotes: 0,
      downvotes: 0,
      replies: []
    };

    const addReplyToComments = (commentsList: CommentType[]): CommentType[] => {
      return commentsList.map(comment => {
        if (comment.id === parentId) {
          return { ...comment, replies: [...comment.replies, newReply] };
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: addReplyToComments(comment.replies) };
        }
        return comment;
      });
    };
    setComments(addReplyToComments(comments));
  };

  const handleNewComment = () => {
    if (newComment.trim()) {
      const comment: CommentType = {
        id: Date.now(),
        author: "currentuser",
        content: newComment,
        timestamp: "now",
        upvotes: 0,
        downvotes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* New comment input */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary/10">YU</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Start a discussion..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={handleNewComment} disabled={!newComment.trim()}>
                  <MessageSquare className="h-4 w-4 mr-2" /> Post Comment
                </Button>
                <Button variant="outline" onClick={() => setNewComment('')} disabled={!newComment}>Clear</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-0">
        {comments.map((comment, index) => (
          <Comment key={comment.id} comment={comment} depth={0} onReply={handleReply} isOp={index === 0} />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to start the discussion!</p>
        </div>
      )}
    </div>
  );
};