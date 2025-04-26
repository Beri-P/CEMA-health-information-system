import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clientsApi } from '../../services/api';

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

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await clientsApi.getById(id);
        setClient(response.data);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError('Failed to load client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!client) {
    return <div className="alert alert-warning">Client not found</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Client Profile</h1>
        <div>
          <Link to={`/clients/${id}`} className="btn btn-info me-2">
            Edit Client
          </Link>
          <Link to={`/clients/${id}/enroll`} className="btn btn-success">
            Enroll in Program
          </Link>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Personal Information</h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th style={{ width: '35%' }}>Name:</th>
                    <td>{`${client.first_name} ${client.last_name}`}</td>
                  </tr>
                  <tr>
                    <th>Date of Birth:</th>
                    <td>{new Date(client.date_of_birth).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>Gender:</th>
                    <td>{client.gender}</td>
                  </tr>
                  <tr>
                    <th>Contact Number:</th>
                    <td>{client.contact_number || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{client.email || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <th>Address:</th>
                    <td>{client.address || 'Not provided'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Enrolled Programs</h5>
              <Link to={`/clients/${id}/enroll`} className="btn btn-sm btn-success">
                Add Program
              </Link>
            </div>
            <div className="card-body">
              {client.Programs && client.Programs.length > 0 ? (
                <div className="list-group">
                  {client.Programs.map((program) => (
                    <div key={program.program_id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-1">{program.name}</h6>
                        <span className={`badge ${program.Enrollment.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                          {program.Enrollment.status}
                        </span>
                      </div>
                      <p className="mb-1 small text-muted">
                        Enrolled: {new Date(program.Enrollment.enrollment_date).toLocaleDateString()}
                      </p>
                      {program.Enrollment.notes && (
                        <p className="mb-0 small">{program.Enrollment.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">
                  Client is not enrolled in any health programs yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/clients')}
        >
          Back to Clients
        </button>
      </div>
    </div>
  );
};

export default ClientProfile;