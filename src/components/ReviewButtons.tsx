import React from 'react';
import { Send, Wand2 } from 'lucide-react';

interface ReviewButtonsProps {
  original: string;
  feedback: string;
  isReviewing: boolean;
  isImplementing: boolean;
  onReview: () => void;
  onImplement: () => void;
}

export default function ReviewButtons({
  original,
  feedback,
  isReviewing,
  isImplementing,
  onReview,
  onImplement,
}: ReviewButtonsProps) {
  return (
    <div className="mt-4 flex gap-3">
      <button
        onClick={onReview}
        disabled={!original || isReviewing}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium
          ${original && !isReviewing 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-400 cursor-not-allowed'}`}
      >
        {isReviewing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Reviewing...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Review Application
          </>
        )}
      </button>

      {feedback && (
        <button
          onClick={onImplement}
          disabled={isImplementing}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium
            ${!isImplementing 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {isImplementing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Implementing...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Implement Suggestions
            </>
          )}
        </button>
      )}
    </div>
  );
}