import React, { HTMLAttributes } from 'react';
import styles from './Input.module.css';
const Input: React.FC<{
  name: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeTextArea?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  hasError: boolean;
  errorMessage: string;
  type: string;
  other?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <div
      className={
        styles['input-container'] +
        ' ' +
        (props.hasError ? styles.error : '') +
        ' ' +
        props.className
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
      {props.type === 'textarea' ? (
        <textarea
          value={props.value}
          className={styles['text-area']}
          id={props.name}
          onChange={props.onChangeTextArea}
          onBlur={props.onBlur}
          placeholder='&nbsp;'
          {...props.other}
        ></textarea>
      ) : (
        <input
          className={styles.input}
          id={props.name}
          value={props.value} // TODO: MAX: 200
          onChange={props.onChange}
          onBlur={props.onBlur}
          placeholder='&nbsp;'
          type={props.type}
          {...props.other}
          style={props.style}
        />
      )}
    </div>
  );
};

export default Input;
