import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { clientsApi } from '../../services/api';

const ClientSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  date_of_birth: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  contact_number: Yup.string(),
  email: Yup.string().email('Invalid email format'),
  address: Yup.string()
});

interface ClientFormValues {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email: string;
  address: string;
}

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<ClientFormValues>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    contact_number: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await clientsApi.getById(id);
          const client = response.data;
          
          // Format date to YYYY-MM-DD for input field
          const formattedDate = client.date_of_birth ? 
            new Date(client.date_of_birth).toISOString().split('T')[0] : '';
          
          setInitialValues({
            first_name: client.first_name || '',
            last_name: client.last_name || '',
            date_of_birth: formattedDate,
            gender: client.gender || '',
            contact_number: client.contact_number || '',
            email: client.email || '',
            address: client.address || ''
          });
        } catch (err) {
          console.error('Error fetching client:', err);
          setError('Failed to load client data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClient();
  }, [id]);

  const handleSubmit = async (values: ClientFormValues) => {
    try {
      if (id) {
        await clientsApi.update(id, values);
      } else {
        await clientsApi.create(values);
      }
      navigate('/clients');
    } catch (err) {
      console.error('Error saving client:', err);
      setError('Failed to save client');
    }
  };

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <h1>{id ? 'Edit' : 'Register'} Client</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={ClientSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <Field
                      type="text"
                      id="first_name"
                      name="first_name"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <Field
                      type="text"
                      id="last_name"
                      name="last_name"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                    <Field
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="date_of_birth"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <Field
                      as="select"
                      id="gender"
                      name="gender"
                      className="form-select"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="contact_number" className="form-label">Contact Number</label>
                    <Field
                      type="text"
                      id="contact_number"
                      name="contact_number"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="contact_number"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
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
                
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <Field
                    as="textarea"
                    id="address"
                    name="address"
                    className="form-control"
                    rows={3}
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-danger"
                  />
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/clients')}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;