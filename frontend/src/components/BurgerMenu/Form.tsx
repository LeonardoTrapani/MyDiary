import styles from './Form.module.css';
import React from 'react';
import Button from '../UI/Button';
import Card from '../UI/Card';

const Form: React.FC<{
  children: React.ReactNode;
  isFormValid: boolean;
  isFormLoading: boolean;
  buttonName: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}> = (props) => {
  return (
    <Card>
      <form onSubmit={props.onSubmit} className={styles.form}>
        {props.children}
        <Button
          isLoading={props.isFormLoading}
          isValid={props.isFormValid}
          type='submit'
          className={styles['form-btn']}
        >
          {props.buttonName}
        </Button>
      </form>
    </Card>
  );
};
export default Form;
