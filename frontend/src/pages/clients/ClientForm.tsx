import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth
                  </label>
                  <Field
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone (optional)
                  </label>
                  <Field
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email (optional)
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-100"
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