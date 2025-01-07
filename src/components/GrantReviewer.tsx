import React, { useState } from 'react';
import { reviewGrantApplication, implementSuggestions } from '../lib/ai-client';
import { parseAIResponse } from '../lib/response-parser';
import { useSupabase } from '../lib/supabase-context';
import Header from '../../../components/Header';
import Editor from '../../../components/Editor';
import ErrorMessage from '../../../components/ErrorMessage';
import ReviewButtons from '../../../components/ReviewButtons';
import ReviewResults from '../../../components/ReviewResults';
import { grantApi, aiApi } from '../lib/api-client';

interface FeedbackState {
  original: string;
  feedback: string;
  rewrite: string;
  revised: string;
  isReviewing: boolean;
  isImplementing: boolean;
  error: string | null;
}

export default function GrantReviewer() {
  const supabase = useSupabase();
  const [feedback, setFeedback] = useState<FeedbackState>({
    original: '',
    feedback: '',
    rewrite: '',
    revised: '',
    isReviewing: false,
    isImplementing: false,
    error: null,
  });

  const handleReview = async () => {
    setFeedback(prev => ({ 
      ...prev, 
      isReviewing: true,
      error: null,
    }));
    
    try {
      const aiResponse = await reviewGrantApplication(feedback.original, supabase);
      const { feedback: feedbackText, rewrite } = parseAIResponse(aiResponse);
      
      setFeedback(prev => ({
        ...prev,
        feedback: feedbackText,
        rewrite,
        revised: rewrite,
        isReviewing: false,
      }));
    } catch (error) {
      setFeedback(prev => ({
        ...prev,
        isReviewing: false,
        error: 'Failed to review grant application. Please try again.',
      }));
    }
  };

  const handleImplementSuggestions = async () => {
    setFeedback(prev => ({
      ...prev,
      isImplementing: true,
      error: null,
    }));

    try {
      const aiResponse = await implementSuggestions(feedback.original, feedback.feedback, supabase);
      const { feedback: implementationFeedback, rewrite: finalVersion } = parseAIResponse(aiResponse);

      setFeedback(prev => ({
        ...prev,
        feedback: implementationFeedback,
        rewrite: finalVersion,
        revised: finalVersion,
        isImplementing: false,
      }));
    } catch (error) {
      setFeedback(prev => ({
        ...prev,
        isImplementing: false,
        error: 'Failed to implement suggestions. Please try again.',
      }));
    }
  };

  const handleAcceptRewrite = () => {
    setFeedback(prev => ({
      ...prev,
      revised: prev.rewrite,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Header />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Editor
                label="Original Grant Application"
                placeholder="Enter your grant application text here..."
                value={feedback.original}
                onChange={(value) => setFeedback(prev => ({ ...prev, original: value }))}
              />

              {feedback.error && <ErrorMessage message={feedback.error} />}

              <ReviewButtons
                original={feedback.original}
                feedback={feedback.feedback}
                isReviewing={feedback.isReviewing}
                isImplementing={feedback.isImplementing}
                onReview={handleReview}
                onImplement={handleImplementSuggestions}
              />
            </div>

            {(feedback.feedback || feedback.rewrite) && (
              <ReviewResults
                original={feedback.original}
                feedback={feedback.feedback}
                rewrite={feedback.rewrite}
                revised={feedback.revised}
                onAcceptRewrite={handleAcceptRewrite}
                onReviseChange={(value) => setFeedback(prev => ({ ...prev, revised: value }))}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}