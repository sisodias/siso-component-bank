'use client';

import React, { useState, useEffect } from 'react';
import '../../index.css';

interface BentoCard {
  id: string;
  type: 'stat' | 'chart' | 'feature' | 'quote' | 'image';
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  title?: string;
  value?: string;
  subtitle?: string;
  content?: string;
  data?: number[];
  author?: string;
  imageUrl?: string;
  gradient: string;
}

const cards: BentoCard[] = [
  {
    id: '1',
    type: 'stat',
    size: 'medium',
    title: 'Active Users',
    value: '127.5K',
    subtitle: '+23% from last month',
    gradient: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 70%)'
  },
  {
    id: '2',
    type: 'chart',
    size: 'wide',
    title: 'Revenue Trend',
    data: [30, 45, 38, 52, 48, 61, 55, 68],
    gradient: 'radial-gradient(circle at 80% 30%, rgba(245, 87, 108, 0.2), transparent 60%)'
  },
  {
    id: '3',
    type: 'quote',
    size: 'small',
    content: 'The best product we\'ve ever used. Game changing.',
    author: 'Sarah Chen, CEO',
    gradient: 'radial-gradient(circle at 50% 80%, rgba(79, 172, 254, 0.2), transparent 50%)'
  },
  {
    id: '4',
    type: 'feature',
    size: 'tall',
    title: 'Real-time Sync',
    content: 'All your data synchronized instantly across every device and platform.',
    gradient: 'radial-gradient(circle at 30% 20%, rgba(250, 208, 196, 0.3), transparent 60%)'
  },
  {
    id: '5',
    type: 'stat',
    size: 'small',
    title: 'Response Time',
    value: '12ms',
    subtitle: 'Average latency',
    gradient: 'radial-gradient(circle at 70% 70%, rgba(159, 122, 234, 0.25), transparent 55%)'
  },
  {
    id: '6',
    type: 'image',
    size: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=600&fit=crop',
    gradient: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.3), transparent 70%)'
  },
  {
    id: '7',
    type: 'stat',
    size: 'small',
    title: 'Uptime',
    value: '99.99%',
    subtitle: 'Last 90 days',
    gradient: 'radial-gradient(circle at 40% 60%, rgba(72, 219, 251, 0.2), transparent 60%)'
  },
  {
    id: '8',
    type: 'feature',
    size: 'medium',
    title: 'AI Powered',
    content: 'Machine learning algorithms that adapt to your workflow and optimize performance.',
    gradient: 'radial-gradient(circle at 60% 40%, rgba(255, 159, 243, 0.2), transparent 65%)'
  }
];

export default function BentoCards() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [blobMorph, setBlobMorph] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlobMorph(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bento-container">
      <div className="bento-header">
        <h1 className="bento-title">Platform Overview</h1>
      </div>

      <div className="bento-grid">
        {cards.map((card) => (
          <BentoCard
            key={card.id}
            card={card}
            isExpanded={expandedCard === card.id}
            onToggle={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
            blobMorph={blobMorph}
          />
        ))}
      </div>
    </div>
  );
}

interface BentoCardProps {
  card: BentoCard;
  isExpanded: boolean;
  onToggle: () => void;
  blobMorph: number;
}

function BentoCard({ card, isExpanded, onToggle, blobMorph }: BentoCardProps) {
  const getBlobPath = (morph: number) => {
    const t = (morph % 100) / 100;
    const wave1 = Math.sin(t * Math.PI * 2) * 10;
    const wave2 = Math.cos(t * Math.PI * 2) * 8;
    
    return `M0,${50 + wave1} 
            Q${25 + wave2},${25 + wave1} ${50 + wave1},${25 + wave2}
            T${100 - wave1},${50 + wave2}
            Q${75 + wave1},${75 + wave2} ${50 - wave2},${75 + wave1}
            T0,${50 + wave1}`;
  };

  return (
    <div 
      className={`bento-card ${card.size} ${card.type} ${isExpanded ? 'expanded' : ''}`}
      onClick={card.type !== 'stat' ? onToggle : undefined}
    >
      {/* Liquid blob border */}
      <svg className="blob-border" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`blob-gradient-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
          </linearGradient>
        </defs>
        <path
          d={getBlobPath(blobMorph)}
          fill="none"
          stroke={`url(#blob-gradient-${card.id})`}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Mesh gradient background */}
      <div className="card-mesh" style={{ background: card.gradient }} />

      {/* Grain texture */}
      <div className="card-grain" />

      {/* Content */}
      <div className="card-inner">
        {card.type === 'stat' && (
          <>
            <div className="stat-label">{card.title}</div>
            <div className="stat-value">{card.value}</div>
            {card.subtitle && <div className="stat-subtitle">{card.subtitle}</div>}
          </>
        )}

        {card.type === 'chart' && (
          <>
            <div className="chart-title">{card.title}</div>
            <div className="chart-wrapper">
              {card.data?.map((value, index) => (
                <div
                  key={index}
                  className="chart-bar"
                  style={{
                    height: `${value}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              ))}
            </div>
          </>
        )}

        {card.type === 'quote' && (
          <>
            <div className="quote-mark">"</div>
            <div className="quote-content">{card.content}</div>
            <div className="quote-author">— {card.author}</div>
          </>
        )}

        {card.type === 'feature' && (
          <>
            <div className="feature-icon">✦</div>
            <div className="feature-title">{card.title}</div>
            <div className={`feature-content ${isExpanded ? 'show' : ''}`}>
              {card.content}
            </div>
          </>
        )}

        {card.type === 'image' && (
          <div 
            className="card-image"
            style={{ backgroundImage: `url(${card.imageUrl})` }}
          />
        )}
      </div>

      {/* Hover glow */}
      <div className="card-glow" />
    </div>
  );
}