import React from 'react';
import { FileEdit } from 'lucide-react';

export default function Header() {
  return (
    <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <FileEdit className="w-8 h-8 text-blue-600" />
      Grant Application Reviewer
    </h1>
  );
}