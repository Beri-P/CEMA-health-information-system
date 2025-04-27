import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createProgram } from '../../services/api';
import { Program } from '../../types';
import CustomErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';

type ProgramFormData = Omit<Program, 'id' | 'createdAt' | 'updatedAt'>;

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Program name is required')
    .min(3, 'Program name must be at least 3 characters')
    .max(100, 'Program name must be at most 100 characters'),
  description: Yup.string()
    .nullable()
    .max(500, 'Description must be at most 500 characters')
});

const ProgramForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const initialValues: ProgramFormData = {
    name: '',
    description: ''
  };

  const handleSubmit = async (values: ProgramFormData) => {
    try {
      await createProgram(values);
      navigate('/programs');
    } catch (err) {
      setError('Failed to create program. Please try again.');
      console.error('Error creating program:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Add New Program"
        backButton={{
          to: "/programs",
          label: "Back to Programs"
        }}
      />

      {error && (
        <div className="mb-4">
          <CustomErrorMessage message={error} />
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Program Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description (optional)
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  className="form-control"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-100"
                >
                  {isSubmitting ? 'Creating...' : 'Create Program'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProgramForm;