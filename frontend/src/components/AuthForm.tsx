import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css';
import Button from './UI/Button';
import Input from './UI/Input';

export interface InputInformations {
  value: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validate: () => boolean;
  errorMessage: string;
  hasError: boolean;
  type: string;
}
const AuthForm: React.FC<{
  inputs: InputInformations[];
  formSubmitHandler: React.FormEventHandler<HTMLFormElement> | undefined;
  isValid: boolean;
  isLoading: boolean;
  insteadToName: string;
  insteadToPath: string;
  name: string;
  hasFetchError: boolean;
  errorMessage: string | undefined;
}> = ({
  inputs,
  formSubmitHandler,
  isValid,
  isLoading,
  insteadToName,
  insteadToPath,
  name,
  hasFetchError,
  errorMessage,
}) => {
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
        type={input.type}
      />
    );
  });

  return (
    <div className={styles['center-flex']}>
      {hasFetchError && (
        <AuthFormError errorMessage={errorMessage || 'An error has occurred'} />
      )}
      <div
        className={`${styles['form-container']} ${
          hasFetchError ? styles['fetch-error'] : ''
        }`}
      >
        <div className={styles['form-img']} />
        <form className={styles.form} onSubmit={formSubmitHandler}>
          <h2>{name}</h2>
          <div className={styles['input-wrap']}>{InputsJsx}</div>
          <div className={styles['btn-wrap']}>
            <Button isValid={isValid} type='submit' isLoading={isLoading}>
              Login
            </Button>
            <Link to={insteadToPath} className={styles.instead}>
              {`${insteadToName} Instead`}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;

const AuthFormError: React.FC<{
  errorMessage: string;
}> = ({ errorMessage }) => {
  return <div className={styles['error-container']}>{errorMessage}</div>;
};
