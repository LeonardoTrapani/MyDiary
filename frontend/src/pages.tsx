import { Link } from 'react-router-dom';
import Input from './components/Input';
import { useInput } from './hooks';
import React from 'react';

export const HomePage: React.FC = () => {
  return <h1>Home page</h1>;
};

export const LoginPage: React.FC = () => {
  const {
    value: emailValue,
    hasError: emailError,
    onChangeValue: emailChangeHandler,
    onBlur: emailBlurHandler,
    errorMessage: emailErrorMessage,
  } = useInput([
    { check: emailValidCheck, errorMessage: 'Please enter a valid email' },
  ]);

  const {
    value: passwordValue,
    hasError: passwordError,
    onChangeValue: passwordChangeHandler,
    onBlur: passwordBlurHandler,
    errorMessage: passwordErrorMessage,
  } = useInput([
    {
      check: (value) => {
        return value.length >= 8;
      },
      errorMessage: 'The password be at least 8 characters long',
    },
    {
      check: (value) => {
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
      check: (value) => {
        return /[A-Z]/.test(value);
      },
      errorMessage: 'The password should have one uppercase letter',
    },
    {
      check: (value) => {
        const regexp = /\d/;
        return regexp.test(value);
      },
      errorMessage: 'The password should have at least one number',
    },
    {
      check: (value) => {
        const regexp = /[a-z]/;
        return regexp.test(value);
      },
      errorMessage: 'The password should have at least one lowercase letter ',
    },
  ]);
  return (
    <>
      <form className='p-5 w-min m-auto flex flex-col gap-8'>
        <Input
          value={emailValue}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          name='Email'
          hasError={emailError}
          errorMessage={emailErrorMessage}
        />
        <Input
          value={passwordValue}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          name='Password'
          hasError={passwordError}
          errorMessage={passwordErrorMessage}
        />
      </form>
      {/* <Link className='' to='/signup'>
        Signup instead
      </Link> */}
    </>
  );
};

export const SignupPage: React.FC = () => {
  return <Link to='/login'>Login instead</Link>;
};

export const NotFound: React.FC = () => {
  return <h1>Error 404: page not found</h1>;
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
