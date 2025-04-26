import { useState, useEffect } from'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { programsApi } from '../../services/api';

const ProgramSchema = Yup.object().shape({
    name: Yup.string().required('Program name is required'),
    description: Yup.string()
  });
  
  interface ProgramFormValues {
    name: string;
    description: string;
  }
  
  const ProgramForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<ProgramFormValues>({
      name: '',
      description: ''
    });
    const [loading, setLoading] = useState(id ? true : false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchProgram = async () => {
        if (id) {
          try {
            setLoading(true);
            const response = await programsApi.getById(id);
            const program = response.data;
            
            setInitialValues({
              name: program.name,
              description: program.description || ''
            });
          } catch (err) {
            console.error('Error fetching program:', err);
            setError('Failed to load program data');
          } finally {
            setLoading(false);
          }
        }
      };
  
      fetchProgram();
    }, [id]);
  
    const handleSubmit = async (values: ProgramFormValues) => {
      try {
        if (id) {
          await programsApi.update(id, values);
        } else {
          await programsApi.create(values);
        }
        navigate('/programs');
      } catch (err) {
        console.error('Error saving program:', err);
        setError('Failed to save program');
      }
    };
  
    if (loading) {
      return <div className="text-center my-5"><div className="spinner-border"></div></div>;
    }
  
    return (
      <div>
        <h1>{id ? 'Edit' : 'Create'} Health Program</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="card">
          <div className="card-body">
            <Formik
              initialValues={initialValues}
              validationSchema={ProgramSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Program Name</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="e.g., TB Program"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      className="form-control"
                      rows={4}
                      placeholder="Describe the health program..."
                    />
                    <ErrorMessage
                      name="description"
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
                      onClick={() => navigate('/programs')}
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
  
  export default ProgramForm;