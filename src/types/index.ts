export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'reviewer' | 'applicant';
}

export interface Grant {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  applicantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  grantId: string;
  reviewerId: string;
  comments: string;
  score: number;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export interface ReviewButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export interface DiffViewerProps {
  oldContent: string;
  newContent: string;
}

export interface EditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

export interface FormattedOutputProps {
  content: string;
  format: 'markdown' | 'plain' | 'html';
}

export interface ReviewResultsProps {
  review: Review;
  grant: Grant;
}
