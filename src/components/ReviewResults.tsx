import React from 'react';
import { CheckCircle } from 'lucide-react';
import DiffViewer from './DiffViewer';
import Editor from './Editor';

interface ReviewResultsProps {
  original: string;
  feedback: string;
  rewrite: string;
  revised: string;
  onAcceptRewrite: () => void;
  onReviseChange: (value: string) => void;
}

export default function ReviewResults({
  original,
  feedback,
  rewrite,
  revised,
  onAcceptRewrite,
  onReviseChange,
}: ReviewResultsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          AI Review Results
        </h2>
        <DiffViewer
          original={original}
          feedback={feedback}
          rewrite={rewrite}
          onAcceptRewrite={onAcceptRewrite}
        />
      </div>

      <div>
        <Editor
          label="Final Version (Editable)"
          value={revised}
          onChange={onReviseChange}
        />
      </div>
    </div>
  );
}