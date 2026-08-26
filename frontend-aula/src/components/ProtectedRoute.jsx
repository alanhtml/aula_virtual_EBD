import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!token) {
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // If user role is not allowed, redirect to a default authorized page or home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
