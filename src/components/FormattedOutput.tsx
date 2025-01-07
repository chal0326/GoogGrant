import React from 'react';
import { formatTextToHtml } from '../utils/textFormatter';

interface FormattedOutputProps {
  text: string;
  onSubmitRevision: () => void;
}

export function FormattedOutput({ text, onSubmitRevision }: FormattedOutputProps) {
  return (
    <div className="w-full">
      <div 
        className="prose max-w-none mb-4 p-6 bg-white rounded-lg shadow-sm"
        dangerouslySetInnerHTML={{ __html: formatTextToHtml(text) }}
      />
      <button
        onClick={onSubmitRevision}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Submit for Further Revision
      </button>
    </div>
  );
}