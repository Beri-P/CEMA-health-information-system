import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Layout components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Page components
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProgramsList from './pages/programs/ProgramsList';
import ProgramForm from './pages/programs/ProgramForm';
import ClientsList from './pages/clients/ClientsList';
import ClientForm from './pages/clients/ClientForm';
import ClientProfile from './pages/clients/ClientProfile';
import EnrollmentForm from './pages/enrollments/EnrollmentForm';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* Programs routes */}
              <Route path="/programs" element={<ProtectedRoute><ProgramsList /></ProtectedRoute>} />
              <Route path="/programs/new" element={<ProtectedRoute><ProgramForm /></ProtectedRoute>} />
              <Route path="/programs/:id" element={<ProtectedRoute><ProgramForm /></ProtectedRoute>} />
              
              {/* Clients routes */}
              <Route path="/clients" element={<ProtectedRoute><ClientsList /></ProtectedRoute>} />
              <Route path="/clients/new" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
              <Route path="/clients/:id" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
              <Route path="/clients/:id/view" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
              
              {/* Enrollments routes */}
              <Route path="/clients/:clientId/enroll" element={<ProtectedRoute><EnrollmentForm /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;