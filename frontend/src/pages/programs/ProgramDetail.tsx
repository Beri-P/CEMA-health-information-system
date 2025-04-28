import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProgram, getProgramEnrollments } from '../../services/api';
import { Program, Enrollment } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';

const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgramDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [programResponse, enrollmentsResponse] = await Promise.all([
        getProgram(parseInt(id)),
        getProgramEnrollments(parseInt(id))
      ]);

      setProgram(programResponse.data);
      setEnrollments(enrollmentsResponse.data);
    } catch (err) {
      setError('Failed to load program details. Please try again.');
      console.error('Error fetching program details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading program details..." />;
  }

  if (error) {
    return (
      <div className="container">
        <ErrorMessage message={error} onRetry={fetchProgramDetails} />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container">
        <ErrorMessage message="Program not found" />
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title={program.name}
        backButton={{
          to: "/programs",
          label: "Back to Programs"
        }}
      />

      {program.description && (
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">Description</h6>
            <p className="card-text">{program.description}</p>
          </div>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title h5 mb-4">Program Details</h2>
          
          <div className="row">
            <div className="col-md-6">
              <p className="mb-2">
                <strong>Created:</strong>{' '}
                {program.createdAt && new Date(program.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-2">
                <strong>Last Updated:</strong>{' '}
                {program.updatedAt && new Date(program.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title h5 mb-4">Enrolled Clients ({enrollments.length})</h2>
          
          {enrollments.length > 0 ? (
            <div className="row g-4">
              {enrollments.map((enrollment) => (
                <div className="col-md-6 col-lg-4" key={enrollment.enrollmentId}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title h6">
                        {enrollment.Client?.firstName} {enrollment.Client?.lastName}
                      </h5>
                      <p className="card-text">
                        <small className="text-muted">
                          Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </small>
                      </p>
                      <span className={`badge bg-${enrollment.status === 'active' ? 'success' : 'secondary'}`}>
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center">No clients enrolled in this program yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;