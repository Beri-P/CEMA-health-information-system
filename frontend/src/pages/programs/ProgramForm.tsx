import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { FormikErrorMessage } from 'formik';
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
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 font-medium">
                    Program Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="w-full border rounded p-2"
                  />
                  <FormikErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block mb-1 font-medium">
                    Description (optional)
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full border rounded p-2"
                  />
                  <FormikErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
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