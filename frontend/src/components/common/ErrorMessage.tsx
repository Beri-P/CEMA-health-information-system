import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between">
      <div>
        <p className="mb-0">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-outline-danger btn-sm ms-3"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;