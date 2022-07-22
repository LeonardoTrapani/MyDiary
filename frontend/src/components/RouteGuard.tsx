import React from 'react';
import { Navigate } from 'react-router-dom';

const RouteGuard: React.FC<{ children: JSX.Element }> = (props) => {
  const hasJwt = () => {
    let flag = false;
    localStorage.getItem('token') ? (flag = true) : (flag = false);
    return flag;
  };
  if (!hasJwt()) {
    return <Navigate to='/login' replace />;
  } else {
    return props.children;
  }
};

export default RouteGuard;

//TEST
