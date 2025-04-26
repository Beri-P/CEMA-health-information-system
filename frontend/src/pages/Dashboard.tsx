import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { programsApi, clientsApi } from '../services/api';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [programCount, setProgramCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [programsRes, clientsRes] = await Promise.all([
          programsApi.getAll(),
          clientsApi.getAll()
        ]);
        
        setProgramCount(programsRes.data.length);
        setClientCount(clientsRes.data.length);
        
        // Get 5 most recent clients
        const sortedClients = [...clientsRes.data].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 5);
        
        setRecentClients(sortedClients);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="jumbotron bg-light p-4 mb-4 rounded shadow-sm">
        <h1 className="display-5">Welcome, {user?.username || 'Doctor'}</h1>
        <p className="lead">Health Information System - Manage your patients and programs</p>
      </div>
      
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card bg-primary text-white h-100 shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Health Programs</h5>
                  <p className="card-text display-4">{programCount}</p>
                </div>
                <i className="bi bi-clipboard-pulse fs-1"></i>
              </div>
              <Link to="/programs" className="btn btn-sm btn-light mt-2">Manage Programs</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card bg-success text-white h-100 shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Registered Clients</h5>
                  <p className="card-text display-4">{clientCount}</p>
                </div>
                <i className="bi bi-people fs-1"></i>
              </div>
              <Link to="/clients" className="btn btn-sm btn-light mt-2">Manage Clients</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <Link to="/programs/new" className="btn btn-outline-primary">
                  <i className="bi bi-plus-circle"></i> Create Health Program
                </Link>
                <Link to="/clients/new" className="btn btn-outline-success">
                  <i className="bi bi-person-plus"></i> Register New Client
                </Link>
                <Link to="/clients" className="btn btn-outline-info">
                  <i className="bi bi-search"></i> Search Clients
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Recently Added Clients</h5>
            </div>
            <div className="card-body">
              {error ? (
                <div className="alert alert-danger">{error}</div>
              ) : recentClients.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Contact</th>
                        <th>Added On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentClients.map((client) => (
                        <tr key={client.client_id}>
                          <td>{`${client.first_name} ${client.last_name}`}</td>
                          <td>{new Date(client.date_of_birth).toLocaleDateString()}</td>
                          <td>{client.contact_number || 'N/A'}</td>
                          <td>{new Date(client.created_at).toLocaleDateString()}</td>
                          <td>
                            <Link 
                              to={`/clients/${client.client_id}/view`} 
                              className="btn btn-sm btn-primary me-1"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                            <Link 
                              to={`/clients/${client.client_id}/enroll`} 
                              className="btn btn-sm btn-success"
                            >
                              <i className="bi bi-plus-circle"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No clients have been registered yet.</p>
                  <Link to="/clients/new" className="btn btn-primary">Register Your First Client</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;