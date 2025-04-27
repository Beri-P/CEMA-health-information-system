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
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Clients</h2>
          <p className="text-3xl text-blue-600">{stats.totalClients}</p>
          <Link
            to="/clients"
            className="mt-4 inline-block text-blue-500 hover:text-blue-600"
          >
            View all clients →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Programs</h2>
          <p className="text-3xl text-green-600">{stats.totalPrograms}</p>
          <Link
            to="/programs"
            className="mt-4 inline-block text-blue-500 hover:text-blue-600"
          >
            View all programs →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              to="/clients/new"
              className="block text-blue-500 hover:text-blue-600"
            >
              Add New Client →
            </Link>
            <Link
              to="/programs/new"
              className="block text-blue-500 hover:text-blue-600"
            >
              Add New Program →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;