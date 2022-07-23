import React, { useEffect } from 'react';
import LoginForm from '../components/loginForm';
import { useFetch } from '../hooks';

export const LoginPage: React.FC = () => {
  const {
    fetchNow: login,
    data: loginData,
    error: loginError,
    loading: isLoginLoading,
  } = useFetch();

  useEffect(() => {
    console.log(loginData);
  }, [loginData]);

  const loginFormSubmitHandler = (
    emailValue: string,
    passwordValue: string
  ) => {
    login('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue,
      }),
    });
  };
  return (
    <>
      <LoginForm onSubmit={loginFormSubmitHandler} />
      <p>{loginError}</p>
      <p>{isLoginLoading}</p>
    </>
  );
};
