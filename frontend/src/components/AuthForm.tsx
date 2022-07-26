import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css';
import Button from './UI/Button';
import Input from './UI/Input';

interface InputInformations {
  value: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validate: () => boolean;
  errorMessage: string;
  hasError: boolean;
}
const AuthForm: React.FC<{
  inputs: InputInformations[];
  formSubmitHandler: React.FormEventHandler<HTMLFormElement> | undefined;
  isValid: boolean;
  isLoading: boolean;
}> = ({ inputs, formSubmitHandler, isValid, isLoading }) => {
  const InputsJsx = inputs.map((input) => {
    return (
      <Input
        key={input.name}
        value={input.value}
        errorMessage={input.errorMessage}
        hasError={input.hasError}
        name={input.name}
        onBlur={input.validate}
        onChange={input.onChange}
      />
    );
  });
  return (
    <div className={styles['center-flex']}>
      <div className={styles['form-container']}>
        <div className={styles['form-img']} />
        <form className={styles.form} onSubmit={formSubmitHandler}>
          <h2>Login</h2>
          <div className={styles['input-wrap']}>{InputsJsx}</div>
          <div className={styles['btn-wrap']}>
            <Button isValid={isValid} type='submit' isLoading={isLoading}>
              Login
            </Button>
            <Link to='/signup' className={styles.instead}>
              Signup Instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
