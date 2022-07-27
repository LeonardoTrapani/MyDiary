import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthenticatedRouteGuard: React.FC<{ children: JSX.Element }> = (
  props
) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return props.children;
  } else {
    return <Navigate to='/' replace />;
  }
};

export default AuthenticatedRouteGuard;
