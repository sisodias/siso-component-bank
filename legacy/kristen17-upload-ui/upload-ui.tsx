// src/components/ui/component.tsx
'use client';

import * as React from 'react';
import { X, ArrowDownCircle, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

interface UploadCardProps {
  status: 'uploading' | 'success' | 'error';
  progress?: number; // Only relevant for 'uploading' status
  title: string;
  description: string;
  primaryButtonText: string;
  onPrimaryButtonClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  status,
  progress,
  title,
  description,
  primaryButtonText,
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
}) => {
  const renderIcon = () => {
    switch (status) {
      case 'uploading':
        return <ArrowDownCircle className="icon" />;
      case 'success':
        return <CheckCircle className="icon" />;
      case 'error':
        return <XCircle className="icon" />;
      default:
        return null;
    }
  };

  return (
    <div className={clsx('card', {
      'blue': status === 'uploading',
      'green': status === 'success',
      'red': status === 'error',
    })}>
      <div className="card-header">
        <X className="close" />
      </div>
      <div className="card-body">
        {renderIcon()}
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
          {status === 'uploading' && (
            <div className="progress">
              <div>
                <span>{progress}%</span>
                <div className="progress-bar" style={{ '--progress-width': `${progress}%` } as React.CSSProperties}></div>
              </div>
              <a href="#" className="btn-first" onClick={onPrimaryButtonClick}>
                {primaryButtonText}
              </a>
            </div>
          )}
        </div>
      </div>
      {(status === 'success' || status === 'error') && (
        <div className="progress">
          <a href="#" className="btn-first" onClick={onPrimaryButtonClick}>
            {primaryButtonText}
          </a>
          {secondaryButtonText && (
            <a href="#" className="btn-second" onClick={onSecondaryButtonClick}>
              {secondaryButtonText}
            </a>
          )}
        </div>
      )}
    </div>
  );
};