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
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {backButton && (
            <Link
              to={backButton.to}
              className="btn btn-outline-secondary me-3"
            >
              <i className="bi bi-arrow-left"></i> {backButton.label || 'Back'}
            </Link>
          )}
          <h1 className="mb-0">{title}</h1>
        </div>
        {actionButton && (
          <Link
            to={actionButton.to}
            className="btn btn-primary"
          >
            {actionButton.label}
          </Link>
        )}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
};

export default PageHeader;