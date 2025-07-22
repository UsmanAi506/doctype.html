import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import DoctorRegister from './pages/DoctorRegister';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register-doctor" element={<DoctorRegister />} />
            
            {/* Protected routes */}
            <Route path="/patient" element={<PrivateRoute roles={['patient']} />}>
              <Route index element={<PatientDashboard />} />
              <Route path="book-appointment" element={<BookAppointment />} />
            </Route>
            
            <Route path="/doctor" element={<PrivateRoute roles={['doctor']} />}>
              <Route index element={<DoctorDashboard />} />
            </Route>
            
            <Route path="/admin" element={<PrivateRoute roles={['admin']} />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
