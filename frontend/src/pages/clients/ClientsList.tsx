import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientsApi } from '../../services/api';

interface Client {
  client_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  contact_number: string;
  email: string;
  created_at: string;
}

const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClients = async (search?: string) => {
    try {
      setLoading(true);
      const response = await clientsApi.getAll(search);
      setClients(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients(searchTerm);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientsApi.delete(id);
        fetchClients(searchTerm); // Refresh the list
      } catch (err) {
        console.error('Error deleting client:', err);
        setError('Failed to delete client');
      }
    }
  };

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Clients</h1>
        <Link to="/clients/new" className="btn btn-primary">
          Register New Client
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-secondary">
            Search
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {clients.length === 0 ? (
        <div className="alert alert-info">
          No clients found. Register your first client!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.client_id}>
                  <td>{`${client.first_name} ${client.last_name}`}</td>
                  <td>{new Date(client.date_of_birth).toLocaleDateString()}</td>
                  <td>{client.contact_number}</td>
                  <td>{client.email}</td>
                  <td>
                    <div className="btn-group">
                      <Link 
                        to={`/clients/${client.client_id}/view`} 
                        className="btn btn-sm btn-primary"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/clients/${client.client_id}`} 
                        className="btn btn-sm btn-info"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(client.client_id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientsList;