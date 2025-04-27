import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { FormikErrorMessage } from 'formik';
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
      <div className="mb-6 flex items-center">
        <Link
          to={`/clients/${clientId}`}
          className="text-blue-500 hover:text-blue-600 mr-4"
        >
          ← Back to Client
        </Link>
        <h2 className="text-2xl font-bold">Enroll in Program</h2>
      </div>

      {error && (
        <div className="mb-4">
          <CustomErrorMessage message={error} onRetry={fetchPrograms} />
        </div>
      )}

      {programs.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">No programs available for enrollment.</p>
          <Link
            to="/programs/new"
            className="text-blue-500 hover:text-blue-600"
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
            <Form className="space-y-4 bg-white p-6 rounded-lg shadow">
              <div>
                <label htmlFor="programId" className="block mb-1 font-medium">
                  Select Program
                </label>
                <Field
                  as="select"
                  id="programId"
                  name="programId"
                  className="w-full border rounded p-2"
                >
                  <option value="">Select a program...</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </Field>
                <FormikErrorMessage
                  name="programId"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Enrolling...' : 'Enroll'}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default EnrollmentForm;