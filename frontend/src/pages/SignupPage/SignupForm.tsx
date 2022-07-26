import React, { useEffect, useMemo } from 'react';
import { useFetch, useInput } from '../../utilities/hooks';
import {
  emailValidCheck,
  passwordInputChecks,
} from '../../utilities/utilities';
import AuthForm, { InputInformations } from '../../components/AuthForm';
import { BACKEND_URL } from '../../utilities/contants';
import { useNavigate } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const {
    data: signupData,
    error: signupError,
    fetchNow: fetchSignup,
    loading: isSignupLoading,
  } = useFetch();

  const navigate = useNavigate();
  useEffect(() => {
    if (signupData) {
      navigate('/login');
    }
  }, [signupData, navigate]);

  const signupFormSubmitHandler = async (
    username: string,
    email: string,
    password: string
  ) => {
    fetchSignup(BACKEND_URL + '/signup', {
      requestBody: {
        username,
        email,
        password,
      },
      method: 'POST',
    });
  };

  const {
    value: usernameValue,
    errorMessage: usernameErrorMessage,
    hasError: usernameHasError,
    isValid: isUsernameValid,
    onChangeValue: onChangeUsername,
    validate: validateUsername,
  } = useInput([
    {
      check: (value) => (value ? true : false),
      errorMessage: 'please enter a username',
    },
    {
      check: (value) => value.length >= 5,
      errorMessage: 'insert at least 5 characters',
    },
  ]);
  const {
    value: emailValue,
    errorMessage: emailErrorMessage,
    hasError: emailHasError,
    isValid: isEmailValid,
    onChangeValue: onChangeEmail,
    validate: validateEmail,
  } = useInput([
    {
      check: (value) => emailValidCheck(value),
      errorMessage: 'please enter a valid email',
    },
  ]);

  const {
    value: passwordValue,
    errorMessage: passwordErrorMessage,
    hasError: passwordHasError,
    isValid: isPasswordValid,
    onChangeValue: onChangePassword,
    validate: validatePassword,
  } = useInput(passwordInputChecks);

  const isFormValid = useMemo(() => {
    return isPasswordValid && isEmailValid && isUsernameValid;
  }, [isPasswordValid, isEmailValid, isUsernameValid]);
  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signupFormSubmitHandler(usernameValue, emailValue, passwordValue);
  };

  const inputs = [
    {
      errorMessage: usernameErrorMessage,
      hasError: usernameHasError,
      name: 'Username',
      onChange: onChangeUsername,
      validate: validateUsername,
      value: usernameValue,
      type: 'text',
    },
    {
      errorMessage: emailErrorMessage,
      hasError: emailHasError,
      name: 'Email',
      onChange: onChangeEmail,
      validate: validateEmail,
      value: emailValue,
      type: 'email',
    },
    {
      errorMessage: passwordErrorMessage,
      hasError: passwordHasError,
      name: 'Password',
      onChange: onChangePassword,
      validate: validatePassword,
      value: passwordValue,
      type: 'password',
    },
  ] as InputInformations[];
  return (
    <AuthForm
      formSubmitHandler={formSubmitHandler}
      inputs={inputs}
      insteadToName='Login'
      insteadToPath='/login'
      isLoading={isSignupLoading}
      isValid={isFormValid}
      name='Signup'
      errorMessage={signupError}
      hasFetchError={signupError ? true : false}
    />
  );
};

export default SignupForm;
