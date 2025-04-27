import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClients } from '../../services/api';
import { Client } from '../../types';
import PageHeader from '../../components/common/PageHeader';

const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClients();
      setClients(response.data);
    } catch (err) {
      setError('Failed to load clients. Please try again.');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading clients...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-link"
            onClick={fetchClients}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Clients"
        actionButton={{
          label: "Add New Client",
          to: "/clients/new"
        }}
      />

      <div className="row g-4">
        {clients.map((client) => (
          <div className="col-md-6 col-lg-4" key={client.id}>
            <Link 
              to={`/clients/${client.id}`}
              className="card h-100 text-decoration-none text-dark"
              style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body">
                <h5 className="card-title">
                  {client.firstName} {client.lastName}
                </h5>
                <p className="card-text">
                  <small className="text-muted">
                    Born: {new Date(client.dateOfBirth).toLocaleDateString()}
                  </small>
                </p>
                {client.phone && <p className="card-text">Phone: {client.phone}</p>}
                {client.email && <p className="card-text">Email: {client.email}</p>}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center my-5 py-5">
          <p className="text-muted">No clients found.</p>
          <p>
            Get started by adding your first client using the button above.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientsList;