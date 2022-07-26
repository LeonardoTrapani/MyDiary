import React, { useMemo } from 'react';
import { useAppDispatch, useInput } from '../../utilities/hooks';
import { useAppSelector } from '../../utilities/hooks';

import {
  emailValidCheck,
  passwordInputChecks,
} from '../../utilities/utilities';
import AuthForm, { InputInformations } from '../../components/AuthForm';
import { login } from '../../store/auth-slice';
import { useNavigate } from 'react-router-dom';
const LoginForm: React.FC = () => {
  const {
    value: emailValue,
    onChangeValue: emailChangeHandler,
    hasError: emailError,
    errorMessage: emailErrorMessage,
    validate: validateEmail,
    isValid: isEmailValid,
  } = useInput([
    { check: emailValidCheck, errorMessage: 'Please enter a valid email' },
  ]);

  const {
    value: passwordValue,
    hasError: passwordError,
    onChangeValue: passwordChangeHandler,
    errorMessage: passwordErrorMessage,
    validate: validatePassword,
    isValid: isPasswordValid,
  } = useInput(passwordInputChecks);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loginFormSubmitHandler = (
    emailValue: string,
    passwordValue: string
  ) => {
    dispatch(login(emailValue, passwordValue));
    navigate('/');
  };

  const isLoginLoading = useAppSelector((state) => state.auth.isLoginLoading);

  const isFormValid = useMemo(
    () => isEmailValid && isPasswordValid,
    [isEmailValid, isPasswordValid]
  );

  const loginSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) {
      return;
    }
    loginFormSubmitHandler(emailValue, passwordValue);
  };

  const loginErrorMessage = useAppSelector((state) => state.auth.loginError);

  const inputs = [
    {
      value: emailValue,
      name: 'Email',
      onChange: emailChangeHandler,
      validate: validateEmail,
      hasError: emailError,
      errorMessage: emailErrorMessage,
      type: 'email',
    },
    {
      value: passwordValue,
      name: 'Password',
      onChange: passwordChangeHandler,
      validate: validatePassword,
      hasError: passwordError,
      errorMessage: passwordErrorMessage,
      type: 'password',
    },
  ] as InputInformations[];
  return (
    <AuthForm
      formSubmitHandler={loginSubmitHandler}
      inputs={inputs}
      isLoading={isLoginLoading}
      isValid={isFormValid}
      insteadToName='Signup'
      insteadToPath='/signup'
      name='Login'
      errorMessage={loginErrorMessage}
      hasFetchError={loginErrorMessage ? true : false}
    />
  );
};

export default LoginForm;
