import React from 'react';
import LoginForm from '../components/loginForm';

export const LoginPage: React.FC = () => {
  const loginFormSubmitHandler = (
    emailValue: string,
    passwordValue: string
  ) => {
    console.log(emailValue, passwordValue);
  };
  return <LoginForm onSubmit={loginFormSubmitHandler} />;
};
