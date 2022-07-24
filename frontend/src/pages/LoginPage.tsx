import React from 'react';
import LoginForm from '../components//LoginForm';
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

  return (
    <h1 className='w-screen h-screen flex items-center justify-center text-4xl font-bold'>
      Login page
    </h1>
  );
};
