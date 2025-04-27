import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createClient } from '../../services/api';
import { Client } from '../../types';
import CustomErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';

type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  phone: Yup.string()
    .nullable()
    .matches(/^[+]?[\d\s-]+$/, 'Invalid phone number format'),
  email: Yup.string()
    .nullable()
    .email('Invalid email address')
});

const ClientForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const initialValues: ClientFormData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: ''
  };

  const handleSubmit = async (values: ClientFormData) => {
    try {
      await createClient(values);
      navigate('/clients');
    } catch (err) {
      setError('Failed to create client. Please try again.');
      console.error('Error creating client:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Add New Client"
        backButton={{
          to: "/clients",
          label: "Back to Clients"
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block mb-1 font-medium">
                    First Name
                  </label>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full border rounded p-2"
                  />
                  <FormikErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block mb-1 font-medium">
                    Last Name
                  </label>
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full border rounded p-2"
                  />
                  <FormikErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block mb-1 font-medium">
                    Date of Birth
                  </label>
                  <Field
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className="w-full border rounded p-2"
                  />
                  <FormikErrorMessage
                    name="dateOfBirth"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-1 font-medium">
                    Phone (optional)
                  </label>
                  <Field
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full border rounded p-2"
                  />
                  <FormikErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block mb-1 font-medium">
                    Email (optional)
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full border rounded p-2"
                  />
                  <FormikErrorMessage
                    name="email"
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
                  {isSubmitting ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ClientForm;