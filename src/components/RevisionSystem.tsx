import React, { useState, useEffect } from 'react';
import { TextEditor } from './TextEditor';
import { FormattedOutput } from './FormattedOutput';
import { ErrorAlert } from './ErrorAlert';
import { useSupabase } from '../lib/supabase-context';
import { reviewGrantApplication } from '../lib/ai-client';
import { parseAIResponse } from '../lib/response-parser';
import { handleError } from '../utils/errorHandler';

export function RevisionSystem() {
  const [draft, setDraft] = useState('');
  const [revision, setRevision] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const COOLDOWN_PERIOD = 60000; // 60 seconds cooldown
  const supabase = useSupabase();

  // Add test data for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !draft) {
      setDraft(`Dear Grant Committee,

I am writing to request funding for our women's tech education initiative. We need $50,000 to train 100 women in coding.

Our program will teach coding. Students will learn programming. We want to help women get jobs.

Thank you for your consideration.

Sincerely,
Jane Smith`);
    }
  }, []);

  const checkCooldown = () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < COOLDOWN_PERIOD) {
      const remainingSeconds = Math.ceil((COOLDOWN_PERIOD - timeSinceLastRequest) / 1000);
      throw new Error(`Please wait ${remainingSeconds} seconds before making another request.`);
    }
  };

  const handleRevision = async () => {
    if (!draft.trim()) {
      setError('Please enter some text to revise');
      return;
    }

    try {
      checkCooldown();
      setIsLoading(true);
      setError(null);
      const response = await reviewGrantApplication(draft, supabase);
      const { rewrite } = parseAIResponse(response);
      setRevision(rewrite);
      setLastRequestTime(Date.now());
    } catch (err) {
      const error = handleError(err);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFurtherRevision = async () => {
    try {
      checkCooldown();
      setIsLoading(true);
      setError(null);
      const response = await reviewGrantApplication(revision, supabase);
      const { rewrite } = parseAIResponse(response);
      setRevision(rewrite);
      setLastRequestTime(Date.now());
    } catch (err) {
      const error = handleError(err);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {error && (
        <ErrorAlert 
          message={error} 
          onDismiss={() => setError(null)} 
        />
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Draft Grant Application</h2>
        <TextEditor
          value={draft}
          onChange={setDraft}
          placeholder="Enter your grant application draft here..."
        />
        {!revision && (
          <button
            onClick={handleRevision}
            disabled={isLoading}
            className={`mt-4 w-full py-3 px-4 rounded-lg text-white transition-colors ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Generating Revision...' : 'Generate Revision'}
          </button>
        )}
      </div>
      
      {revision && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Revised Version</h2>
          <FormattedOutput
            text={revision}
            onSubmitRevision={handleFurtherRevision}
          />
        </div>
      )}
    </div>
  );
}