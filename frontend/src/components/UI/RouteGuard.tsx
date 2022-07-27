import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../utilities/hooks';
const RouteGuard: React.FC<{ children: JSX.Element }> = (props) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return props.children;
  } else {
    return <Navigate to='/login' replace />;
  }
};

export default RouteGuard;
