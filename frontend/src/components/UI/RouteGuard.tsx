import React from 'react';
import { Navigate } from 'react-router-dom';
import { authActions } from '../../store/auth-slice';

import { useAppDispatch, useAppSelector } from '../../utilities/hooks';

const RouteGuard: React.FC<{ children: JSX.Element }> = (props) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  if (isAuthenticated) {
    return props.children;
  } else {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(authActions.setToken(token));
      return props.children;
    } else {
      return <Navigate to='/login' replace />;
    }
    return props.children;
  }
};

export default RouteGuard;
