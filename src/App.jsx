import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AvailabilityForm from './pages/Availability';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Registration';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';


function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/availability" element={<AvailabilityForm />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
      </Routes>
      
    </div>
  );
}

export default App;
