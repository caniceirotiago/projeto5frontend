
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * 
 * Description:
 * Renders a protected route, allowing access to its children components only if a token exists in session storage.
 * If no token is found, the user is redirected to the home page.
 */


const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  return token ? children : <Navigate to="/"/>;
};

export default ProtectedRoute;