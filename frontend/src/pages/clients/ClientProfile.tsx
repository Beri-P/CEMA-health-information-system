import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClient, deleteEnrollment } from '../../services/api';
import { Client, Enrollment } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function fetchClientData() {
    try {
      setLoading(true);
      setError(null);
      if (!id) return;

      const clientResponse = await getClient(parseInt(id));
      setClient(clientResponse.data);

      // Map the included Programs → Enrollment[] shape
      const evts: Enrollment[] = clientResponse.data.Programs?.map(p => ({
        enrollmentId: p.Enrollment.enrollmentId,
        clientId: clientResponse.data.id,
        programId: p.id,
        status: p.Enrollment.status,
        enrollmentDate: p.Enrollment.enrollmentDate,
        Program: {
          id: p.id,
          name: p.name,
          description: p.description
        }
      })) || [];
      
      setEnrollments(evts);
    } catch (error) {
      setError('Failed to load client data. Please try again.');
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const handleRemoveEnrollment = async (enrollmentId: string) => {
    if (!window.confirm('Are you sure you want to remove this enrollment?')) {
      return;
    }

    try {
      setDeleteError(null);
      await deleteEnrollment(enrollmentId);
      setEnrollments(enrollments.filter(e => e.enrollmentId !== enrollmentId));
    } catch (error) {
      setDeleteError('Failed to remove enrollment. Please try again.');
      console.error('Error removing enrollment:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading client profile..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorMessage message={error} onRetry={fetchClientData} />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-4">
        <ErrorMessage message="Client not found" />
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        backButton={{
          to: "/clients",
          label: "Back to Clients"
        }}
      />

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-muted mb-2">Date of Birth</h5>
              <p className="card-text">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        {client.phone && (
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-muted mb-2">Phone</h5>
                <p className="card-text">{client.phone}</p>
              </div>
            </div>
          </div>
        )}
        {client.email && (
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-muted mb-2">Email</h5>
                <p className="card-text">{client.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0">Program Enrollments</h2>
            <Link
              to={`/clients/${id}/enroll`}
              className="btn btn-primary"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Enroll in Program
            </Link>
          </div>

          {deleteError && (
            <div className="mb-4">
              <ErrorMessage message={deleteError} />
            </div>
          )}

          {enrollments.length > 0 ? (
            <div className="row g-4">
              {enrollments.map((enrollment) => (
                <div className="col-md-6 col-lg-4" key={enrollment.enrollmentId}>
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h3 className="h5 card-title mb-0">{enrollment.Program?.name}</h3>
                        <button
                          onClick={() => handleRemoveEnrollment(enrollment.enrollmentId)}
                          className="btn btn-sm btn-outline-danger"
                          title="Remove enrollment"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                      <p className="card-text text-muted">
                        <small>
                          <i className="bi bi-calendar me-2"></i>
                          Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted mb-0">No program enrollments found.</p>
              <p className="text-muted">
                Use the "Enroll in Program" button above to enroll this client in a program.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;