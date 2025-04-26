import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { programsApi, clientsApi } from '../services/api';

const Dashboard = () => {
  const [programCount, setProgramCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsRes, clientsRes] = await Promise.all([
          programsApi.getAll(),
          clientsApi.getAll()
        ]);
        
        setProgramCount(programsRes.data.length);
        setClientCount(clientsRes.data.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="dashboard">
      <h1 className="mb-4">Dashboard</h1>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Health Programs</h5>
              <p className="card-text display-4">{programCount}</p>
              <Link to="/programs" className="btn btn-light">Manage Programs</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Registered Clients</h5>
              <p className="card-text display-4">{clientCount}</p>
              <Link to="/clients" className="btn btn-light">Manage Clients</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/programs/new" className="btn btn-outline-primary">
                  Create New Health Program
                </Link>
                <Link to="/clients/new" className="btn btn-outline-success">
                  Register New Client
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;