import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  href?: string;
  className?: string;
}

export default function StatCard({ label, value, sub, trend, href, className = '' }: StatCardProps) {
  const trendEmoji = trend === 'up' ? '\u2191' : trend === 'down' ? '\u2193' : '';
  const trendClass = trend === 'up' ? 'stat-card-up' : trend === 'down' ? 'stat-card-down' : '';

  const cardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    padding: '1.25em 1.4em',
    borderRadius: '8px',
    border: '1px solid #BFDBFE',
    boxShadow: '0 1px 2px rgba(15,23,42,.04)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color .15s ease, box-shadow .15s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '.2em',
    textDecoration: 'none',
    color: '#0F172A',
    cursor: href ? 'pointer' : 'default',
  };

  const labelStyle: React.CSSProperties = {
    color: '#64748B',
    fontSize: '.82em',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
  };

  const valueStyle: React.CSSProperties = {
    fontFamily: "'Fraunces', 'Iowan Old Style', Georgia, serif",
    fontSize: '2.1em',
    fontWeight: 500,
    margin: '.2em 0 .15em',
    color: '#0F172A',
    letterSpacing: '-0.02em',
    fontVariantNumeric: 'tabular-nums',
  };

  const subStyle: React.CSSProperties = {
    color: '#64748B',
    fontSize: '.88em',
    fontVariantNumeric: 'tabular-nums',
  };

  const accentStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: '3px',
    background: trend === 'up' ? '#15803D' : trend === 'down' ? '#B91C1C' : '#0369A1',
    borderRadius: '3px 0 0 3px',
  };

  const hoverStyle = href ? {
    borderColor: '#0369A1',
    boxShadow: '0 4px 14px rgba(15,23,42,.08), 0 2px 4px rgba(15,23,42,.04)',
    color: '#0F172A',
    textDecoration: 'none',
  } : {};

  return (
    <a href={href} style={{ ...cardStyle, ...hoverStyle }} className={className}>
      <div style={accentStyle} aria-hidden="true" />
      <span style={labelStyle}>{label}</span>
      <span className={trendClass} style={valueStyle}>
        {trendEmoji && <span>{trendEmoji} </span>}
        {value}
      </span>
      {sub && <span style={subStyle}>{sub}</span>}
    </a>
  );
}
