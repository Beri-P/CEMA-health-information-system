import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPrograms } from '../../services/api';
import { Program } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';

const ProgramsList: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPrograms();
      setPrograms(response.data);
    } catch (err) {
      setError('Failed to load programs. Please try again.');
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading programs..." />;
  }

  if (error) {
    return (
      <div className="container">
        <ErrorMessage message={error} onRetry={fetchPrograms} />
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Programs"
        actionButton={{
          label: "Add New Program",
          to: "/programs/new"
        }}
      />

      <div className="row g-4">
        {programs.map((program) => (
          <div className="col-md-6 col-lg-4" key={program.id}>
            <Link 
              to={`/programs/${program.id}`}
              className="card h-100 text-decoration-none text-dark"
              style={{ transition: 'transform 0.2s' }}
            >
              <div className="card-body">
                <h5 className="card-title">{program.name}</h5>
                {program.description && (
                  <p className="card-text text-muted">{program.description}</p>
                )}
              </div>
              <div className="card-footer bg-transparent border-top-0">
                <span className="text-primary">View details →</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center my-5">
          <p className="text-muted">No programs found.</p>
          <p>Get started by adding your first program using the button above.</p>
        </div>
      )}
    </div>
  );
};

export default ProgramsList;