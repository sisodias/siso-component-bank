// src/components/ui/component.tsx
'use client';

import React from 'react';
import { Search,  Star } from 'lucide-react';
import clsx from 'clsx';

export interface MessageProps {
  id: string;
  avatar: string;
  name: string;
  text: string;
  date: string;
  isFavorite?: boolean;
  isActive?: boolean;
}

interface ClientMessagesSidebarProps {
  messages: MessageProps[];
  onMessageClick?: (id: string) => void;
  onFavoriteToggle?: (id: string) => void;
}

export const ClientMessagesSidebar: React.FC<ClientMessagesSidebarProps> = ({
  messages,
  onMessageClick,
  onFavoriteToggle,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>client messages</h2>
        <div className="tools">
          <Search className="size-6" />
        </div>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={clsx('message', { active: message.isActive })}
            onClick={() => onMessageClick?.(message.id)}
          >
            <div className="message-body">
              <div className="profile-img">
                <img src={message.avatar} alt={message.name} />
              </div>
              <div className="profile">
                <div className="profile-name">
                  <h3>{message.name}</h3>
                  <Star
                    className={clsx('size-6', { fav: message.isFavorite })}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent message click from firing
                      onFavoriteToggle?.(message.id);
                    }}
                  />
                </div>
                <div className="profile-text">
                  <p>{message.text}</p>
                </div>
              </div>
            </div>
            <div className="message-footer">
              <div className="date">{message.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};