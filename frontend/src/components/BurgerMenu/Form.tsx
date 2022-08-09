import styles from './Form.module.css';
import React from 'react';
import Button from '../UI/Button';

const Form: React.FC<{
  children: React.ReactNode;
  isFormValid: boolean;
  isFormLoading: boolean;
  buttonName: string;
  validateInputs: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className: string;
}> = (props) => {
  const formSubmitHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.isFormValid) {
      props.validateInputs();
      event.preventDefault();
    }
  };
  return (
    <form
      onSubmit={props.onSubmit}
      className={styles.form + ' ' + props.className}
    >
      {props.children}
      <Button
        onClick={formSubmitHandler}
        isLoading={props.isFormLoading}
        isValid={props.isFormValid}
        type='submit'
        className={styles['form-btn']}
      >
        {props.buttonName}
      </Button>
    </form>
  );
};
export default Form;
