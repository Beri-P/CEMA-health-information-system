import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClients, getPrograms } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPrograms: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientsResponse, programsResponse] = await Promise.all([
          getClients(),
          getPrograms()
        ]);

        setStats({
          totalClients: clientsResponse.data.length,
          totalPrograms: programsResponse.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mb-4">Dashboard</h1>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Total Clients</h2>
              <p className="display-4 text-primary">{stats.totalClients}</p>
              <Link to="/clients" className="btn btn-outline-primary mt-2">
                View all clients →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Total Programs</h2>
              <p className="display-4 text-success">{stats.totalPrograms}</p>
              <Link to="/programs" className="btn btn-outline-primary mt-2">
                View all programs →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="d-grid gap-2">
                <Link to="/clients/new" className="btn btn-primary">
                  Add New Client
                </Link>
                <Link to="/programs/new" className="btn btn-success">
                  Add New Program
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