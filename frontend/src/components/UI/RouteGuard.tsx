import React from 'react';
import { Navigate } from 'react-router-dom';
import { authActions } from '../../store/auth-slice';
import { useAppDispatch } from '../../utilities/hooks';

const RouteGuard: React.FC<{ children: JSX.Element }> = (props) => {
  const dispatch = useAppDispatch();
  const hasJwt = () => {
    let flag = false;
    const token = localStorage.getItem('token');
    if (token) {
      flag = true;
      dispatch(authActions.setToken(token));
    } else {
      flag = false;
    }
    return flag;
  };
  if (!hasJwt()) {
    return <Navigate to='/login' replace />;
  } else {
    return props.children;
  }
};

export default RouteGuard;
