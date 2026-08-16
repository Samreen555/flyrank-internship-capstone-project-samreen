import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center gap-4 p-8 animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-3 text-red-400">
        <AlertCircle className="w-8 h-8" aria-hidden="true" />
        <p className="text-lg font-medium">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary"
          aria-label="Retry the failed operation"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
