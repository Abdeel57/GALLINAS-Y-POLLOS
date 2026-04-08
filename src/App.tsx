import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TicketPicker from './pages/TicketPicker';
import RegistrationForm from './pages/RegistrationForm';
import SuccessPage from './pages/SuccessPage';
import TicketView from './pages/TicketView';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('is_admin_logged') === 'true');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:slug/:code" element={<LandingPage />} />
        <Route path="/picker" element={<TicketPicker />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/ticket" element={<TicketView />} />
        <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAdmin(true)} />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard onLogout={() => setIsAdmin(false)} /> : <Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
