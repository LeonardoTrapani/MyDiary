import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isValid: boolean;
  isLoading: boolean;
}
const Button: React.FC<ButtonProps> = ({
  children,
  isValid,
  isLoading,
  ...props
}) => {
  const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isValid) {
      event.preventDefault();
    }
  };
  return (
    <button
      {...props}
      onClick={buttonClickHandler}
      className={styles.button + ' ' + (isValid ? '' : styles['btn--invalid'])}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </button>
  );
};

export default Button;
