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
import AuthForm from '../../components/AuthForm';
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

  interface InputInformations {
    value: string;
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    validate: () => boolean;
    errorMessage: string;
    hasError: boolean;
    onBlur: () => void;
  }
  const inputs = [
    {
      value: emailValue,
      name: 'email',
      onChange: emailChangeHandler,
      validate: validateEmail,
      errorMessage: emailErrorMessage,
    },
    {
      value: passwordValue,
      name: 'password',
      onChange: passwordChangeHandler,
      validate: validatePassword,
      errorMessage: passwordErrorMessage,
    },
  ] as InputInformations[];
  return (
    <AuthForm
      formSubmitHandler={loginSubmitHandler}
      inputs={inputs}
      isLoading={isLoginLoading}
      isValid={isFormValid}
    />
  );
  // return (
  //   <div
  //     className={`${styles['center-flex']} ${
  //       !showHamburgerMenu ? styles['rem-header-height'] : ''
  //     }`}
  //   >
  //     <div className={styles['form-container']}>
  //       <div className={styles['form-img']} />
  //       <form className={styles.form} onSubmit={loginSubmitHandler}>
  //         <h2>Login</h2>
  //         <div className={styles['input-wrap']}>
  //           <Input
  //             value={emailValue}
  //             onChange={emailChangeHandler}
  //             onBlur={validateEmail}
  //             name='Email'
  //             hasError={emailError}
  //             errorMessage={emailErrorMessage}
  //           />
  //           <Input
  //             value={passwordValue}
  //             onChange={passwordChangeHandler}
  //             onBlur={validatePassword}
  //             name='Password'
  //             hasError={passwordError}
  //             errorMessage={passwordErrorMessage}
  //           />
  //         </div>
  //         <div className={styles['btn-wrap']}>
  //           <Button
  //             isValid={isFormValid}
  //             type='submit'
  //             isLoading={isLoginLoading}
  //           >
  //             Login
  //           </Button>
  //           <Link to='/signup' className={styles.instead}>
  //             Signup Instead
  //           </Link>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
};

export default LoginForm;
