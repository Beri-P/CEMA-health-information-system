import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import ClientsList from './pages/clients/ClientsList';
import ClientForm from './pages/clients/ClientForm';
import ClientProfile from './pages/clients/ClientProfile';
import ProgramsList from './pages/programs/ProgramsList';
import ProgramForm from './pages/programs/ProgramForm';
import ProgramDetail from './pages/programs/ProgramDetail';
import EnrollmentForm from './pages/enrollments/EnrollmentForm';

function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <Navbar />
        <main className="flex-grow-1 py-3">
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/clients/new" element={<ClientForm />} />
              <Route path="/clients/:id" element={<ClientProfile />} />
              <Route path="/programs" element={<ProgramsList />} />
              <Route path="/programs/new" element={<ProgramForm />} />
              <Route path="/programs/:id" element={<ProgramDetail />} />
              <Route path="/clients/:clientId/enroll" element={<EnrollmentForm />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;