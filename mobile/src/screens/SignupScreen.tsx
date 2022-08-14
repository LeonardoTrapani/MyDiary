import { RootStackScreenProps } from '../../types';
import AuthForm, { AuthInputType } from '../components/AuthForm';
import React from 'react';
import useInput, {
  emailValidCheck,
  passwordInputChecks,
} from '../util/useInput';
import SignupSvg from '../components/svgs/SignupSvg';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/auth';

export const SignupScreen = ({
  navigation,
}: RootStackScreenProps<'Signup'>) => {
  const mutateSignup = useMutation(
    (signupInfo: { email: string; password: string; username: string }) => {
      return signup(signupInfo.username, signupInfo.email, signupInfo.password);
    },
    {
      onSuccess: () => {
        navigation.navigate('Login');
      },
    }
  );

  const {
    errorMessage: usernameErrorMessage,
    hasError: usernameHasError,
    isValid: usernameIsValid,
    onChangeText: usernameOnChangeText,
    validate: usernameValidate,
    value: usernameValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'please enter a username',
    },
    {
      check: (value) => value.length >= 5,
      errorMessage: 'at least 5 characters',
    },
  ]);
  const {
    errorMessage: emailErrorMessage,
    hasError: emailHasError,
    isValid: emailIsValid,
    onChangeText: emailOnChangeText,
    validate: emailValidate,
    value: emailValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'please enter an email',
    },
    {
      check: emailValidCheck,
      errorMessage: 'please enter a valid email',
    },
  ]);

  const {
    errorMessage: passwordErrorMessage,
    hasError: passwordHasError,
    isValid: passwordIsValid,
    onChangeText: passwordOnChangeText,
    validate: passwordValidate,
    value: passwordValue,
  } = useInput(passwordInputChecks);

  const isFormValid = passwordIsValid && emailIsValid && usernameIsValid;
  const submitSignupHandler = () => {
    if (isFormValid) {
      mutateSignup.mutate({
        email: emailValue,
        password: passwordValue,
        username: usernameValue,
      });
    } else {
      usernameValidate();
      emailValidate();
      passwordValidate();
    }
  };
  const loginInsteadHandler = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.push('Login');
    }
  };

  const inputs: AuthInputType[] = [
    {
      name: 'username',
      errorMessage: usernameErrorMessage,
      hasError: usernameHasError,
      keyboardType: 'default',
      value: usernameValue,
      onChangeText: usernameOnChangeText,
      autoComplete: 'username',
      validate: usernameValidate,
      autoCapitalize: 'none',
      secureTextEntry: false,
    },
    {
      name: 'email',
      errorMessage: emailErrorMessage,
      hasError: emailHasError,
      keyboardType: 'email-address',
      autoCapitalize: 'none',
      autoComplete: 'email',
      onChangeText: emailOnChangeText,
      validate: emailValidate,
      value: emailValue,
      secureTextEntry: false,
    },
    {
      name: 'password',
      errorMessage: passwordErrorMessage,
      hasError: passwordHasError,
      autoCapitalize: 'none',
      autoComplete: 'password',
      keyboardType: 'default',
      onChangeText: passwordOnChangeText,
      secureTextEntry: true,
      validate: passwordValidate,
      value: passwordValue,
    },
  ];

  return (
    <AuthForm
      insteadHandler={loginInsteadHandler}
      insteadTitle='login instead'
      title='Signup'
      inputs={inputs}
      submitHandler={submitSignupHandler}
      svg={<SignupSvg />}
      isLoading={mutateSignup.isLoading}
    />
  );
};
