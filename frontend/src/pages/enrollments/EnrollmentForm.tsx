import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage as FormikError } from 'formik';
import * as Yup from 'yup';
import { createEnrollment, getPrograms, getClient } from '../../services/api';
import { Program, Client } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CustomErrorMessage from '../../components/common/ErrorMessage';

interface FormValues {
  programId: string;
}

const validationSchema = Yup.object({
  programId: Yup.string()
    .required('Please select a program')
});

const EnrollmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      setError(null);
      const [programsResponse, clientResponse] = await Promise.all([
        getPrograms(),
        getClient(parseInt(clientId))
      ]);

      // Get the program IDs the client is already enrolled in
      const enrolledProgramIds = clientResponse.data.Programs?.map(p => p.id) || [];
      
      // Filter out programs the client is already enrolled in
      const availablePrograms = programsResponse.data.filter(
        program => !enrolledProgramIds.includes(program.id)
      );

      setPrograms(availablePrograms);
      setClient(clientResponse.data);
    } catch (error) {
      setError('Failed to load programs. Please try again.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const handleSubmit = async (values: FormValues) => {
    if (!clientId) return;

    try {
      await createEnrollment({
        clientId: parseInt(clientId),
        programId: parseInt(values.programId)
      });
      navigate(`/clients/${clientId}`);
    } catch (err) {
      setError('Failed to create enrollment. Please try again.');
      console.error('Error creating enrollment:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading programs..." />;
  }

  if (!client) {
    return <CustomErrorMessage message="Client not found" />;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="mb-6 d-flex align-items-center">
        <Link
          to={`/clients/${clientId}`}
          className="btn btn-outline-primary me-3"
        >
          ← Back to Client
        </Link>
        <h2 className="h4 mb-0">Enroll {client.firstName} {client.lastName}</h2>
      </div>

      {error && (
        <div className="mb-4">
          <CustomErrorMessage message={error} onRetry={fetchData} />
        </div>
      )}

      {programs.length === 0 ? (
        <div className="text-center">
          {client.Programs?.length === 0 ? (
            <>
              <p className="text-muted mb-4">No programs available for enrollment.</p>
              <Link
                to="/programs/new"
                className="btn btn-primary"
              >
                Create a new program
              </Link>
            </>
          ) : (
            <div className="alert alert-info">
              <p className="mb-0">This client is already enrolled in all available programs.</p>
            </div>
          )}
        </div>
      ) : (
        <Formik
          initialValues={{ programId: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="card shadow">
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="programId" className="form-label">
                    Select Program
                  </label>
                  <Field
                    as="select"
                    id="programId"
                    name="programId"
                    className="form-select"
                  >
                    <option value="">Select a program...</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </Field>
                  <FormikError
                    name="programId"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-100"
                >
                  {isSubmitting ? 'Enrolling...' : 'Enroll'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default EnrollmentForm;