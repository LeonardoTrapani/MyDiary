import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isValid: boolean;
  isLoading: boolean;
}
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  isValid,
  isLoading,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className={
        styles.button +
        ' ' +
        (isValid ? '' : styles['btn--invalid']) +
        ' ' +
        className
      }
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </button>
  );
};

export default Button;
