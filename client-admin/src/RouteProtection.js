import { Navigate } from 'react-router-dom';
import React from 'react';

const RouteProtection = (props) => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  // Check if the user is a super admin (role 2) or an admin (role 1)
  if (token && (role === '1' || role === '2')) {
    return <>{props.children}</>;
  }

  // Redirect to the login page if the user doesn't have the required role
  return <Navigate to="/login" />;
};

export default RouteProtection;
