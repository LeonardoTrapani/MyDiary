import React from 'react';
import styles from './Input.module.css';
const Input: React.FC<{
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  hasError: boolean;
  errorMessage: string;
  other?: Record<string, never>;
}> = (props) => {
  return (
    <div
      className={
        styles['input-container'] + ' ' + (props.hasError ? styles.error : '')
      }
    >
      <div className={styles['title-container']}>
        <label htmlFor={props.name} className={styles.label}>
          {props.name}
        </label>
        {props.hasError && (
          <p className={styles['error-text']}>{props.errorMessage}</p>
        )}
      </div>
      <input
        className={styles.input}
        id={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        placeholder='&nbsp;'
        {...props.other}
      />
    </div>
  );
};

export default Input;
