import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clientsApi, enrollmentsApi } from '../../services/api';

interface Program {
  program_id: string;
  name: string;
  description: string;
  Enrollment: {
    enrollment_date: string;
    status: string;
    notes: string;
  };
}

interface Client {
  client_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email: string;
  address: string;
  Programs: Program[];
}

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Stable fetchClient callback
  const fetchClient = useCallback(async () => {
    if (!id) return;
    setError('');        // clear previous errors
    setLoading(true);
    try {
      const { data } = await clientsApi.getById(id);
      setClient(data);
    } catch (err) {
      console.error('Error fetching client:', err);
      setError('Failed to load client data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const handleUnenroll = async (programId: string) => {
    if (!id || !window.confirm('Are you sure you want to unenroll the client from this program?')) {
      return;
    }
    setError('');
    setActionLoading(true);
    try {
      await enrollmentsApi.unenroll(id, programId);
      await fetchClient();  // Refresh client data
    } catch (err) {
      console.error('Error unenrolling client:', err);
      setError('Failed to unenroll client from program');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading client profile…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!client) {
    return <div className="alert alert-warning">Client not found</div>;
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'completed': return 'bg-info';
      case 'suspended': return 'bg-secondary';
      default: return 'bg-primary';
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Client Profile</h1>
        <div>
          <Link to={`/clients/${id}`} className="btn btn-info me-2">
            <i className="bi bi-pencil"></i> Edit Client
          </Link>
          <Link to={`/clients/${id}/enroll`} className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Enroll in Program
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-5">
          {/* Personal Info Card */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Personal Information</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-center mb-3">
                <div className="text-center">
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-2"
                    style={{ width: '100px', height: '100px', margin: '0 auto' }}
                  >
                    <span className="display-4 text-secondary">
                      {client.first_name[0]}{client.last_name[0]}
                    </span>
                  </div>
                  <h4>{`${client.first_name} ${client.last_name}`}</h4>
                </div>
              </div>
              <hr />
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th style={{ width: '35%' }}>
                      <i className="bi bi-calendar"></i> Date of Birth:
                    </th>
                    <td>{new Date(client.date_of_birth).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th><i className="bi bi-person"></i> Gender:</th>
                    <td>{client.gender}</td>
                  </tr>
                  <tr>
                    <th><i className="bi bi-telephone"></i> Contact:</th>
                    <td>{client.contact_number || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <th><i className="bi bi-envelope"></i> Email:</th>
                    <td>{client.email || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <th><i className="bi bi-geo-alt"></i> Address:</th>
                    <td>{client.address || 'Not provided'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          {/* Enrolled Programs Card */}
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Enrolled Programs</h5>
              <Link to={`/clients/${id}/enroll`} className="btn btn-sm btn-light">
                <i className="bi bi-plus-circle"></i> Add Program
              </Link>
            </div>
            <div className="card-body">
              {actionLoading && (
                <div className="d-flex justify-content-center mb-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Processing…</span>
                  </div>
                </div>
              )}

              {client.Programs.length === 0 ? (
                // “No programs enrolled” empty state card
                <div className="card border-info mb-3">
                  <div className="card-body text-center">
                    <p className="mb-2">This client is not enrolled in any health programs yet.</p>
                    <Link to={`/clients/${id}/enroll`} className="btn btn-info">
                      <i className="bi bi-plus-circle"></i> Enroll Now
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="list-group">
                  {client.Programs.map((program) => (
                    <div
                      key={program.program_id}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-1 fw-bold">{program.name}</h6>
                        <span className={`badge ${getStatusBadgeColor(program.Enrollment.status)}`}>
                          {program.Enrollment.status}
                        </span>
                      </div>
                      <p className="mb-1 small text-muted">
                        <strong>Enrolled:</strong>{' '}
                        {new Date(program.Enrollment.enrollment_date).toLocaleDateString()}
                      </p>
                      {program.Enrollment.notes && (
                        <p className="mb-1 small">
                          <strong>Notes:</strong> {program.Enrollment.notes}
                        </p>
                      )}
                      <div className="mt-2 d-flex justify-content-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleUnenroll(program.program_id)}
                          disabled={actionLoading}
                        >
                          <i className="bi bi-trash"></i> Unenroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick API Access Card */}
          <div className="card mt-4 shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="card-title mb-0">Quick API Access</h5>
            </div>
            <div className="card-body">
              <p className="mb-2">Client data is available via API at:</p>
              <div className="input-group mb-3">
                <span className="input-group-text">GET</span>
                <input
                  type="text"
                  className="form-control"
                  value={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/clients/${id}`}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/clients/${id}`
                    )
                  }
                >
                  Copy
                </button>
              </div>
              <div className="alert alert-info mb-0 small">
                <i className="bi bi-info-circle"></i> Requires authentication token
                in the Authorization header.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button className="btn btn-secondary" onClick={() => navigate('/clients')}>
          <i className="bi bi-arrow-left"></i> Back to Clients List
        </button>
      </div>
    </div>
  );
};

export default ClientProfile;