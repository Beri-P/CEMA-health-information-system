import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  actionButton?: {
    label: string;
    to: string;
  };
  backButton?: {
    to: string;
    label?: string;
  };
  children?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  actionButton,
  backButton,
  children
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {backButton && (
            <Link
              to={backButton.to}
              className="text-blue-500 hover:text-blue-600 mr-4"
            >
              ← {backButton.label || 'Back'}
            </Link>
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {actionButton && (
          <Link
            to={actionButton.to}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {actionButton.label}
          </Link>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PageHeader;