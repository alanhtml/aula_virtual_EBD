import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ModuleView from './components/ModuleView';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modulo/:id"
          element={
            <ProtectedRoute>
              <ModuleView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
