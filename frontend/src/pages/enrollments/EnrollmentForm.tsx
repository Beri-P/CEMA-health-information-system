import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { programsApi, clientsApi, enrollmentsApi } from '../../services/api';

interface Program {
  program_id: string;
  name: string;
  description: string;
}

interface EnrollmentFormValues {
  program_id: string;
  status: string;
  enrollment_date: string;
  notes: string;
}

const EnrollmentSchema = Yup.object().shape({
  program_id: Yup.string().required('Please select a program'),
  status: Yup.string().required('Status is required'),
  enrollment_date: Yup.string().required('Enrollment date is required'),
  notes: Yup.string()
});

const EnrollmentForm: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clientEnrolledPrograms, setClientEnrolledPrograms] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');

  const initialValues: EnrollmentFormValues = {
    program_id: '',
    status: 'active',
    enrollment_date: new Date().toISOString().split('T')[0],
    notes: ''
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // load all programs
        const { data: allPrograms } = await programsApi.getAll();
        setPrograms(allPrograms);

        if (clientId) {
          // load client + their enrolled programs
          const { data: client } = await clientsApi.getById(clientId);
          setClientName(`${client.first_name} ${client.last_name}`);

          const enrolledIds: string[] = client.Programs?.map((p: Program) => p.program_id) || [];
          setClientEnrolledPrograms(enrolledIds);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clientId]);

  const handleSubmit = async (
    values: EnrollmentFormValues,
    { setSubmitting }: FormikHelpers<EnrollmentFormValues>
  ) => {
    if (!clientId) return;
    try {
      await enrollmentsApi.enroll(clientId, values.program_id, {
        status: values.status,
        enrollment_date: values.enrollment_date,
        notes: values.notes
      });
      navigate(`/clients/${clientId}/view`);
    } catch (err) {
      console.error(err);
      setError('Failed to enroll client in program');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  // filter out already-enrolled programs
  const availablePrograms = programs.filter(
    (p) => !clientEnrolledPrograms.includes(p.program_id)
  );

  return (
    <div>
      <h1>Enroll Client in Program</h1>
      {clientName && <p className="lead">Client: {clientName}</p>}

      {error && <div className="alert alert-danger">{error}</div>}

      {availablePrograms.length === 0 ? (
        <div className="alert alert-info">
          <p>Client is already enrolled in all available programs.</p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => navigate(`/clients/${clientId}/view`)}
          >
            ← Return to Client Profile
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <Formik
              initialValues={initialValues}
              validationSchema={EnrollmentSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  {/* Program selector */}
                  <div className="mb-3">
                    <label htmlFor="program_id" className="form-label">
                      Select Program
                    </label>
                    <Field
                      as="select"
                      id="program_id"
                      name="program_id"
                      className="form-select"
                    >
                      <option value="">-- Select a program --</option>
                      {availablePrograms.map((prog) => (
                        <option key={prog.program_id} value={prog.program_id}>
                          {prog.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="program_id"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="form-select"
                    >
                      {['active', 'pending', 'completed', 'suspended'].map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-danger" />
                  </div>

                  {/* Enrollment date */}
                  <div className="mb-3">
                    <label htmlFor="enrollment_date" className="form-label">
                      Enrollment Date
                    </label>
                    <Field
                      type="date"
                      id="enrollment_date"
                      name="enrollment_date"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="enrollment_date"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Notes */}
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      Notes
                    </label>
                    <Field
                      as="textarea"
                      id="notes"
                      name="notes"
                      className="form-control"
                      rows={3}
                      placeholder="Any additional notes..."
                    />
                    <ErrorMessage name="notes" component="div" className="text-danger" />
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enrolling...' : 'Enroll Client'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate(`/clients/${clientId}/view`)}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentForm;