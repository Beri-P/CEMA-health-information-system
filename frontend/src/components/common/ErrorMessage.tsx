import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <p className="mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm underline hover:no-underline focus:outline-none"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;