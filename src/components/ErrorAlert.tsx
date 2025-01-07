import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 relative">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}