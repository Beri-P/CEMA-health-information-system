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
      <div className="container mx-auto p-4">
        <ErrorMessage message={error} onRetry={fetchPrograms} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Programs"
        actionButton={{
          label: "Add New Program",
          to: "/programs/new"
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <div
            key={program.id}
            className="p-6 bg-white border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{program.name}</h2>
            {program.description && (
              <p className="text-gray-600">{program.description}</p>
            )}
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No programs found.</p>
          <p className="mt-2">
            Get started by adding your first program using the button above.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgramsList;