import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Input from './components/Input';
import { useInput } from './hooks';

export const HomePage = () => {
  const navigate = useNavigate();

  return <h1>Home page</h1>;
};

export const LoginPage = () => {
  const {
    value: emailValue,
    hasError: emailError,
    onChangeValue: emailChangeHandler,
    onBlur: emailBlurHandler,
  } = useInput(emailValidCheck);
  useEffect(() => {
    console.log(emailError);
  }, [emailError]);

  return (
    <>
      <form>
        <Input
          value={emailValue}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          name='Email'
        />
      </form>
      <Link className='' to='/signup'>
        Signup instead
      </Link>
    </>
  );
};

export const SignupPage = () => {
  return <Link to='/login'>Login instead</Link>;
};

export const NotFound = () => {
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
