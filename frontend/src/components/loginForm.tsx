import React, { useMemo } from 'react';
import Button from './UI/Button';
import Input from './UI/Input';
import { useInput } from '../hooks';
import { useAppSelector } from '../hooks';
import { emailValidCheck, passwordInputChecks } from '../utilities';
const LoginForm: React.FC<{
  onSubmit: (emailValue: string, passwordValue: string) => void;
}> = ({ onSubmit }) => {
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
    onSubmit(emailValue, passwordValue);
  };

  return (
    <>
      <form
        className='p-5 w-min m-auto flex flex-col gap-8'
        onSubmit={loginSubmitHandler}
      >
        <Input
          value={emailValue}
          onChange={emailChangeHandler}
          onBlur={validateEmail}
          name='Email'
          hasError={emailError}
          errorMessage={emailErrorMessage}
        />
        <Input
          value={passwordValue}
          onChange={passwordChangeHandler}
          onBlur={validatePassword}
          name='Password'
          hasError={passwordError}
          errorMessage={passwordErrorMessage}
        />
        <Button isValid={isFormValid} type='submit' isLoading={isLoginLoading}>
          Login
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
