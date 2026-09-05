'use client';
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface RadioOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface RadioGroupProps {
  options: RadioOption[];
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  fontSize?: string;
  fontWeight?: number;
  fontFamily?: string;
  borderRadius?: string;
  gap?: string;
  rtl?: boolean;
  bgDefault?: string;
  fgDefault?: string;
  bgActive?: string;
  fgActive?: string;
  bgHover?: string;
  fgHover?: string;
  padding?: string;
}

export function RadioGroup({
  options,
  onChange,
  value,
  defaultValue = options[0]?.value,
  fontSize = '1rem',
  fontWeight = 400,
  fontFamily = 'inherit',
  borderRadius = '8px',
  gap = '14px',
  rtl = false,
  bgDefault = '#e1e1e1',
  fgDefault = '#0a0a0a',
  bgActive = '#0a0a0a',
  fgActive = '#fff',
  bgHover = '#00a6fb',
  fgHover = '#fff',
  padding = '0 56px',
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalValue;
  const [hovered, setHovered] = useState<string | null>(null);

  // For RTL, use row-reverse so first option is rightmost, last is leftmost
  // Don't reverse the array! Just let flexbox do the job.
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: rtl ? 'row-reverse' : 'row',
        gap,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
      }}
    >
      {options.map((option) => {
        const isActive = activeTab === option.value;
        const isHovered = hovered === option.value;

        let bg = bgDefault;
        let fg = fgDefault;
        if (isActive) {
          bg = bgActive;
          fg = fgActive;
        } else if (isHovered) {
          bg = bgHover;
          fg = fgHover;
        }

        // For RTL, swap icon and label order within the button
        const content = rtl ? (
          <>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                zIndex: 2,
              }}
            >
              {option.label}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: 4,
                zIndex: 2,
              }}
            >
              <option.icon color="currentColor" size={20} strokeWidth={2} />
            </span>
          </>
        ) : (
          <>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: 4,
                zIndex: 2,
              }}
            >
              <option.icon color="currentColor" size={20} strokeWidth={2} />
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                zIndex: 2,
              }}
            >
              {option.label}
            </span>
          </>
        );

        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            onClick={() => {
              if (value === undefined) setInternalValue(option.value);
              onChange?.(option.value);
            }}
            onMouseEnter={() => setHovered(option.value)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: bg,
              color: fg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding,
              height: 48,
              border: 'none',
              borderRadius,
              fontSize,
              fontWeight,
              fontFamily,
              cursor: 'pointer',
              outline: 'none',
              userSelect: 'none',
              margin: 0,
              boxSizing: 'border-box',
              minWidth: 0,
              minHeight: 0,
              position: 'relative',
              overflow: 'hidden',
              transition: 'background 0.3s, color 0.3s',
            }}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
