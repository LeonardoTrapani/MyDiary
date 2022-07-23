import React from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useInput } from '../hooks';

export const LoginPage: React.FC = () => {
  const {
    value: emailValue,
    onChangeValue: emailChangeHandler,
    hasError: emailError,
    errorMessage: emailErrorMessage,
    validate: validateEmail,
  } = useInput([
    { check: emailValidCheck, errorMessage: 'Please enter a valid email' },
  ]);

  const {
    value: passwordValue,
    hasError: passwordError,
    onChangeValue: passwordChangeHandler,
    errorMessage: passwordErrorMessage,
    validate: validatePassword,
  } = useInput(passwordInputChecks);

  const loginSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    if (!emailValid || !passwordValid) {
      console.log('not valid');
      return;
    }
    //SEND HTTP REQUEST
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
        <Button isValid={true}>Login</Button>
      </form>
    </>
  );
};
const emailValidCheck = (email: string) => {
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  if (validateEmail(email)) {
    return true;
  }
  return false;
};

const passwordInputChecks = [
  {
    check: (value: string) => {
      return value.length > 0;
    },
    errorMessage: 'Please provide a password',
  },
  {
    check: (value: string) => {
      return value.length >= 8;
    },
    errorMessage: 'The password be at least 8 characters long',
  },
  {
    check: (value: string) => {
      const format = /\W/;
      if (format.test(value)) {
        return true;
      } else {
        return false;
      }
    },
    errorMessage: 'The password should have one special character',
  },
  {
    check: (value: string) => {
      return /[A-Z]/.test(value);
    },
    errorMessage: 'The password should have one uppercase letter',
  },
  {
    check: (value: string) => {
      const regexp = /\d/;
      return regexp.test(value);
    },
    errorMessage: 'The password should have at least one number',
  },
  {
    check: (value: string) => {
      const regexp = /[a-z]/;
      return regexp.test(value);
    },
    errorMessage: 'The password should have at least one lowercase letter ',
  },
];
