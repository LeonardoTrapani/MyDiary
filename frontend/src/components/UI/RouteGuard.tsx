import React from 'react';
import { Navigate } from 'react-router-dom';

const RouteGuard: React.FC<{ children: JSX.Element }> = (props) => {
  const token = localStorage.getItem('token');
  if (token) {
    return props.children;
  } else {
    return <Navigate to='/login' replace />;
  }
};

export default RouteGuard;
