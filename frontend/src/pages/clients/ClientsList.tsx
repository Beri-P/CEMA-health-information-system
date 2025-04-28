import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClients } from '../../services/api';
import { Client } from '../../types';
import PageHeader from '../../components/common/PageHeader';

const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClients();
      setClients(response.data);
      setFilteredClients(response.data);
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = clients.filter(client => 
      client.firstName.toLowerCase().includes(term) || 
      client.lastName.toLowerCase().includes(term)
    );
    setFilteredClients(filtered);
  };

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

      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search clients by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="row g-4">
        {filteredClients.map((client) => (
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

      {filteredClients.length === 0 && (
        <div className="text-center my-5 py-5">
          {searchTerm ? (
            <p className="text-muted">No clients found matching "{searchTerm}"</p>
          ) : (
            <>
              <p className="text-muted">No clients found.</p>
              <p>
                Get started by adding your first client using the button above.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsList;