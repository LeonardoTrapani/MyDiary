import React, { useMemo } from 'react';
import { useInput } from '../hooks';
import Input from './UI/Input';
import Button from './UI/Button';
import { emailValidCheck, passwordInputChecks } from '../utilities';

const SignupForm: React.FC<{
  onSubmit: (username: string, emailValue: string, password: string) => void;
  isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
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
      errorMessage: 'please enter a username with at least 5 characters',
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
    onSubmit(usernameValue, emailValue, passwordValue);
  };
  return (
    <form
      onSubmit={formSubmitHandler}
      className='p-5 w-min m-auto flex flex-col gap-8'
    >
      <Input
        errorMessage={usernameErrorMessage}
        hasError={usernameHasError}
        name='Username'
        onBlur={validateUsername}
        onChange={onChangeUsername}
        value={usernameValue}
      />{' '}
      <Input
        errorMessage={emailErrorMessage}
        hasError={emailHasError}
        name='Email'
        onBlur={validateEmail}
        onChange={onChangeEmail}
        value={emailValue}
      />
      <Input
        errorMessage={passwordErrorMessage}
        hasError={passwordHasError}
        name='Password'
        onBlur={validatePassword}
        onChange={onChangePassword}
        value={passwordValue}
      />
      <Button isValid={isFormValid} type='submit' isLoading={isLoading}>
        Signup
      </Button>
    </form>
  );
};

export default SignupForm;
