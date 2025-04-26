import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { programsApi } from '../../services/api';

interface Program {
  program_id: string;
  name: string;
  description: string;
  created_at: string;
}

const ProgramsList = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await programsApi.getAll();
      setPrograms(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Failed to load health programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await programsApi.delete(id);
        fetchPrograms(); // Refresh the list
      } catch (err) {
        console.error('Error deleting program:', err);
        setError('Failed to delete program');
      }
    }
  };

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Health Programs</h1>
        <Link to="/programs/new" className="btn btn-primary">
          Add New Program
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {programs.length === 0 ? (
        <div className="alert alert-info">
          No health programs found. Create your first program!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.program_id}>
                  <td>{program.name}</td>
                  <td>{program.description}</td>
                  <td>{new Date(program.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="btn-group">
                      <Link 
                        to={`/programs/${program.program_id}`} 
                        className="btn btn-sm btn-info"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(program.program_id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProgramsList;