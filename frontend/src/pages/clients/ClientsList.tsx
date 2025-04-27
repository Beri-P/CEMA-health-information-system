import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClients } from '../../services/api';
import { Client } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
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
    return <LoadingSpinner message="Loading clients..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorMessage message={error} onRetry={fetchClients} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Clients"
        actionButton={{
          label: "Add New Client",
          to: "/clients/new"
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Link
            key={client.id}
            to={`/clients/${client.id}`}
            className="block p-6 bg-white border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">
              {client.firstName} {client.lastName}
            </h2>
            <p className="text-gray-600 mb-1">
              Born: {new Date(client.dateOfBirth).toLocaleDateString()}
            </p>
            {client.phone && (
              <p className="text-gray-600 mb-1">Phone: {client.phone}</p>
            )}
            {client.email && (
              <p className="text-gray-600">Email: {client.email}</p>
            )}
          </Link>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No clients found.</p>
          <p className="mt-2">
            Get started by adding your first client using the button above.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientsList;