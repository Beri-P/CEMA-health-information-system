import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage as FormikError } from 'formik';
import * as Yup from 'yup';
import { createEnrollment, getPrograms } from '../../services/api';
import { Program } from '../../types';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPrograms();
      setPrograms(response.data);
    } catch (error) {
      setError('Failed to load programs. Please try again.');
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmit = async (values: FormValues) => {
    if (!clientId) return;

    try {
      await createEnrollment({
        clientId: parseInt(clientId),
        programId: parseInt(values.programId),
        status: 'active'
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

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="mb-6 d-flex align-items-center">
        <Link
          to={`/clients/${clientId}`}
          className="btn btn-outline-primary me-3"
        >
          ← Back to Client
        </Link>
        <h2 className="h4 mb-0">Enroll in Program</h2>
      </div>

      {error && (
        <div className="mb-4">
          <CustomErrorMessage message={error} onRetry={fetchPrograms} />
        </div>
      )}

      {programs.length === 0 ? (
        <div className="text-center">
          <p className="text-muted mb-4">No programs available for enrollment.</p>
          <Link
            to="/programs/new"
            className="btn btn-primary"
          >
            Create a new program
          </Link>
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