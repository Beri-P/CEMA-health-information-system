import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import ClientsList from './pages/clients/ClientsList';
import ClientForm from './pages/clients/ClientForm';
import ClientProfile from './pages/clients/ClientProfile';
import ProgramsList from './pages/programs/ProgramsList';
import ProgramForm from './pages/programs/ProgramForm';
import EnrollmentForm from './pages/enrollments/EnrollmentForm';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 container py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id" element={<ClientProfile />} />
            <Route path="/programs" element={<ProgramsList />} />
            <Route path="/programs/new" element={<ProgramForm />} />
            <Route path="/clients/:clientId/enroll" element={<EnrollmentForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;