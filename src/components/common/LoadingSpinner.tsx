import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8" role="status" aria-live="polite">
      <Loader2 
        className={`${sizeClasses[size]} animate-spin text-primary-500`}
        aria-hidden="true"
      />
      {text && (
        <p className="text-gray-400 text-sm font-medium">{text}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
