import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClient, getClientEnrollments, updateEnrollmentStatus } from '../../services/api';
import { Client, Enrollment } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!id) return;

      const [clientResponse, enrollmentsResponse] = await Promise.all([
        getClient(parseInt(id)),
        getClientEnrollments(parseInt(id))
      ]);

      setClient(clientResponse.data);
      setEnrollments(enrollmentsResponse.data);
    } catch (error) {
      setError('Failed to load client data. Please try again.');
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const handleStatusChange = async (enrollmentId: number, newStatus: string) => {
    try {
      setUpdateError(null);
      await updateEnrollmentStatus(enrollmentId, newStatus as Enrollment['status']);
      setEnrollments(enrollments.map(enrollment => 
        enrollment.id === enrollmentId 
          ? { ...enrollment, status: newStatus as Enrollment['status'] }
          : enrollment
      ));
    } catch (error) {
      setUpdateError('Failed to update enrollment status. Please try again.');
      console.error('Error updating enrollment status:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading client profile..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorMessage message={error} onRetry={fetchClientData} />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-4">
        <ErrorMessage message="Client not found" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        backButton={{
          to: "/clients",
          label: "Back to Clients"
        }}
      >
        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Date of Birth</p>
            <p className="font-medium">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
          </div>
          {client.phone && (
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="font-medium">{client.phone}</p>
            </div>
          )}
          {client.email && (
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-medium">{client.email}</p>
            </div>
          )}
        </div>
      </PageHeader>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Program Enrollments</h2>
          <Link
            to={`/clients/${id}/enroll`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Enroll in Program
          </Link>
        </div>

        {updateError && (
          <div className="mb-4">
            <ErrorMessage message={updateError} />
          </div>
        )}

        {enrollments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-white rounded-lg shadow p-4"
              >
                <h3 className="font-semibold mb-2">{enrollment.Program?.name}</h3>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <select
                    value={enrollment.status}
                    onChange={(e) => handleStatusChange(enrollment.id, e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No program enrollments found.</p>
            <p className="mt-2 text-sm text-gray-400">
              Click the "Enroll in Program" button above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;