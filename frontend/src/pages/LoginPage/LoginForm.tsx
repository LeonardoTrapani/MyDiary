import React, { useMemo } from 'react';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { useInput } from '../../utilities/hooks';
import { useAppSelector } from '../../utilities/hooks';
import styles from './Login.module.css';

import {
  emailValidCheck,
  passwordInputChecks,
} from '../../utilities/utilities';
import { Link } from 'react-router-dom';
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
  const showHamburgerMenu = useAppSelector((state) => state.ui.showBurgerMenu);

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
    <div
      className={`${styles['center-flex']} ${
        !showHamburgerMenu ? styles['rem-header-height'] : ''
      }`}
    >
      <div className={styles['form-container']}>
        <div className={styles['form-img']} />
        <form className={styles.form} onSubmit={loginSubmitHandler}>
          <h2>Login</h2>
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
          <Button
            isValid={isFormValid}
            type='submit'
            isLoading={isLoginLoading}
          >
            Login
          </Button>
          <Link to='/signup'>Signup Instead</Link>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
