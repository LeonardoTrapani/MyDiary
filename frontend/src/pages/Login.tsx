import React, { useEffect } from 'react';
import LoginForm from '../components/loginForm';
import { useFetch, useAppDispatch, useAppSelector } from '../hooks';
import { authActions } from '../store/auth-slice';
export const LoginPage: React.FC = () => {
  // const {
  //   fetchNow: login,
  //   data: loginData,
  //   error: loginError,
  //   loading: isLoginLoading,
  // } = useFetch();
  // const dispatch = useAppDispatch();
  // const authInformations = useAppSelector((state) => state.auth);
  // useEffect(() => {
  //   if (loginData) {
  //     dispatch(
  //       authActions.login({
  //         email: loginData.userId,
  //         jwt: loginData.jwt,
  //         userId: loginData.userId,
  //         username: loginData.username,
  //       })
  //     );
  //   }
  // }, [loginData, dispatch]); //PUT INTO A REDUCER

  const loginFormSubmitHandler = (
    emailValue: string,
    passwordValue: string
  ) => {
    // login('http://localhost:3000/login', { USE INTO CUSTOM HOOK
    //   method: 'POST',
    //   requestBody: {
    //     email: emailValue,
    //     password: passwordValue,
    //   },
    // });
  };

  return <LoginForm onSubmit={loginFormSubmitHandler} />;
};
