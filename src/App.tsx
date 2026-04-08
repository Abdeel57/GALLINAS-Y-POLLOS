import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TicketPicker from './pages/TicketPicker';
import RegistrationForm from './pages/RegistrationForm';
import SuccessPage from './pages/SuccessPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  const isAdmin = localStorage.getItem('is_admin_logged') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/picker" element={<TicketPicker />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
