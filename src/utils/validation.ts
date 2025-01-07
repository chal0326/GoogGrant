export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): {
  isValid: boolean;
  requirements: string[];
} => {
  const requirements = [];
  
  if (password.length < 8) {
    requirements.push('At least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    requirements.push('At least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    requirements.push('At least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    requirements.push('At least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    requirements.push('At least one special character (!@#$%^&*)');
  }

  return {
    isValid: requirements.length === 0,
    requirements,
  };
};

export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '');
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};
