import React from 'react';
import LoginForm from '../components/loginForm';
import { login } from '../store/auth-slice';
import { useAppDispatch } from '../hooks';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const loginFormSubmitHandler = (
    emailValue: string,
    passwordValue: string
  ) => {
    dispatch(login(emailValue, passwordValue));
  };

  return <h1>Login page</h1>;
};
