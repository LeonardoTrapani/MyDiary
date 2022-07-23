import React from 'react';
import LoginForm from '../components/loginForm';
import { login } from '../store/auth-slice';
import { useAppDispatch } from '../hooks';
export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const loginFormSubmitHandler = (
    emailValue: string,
    passwordValue: string
  ) => {
    dispatch(login(emailValue, passwordValue));
  };

  return <LoginForm onSubmit={loginFormSubmitHandler} />;
};
